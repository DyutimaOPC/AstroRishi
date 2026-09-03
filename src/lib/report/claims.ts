/**
 * Blocks a generated report from reaching REPORT_READY when it makes claims the
 * business must not make (plan §21): guaranteed outcomes, regulated financial
 * advice, medical or psychological diagnosis, and certainty about what another
 * person privately thinks.
 *
 * This runs on model output, which is why it is a validator and not a line in a
 * prompt. Prompts drift; this does not.
 */
export type ClaimCategory =
  | 'guarantee' | 'wealth' | 'financial-advice' | 'medical'
  | 'diagnosis' | 'mind-reading' | 'dated-prediction'
  | 'relationship-outcome' | 'invented-score';

export type Severity = 'block' | 'warn';

interface Rule {
  category: ClaimCategory;
  severity: Severity;
  pattern: RegExp;
  why: string;
}

const RULES: readonly Rule[] = [
  { category: 'guarantee', severity: 'block', why: 'Promises an outcome',
    pattern: /\b(guarantee[ds]?|guaranteeing|assured\s+(?:success|result|outcome)|100\s*%\s*(?:sure|certain|accurate)|definitely\s+will|will\s+certainly|is\s+certain\s+to)\b/i },
  { category: 'wealth', severity: 'block', why: 'Promises money or riches',
    pattern: /\b(you\s+will\s+(?:become|be)\s+(?:rich|wealthy|a\s+millionaire|a\s+crorepati)|double\s+your\s+money|assured\s+returns?|guaranteed\s+returns?|will\s+make\s+you\s+rich)\b/i },
  { category: 'financial-advice', severity: 'block', why: 'Regulated investment advice',
    pattern: /\b(you\s+should\s+invest\s+in|invest\s+in\s+(?:stocks?|shares?|equity|mutual\s+funds?|crypto|bitcoin|gold\s+etf)|buy\s+(?:shares?|stocks?)\s+of|put\s+your\s+(?:money|savings)\s+in(?:to)?)\b/i },
  { category: 'medical', severity: 'block', why: 'Medical claim or advice',
    pattern: /\b(will\s+cure|cures?\s+your|stop\s+taking\s+(?:your\s+)?(?:medicine|medication)|no\s+need\s+for\s+(?:medicine|medication|doctor|treatment)|instead\s+of\s+(?:medicine|treatment)|heal\s+your\s+(?:cancer|diabetes|illness|disease))\b/i },
  { category: 'diagnosis', severity: 'block', why: 'Diagnoses a person',
    pattern: /\b(you\s+(?:have|are\s+suffering\s+from)\s+(?:depression|anxiety\s+disorder|bipolar|adhd|ptsd|ocd)|(?:he|she|they|your\s+partner)\s+is\s+(?:a\s+)?(?:narcissist|sociopath|psychopath|bipolar|depressed\s+person))\b/i },
  { category: 'mind-reading', severity: 'block', why: 'Asserts another person’s private thoughts or hidden acts as fact',
    pattern: /\b((?:he|she|they|your\s+partner|your\s+spouse)\s+(?:is\s+)?(?:secretly|definitely)\s+\w+|(?:he|she|they)\s+is\s+(?:cheating|lying\s+to\s+you|hiding\s+someone)|your\s+partner\s+(?:no\s+longer\s+loves|does\s+not\s+love)\s+you)\b/i },
  { category: 'relationship-outcome', severity: 'block', why: 'Predicts how a relationship ends',
    pattern: /\b((?:this|the|your)\s+(?:relationship|marriage)\s+(?:will|is\s+going\s+to)\s+(?:end|fail|not\s+last|collapse|break\s+down)|you\s+will\s+(?:divorce|separate|break\s+up)|(?:he|she|they|your\s+partner)\s+will\s+(?:leave\s+you|cheat|betray\s+you)|(?:this|your)\s+(?:relationship|marriage)\s+is\s+(?:doomed|over|beyond\s+saving))\b/i },
  { category: 'invented-score', severity: 'block', why: 'Scores a relationship — this report deliberately has no score',
    pattern: /\b((?:relationship|marriage|compatibility|love)\s+(?:score|rating|percentage)|rate[sd]?\s+(?:your|this)\s+(?:relationship|marriage)|(?:relationship|marriage)\s+(?:scores?|rates?)\s+\d+)\b/i },
  { category: 'dated-prediction', severity: 'warn', why: 'Dates an outcome with certainty',
    pattern: /\b(?:you\s+will|there\s+will\s+be)\s+[\w\s]{0,40}?\b(?:within|in|by)\s+(?:the\s+next\s+)?\d+\s+(?:days?|weeks?|months?|years?)\b/i },
];

export interface Finding {
  category: ClaimCategory;
  severity: Severity;
  why: string;
  match: string;
  path: string;
}

export interface ClaimsResult {
  ok: boolean;
  findings: Finding[];
  blocking: Finding[];
}

/** Walks every string in a nested object so no section can slip through. */
function walk(value: unknown, path: string, out: (s: string, p: string) => void): void {
  if (typeof value === 'string') return out(value, path);
  if (Array.isArray(value)) return value.forEach((v, i) => walk(v, `${path}[${i}]`, out));
  if (value && typeof value === 'object')
    for (const [k, v] of Object.entries(value)) walk(v, path ? `${path}.${k}` : k, out);
}

/**
 * Hedging is not a claim. "There is no guarantee", "nothing here is assured"
 * and "we cannot promise" are exactly the language the reports SHOULD use, so a
 * negation immediately before a trigger clears it.
 */
const NEGATED = /\b(?:no|not|never|nothing|none|neither|cannot|can't|won't|without|isn't|aren't|doesn't)\b[\w\s,'’-]{0,24}$/i;

function isNegated(text: string, index: number): boolean {
  return NEGATED.test(text.slice(Math.max(0, index - 48), index));
}

export function checkClaims(sections: unknown): ClaimsResult {
  const findings: Finding[] = [];
  walk(sections, '', (text, path) => {
    for (const rule of RULES) {
      const m = rule.pattern.exec(text);
      if (m && !isNegated(text, m.index)) findings.push({
        category: rule.category, severity: rule.severity, why: rule.why,
        match: m[0].trim(), path: path || '(root)',
      });
    }
  });
  const blocking = findings.filter((f) => f.severity === 'block');
  return { ok: blocking.length === 0, findings, blocking };
}

export class ClaimsRejected extends Error {
  constructor(public findings: Finding[]) {
    super(`Report blocked by ${findings.length} claim(s): ${findings.map((f) => f.category).join(', ')}`);
    this.name = 'ClaimsRejected';
  }
}
