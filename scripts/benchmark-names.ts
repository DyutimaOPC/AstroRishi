/**
 * The metric that matters: LIFT — how much better the best suggestion is than
 * the name the customer already has. Candidate count is not the metric; a
 * generator that produces sixty spellings which all reduce to the same number
 * has produced nothing.
 *
 * Run: npx tsx scripts/benchmark-names.ts
 */
import { compute, variantsOf, scoreName, loShu, parseDob, reduceToDigit, lifePath } from '../src/lib/numerology';
import type { ScoreContext } from '../src/lib/numerology';

// Real given names from the shipped lexicon, spread across the frequency range.
const NAMES = ['Ronak','Minal','Anand','Kavita','Priya','Rakesh','Shalini','Vipul','Sunita','Amit',
  'Deepa','Sanjay','Meera','Nikhil','Rahul','Swati','Manish','Pallavi','Ritu','Ajay',
  'Sneha','Pooja','Rohit','Vikram','Arjun','Divya','Karan','Suresh','Neha','Ananya'];
const SURNAMES = ['Sharma','Jain','Shah','Mehta','Rao','Nair','Gupta','Patel'];
const DOBS = ['1985-03-17','1988-09-05','1990-04-12','1992-08-23','1995-07-21','1997-11-16','2000-01-30','1979-06-08'];

interface Row { lift: number; had: boolean }

function measure(useMerged: boolean): Row[] {
  const rows: Row[] = [];
  for (const first of NAMES)
    for (const last of SURNAMES.slice(0, 3))
      for (const dob of DOBS) {
        const full = `${first} ${last}`;
        const c = compute({ fullName: full, dob });
        if (useMerged) {
          rows.push({ lift: c.nameAnalysis.best ? c.nameAnalysis.best.score - c.score : 0,
                      had: !!c.nameAnalysis.best });
          continue;
        }
        // Mechanical edits alone — the generator before re-romanisation.
        const birth = parseDob(dob);
        const ctx: ScoreContext = {
          lifePathDigit: reduceToDigit(lifePath(birth)),
          birthNum: reduceToDigit(birth.day),
          grid: loShu(birth), original: full,
        };
        const cur = scoreName(full, ctx);
        const best = variantsOf(full)
          .map((v) => scoreName(v.split(' ').map((w) => w[0] + w.slice(1).toLowerCase()).join(' '), ctx))
          .filter((o) => o.score > cur.score)
          .sort((a, b) => b.score - a.score)[0];
        rows.push({ lift: best ? best.score - cur.score : 0, had: !!best });
      }
  return rows;
}

const stat = (rows: Row[]) => {
  const lifts = rows.map((r) => r.lift).sort((a, b) => a - b);
  const withAny = rows.filter((r) => r.had).length;
  const worthwhile = rows.filter((r) => r.lift >= 8).length;
  const mean = lifts.reduce((a, b) => a + b, 0) / lifts.length;
  return {
    n: rows.length,
    anyOption: `${Math.round(withAny / rows.length * 100)}%`,
    worthwhile: `${Math.round(worthwhile / rows.length * 100)}%`,
    meanLift: mean.toFixed(1),
    medianLift: String(lifts[Math.floor(lifts.length / 2)]),
    bestLift: String(lifts[lifts.length - 1]),
  };
};

const before = stat(measure(false));
const after = stat(measure(true));
console.log(`${NAMES.length} names × 3 surnames × ${DOBS.length} birth dates = ${before.n} customers\n`);
console.log('                     mechanical only    with re-romanisation');
for (const k of ['anyOption', 'worthwhile', 'meanLift', 'medianLift', 'bestLift'] as const)
  console.log(`  ${k.padEnd(18)} ${String(before[k]).padStart(12)} ${String(after[k]).padStart(23)}`);

/* ------------------------------------------------------------------ *
 * Is generation still the constraint?
 *
 * Harmony depends only on the resulting digit, and there are nine of them. So
 * the most lift ANY generator could deliver is fixed by the spread of harmony
 * across those nine for that person's core pair. If we already reach their best
 * digit, more spellings cannot help — the limit is the scoring model.
 * ------------------------------------------------------------------ */
let reachedBest = 0, headroomTotal = 0, capped = 0;
const gaps: number[] = [];
for (const first of NAMES)
  for (const last of SURNAMES.slice(0, 3))
    for (const dob of DOBS) {
      const c = compute({ fullName: `${first} ${last}`, dob });
      const ceiling = c.numbers.ranked[0].harmony;       // best digit available to them
      const got = c.nameAnalysis.best?.score ?? c.score; // best we actually offered
      if (got >= ceiling) reachedBest++;
      const headroom = ceiling - got;
      headroomTotal += headroom;
      gaps.push(headroom);
      if (ceiling - c.score <= 8) capped++;              // no worthwhile lift exists at all
    }
const n = gaps.length;
gaps.sort((a, b) => a - b);
console.log('\nHeadroom — how much lift is still on the table\n');
console.log(`  reach their best possible number   ${Math.round(reachedBest / n * 100)}%`);
console.log(`  mean headroom left unclaimed       ${(headroomTotal / n).toFixed(1)} points`);
console.log(`  median headroom                    ${gaps[Math.floor(n / 2)]}`);
console.log(`  customers where the SCORING MODEL  ${Math.round(capped / n * 100)}%  (best digit is <8 above their own —`);
console.log(`  caps lift below worthwhile              no generator can help these people)`);
