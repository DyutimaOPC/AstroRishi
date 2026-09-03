import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { env, require_ } from '@/lib/env';
import type { ProductSlug } from '@/lib/config/products';
import { SECTION_SCHEMAS, type AnySections } from './schema';
import { buildPrompt } from './prompts';
import { checkClaims, ClaimsRejected, type Finding } from './claims';

export interface GenerateResult {
  sections: AnySections;
  model: string;
  findings: Finding[];
  attempts: number;
}

let client: Anthropic | null = null;
const anthropic = (): Anthropic => (client ??= new Anthropic());

/**
 * Turns computed facts plus questionnaire answers into the interpretive prose.
 *
 * Two things make this safe to put in front of a paying customer: the model is
 * constrained to the product's section schema, so the template always has the
 * shape it expects, and the claims validator gets the last word. A blocked
 * report is regenerated with the offending lines quoted back, and if it fails
 * twice the order stays out of REPORT_READY for a human to look at.
 */
export async function generateSections(
  slug: ProductSlug,
  computed: unknown,
  answers: Record<string, string>,
  { maxAttempts = 2 }: { maxAttempts?: number } = {},
): Promise<GenerateResult> {
  require_(['ANTHROPIC_API_KEY'], 'Report generation');

  const schema = SECTION_SCHEMAS[slug];
  const shape = describeShape(slug);
  let prompt = buildPrompt(slug, computed, answers, shape);
  let lastFindings: Finding[] = [];

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const response = await anthropic().messages.parse({
      model: env.ANTHROPIC_MODEL,
      max_tokens: 16000,
      thinking: { type: 'adaptive' },
      messages: [{ role: 'user', content: prompt }],
      output_config: { format: zodOutputFormat(schema) },
    });

    const sections = response.parsed_output;
    if (!sections) {
      prompt = `${prompt}\n\nYour previous reply could not be parsed. Return only JSON in the required shape.`;
      continue;
    }

    const claims = checkClaims(sections);
    lastFindings = claims.findings;
    if (claims.ok)
      return { sections: sections as AnySections, model: env.ANTHROPIC_MODEL, findings: claims.findings, attempts: attempt };

    // Quote the exact lines back rather than restating the rules in the abstract.
    prompt = [
      buildPrompt(slug, computed, answers, shape),
      'Your previous draft was rejected. These passages broke the absolute rules:',
      claims.blocking.map((f) => `- at ${f.path}: "${f.match}" — ${f.why}`).join('\n'),
      'Rewrite those passages so they describe tendencies rather than promises. Keep everything else.',
    ].join('\n\n');
  }

  throw new ClaimsRejected(lastFindings.filter((f) => f.severity === 'block'));
}

/** A compact prose description of the shape, alongside the enforced schema. */
function describeShape(slug: ProductSlug): string {
  const keys = Object.keys((SECTION_SCHEMAS[slug] as unknown as { shape: object }).shape);
  return `A JSON object with exactly these keys: ${keys.join(', ')}.`;
}

export { ClaimsRejected };
