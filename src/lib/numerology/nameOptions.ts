import { nameNumber, normalise } from './letters';
import { affinity, verdict, Verdict } from './affinity';
import { harmony } from './profile';
import { respell } from './respell';
import { attested } from './lexicon';
import { LoShu } from './loshu';

export interface ScoreContext {
  lifePathDigit: number;
  birthNum: number;
  grid: LoShu;
  /** The spelling the customer uses today, for the closeness term. */
  original: string;
}

export interface ScoredName {
  name: string;
  total: number;
  digit: number;
  score: number;
  verdict: Verdict;
  /** How the score splits across the two core numbers, both 0-100. */
  parts: { moolank: number; bhagyank: number };
  /** Whether this number fills a gap in the grid. Ranking only, never scored. */
  fillsGap: boolean;
  /** How normally Indians write a name this way, 0-1. Ranking only. */
  naturalness: number;
  /** How many people in the public records carried this exact spelling. */
  attested: number;
  /** Edit distance from the spelling in use. Ranking only, never scored. */
  distance: number;
  change: string | null;
  isCurrent: boolean;
}

export function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++)
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[n];
}

/**
 * The harmony score answers one question: how well does THIS spelling sit with
 * the two numbers that are fixed for life — the birth number (moolank) and the
 * destiny number (bhagyank)? That is the traditional test, and it is the one a
 * reader can check against the ranked table of all nine numbers.
 *
 * Two things are deliberately kept OUT of the score and used only to break ties:
 * whether the number fills a gap in the grid, and how far the spelling departs
 * from the name in use. Folding closeness into the score would flatter whichever
 * name the customer already has and conclude that nothing needs changing.
 */
export function scoreName(candidate: string, ctx: ScoreContext, naturalness = MECHANICAL): ScoredName {
  const { total, digit } = nameNumber(candidate);
  const a = normalise(candidate).replace(/ /g, '');
  const b = normalise(ctx.original).replace(/ /g, '');

  const distance = levenshtein(a, b);
  const score = harmony(digit, ctx.birthNum, ctx.lifePathDigit);
  return {
    name: candidate,
    total,
    digit,
    score,
    verdict: verdict(score),
    parts: { moolank: affinity(digit, ctx.birthNum), bhagyank: affinity(digit, ctx.lifePathDigit) },
    fillsGap: ctx.grid.missing.includes(digit),
    naturalness,
    // Only meaningful when the given name itself changed. A middle-initial
    // variant leaves it untouched, so the original's record says nothing about
    // the suggestion and must not lift it up the ranking.
    attested: attestedGiven(candidate, ctx.original),
    distance,
    change: distance === 0 ? null : describeChange(b, a),
    isCurrent: distance === 0,
  };
}

function describeChange(from: string, to: string): string {
  if (to.length > from.length) {
    const added = to.length - from.length;
    for (let i = 0; i < to.length; i++) {
      if (from[i] !== to[i]) {
        const ch = to[i];
        return added === 1
          ? `An added “${ch.toLowerCase()}”`
          : `Two added letters around “${ch.toLowerCase()}”`;
      }
    }
  }
  if (to.length < from.length) return 'A dropped letter';
  return 'A changed letter';
}

const DOUBLEABLE = 'BDGKLMNPRSTVZ'.split('');
const H_AFTER = 'BDGJKPTS'.split('');
const VOWELS = 'AEIOU'.split('');

/** Spelling variants of the first word only — surnames are normally left alone. */
export function variantsOf(fullName: string): string[] {
  const words = normalise(fullName).split(' ');
  if (!words.length || !words[0]) return [];
  const [head, ...tail] = words;
  const out = new Set<string>();
  const push = (w: string) => {
    if (w.length <= 14) out.add([w, ...tail].join(' '));
  };

  const vowel = (c: string | undefined) => !!c && 'AEIOU'.includes(c);

  for (let i = 0; i < head.length; i++) {
    const ch = head[i];
    // A doubled consonant reads as a name only between two vowels. Annand is a
    // spelling people use; Anannd is a typo, because the doubled n runs into the
    // d. Never double the opening letter either — Mminal is nobody's name.
    if (i > 0 && DOUBLEABLE.includes(ch) && vowel(head[i - 1]) && vowel(head[i + 1]))
      push(head.slice(0, i) + ch + head.slice(i));
    if (H_AFTER.includes(ch) && head[i + 1] !== 'H') push(head.slice(0, i + 1) + 'H' + head.slice(i + 1));
    if (VOWELS.includes(ch)) push(head.slice(0, i) + ch + head.slice(i));
  }
  // Adding a middle initial changes the total without touching either name — by
  // far the easiest correction for someone to actually adopt. Only initials that
  // already belong to the person are offered: the surname's own letter first,
  // then the initials of any other name parts. A stranger's letter reads as
  // arbitrary and nobody adopts it.
  if (tail.length) {
    const natural = [tail[tail.length - 1][0], ...tail.map((w) => w[0]), head[0]];
    for (const initial of [...new Set(natural)]) {
      const withInitial = [head, initial, ...tail].join(' ');
      if (withInitial.length <= 34) out.add(withInitial);
    }
  }

  if (head.endsWith('I')) push(head.slice(0, -1) + 'EE');
  if (head.endsWith('EE')) push(head.slice(0, -2) + 'I');
  if (head.includes('Y')) push(head.replace('Y', 'I'));
  push(head + 'A');
  push(head + 'H');

  out.delete(words.join(' '));
  return [...out];
}

/**
 * A doubled letter is a recognised numerology convention — nobody reads Kkothari
 * as an ordinary surname, they read it as a deliberate adjustment. So mechanical
 * edits are neither natural nor unnatural; they sit in the middle and lose to a
 * genuine alternative transliteration whenever one exists.
 */
const MECHANICAL = 0.5;

/**
 * A corrected name is meant to look adjusted — that is what the correction IS.
 * Anything that reads as an outright mistake is already removed by the exception
 * laws in respell.ts, so this floor only needs to drop the far tail where the
 * substitutions have stacked up several unlikely choices at once.
 */
export const MIN_WEIGHT = 0.15;

function attestedGiven(candidate: string, original: string): number {
  const a = normalise(candidate).split(' ')[0] ?? '';
  const b = normalise(original).split(' ')[0] ?? '';
  return a && a !== b ? attested(a) : 0;
}

export interface Candidate { name: string; naturalness: number }

/**
 * Both generators, merged. Mechanical edits reach spellings re-romanisation
 * cannot (Anandh), and re-romanisation reaches spellings editing cannot
 * (Raunak). Neither alone covers the ground.
 */
export function candidatesFor(fullName: string): Candidate[] {
  const words = normalise(fullName).split(' ').filter(Boolean);
  if (!words.length) return [];
  const [head, ...tail] = words;
  const best = new Map<string, number>();
  const add = (name: string, n: number) => best.set(name, Math.max(best.get(name) ?? 0, n));

  for (const v of variantsOf(fullName)) add(v, MECHANICAL);
  // Only the given name is re-romanised; a surname is family identity.
  for (const r of respell(head)) add([r.name.toUpperCase(), ...tail].join(' '), r.weight);

  best.delete(words.join(' '));
  return [...best].map(([name, naturalness]) => ({ name, naturalness }));
}

const titleCase = (s: string) =>
  s.split(' ').map((w) => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');

export interface NameAnalysis {
  current: ScoredName;
  options: ScoredName[];
  best: ScoredName | null;
  /** True when a candidate beats the current spelling by a meaningful margin. */
  changeWorthwhile: boolean;
}

export const MIN_OPTIONS = 5;
export const MAX_OPTIONS = 10;

/**
 * Ranking, in order:
 *   1. how well the number suits their core pair (the score itself)
 *   2. whether it supplies something their birth grid is missing
 *   3. whether real people are recorded using that spelling
 *   4. how naturally it reads
 *   5. how little it departs from the name they have
 *
 * Filling a grid gap sits second deliberately. It is the only signal that reads
 * the WHOLE birth date rather than the two digits harmony is built from, so it
 * is what makes two people with the same moolank and bhagyank — but different
 * birth dates — get different advice. It is traditional reasoning, not a
 * tiebreak of convenience.
 */
const byMerit = (a: ScoredName, b: ScoredName): number =>
  b.score - a.score ||
  Number(b.fillsGap) - Number(a.fillsGap) ||
  Number(b.attested > 0) - Number(a.attested > 0) ||
  b.naturalness - a.naturalness ||
  b.attested - a.attested ||
  a.distance - b.distance ||
  a.name.localeCompare(b.name);

export function analyseName(fullName: string, ctx: ScoreContext): NameAnalysis {
  const current = scoreName(fullName, ctx);

  // The cutoff: a suggestion has to actually beat the name they already have.
  const eligible = candidatesFor(fullName)
    .filter((c) => c.naturalness >= MIN_WEIGHT)
    .map((c) => scoreName(titleCase(c.name), ctx, c.naturalness))
    .filter((o) => o.score > current.score)
    .sort(byMerit);

  // Lead with one spelling per resulting number, so the first options are
  // genuinely different outcomes rather than the same advice reworded.
  const seen = new Set<number>();
  const picked: ScoredName[] = [];
  for (const o of eligible) if (!seen.has(o.digit)) { seen.add(o.digit); picked.push(o); }

  // Then top up with the next best spellings — a second good way to write the
  // same number is still a real choice for someone deciding what they like.
  for (const o of eligible) {
    if (picked.length >= MIN_OPTIONS) break;
    if (!picked.includes(o)) picked.push(o);
  }

  const options = picked.sort(byMerit).slice(0, MAX_OPTIONS);
  const best = options[0] ?? null;
  return { current, options, best, changeWorthwhile: !!best && best.score - current.score >= 8 };
}
