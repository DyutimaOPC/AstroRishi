import raw from '@/data/lexicon.json';
import { phoneticKey } from './phonetics';

/**
 * Roughly 6,600 given names and 3,100 surnames drawn from public Indian records,
 * with how often each spelling appeared.
 *
 * IMPORTANT — this is a one-way signal. Presence proves a spelling is one real
 * people actually use. Absence proves nothing at all: the source records are
 * regionally skewed and miss spellings that are certainly real (meenal, raunak
 * and preeya are all absent). So it is only ever used to PROMOTE a candidate,
 * never to reject one. Rejecting on absence would quietly refuse correct
 * suggestions for anyone whose name the records happen not to cover.
 */
function parse(block: string): Map<string, number> {
  const m = new Map<string, number>();
  for (const line of block.split('\n')) {
    const sp = line.lastIndexOf(' ');
    if (sp < 1) continue;
    m.set(line.slice(0, sp), Number(line.slice(sp + 1)) || 1);
  }
  return m;
}

const GIVEN = parse((raw as { given: string }).given);
const SURNAMES = parse((raw as { surnames: string }).surnames);

/** How many people in the records carried this exact spelling. 0 = not recorded. */
export const attested = (word: string): number =>
  GIVEN.get(word.toLowerCase()) ?? SURNAMES.get(word.toLowerCase()) ?? 0;

/** Every recorded spelling that is the same name as this one. */
export function recordedVariants(word: string): { spelling: string; count: number }[] {
  const k = phoneticKey(word);
  if (!k) return [];
  const out: { spelling: string; count: number }[] = [];
  for (const [spelling, count] of GIVEN)
    if (spelling !== word.toLowerCase() && phoneticKey(spelling) === k) out.push({ spelling, count });
  return out.sort((a, b) => b.count - a.count);
}

export const lexiconSize = (): { given: number; surnames: number } =>
  ({ given: GIVEN.size, surnames: SURNAMES.size });
