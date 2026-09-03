import type { CareerResult } from '@/lib/career';
import {
  Section, Lede, Callout, Prose, Tile, Column, Steps, Meter, LoShuGrid, Footnote,
  list, steps, proseOf,
} from './chrome';

export function CareerReport({ r, sections }: {
  r: CareerResult; sections: Record<string, unknown> | null;
}) {
  const prose = proseOf(sections);
  const blocks: { title: string; node: React.ReactNode }[] = [];
  const add = (title: string, node: React.ReactNode) => blocks.push({ title, node });

  /* 01 ── the verdict, and what fed it */
  add('Where you stand', (
    <>
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
    </>
  ));

  /* 02 ── the numbers behind everything else */
  add('The numbers this is built on', (
    <>
      <div className="grid gap-px bg-rule sm:grid-cols-3">
        {r.numbers.map((n) => (
          <Tile key={n.key} label={`${n.label} · ${n.hindi}`} value={String(n.value)} note={`${n.ruler} — ${n.how}`} />
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
    </>
  ));

  /* 03 ── work nature */
  add('What you are built to do', (
    <>
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
    </>
  ));

  /* 04 ── the fit gap: the paid insight */
  add('What you do, against what you are built for', (
    <>
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
    </>
  ));

  /* 05 ── earning capacity */
  add('Your earning capacity', (
    <>
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
        <Column
          title="Working for you"
          tone="leaf"
          items={r.earning.drivers.map((d) => ({ title: `${d.number} — ${d.label}`, body: d.note }))}
        />
        <Column
          title="Not in the chart"
          tone="sindoor"
          items={r.earning.leaks.map((d) => ({ title: `${d.number} — ${d.label}`, body: d.note }))}
          fallback="Every money-bearing number is present in your grid. That is uncommon."
        />
      </div>
      <Callout>{r.earning.note}</Callout>
      <Prose>{prose('earningReading')}</Prose>
    </>
  ));

  /* 06 ── job or business */
  add('Job or business', (
    <>
      <div className="grid gap-px border border-rule bg-rule sm:grid-cols-3">
        <Tile label="What you told us" value={`${r.path.stated}`} note="toward your own venture" />
        <Tile label="What your chart leans" value={`${r.path.chart}`} note="toward your own venture" />
        <Tile label="Together" value={`${r.path.score}`} note={r.path.score >= 55 ? 'own venture' : 'inside a structure'} accent />
      </div>
      <Lede>{r.path.verdict}</Lede>
      {r.path.tension && <Callout>{r.path.tension}</Callout>}
      <Callout>{r.path.runway}</Callout>
      <Prose>{prose('jobVsBusiness')}</Prose>
    </>
  ));

  /* 07 ── the blocker */
  add('What is actually in the way', (
    <>
      <Callout><b>{r.blocker.title}.</b> {r.blocker.body}</Callout>
      {r.blocker.aggravated && (
        <p className="max-w-[74ch] text-[15.5px] leading-relaxed">
          Your grid makes this harder than it needs to be: {r.blocker.missing.join(' and ')}{' '}
          {r.blocker.missing.length > 1 ? 'are' : 'is'} missing, and {r.blocker.missing.length > 1 ? 'those are' : 'that is'} exactly
          what this concern runs on. It is a gap to work around deliberately, not a verdict.
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
    </>
  ));

  /* 08 ── three years */
  add('The next three years', (
    <>
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
    </>
  ));

  /* 09 ── periods inside the year */
  add('The favourable periods this year', (
    <>
      <p className="max-w-[74ch] text-[15.5px] leading-relaxed">
        Each month carries its own number, worked from your personal year. These describe what a period is good for —
        never what will happen in it.
      </p>
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
    </>
  ));

  /* 10 ── working numbers */
  add('Your working numbers', (
    <>
      <div className="grid gap-px bg-rule sm:grid-cols-2">
        <Tile label="Suits you" value={r.allowed.suits.join(' · ') || '—'} note="dates, totals and choices that sit well" />
        <Tile label="Work around" value={r.allowed.avoid.join(' · ') || '—'} note="not forbidden — simply harder work for you" />
      </div>
      <div className="grid gap-px bg-rule sm:grid-cols-3">
        <Tile label="Mobile ending" value={r.guidance.mobileEndings.slice(0, 3).join(' ') || '—'} />
        <Tile label="Vehicle" value={r.guidance.vehicleEndings.slice(0, 4).join(' ') || '—'} />
        <Tile label="PIN / totals" value={r.guidance.pins.slice(0, 3).join(' ') || '—'} />
      </div>
    </>
  ));

  /* 11 ── name friction, only when real */
  if (r.nameFriction)
    add('Your name is working against your numbers', (
      <>
        <Callout>{r.nameFriction.note}</Callout>
        <Prose>{prose('nameNote')}</Prose>
        <p className="max-w-[74ch] text-[14.5px] leading-relaxed text-ink-2">
          This is the one thing in this report that is fixable by changing something rather than doing something. Our
          Name Correction Report works out which spellings raise that figure and by how much.
        </p>
      </>
    ));

  /* 12 ── the plan */
  const plan = steps(sections?.ninetyDayPlan);
  add('The next ninety days', (
    <>
      {prose('decisionFramework') && <Prose>{prose('decisionFramework')}</Prose>}
      <Steps items={plan.length ? plan : r.plan.map((p) => ({ title: p.title, detail: p.purpose, when: p.window }))} />
    </>
  ));

  if (prose('closing')) add('In closing', <Prose>{prose('closing')}</Prose>);

  return (
    <div className="flex flex-col">
      {blocks.map((b, i) => (
        <Section key={b.title} n={String(i + 1).padStart(2, '0')} title={b.title}>{b.node}</Section>
      ))}
      <Footnote>
        <b>About this report.</b> Everything above was built from your name, your date of birth and the answers you
        gave us. It is interpretive guidance meant to help you think, not a prediction and not a guarantee. Nothing
        here is financial or investment advice, and no part of it should be read as a promise about income,
        employment or any other outcome.
      </Footnote>
    </div>
  );
}
