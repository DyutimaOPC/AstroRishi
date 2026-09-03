import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import { env, require_ } from '@/lib/env';
import type { SectionKey } from '@/lib/config/products';
import { SECTION_SCHEMAS, type AnySections } from './schema';
import { buildPrompt } from './prompts';
import { checkClaims, ClaimsRejected, type Finding } from './claims';

export interface GenerateResult {
  sections: AnySections;
  model: string;
  findings: Finding[];
  attempts: number;
}

let client: GoogleGenAI | null = null;
const genai = (): GoogleGenAI => (client ??= new GoogleGenAI({ apiKey: env.GOOGLE_API_KEY! }));

export async function generateSections(
  key: SectionKey,
  computed: unknown,
  answers: Record<string, string>,
  { maxAttempts = 2 }: { maxAttempts?: number } = {},
): Promise<GenerateResult> {
  require_(['GOOGLE_API_KEY'], 'Report generation');

  const schema = SECTION_SCHEMAS[key];
  const jsonSchema = z.toJSONSchema(schema);
  const shape = describeShape(key);
  let prompt = buildPrompt(key, computed, answers, shape);
  let lastFindings: Finding[] = [];

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const response = await genai().models.generateContent({
      model: env.GOOGLE_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: jsonSchema as Record<string, unknown>,
      },
    });

    const text = response.text;
    if (!text) {
      prompt = `${prompt}\n\nYour previous reply was empty. Return only JSON in the required shape.`;
      continue;
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      prompt = `${prompt}\n\nYour previous reply could not be parsed as JSON. Return only valid JSON.`;
      continue;
    }

    const result = schema.safeParse(parsed);
    if (!result.success) {
      prompt = `${prompt}\n\nYour previous reply did not match the schema. Return only JSON in the required shape.`;
      continue;
    }

    const sections = result.data;
    const claims = checkClaims(sections);
    lastFindings = claims.findings;
    if (claims.ok)
      return { sections: sections as AnySections, model: env.GOOGLE_MODEL, findings: claims.findings, attempts: attempt };

    prompt = [
      buildPrompt(key, computed, answers, shape),
      'Your previous draft was rejected. These passages broke the absolute rules:',
      claims.blocking.map((f) => `- at ${f.path}: "${f.match}" — ${f.why}`).join('\n'),
      'Rewrite those passages so they describe tendencies rather than promises. Keep everything else.',
    ].join('\n\n');
  }

  throw new ClaimsRejected(lastFindings.filter((f) => f.severity === 'block'));
}

function describeShape(key: SectionKey): string {
  const keys = Object.keys((SECTION_SCHEMAS[key] as unknown as { shape: object }).shape);
  return `A JSON object with exactly these keys: ${keys.join(', ')}.`;
}

export { ClaimsRejected };
