/**
 * Nobody reads these reports before they reach the customer. That is fine for a
 * report about spelling; it is not fine for a report about a relationship,
 * because a small number of the people who buy this one are describing danger.
 *
 * So the free text is scanned before anything else runs. When it trips, the
 * report leads with help rather than with numerology, and every branch that
 * could read as "be patient" is suppressed. The scan is deliberately
 * over-sensitive: a helpline shown to someone who did not need it costs us a
 * little credibility, and the opposite mistake costs something we cannot repay.
 */

export type SafetyKind = 'harm' | 'selfHarm';

export interface SafetyFlag {
  flagged: boolean;
  kind: SafetyKind | null;
  /** The phrase that tripped it. Logged, never printed back to the reader. */
  matched: string | null;
}

/** Physical danger, coercion, or a threat. Unambiguous phrasings only. */
const HARM = [
  'hits me', 'hit me', 'beats me', 'beat me', 'slapped me', 'slaps me', 'punched me',
  'physically abus', 'domestic violence', 'domestic abuse', 'threatens me', 'threatened me',
  'threatened to kill', 'threatens to kill', 'kill me', 'forced me', 'forces me',
  'raped', 'marital rape', 'dowry harassment', 'dowry demand', 'locked me in', 'locks me in',
  'afraid of him', 'afraid of her', 'scared of him', 'scared of her', 'afraid for my life',
  'not safe at home', 'i am not safe', 'my life is in danger',
];

/** Self-harm. Separate copy, separate helpline. */
const SELF_HARM = [
  'kill myself', 'killing myself', 'end my life', 'ending my life', 'end it all',
  'suicidal', 'suicide', 'harm myself', 'hurt myself', 'no reason to live',
  'better off without me', 'want to die',
];

const flat = (s: string) => ` ${s.toLowerCase().replace(/[^a-z ]+/g, ' ').replace(/\s+/g, ' ')} `;

/** Scans every free-text answer the reader gave us. */
export function safetyScan(answers: Record<string, string>): SafetyFlag {
  const text = flat(Object.values(answers).join(' '));
  for (const p of SELF_HARM) if (text.includes(p)) return { flagged: true, kind: 'selfHarm', matched: p };
  for (const p of HARM) if (text.includes(p)) return { flagged: true, kind: 'harm', matched: p };
  return { flagged: false, kind: null, matched: null };
}

export interface Helpline { name: string; number: string; note: string }

/**
 * Indian national helplines. VERIFY THESE BEFORE LAUNCH and re-check yearly —
 * a helpline number that has changed is worse than none, because the reader
 * trusts it enough to dial it once.
 */
export const HELPLINES: Readonly<Record<SafetyKind, { lead: string; lines: Helpline[] }>> = {
  harm: {
    lead: 'Some of what you have written describes harm rather than difficulty. That is outside what any report can help with, and it is more important than anything else on these pages. Please talk to someone who can actually act.',
    lines: [
      { name: 'Emergency', number: '112', note: 'Police, ambulance and fire, anywhere in India.' },
      { name: 'Women Helpline', number: '181', note: 'Government of India, 24 hours, in most states.' },
      { name: 'Kiran Mental Health Helpline', number: '1800-599-0019', note: 'Free, 24 hours, 13 languages.' },
    ],
  },
  selfHarm: {
    lead: 'Some of what you have written suggests you may be thinking about harming yourself. Please treat that as more urgent than anything in this report, and talk to someone tonight.',
    lines: [
      { name: 'Kiran Mental Health Helpline', number: '1800-599-0019', note: 'Free, 24 hours, 13 languages.' },
      { name: 'AASRA', number: '9152987821', note: '24 hours, confidential.' },
      { name: 'Emergency', number: '112', note: 'If you are in immediate danger.' },
    ],
  },
};
