<<<<<<< HEAD
# AstroRishi
=======
# AstroRishi

Personalised numerology and astrology reports, sold direct. Ad click → landing
page → questionnaire → payment → report.

```bash
npm install
cp .env.example .env.local     # optional — see "Running with nothing configured"
npm run dev
```

## Running with nothing configured

The whole funnel works before you have a single account:

| Missing | What happens instead |
|---|---|
| Supabase | Orders and reports go to a JSON file under `.data/` |
| Razorpay | Checkout shows a clearly-labelled test payment button |
| Anthropic | Reports render from computed facts only — every number is still present and correct |
| Resend | Delivery is logged rather than sent |

That is deliberate. The deterministic engine is the product's spine, so a report
is always renderable; the model only writes the prose between the numbers.

## Architecture

```
questionnaire → engine (deterministic) → Razorpay → prose (Claude) → claims validator → report
```

- **`src/lib/numerology/`** — the engine. Chaldean and Pythagorean letter values,
  life path, Lo Shu grid and its planes, the affinity rubric, corrected-spelling
  generation and scoring. Pure functions, no I/O, 39 tests.
- **`src/lib/numerology/respell.ts`** — spelling variants, built as two separate
  things. **Substitutions** are the grammar: how a sound can legitimately be
  written another way (`i→ee`, `a→aa`, `o→au`, doubling). **Exception laws** are
  the constraints, each named and independently relaxable: never double the
  opening letter, a doubled consonant needs vowels both sides, no letter three
  times running, no run of three consonants, keep the first letter, at most two
  substitutions.

  The laws exist to rule out things that read as *mistakes* (`Mminal`,
  `Anannd`, `Miinnaal`) — never to enforce ordinariness. A corrected name is
  supposed to look adjusted; that is what the correction is. `Kkothari` and
  `Anandh` are the convention, not failures of it.
- **`src/lib/numerology/lexicon.ts`** — ~6,600 given names and ~3,100 surnames
  from public Indian records. A **one-way** signal: presence proves a spelling is
  one real people use, absence proves nothing (the records are regionally skewed
  and miss `meenal`, `raunak`, `preeya`). It only ever promotes a candidate,
  never rejects one.
- **`src/lib/rubric/`** — Career and Relationship have no chart, so their engine
  is a declared scoring rubric over the questionnaire. Same contract: the score
  shown is always the sum of the parts shown.
- **`src/lib/report/claims.ts`** — blocks guarantees, financial advice, medical
  claims, diagnosis and mind-reading from reaching a customer. Runs on model
  output, allows honest hedging ("nothing here is guaranteed").
- **`src/lib/orders/state.ts`** — the order state machine. Illegal transitions
  throw rather than returning a boolean a call site could ignore.
- **`src/lib/store/`** — one interface, two drivers (Supabase, local file).

### The metric for name suggestions

Candidate count is **not** the metric. A generator producing sixty spellings that
all reduce to the same number has produced nothing. The metric is **lift** — how
much better the best suggestion is than the name the customer already has.

`npx tsx scripts/benchmark-names.ts` measures it across 720 name/birth-date
combinations. Current state: 77% of customers get an option at all, 57% get one
worth making (lift >= 8), mean lift 11.8.

Generation is close to exhausted: **83% already reach their best possible number
and the mean headroom left is 0.6 points.** More spellings will not move this.
The binding constraint is the scoring model — for 53% of people the best
reachable number is under 8 points above their own, so no generator can help
them. Raising that ceiling means changing what harmony measures, which is a
product decision about what a correction *is*, not a bug fix. Adding the Lo Shu
grid to the score was tried and rejected: it raises mean lift but drops the share
of customers getting any option at all from 77% to 63%.

Run `npm test` for the engine, rubric, state machine and claims validator.
`node scripts/smoke.mjs` checks every route against a running dev server.

## Placeholders

Everything the business still owes lives in **`src/lib/config/site.ts`** and
renders with a dotted red underline until filled in. Anything matching `[[ ... ]]`
is unfilled by definition, so a placeholder cannot ship looking like real data.

```bash
grep -rn '\[\[' src/lib/config/site.ts src/lib/content/policies.ts
```

Currently outstanding: company name, GST, registered address, WhatsApp number,
support email, offer end date, delivery turnaround, review count and rating,
Pandit Maya's photo and background line, consultation slots per week, policy
last-updated date, jurisdiction city, and the refund window figures.

## Before launch

1. **Name suggestions ship without human review**, so the automated guards are
   the only thing between a bad spelling and a customer: the naturalness floor,
   the doubling rules, the harmony cutoff, and the fabricated-name validator.
   Change any of them deliberately.
2. **Replace the sample reviews.** The six in `src/components/Blocks.tsx` are
   written samples so the component can be judged. Fabricated reviews are an
   unfair trade practice under the Consumer Protection Act — swap them for real
   ones or remove the section.
3. **Razorpay activation** needs a registered business, GST details and the
   policy pages live. Start it early; it gates launch, not development.
4. **Set `ADMIN_PASSWORD`** (8+ characters) before deploying, or `/admin` stays
   locked out.
5. **Point `NEXT_PUBLIC_SITE_URL`** at the real domain so sitemap, canonicals and
   report links resolve.

## Adding a product

Config, not components: add an entry to `src/lib/config/products.ts`, a
questionnaire to `src/lib/questions/index.ts`, a section schema to
`src/lib/report/schema.ts`, and a brief to `src/lib/report/prompts.ts`. The
wizard, checkout, admin and report chrome all pick it up.
>>>>>>> a6cd898 (Initial commit — AstroRishi v0 codebase)
