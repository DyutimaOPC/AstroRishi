/**
 * Spelling variants for numerological correction.
 *
 * Two separate things, kept separate on purpose:
 *
 *   SUBSTITUTIONS — the grammar. How a sound can legitimately be written
 *                   another way in Indian romanisation. i→ee, a→aa, o→au.
 *
 *   EXCEPTIONS    — the laws. What must never come out, regardless of what the
 *                   grammar allows. These stop typos, not unusual spellings.
 *
 * A corrected name is SUPPOSED to look adjusted. Kkothari, Anandh, Reetaa are
 * not attempts to pass as common names — a numerology correction is understood
 * to be deliberate, and customers read it that way. So the exceptions exist to
 * rule out things that read as mistakes (Mminal, Anannd), never to enforce
 * ordinariness. Weight is used to order suggestions, not to forbid them.
 */
type Alt = readonly [spelling: string, weight: number];

/** The grammar. Longest key wins, so digraphs are matched before single letters. */
const SUBSTITUTIONS: readonly (readonly [string, readonly Alt[]])[] = [
  // vowel digraphs
  ['ee', [['ee', 1], ['i', .9], ['ea', .4], ['ie', .3]]],
  ['oo', [['oo', 1], ['u', .9], ['ou', .6], ['ue', .3]]],
  ['ai', [['ai', 1], ['ay', .8], ['ei', .4], ['ae', .3]]],
  ['au', [['au', 1], ['ou', .8], ['o', .7], ['aw', .4]]],
  ['ou', [['ou', 1], ['au', .8], ['oo', .7], ['o', .6]]],
  ['ea', [['ea', 1], ['ee', .8], ['e', .6]]],
  // aspirated consonants
  ['sh', [['sh', 1], ['s', .5], ['ssh', .3]]],
  ['ch', [['ch', 1], ['chh', .4]]],
  ['th', [['th', 1], ['t', .6], ['tth', .3]]],
  ['kh', [['kh', 1], ['k', .6]]],
  ['bh', [['bh', 1], ['b', .5]]],
  ['dh', [['dh', 1], ['d', .6]]],
  ['gh', [['gh', 1], ['g', .5]]],
  ['ph', [['ph', 1], ['f', .6]]],
  // single vowels — the widest source of variation
  ['a', [['a', 1], ['aa', .8], ['ah', .4]]],
  ['e', [['e', 1], ['ee', .6], ['ae', .4], ['ea', .4]]],
  ['i', [['i', 1], ['ee', .9], ['ii', .5], ['y', .5], ['ie', .3]]],
  ['o', [['o', 1], ['au', .8], ['oo', .7], ['ou', .7], ['oh', .4]]],
  ['u', [['u', 1], ['oo', .8], ['ou', .4], ['uu', .3]]],
  // consonants — doubling is the commonest correction of all
  ['k', [['k', 1], ['kk', .7], ['ck', .5], ['kh', .5]]],
  ['t', [['t', 1], ['tt', .7], ['th', .5]]],
  ['d', [['d', 1], ['dd', .7], ['dh', .5]]],
  ['n', [['n', 1], ['nn', .7]]],
  ['m', [['m', 1], ['mm', .7]]],
  ['l', [['l', 1], ['ll', .7]]],
  ['r', [['r', 1], ['rr', .6]]],
  ['s', [['s', 1], ['ss', .7], ['sh', .4]]],
  ['b', [['b', 1], ['bb', .5], ['bh', .4]]],
  ['g', [['g', 1], ['gg', .5], ['gh', .4]]],
  ['p', [['p', 1], ['pp', .5]]],
  ['j', [['j', 1], ['jj', .5], ['jh', .4]]],
  ['v', [['v', 1], ['w', .6], ['vv', .3]]],
  ['w', [['w', 1], ['v', .7]]],
  ['y', [['y', 1], ['i', .5], ['yy', .3]]],
  ['c', [['c', 1], ['k', .7], ['ch', .4]]],
  ['h', [['h', 1]]],
  ['z', [['z', 1], ['j', .5]]],
  ['f', [['f', 1], ['ph', .7]]],
  ['q', [['q', 1], ['k', .8]]],
];

const VOWELS = 'aeiou';
const isVowel = (c: string | undefined) => !!c && VOWELS.includes(c);

/**
 * The laws. Each returns true when a candidate must be thrown away.
 * Named individually so any one of them can be relaxed on its own.
 */
export const EXCEPTIONS: readonly { law: string; breaks: (word: string, original: string) => boolean }[] = [
  { law: 'the opening letter is never doubled',
    breaks: (w) => w.length > 1 && w[0] === w[1] },

  { law: 'a doubled consonant needs a vowel on both sides',
    breaks: (w) => {
      for (let i = 1; i < w.length; i++) {
        if (w[i] !== w[i - 1] || isVowel(w[i])) continue;
        if (!isVowel(w[i - 2]) || !isVowel(w[i + 1])) return true;
      }
      return false;
    } },

  { law: 'no letter appears three times running',
    breaks: (w) => /(.)\1\1/.test(w) },

  { law: 'no run of three consonants',
    breaks: (w) => new RegExp(`[^${VOWELS}]{3,}`).test(w.replace(/(.)\1/g, '$1')) },

  { law: 'the first letter is kept — an initial is an identity',
    breaks: (w, o) => w[0] !== o[0] },

  { law: 'a name may not grow by more than four letters',
    breaks: (w, o) => w.length > o.length + 4 },

  { law: 'the original spelling is not a suggestion',
    breaks: (w, o) => w === o },
];

export interface Respelling {
  name: string;
  weight: number;
  /** How many sound-units were respelled. A correction changes one or two things. */
  changes: number;
}

/**
 * A correction adjusts a name; it does not rewrite it. Two substitutions is
 * already a visible change (Roonaak); three or more stops reading as the same
 * name and starts reading as a mistake (Miinnaal).
 */
export const MAX_SUBSTITUTIONS = 2;

export function respell(
  word: string,
  { cap = 1200, minWeight = 0.08 }: { cap?: number; minWeight?: number } = {},
): Respelling[] {
  const original = word.toLowerCase().replace(/[^a-z]/g, '');
  if (original.length < 2) return [];

  const units: (readonly Alt[])[] = [];
  for (let i = 0; i < original.length; ) {
    const hit = SUBSTITUTIONS.find(([g]) => original.startsWith(g, i));
    if (hit) { units.push(hit[1]); i += hit[0].length; }
    else { units.push([[original[i], 1] as Alt]); i += 1; }
  }

  let acc: { s: string; w: number; c: number }[] = [{ s: '', w: 1, c: 0 }];
  units.forEach((alts, idx) => {
    const source = alts[0][0];                 // how this unit was originally written
    const atStart = idx === 0;
    const atEnd = idx === units.length - 1;
    const next: { s: string; w: number; c: number }[] = [];

    for (const partial of acc)
      for (const [sp, weight] of alts) {
        const changed = sp !== source;
        // An h after an opening vowel reads as a mistake: Ahnand, not Anand.
        if (changed && atStart && sp.endsWith('h') && isVowel(sp[0])) continue;
        // A trailing h belongs at the end of a name (Farah), not inside it.
        if (changed && !atEnd && sp.length > 1 && sp.endsWith('h') && isVowel(sp[0])) continue;
        const c = partial.c + (changed ? 1 : 0);
        if (c > MAX_SUBSTITUTIONS) continue;
        const w = partial.w * weight;
        if (w >= minWeight) next.push({ s: partial.s + sp, w, c });
      }
    acc = next.sort((a, b) => b.w - a.w).slice(0, cap);
  });

  const title = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  return acc
    .filter(({ s }) => !EXCEPTIONS.some((e) => e.breaks(s, original)))
    .map(({ s, w, c }) => ({ name: title(s), weight: Math.round(w * 100) / 100, changes: c }))
    .sort((a, b) => b.weight - a.weight || a.changes - b.changes || a.name.length - b.name.length);
}

/** Which law a rejected spelling broke. Used by the tests and worth keeping. */
export const brokenLaw = (candidate: string, original: string): string | null =>
  EXCEPTIONS.find((e) => e.breaks(candidate.toLowerCase(), original.toLowerCase()))?.law ?? null;
