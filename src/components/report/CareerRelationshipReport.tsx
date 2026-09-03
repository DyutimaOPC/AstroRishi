import type { CareerResult } from '@/lib/career';
import type { RelationshipResult } from '@/lib/relationship';
import { HELPLINES } from '@/lib/relationship/safety';
import {
  Section, Lede, Callout, Prose, Tile, Column, Steps, Meter, LoShuGrid, Footnote,
  list, steps, proseOf,
} from './chrome';

interface LifeResult {
  career: CareerResult;
  relationship: RelationshipResult;
}

/**
 * Combined Career & Relationship Report. Two chapter halves rendered in
 * sequence, each with its own section numbering reset.
 */
export function CareerRelationshipReport({ r, sections }: {
  r: LifeResult;
  sections: { 'career-money'?: Record<string, unknown>; relationship?: Record<string, unknown> } | null;
}) {
  return (
    <div className="flex flex-col">
      <CareerHalf r={r.career} sections={(sections?.['career-money'] ?? null) as Record<string, unknown> | null} />
      <RelationshipHalf r={r.relationship} sections={(sections?.relationship ?? null) as Record<string, unknown> | null} />
      <Footnote>
        <b>About this report.</b> Everything above was built from your name, your date of birth and the answers you
        gave us. It is interpretive guidance meant to help you think, not a prediction and not a guarantee. Nothing
        here is financial or investment advice, no part of it should be read as a promise about income, employment or
        any outcome, and nothing claims to know what another person privately thinks or intends.
      </Footnote>
    </div>
  );
}

/* ── CAREER HALF ───────────────────────────────────────────────────── */

function CareerHalf({ r, sections }: { r: CareerResult; sections: Record<string, unknown> | null }) {
  const prose = proseOf(sections);
  const blocks: { title: string; node: React.ReactNode }[] = [];
  const add = (title: string, node: React.ReactNode) => blocks.push({ title, node });

  add('Where you stand', <>
    <div className="grid gap-px border border-rule bg-rule sm:grid-cols-[1fr_2fr]">
      <Meter value={r.score} label="Career strength" caption={r.band} />
      <div className="flex flex-col gap-2.5 bg-paper-card p-5">
        <span className="lbl">What went into it</span>
        {r.signals.map((s) => (
          <div key={s.key} className="flex items-baseline justify-between gap-4 border-b border-paper-2 py-1.5 last:border-0">
            <span className="flex flex-col">
              <span className="text-[14.5px] font-medium">{s.label}</span>
              <span className="text-[12.5px] text-ink-3">{s.value}</span>
            </span>
            <span className="font-mono text-xs text-ink-2">{s.points}<span className="text-ink-3">/{s.weight}</span></span>
          </div>
        ))}
      </div>
    </div>
    <Lede>{prose('verdict') ?? r.verdict}</Lede>
  </>);

  add('The numbers this is built on', <>
    <div className="grid gap-px bg-rule sm:grid-cols-3">
      {r.numbers.map((nm) => (
        <Tile key={nm.key} label={`${nm.label} · ${nm.hindi}`} value={String(nm.value)} note={`${nm.ruler} — ${nm.how}`} />
      ))}
    </div>
    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-8">
      <LoShuGrid mine={r.grid.counts} caption={`Grid balance ${r.grid.balance}/100${r.grid.missing.length ? ` · missing ${r.grid.missing.join(', ')}` : ''}`} />
      <div className="flex flex-1 flex-col gap-2">
        <span className="lbl">Which numbers run your working life</span>
        {r.vocation.slice(0, 4).map((v) => (
          <div key={v.number} className="flex items-baseline justify-between gap-4 border-b border-[#E3E0D8] py-2 last:border-0">
            <span className="flex flex-col">
              <span className="text-[14.5px] font-medium">{v.number} — {r.vocation[0].number === v.number ? 'your working number' : 'also present'}</span>
              <span className="text-[12.5px] text-ink-3">{v.why.join(', ')}</span>
            </span>
            <span className="font-mono text-xs text-ink-2">{v.points.toFixed(1)}</span>
          </div>
        ))}
      </div>
    </div>
  </>);

  add('What you are built to do', <>
    <Callout>
      <b>{r.workNature.number} — {r.workNature.title}.</b> You work by {r.workNature.mode}. It runs best on {r.workNature.thrivesIn}, and it is drained by {r.workNature.drainedBy}.
    </Callout>
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="flex flex-col gap-2">
        <span className="lbl">Fits you</span>
        <ul className="flex flex-col gap-1.5">
          {r.workNature.fields.map((f) => (
            <li key={f} className="border-b border-[#E3E0D8] pb-1.5 text-[14.5px] last:border-0">{f}</li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col gap-2">
        <span className="lbl">Your second current — {r.secondNature.number}, {r.secondNature.title.toLowerCase()}</span>
        <p className="text-[14.5px] leading-relaxed text-ink-2">
          Underneath the first there is a {r.secondNature.number}, which works by {r.secondNature.mode}. Careers that
          use both tend to feel like a fit in a way that neither alone does.
        </p>
      </div>
    </div>
    <Prose>{prose('workNatureReading')}</Prose>
  </>);

  add('What you do, against what you are built for', <>
    <div className="grid gap-px border border-rule bg-rule sm:grid-cols-3">
      <Tile label="You said you do" value={r.fit.statedNumber ? String(r.fit.statedNumber) : '—'} note={r.fit.stated || 'not given'} />
      <Tile label="Your chart works by" value={String(r.fit.naturalNumber)} note={r.fit.naturalVocation.title} />
      <Tile
        label="Agreement"
        value={r.fit.verdict === 'unknown' ? '—' : `${r.fit.agreement}`}
        note={r.fit.verdict === 'aligned' ? 'same number' : r.fit.verdict === 'adjacent' ? 'close enough to work' : r.fit.verdict === 'stretched' ? 'a real gap' : 'could not place the occupation'}
        accent={r.fit.verdict === 'stretched'}
      />
    </div>
    <Callout>{r.fit.note}</Callout>
    <Prose>{prose('fitReading')}</Prose>
  </>);

  add('Your earning capacity', <>
    <div className="grid gap-px border border-rule bg-rule sm:grid-cols-[1fr_2fr]">
      <Meter value={r.earning.capacity} label="Money structure" />
      <div className="flex flex-col gap-2.5 bg-paper-card p-5">
        <span className="lbl">The money-bearing lines</span>
        {r.earning.planes.map((p) => (
          <div key={p.key} className="flex items-baseline justify-between gap-4 border-b border-paper-2 py-1.5 last:border-0">
            <span className="text-[14.5px]">{p.label} <span className="font-mono text-[12px] text-ink-3">{p.numbers.join('–')}</span></span>
            <span className="font-mono text-xs text-ink-2">{p.present}<span className="text-ink-3">/3</span></span>
          </div>
        ))}
      </div>
    </div>
    <div className="grid gap-6 lg:grid-cols-2">
      <Column title="Working for you" tone="leaf"
        items={r.earning.drivers.map((d) => ({ title: `${d.number} — ${d.label}`, body: d.note }))} />
      <Column title="Not in the chart" tone="sindoor"
        items={r.earning.leaks.map((d) => ({ title: `${d.number} — ${d.label}`, body: d.note }))}
        fallback="Every money-bearing number is present in your grid. That is uncommon." />
    </div>
    <Callout>{r.earning.note}</Callout>
    <Prose>{prose('earningReading')}</Prose>
  </>);

  add('Job or business', <>
    <div className="grid gap-px border border-rule bg-rule sm:grid-cols-3">
      <Tile label="What you told us" value={`${r.path.stated}`} note="toward your own venture" />
      <Tile label="What your chart leans" value={`${r.path.chart}`} note="toward your own venture" />
      <Tile label="Together" value={`${r.path.score}`} note={r.path.score >= 55 ? 'own venture' : 'inside a structure'} accent />
    </div>
    <Lede>{r.path.verdict}</Lede>
    {r.path.tension && <Callout>{r.path.tension}</Callout>}
    <Callout>{r.path.runway}</Callout>
    <Prose>{prose('jobVsBusiness')}</Prose>
  </>);

  add('What is actually in the way', <>
    <Callout><b>{r.blocker.title}.</b> {r.blocker.body}</Callout>
    {r.blocker.aggravated && (
      <p className="max-w-[74ch] text-[15.5px] leading-relaxed">
        Your grid makes this harder: {r.blocker.missing.join(' and ')}{' '}
        {r.blocker.missing.length > 1 ? 'are' : 'is'} missing, and {r.blocker.missing.length > 1 ? 'those are' : 'that is'} exactly
        what this concern runs on.
      </p>
    )}
    <Prose>{prose('blockerReading')}</Prose>
    <div className="grid gap-6 lg:grid-cols-2">
      <Column title="Your strengths" items={list(sections?.strengths)} tone="leaf" />
      <Column title="Your risks" items={list(sections?.risks)} tone="sindoor" />
    </div>
    {Boolean(list(sections?.openings).length) && (
      <Column title="Where the openings are" items={list(sections?.openings)} tone="leaf" />
    )}
  </>);

  add('The next three years', <>
    <div className="grid gap-px bg-rule lg:grid-cols-3">
      {r.years.map((y) => (
        <div key={y.year} className={`flex flex-col gap-2 p-5 ${y.current ? 'bg-ink text-paper' : 'bg-paper-card'}`}>
          <span className={`font-mono text-[10px] uppercase tracking-[.18em] ${y.current ? 'text-haldi' : 'text-ink-3'}`}>
            {y.year}{y.current ? ' · you are here' : ''}
          </span>
          <span className="disp text-[34px] leading-none">{y.number}</span>
          <span className="text-[14px] font-semibold">{y.title}</span>
          <span className={`text-[13.5px] leading-relaxed ${y.current ? 'text-[#B8B0A6]' : 'text-ink-2'}`}>{y.career}</span>
        </div>
      ))}
    </div>
    <Prose>{prose('yearsReading')}</Prose>
  </>);

  add('Favourable periods this year', <>
    <div className="grid gap-px bg-rule sm:grid-cols-2 lg:grid-cols-3">
      {r.windows.map((w) => (
        <div key={w.month} className={`flex items-baseline gap-3 p-3.5 ${w.favourable ? 'bg-paper-card' : 'bg-[#F5F3EC]'}`}>
          <span className={`disp text-[22px] leading-none ${w.favourable ? 'text-sindoor' : 'text-ink-3'}`}>{w.number}</span>
          <span className="flex flex-col">
            <span className="text-[14px] font-medium">{w.month}</span>
            <span className="text-[12.5px] leading-snug text-ink-2">{w.note}</span>
          </span>
        </div>
      ))}
    </div>
    <Prose>{prose('timingReading')}</Prose>
  </>);

  add('Your working numbers', <>
    <div className="grid gap-px bg-rule sm:grid-cols-2">
      <Tile label="Suits you" value={r.allowed.suits.join(' · ') || '—'} note="dates, totals and choices that sit well" />
      <Tile label="Work around" value={r.allowed.avoid.join(' · ') || '—'} note="not forbidden — simply harder work" />
    </div>
    <div className="grid gap-px bg-rule sm:grid-cols-3">
      <Tile label="Mobile ending" value={r.guidance.mobileEndings.slice(0, 3).join(' ') || '—'} />
      <Tile label="Vehicle" value={r.guidance.vehicleEndings.slice(0, 4).join(' ') || '—'} />
      <Tile label="PIN / totals" value={r.guidance.pins.slice(0, 3).join(' ') || '—'} />
    </div>
  </>);

  if (r.nameFriction)
    add('Your name is working against your numbers', <>
      <Callout>{r.nameFriction.note}</Callout>
      <Prose>{prose('nameNote')}</Prose>
    </>);

  const plan = steps(sections?.ninetyDayPlan);
  add('The next ninety days', <>
    {prose('decisionFramework') && <Prose>{prose('decisionFramework')}</Prose>}
    <Steps items={plan.length ? plan : r.plan.map((p) => ({ title: p.title, detail: p.purpose, when: p.window }))} />
  </>);

  if (prose('closing')) add('In closing', <Prose>{prose('closing')}</Prose>);

  return (
    <>
      <div className="border-b-2 border-sindoor bg-ink px-6 py-4 sm:px-10">
        <span className="font-mono text-[10px] uppercase tracking-[.3em] text-haldi">Part one · Career &amp; Money</span>
      </div>
      {blocks.map((b, i) => (
        <Section key={b.title} n={String(i + 1).padStart(2, '0')} title={b.title}>{b.node}</Section>
      ))}
    </>
  );
}

/* ── RELATIONSHIP HALF ─────────────────────────────────────────────── */

function RelationshipHalf({ r, sections }: { r: RelationshipResult; sections: Record<string, unknown> | null }) {
  const prose = proseOf(sections);
  const blocks: { title: string; node: React.ReactNode }[] = [];
  const add = (title: string, node: React.ReactNode) => blocks.push({ title, node });

  if (r.safety.flagged && r.safety.kind) {
    const h = HELPLINES[r.safety.kind];
    add('Please read this first', <>
      <div className="border-[1.5px] border-sindoor bg-[#FBF1EE] p-5 sm:p-6">
        <p className="max-w-[70ch] text-[16px] leading-relaxed">{h.lead}</p>
        <div className="mt-4 grid gap-px bg-rule sm:grid-cols-3">
          {h.lines.map((l) => (
            <div key={l.number} className="flex flex-col gap-1 bg-paper-card p-4">
              <span className="lbl">{l.name}</span>
              <span className="disp text-[26px] leading-none">{l.number}</span>
              <span className="text-[12.5px] leading-snug text-ink-2">{l.note}</span>
            </div>
          ))}
        </div>
      </div>
    </>);
  }

  add('What this looks like', <>
    <div className="border border-rule bg-[#F5F3EC] p-6 sm:p-7">
      <span className="lbl">Your pattern</span>
      <h3 className="disp mt-1 text-[30px] leading-tight sm:text-[36px]">{r.pattern.name}</h3>
      <p className="mt-3 max-w-[70ch] text-[15.5px] leading-relaxed">{r.pattern.body}</p>
    </div>
    <Lede>{prose('verdict') ?? r.verdict}</Lede>
    <Prose>{prose('patternReading')}</Prose>
  </>);

  add(r.paired ? 'The two of you, in numbers' : 'Your numbers', <>
    <div className="grid gap-px bg-rule sm:grid-cols-2">
      <div className="flex flex-col gap-3 bg-paper-card p-5">
        <span className="lbl">{r.you.name || 'You'}</span>
        <div className="flex gap-5">
          <NumPair label="birth" value={r.you.moolank} />
          <NumPair label="life path" value={r.you.bhagyank} />
          <NumPair label="name" value={r.you.naamank} />
        </div>
        <LoShuGrid mine={r.you.grid.counts} />
      </div>
      {r.them ? (
        <div className="flex flex-col gap-3 bg-paper-card p-5">
          <span className="lbl">{r.them.name || 'Them'}</span>
          <div className="flex gap-5">
            <NumPair label="birth" value={r.them.moolank} />
            <NumPair label="life path" value={r.them.bhagyank} />
            <NumPair label="name" value={r.them.naamank} />
          </div>
          <LoShuGrid mine={r.them.grid.counts} />
        </div>
      ) : (
        <div className="flex flex-col justify-center gap-2 bg-[#F5F3EC] p-5">
          <span className="lbl">Their chart</span>
          <p className="max-w-[42ch] text-[14.5px] leading-relaxed text-ink-2">
            You did not give us their details, so this report reads your side only.
          </p>
        </div>
      )}
    </div>
    <Prose>{prose('pairReading')}</Prose>
  </>);

  if (r.affinity && r.agreement !== null)
    add('Where you agree, and where you grate', <>
      <div className="grid gap-px bg-rule sm:grid-cols-3">
        {r.affinity.map((l) => (
          <Tile key={l.key} label={l.label} value={`${l.score}`} note={`${l.you} and ${l.them} — ${l.verdict}`} accent={l.verdict === 'strained'} />
        ))}
      </div>
      <div className="flex flex-col gap-3">
        {r.affinity.map((l) => (
          <div key={l.key} className="border-b border-[#E3E0D8] pb-3 last:border-0">
            <p className="max-w-[76ch] text-[14.5px] leading-relaxed text-ink-2">{l.note}</p>
          </div>
        ))}
      </div>
      <Callout>
        Taken together the two charts agree {r.agreement} out of 100. That is a reading of two sets of numbers, not a
        verdict on a relationship.
      </Callout>
      <Prose>{prose('agreementReading')}</Prose>
    </>);

  if (r.composite)
    add('What you supply each other', <>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-8">
        <LoShuGrid mine={r.you.grid.counts} theirs={r.them?.grid.counts} caption={`Between you, ${r.composite.coverage} of 100 covered`} />
        <div className="flex flex-1 flex-col gap-5">
          <Column title="What they bring that you do not" tone="leaf"
            items={r.composite.theyBring.map((m) => ({ title: `${m.number} — ${m.label}`, body: m.brings }))}
            fallback="They carry nothing your own grid is missing." />
          <Column title="What you bring that they do not" tone="leaf"
            items={r.composite.youBring.map((m) => ({ title: `${m.number} — ${m.label}`, body: m.brings }))}
            fallback="You carry nothing their grid is missing." />
        </div>
      </div>
      <Prose>{prose('exchangeReading')}</Prose>
    </>);

  if (r.composite)
    add(r.composite.blindSpot.length ? 'What neither of you supplies' : 'Your shared ground', <>
      {r.composite.blindSpot.length ? (
        <>
          <Callout>
            These numbers appear in neither chart. Nobody in this relationship provides them instinctively, which
            means they do not arrive by trying harder — they have to be built in on purpose.
          </Callout>
          <div className="grid gap-px bg-rule sm:grid-cols-2">
            {r.composite.blindSpot.map((m) => (
              <div key={m.number} className="flex flex-col gap-1.5 bg-paper-card p-5">
                <span className="disp text-[36px] leading-none text-sindoor">{m.number}</span>
                <span className="text-[15px] font-semibold">{m.label}</span>
                <span className="text-[14px] leading-relaxed text-ink-2">Where it is present, {m.brings}. Because it is absent from both charts, {m.absent}.</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <Callout>
          Between you, every number in the square is covered. That is unusual, and it means this relationship has no
          structural blind spot.
        </Callout>
      )}
      <Prose>{prose('blindSpotReading')}</Prose>
    </>);

  add('Where the friction sits', <>
    {r.composite?.friction && (
      <Callout>
        <b>{r.composite.friction.label}.</b> This is the thinnest line across the two of you — {r.composite.friction.missing.map((m) => `${m.number} (${m.label.toLowerCase()})`).join(' and ')} missing from both.
      </Callout>
    )}
    <div className="grid gap-6 lg:grid-cols-2">
      <Column title="What is working" items={list(sections?.strengths)} tone="leaf" />
      <Column title="Where it grates" items={list(sections?.friction)} tone="sindoor" />
    </div>
    <Prose>{prose('frictionReading')}</Prose>
    <div className="flex flex-col gap-2">
      <span className="lbl">How this shows up week to week</span>
      <ul className="flex flex-col gap-1.5">
        {r.pattern.shows.map((s) => (
          <li key={s} className="border-b border-[#E3E0D8] pb-1.5 text-[14.5px] leading-relaxed last:border-0">{s}</li>
        ))}
      </ul>
    </div>
    {!r.safety.flagged && <Callout>{r.pattern.costs}</Callout>}
  </>);

  add('Why the timing feels off', <>
    <div className="grid gap-px bg-rule sm:grid-cols-2">
      <Tile label={`${r.you.name || 'You'} · ${r.timing.you.year}`} value={String(r.timing.you.number)} note={r.timing.you.title} accent />
      {r.timing.them
        ? <Tile label={`${r.them?.name || 'Them'} · ${r.timing.them.year}`} value={String(r.timing.them.number)} note={r.timing.them.title} />
        : <Tile label="Their year" value="—" note="needs their date of birth" />}
    </div>
    <Prose>{r.timing.mismatch}</Prose>
    <Callout>{r.timing.you.body}</Callout>
    <Prose>{prose('timingReading')}</Prose>
  </>);

  add(r.branch.title, <>
    <Lede>{r.branch.body}</Lede>
    <Prose>{prose('branchReading')}</Prose>
    <Steps items={r.branch.steps.map((s) => ({ title: s.title, detail: s.detail }))} />
  </>);

  const guide = steps(sections?.conversationGuide);
  add('The conversation to have', <>
    {prose('overlooked') && <Callout>{prose('overlooked')}</Callout>}
    <Steps items={guide.length ? guide : r.conversation.map((cv) => ({ title: cv.title, detail: cv.detail }))} />
  </>);

  const plan = steps(sections?.thirtyDayPlan);
  if (plan.length || prose('nextStep'))
    add('The next thirty days', <>
      <Prose>{prose('nextStep')}</Prose>
      {Boolean(plan.length) && <Steps items={plan} />}
    </>);

  if (prose('closing')) add('In closing', <Prose>{prose('closing')}</Prose>);

  return (
    <>
      <div className="border-b-2 border-sindoor bg-ink px-6 py-4 sm:px-10">
        <span className="font-mono text-[10px] uppercase tracking-[.3em] text-haldi">Part two · Relationship Clarity</span>
      </div>
      {blocks.map((b, i) => (
        <Section key={b.title} n={String(i + 1).padStart(2, '0')} title={b.title}>{b.node}</Section>
      ))}
    </>
  );
}

function NumPair({ label, value }: { label: string; value: number }) {
  return (
    <span className="flex flex-col">
      <span className="disp text-[30px] leading-none">{value}</span>
      <span className="text-[11px] text-ink-3">{label}</span>
    </span>
  );
}
