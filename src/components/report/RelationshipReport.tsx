import type { RelationshipResult } from '@/lib/relationship';
import { HELPLINES } from '@/lib/relationship/safety';
import {
  Section, Lede, Callout, Prose, Tile, Column, Steps, LoShuGrid, Footnote,
  list, steps, proseOf,
} from './chrome';

export function RelationshipReport({ r, sections }: {
  r: RelationshipResult; sections: Record<string, unknown> | null;
}) {
  const prose = proseOf(sections);
  const blocks: { title: string; node: React.ReactNode }[] = [];
  const add = (title: string, node: React.ReactNode) => blocks.push({ title, node });

  /* 01 ── safety comes before anything else on the page */
  if (r.safety.flagged && r.safety.kind) {
    const h = HELPLINES[r.safety.kind];
    add('Please read this first', (
      <>
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
        <p className="max-w-[74ch] text-[14.5px] leading-relaxed text-ink-2">
          The rest of this report is below and it is yours to read whenever you want to. Nothing in it is more
          important than the numbers above, and nothing in it is asking you to be patient with something unsafe.
        </p>
      </>
    ));
  }

  /* 02 ── the pattern, which is where a score used to be */
  add('What this looks like', (
    <>
      <div className="border border-rule bg-[#F5F3EC] p-6 sm:p-7">
        <span className="lbl">Your pattern</span>
        <h3 className="disp mt-1 text-[30px] leading-tight sm:text-[36px]">{r.pattern.name}</h3>
        <p className="mt-3 max-w-[70ch] text-[15.5px] leading-relaxed">{r.pattern.body}</p>
      </div>
      <Lede>{prose('verdict') ?? r.verdict}</Lede>
      <Prose>{prose('patternReading')}</Prose>
    </>
  ));

  /* 03 ── the two charts */
  add(r.paired ? 'The two of you, in numbers' : 'Your numbers', (
    <>
      <div className="grid gap-px bg-rule sm:grid-cols-2">
        <div className="flex flex-col gap-3 bg-paper-card p-5">
          <span className="lbl">{r.you.name || 'You'}</span>
          <div className="flex gap-5">
            <span className="flex flex-col"><span className="disp text-[30px] leading-none">{r.you.moolank}</span><span className="text-[11px] text-ink-3">birth</span></span>
            <span className="flex flex-col"><span className="disp text-[30px] leading-none">{r.you.bhagyank}</span><span className="text-[11px] text-ink-3">life path</span></span>
            <span className="flex flex-col"><span className="disp text-[30px] leading-none">{r.you.naamank}</span><span className="text-[11px] text-ink-3">name</span></span>
          </div>
          <LoShuGrid mine={r.you.grid.counts} />
        </div>
        {r.them ? (
          <div className="flex flex-col gap-3 bg-paper-card p-5">
            <span className="lbl">{r.them.name || 'Them'}</span>
            <div className="flex gap-5">
              <span className="flex flex-col"><span className="disp text-[30px] leading-none">{r.them.moolank}</span><span className="text-[11px] text-ink-3">birth</span></span>
              <span className="flex flex-col"><span className="disp text-[30px] leading-none">{r.them.bhagyank}</span><span className="text-[11px] text-ink-3">life path</span></span>
              <span className="flex flex-col"><span className="disp text-[30px] leading-none">{r.them.naamank}</span><span className="text-[11px] text-ink-3">name</span></span>
            </div>
            <LoShuGrid mine={r.them.grid.counts} />
          </div>
        ) : (
          <div className="flex flex-col justify-center gap-2 bg-[#F5F3EC] p-5">
            <span className="lbl">Their chart</span>
            <p className="max-w-[42ch] text-[14.5px] leading-relaxed text-ink-2">
              You did not give us their name and date of birth, so this report reads your side only. That is a
              complete reading of you — but the comparison sections, the shared grid and the timing reading all need
              the second chart. Send them to us and we will add those pages at no cost.
            </p>
          </div>
        )}
      </div>
      <Prose>{prose('pairReading')}</Prose>
    </>
  ));

  /* 04 ── affinity */
  if (r.affinity && r.agreement !== null)
    add('Where you agree, and where you grate', (
      <>
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
          verdict on a relationship — people with low agreement stay together well, and people with high agreement
          part. What it tells you is where the effort has to go.
        </Callout>
        <Prose>{prose('agreementReading')}</Prose>
      </>
    ));

  /* 05 ── what you supply each other */
  if (r.composite)
    add('What you supply each other', (
      <>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-8">
          <LoShuGrid mine={r.you.grid.counts} theirs={r.them?.grid.counts} caption={`Between you, ${r.composite.coverage} of 100 covered`} />
          <div className="flex flex-1 flex-col gap-5">
            <Column
              title="What they bring that you do not"
              tone="leaf"
              items={r.composite.theyBring.map((m) => ({ title: `${m.number} — ${m.label}`, body: m.brings }))}
              fallback="They carry nothing your own grid is missing. You are alike in what you have, which is comfortable and can be narrow."
            />
            <Column
              title="What you bring that they do not"
              tone="leaf"
              items={r.composite.youBring.map((m) => ({ title: `${m.number} — ${m.label}`, body: m.brings }))}
              fallback="You carry nothing their grid is missing."
            />
          </div>
        </div>
        <Prose>{prose('exchangeReading')}</Prose>
      </>
    ));

  /* 06 ── the centrepiece */
  if (r.composite)
    add(r.composite.blindSpot.length ? 'What neither of you supplies' : 'Your shared ground', (
      <>
        {r.composite.blindSpot.length ? (
          <>
            <Callout>
              These numbers appear in neither chart. Nobody in this relationship provides them instinctively, which
              means they do not arrive by trying harder — they have to be built in on purpose, by whichever of you
              decides to.
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
            structural blind spot — whatever is difficult here is a matter of what you do with each other, not of
            something neither of you has.
          </Callout>
        )}
        <Prose>{prose('blindSpotReading')}</Prose>
      </>
    ));

  /* 07 ── friction */
  add('Where the friction sits', (
    <>
      {r.composite?.friction && (
        <Callout>
          <b>{r.composite.friction.label}.</b> This is the thinnest line across the two of you together — {r.composite.friction.missing.map((m) => `${m.number} (${m.label.toLowerCase()})`).join(' and ')} missing from both. Arguments
          that feel unreasonably hard tend to be arguments that need this line.
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
    </>
  ));

  /* 08 ── timing */
  add('Why the timing feels off', (
    <>
      <div className="grid gap-px bg-rule sm:grid-cols-2">
        <Tile label={`${r.you.name || 'You'} · ${r.timing.you.year}`} value={String(r.timing.you.number)} note={r.timing.you.title} accent />
        {r.timing.them
          ? <Tile label={`${r.them?.name || 'Them'} · ${r.timing.them.year}`} value={String(r.timing.them.number)} note={r.timing.them.title} />
          : <Tile label="Their year" value="—" note="needs their date of birth" />}
      </div>
      <Prose>{r.timing.mismatch}</Prose>
      <Callout>{r.timing.you.body}</Callout>
      <Prose>{prose('timingReading')}</Prose>
    </>
  ));

  /* 09 ── the branch */
  add(r.branch.title, (
    <>
      <Lede>{r.branch.body}</Lede>
      <Prose>{prose('branchReading')}</Prose>
      <Steps items={r.branch.steps.map((s) => ({ title: s.title, detail: s.detail }))} />
    </>
  ));

  /* 10 ── the conversation */
  const guide = steps(sections?.conversationGuide);
  add('The conversation to have', (
    <>
      {prose('overlooked') && <Callout>{prose('overlooked')}</Callout>}
      <Steps items={guide.length ? guide : r.conversation.map((c) => ({ title: c.title, detail: c.detail }))} />
    </>
  ));

  /* 11 ── thirty days */
  const plan = steps(sections?.thirtyDayPlan);
  if (plan.length || prose('nextStep'))
    add('The next thirty days', (
      <>
        <Prose>{prose('nextStep')}</Prose>
        {Boolean(plan.length) && <Steps items={plan} />}
      </>
    ));

  if (prose('closing')) add('In closing', <Prose>{prose('closing')}</Prose>);

  return (
    <div className="flex flex-col">
      {blocks.map((b, i) => (
        <Section key={b.title} n={String(i + 1).padStart(2, '0')} title={b.title}>{b.node}</Section>
      ))}
      <Footnote>
        <b>About this report.</b> Everything above was built from the details you gave us and, where you provided
        them, your partner&rsquo;s. Only you have told us anything — nothing here claims to know what another person
        privately thinks, feels or intends, and nothing here is a diagnosis. It is interpretive guidance meant to help
        you think, not a prediction about what will happen. There is deliberately no score in this report: a single
        number is a poor way to describe a relationship and an easy thing to use as a weapon.
      </Footnote>
    </div>
  );
}
