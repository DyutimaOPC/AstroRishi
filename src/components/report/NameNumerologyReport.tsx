import type { Computed } from '@/lib/numerology';
import { Check } from '@/components/icons';
import {
  Section, Lede, Callout, Prose, Tile, Steps, Footnote,
  proseOf,
} from './chrome';

const TONE: Record<number, string> = {
  1: 'independent and self-starting', 2: 'attuned to people and slow to force things',
  3: 'expressive and quick to connect', 4: 'methodical and happier with a system',
  5: 'restless, sociable and quick to start', 6: 'responsible, and pulled towards home',
  7: 'reflective, private and needing depth', 8: 'structural, patient and built for the long haul',
  9: 'driven, direct and impatient with delay',
};

const PLANE_NOTE: Record<string, string> = {
  emotional: 'Feeling, adaptability and letting go.',
  thought: 'How thoroughly a situation gets thought through before you move.',
  will: 'Persistence — whether it runs on system or on effort.',
  mental: 'Ideas, and the structure available to hold them.',
  practical: 'Work, home and material comfort.',
  action: 'Getting things finished rather than started.',
  golden: 'A rare full line — unusual balance across the middle of the grid.',
  silver: 'Intuition backed by method.',
};

const ordinal = (n: number): string =>
  n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] ?? 'th';

export function NameNumerologyReport({ c, sections }: {
  c: Computed;
  sections: { 'name-correction'?: Record<string, unknown>; numerology?: Record<string, unknown> } | null;
}) {
  return (
    <div className="flex flex-col">
      <NameHalf c={c} sections={(sections?.['name-correction'] ?? null) as Record<string, unknown> | null} />
      <NumerologyHalf c={c} sections={(sections?.numerology ?? null) as Record<string, unknown> | null} />
      <Footnote>
        <b>About this report.</b> Everything above was worked out from the name and birth date you gave us, using
        Chaldean values. It is interpretive guidance meant to help you think, not a prediction and not a guarantee.
        Nothing here is medical, psychological, legal or financial advice.
      </Footnote>
    </div>
  );
}

/* ── NAME CORRECTION HALF ─────────────────────────────────────────── */

function NameHalf({ c, sections }: { c: Computed; sections: Record<string, unknown> | null }) {
  const prose = proseOf(sections);
  const best = c.nameAnalysis.best;

  return (
    <>
      <div className="border-b-2 border-sindoor bg-ink px-6 py-4 sm:px-10">
        <span className="font-mono text-[10px] uppercase tracking-[.3em] text-haldi">Part one · Your name</span>
      </div>

      <Section n="01" title="At a glance">
        <div className="grid gap-px border border-rule bg-rule sm:grid-cols-3">
          {c.named.map((n) => (
            <div key={n.key} className="flex flex-col gap-1 bg-paper-card p-5">
              <span className="flex items-baseline gap-2">
                <span className="lbl">{n.label}</span>
                <span className="disp text-[13px] text-ink-3">{n.hindi}</span>
              </span>
              <span className="flex items-baseline gap-2.5">
                <span className="disp text-[42px] leading-none">{n.value}</span>
                <span className="font-mono text-[11px] uppercase tracking-[.14em] text-sindoor">{n.ruler}</span>
              </span>
              <span className="text-[12.5px] leading-snug text-ink-2">{n.how}</span>
            </div>
          ))}
        </div>

        <div className="grid gap-px border border-rule bg-rule sm:grid-cols-2">
          <Tile label="Name harmony" value={`${c.score}/100`}
            note={`Your name against your birth and destiny numbers — a ${c.nameAnalysis.current.verdict} fit.`} />
          {best
            ? <Tile label="Best available" value={`${best.score}/100`} note={best.name} accent />
            : <Tile label="Grid" value={`${c.grid.cells.filter((x) => x.count > 0).length}/9`}
                note={c.grid.missing.length ? `Missing ${c.grid.missing.join(' and ')}.` : 'Every cell filled.'} />}
        </div>

        <Lede>
          {prose('verdict') ?? (
            <>Your name carries a <b>{c.core.name.digit}</b> vibration and your birth date a <b>{c.core.lifePath}</b>. A{' '}
              {c.core.name.digit} is {TONE[c.core.name.digit]}; a {c.core.lifePathDigit} is {TONE[c.core.lifePathDigit]}.{' '}
              {c.nameAnalysis.current.verdict === 'strained'
                ? 'The two pull in different directions, which is usually felt as effort that does not convert.'
                : c.nameAnalysis.current.verdict === 'workable'
                  ? 'They can work together, but they ask different things of you, and that costs energy.'
                  : 'They reinforce each other, which tends to show up as effort that lands.'}</>
          )}
        </Lede>
      </Section>

      <Section n="02" title="How your name reads today">
        <Prose>{prose('currentNameReading')}</Prose>
        <div className="flex flex-wrap items-start gap-x-4 gap-y-3 border border-rule bg-[#F5F3EC] p-5">
          {c.core.name.letters.map((l, i) => (
            <span key={`${l.letter}-${i}`} className="flex min-w-[28px] flex-col items-center gap-1">
              <span className="disp text-2xl leading-none">{l.letter}</span>
              <span className="font-mono text-[11px] text-sindoor">{l.value}</span>
            </span>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-5">
          <Pair label="Total" value={`${c.core.name.total}`} />
          <span className="text-rule">&rarr;</span>
          <Pair label="Reduced" value={`${c.core.name.digit}`} accent />
          <span className="min-w-[240px] flex-1 text-sm text-ink-2">A {c.core.name.digit} name is {TONE[c.core.name.digit]}.</span>
        </div>
        {c.words.length > 1 && (
          <div className="grid gap-px border border-rule bg-rule sm:grid-cols-2">
            {c.words.map((w) => (
              <div key={w.word} className="flex flex-col gap-1.5 bg-paper-card p-4">
                <span className="lbl">{w.word}</span>
                <span className="font-mono text-[12.5px] leading-relaxed text-ink-2">
                  {w.letters.map((l) => `${l.letter}(${l.value})`).join(' + ')} = {w.total}
                </span>
                <span className="text-sm">Reduces to <span className="disp text-xl text-sindoor">{w.digit}</span></span>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section n="03" title="Which numbers suit you">
        <p className="max-w-[72ch] text-[15px] text-ink-2">
          Every number from 1 to 9, scored against your birth number ({c.core.birthNumber}) and destiny number{' '}
          ({c.core.lifePathDigit}) together.
        </p>
        <div className="flex flex-col gap-1.5">
          {c.numbers.ranked.map((r) => {
            const isName = r.number === c.core.name.digit;
            return (
              <div key={r.number}
                className={`grid grid-cols-[34px_86px_1fr_44px] items-center gap-3 px-2 py-1.5 ${isName ? 'bg-sindoor-wash' : ''}`}>
                <span className={`disp text-xl ${isName ? 'text-sindoor' : ''}`}>{r.number}</span>
                <span className="font-mono text-[11px] uppercase tracking-[.1em] text-ink-3">{r.ruler}</span>
                <span className="h-2 bg-[#DDD9CF]">
                  <span className="block h-full bg-sindoor" style={{ width: `${r.harmony}%`, opacity: isName ? 1 : 0.55 }} />
                </span>
                <span className="text-right font-mono text-xs">{r.harmony}%</span>
              </div>
            );
          })}
        </div>
        <div className="grid gap-px border border-rule bg-rule sm:grid-cols-2">
          <div className="flex flex-col gap-1.5 bg-paper-card p-5">
            <span className="lbl text-leaf">Suits you</span>
            <span className="disp text-[30px] leading-none">{c.numbers.suits.join(' · ')}</span>
          </div>
          <div className="flex flex-col gap-1.5 bg-paper-card p-5">
            <span className="lbl text-sindoor">Works against you</span>
            <span className="disp text-[30px] leading-none">{c.numbers.avoid.length ? c.numbers.avoid.join(' · ') : 'None'}</span>
          </div>
        </div>
        <Callout>
          Your name currently reads <b>{c.core.name.digit}</b>, which sits at{' '}
          <b>{c.nameAnalysis.current.score}%</b> with your core pair — {c.numbers.ranked.findIndex((r) => r.number === c.core.name.digit) + 1}
          {ordinal(c.numbers.ranked.findIndex((r) => r.number === c.core.name.digit) + 1)} of the nine.
          {c.nameAnalysis.best
            ? ` The best available is ${c.numbers.ranked[0].harmony}%, and the next section shows the spellings that reach it.`
            : ' No spelling would place you meaningfully higher, so no change is recommended.'}
        </Callout>
      </Section>

      {c.nameAnalysis.options.length > 0 && (
        <Section n="04" title="Your corrected name options">
          <p className="max-w-[72ch] text-[15px] text-ink-2">
            Each spelling was scored against your birth date: how the resulting number sits with your life path and birth
            number, and whether it shores up a gap in your grid.
          </p>
          <div className="overflow-x-auto border border-rule">
            <table className="w-full min-w-[560px] border-collapse text-left">
              <thead>
                <tr className="bg-ink">
                  {['Spelling', 'Total', 'Number', 'Fit'].map((h) => <th key={h} className="lbl px-4 py-3 text-[#B8B0A6]">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {[...c.nameAnalysis.options, c.nameAnalysis.current].map((o, i) => (
                  <tr key={o.name} className={`border-b border-[#E3E0D8] ${i === 0 ? 'bg-sindoor-wash' : o.isCurrent ? 'bg-[#EDEBE4]' : 'bg-paper-card'}`}>
                    <td className="px-4 py-3.5">
                      <span className="flex flex-wrap items-baseline gap-2.5">
                        <span className={`disp text-[23px] ${o.isCurrent ? 'text-ink-3' : ''}`}>{o.name}</span>
                        {i === 0 && <span className="border border-sindoor px-1.5 py-0.5 font-mono text-[8.5px] uppercase tracking-[.13em] text-sindoor">Recommended</span>}
                        {o.isCurrent && <span className="bg-[#DDD9CF] px-1.5 py-0.5 font-mono text-[8.5px] uppercase tracking-[.13em] text-ink-2">Current</span>}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-[13px] text-ink-2">{o.total}</td>
                    <td className={`disp px-4 py-3.5 text-[22px] ${o.isCurrent ? 'text-ink-3' : 'text-sindoor'}`}>{o.digit}</td>
                    <td className="px-4 py-3.5">
                      <span className="flex items-center gap-2.5">
                        <span className="h-1.5 w-full min-w-[60px] max-w-[90px] bg-[#DDD9CF]">
                          <span className={`block h-full ${o.isCurrent ? 'bg-[#A8A196]' : 'bg-sindoor'}`} style={{ width: `${o.score}%` }} />
                        </span>
                        <span className="w-5 text-right font-mono text-xs">{o.score}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {best && (
            <Callout>
              {prose('recommendation') ?? (
                <><b>{best.change}.</b> It moves your total from {c.core.name.total} to {best.total} and your name number from{' '}
                  {c.core.name.digit} to {best.digit} — {best.digit} sits more comfortably with a {c.core.lifePathDigit} life path
                  than {c.core.name.digit} does.</>
              )}
            </Callout>
          )}
        </Section>
      )}
    </>
  );
}

/* ── NUMEROLOGY HALF ──────────────────────────────────────────────── */

function NumerologyHalf({ c, sections }: { c: Computed; sections: Record<string, unknown> | null }) {
  const prose = proseOf(sections);

  return (
    <>
      <div className="border-b-2 border-sindoor bg-ink px-6 py-4 sm:px-10">
        <span className="font-mono text-[10px] uppercase tracking-[.3em] text-haldi">Part two · Your numbers</span>
      </div>

      <Section n="01" title="Your Lo Shu grid">
        <div className="grid gap-8 lg:grid-cols-[322px_1fr]">
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-3 gap-0.5 border border-rule bg-rule p-0.5">
              {c.grid.cells.map((cell) => {
                const on = cell.count > 0, many = cell.count > 1;
                return (
                  <span key={cell.number}
                    className={`flex h-24 flex-col items-center justify-center gap-1 ${many ? 'bg-sindoor-wash' : on ? 'bg-paper-card' : 'bg-[#EDEBE4]'}`}>
                    <span className={`disp leading-none ${many ? 'text-3xl text-sindoor' : on ? 'text-3xl' : 'text-2xl text-[#C2BCB1]'}`}>
                      {on ? String(cell.number).repeat(cell.count) : cell.number}
                    </span>
                    <span className={`font-mono text-[8px] uppercase tracking-wider ${on ? 'text-ink-3' : 'text-[#C2BCB1]'}`}>
                      {on ? cell.meaning : 'absent'}
                    </span>
                  </span>
                );
              })}
            </div>
            <div className="flex flex-wrap gap-4 font-mono text-[10px] text-ink-3">
              <span><span className="text-sindoor">&#9632;</span> repeated</span>
              <span><span className="text-ink">&#9632;</span> present</span>
              <span><span className="text-[#C2BCB1]">&#9632;</span> absent</span>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="hidden grid-cols-[20px_132px_76px_1fr] gap-3.5 border-b-[1.5px] border-ink pb-2 sm:grid">
              <span /><span className="lbl">Plane</span><span className="lbl">Numbers</span><span className="lbl">What it means</span>
            </div>
            {c.grid.planes.map((p) => (
              <div key={p.key} className="grid grid-cols-[20px_1fr] items-baseline gap-3.5 border-b border-[#E3E0D8] py-3 sm:grid-cols-[20px_132px_76px_1fr]">
                {p.complete ? <Check size={14} className="text-leaf" /> : <span className="font-mono text-xs text-[#C2BCB1]">&ndash;</span>}
                <span className={`text-[14.5px] font-semibold ${p.complete ? '' : 'text-ink-3'}`}>{p.label}</span>
                <span className={`col-start-2 font-mono text-xs tracking-wider sm:col-start-auto ${p.complete ? 'text-sindoor' : 'text-[#C2BCB1]'}`}>
                  {p.numbers.join(' · ')}
                </span>
                <span className="col-start-2 text-[13.5px] leading-relaxed text-ink-2 sm:col-start-auto">{PLANE_NOTE[p.key]}</span>
              </div>
            ))}
          </div>
        </div>
        <Callout>
          {prose('gridReading') ?? (
            <><b>{c.grid.completePlanes.length} complete {c.grid.completePlanes.length === 1 ? 'plane' : 'planes'}.</b>{' '}
              {c.grid.missing.length
                ? `The gaps are at ${c.grid.missing.join(' and ')} — the numbers the remedies below are aimed at.`
                : 'Every cell in your grid is filled, which is uncommon.'}
              {c.grid.repeated.length ? ` ${c.grid.repeated.join(' and ')} appear more than once, doubling their effect.` : ''}</>
          )}
        </Callout>
      </Section>

      <Section n="02" title="Your energy profile">
        <p className="max-w-[72ch] text-[15px] text-ink-2">
          Five readings taken from the same grid. A low bar marks where you rely on effort rather
          than on natural supply.
        </p>
        <div className="flex flex-col gap-3">
          {c.energy.map((e) => (
            <div key={e.label} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 sm:grid-cols-[210px_1fr_44px]">
              <span className="text-[14.5px] font-medium">{e.label}</span>
              <span className="order-3 h-2.5 bg-[#DDD9CF] sm:order-none">
                <span className="block h-full bg-sindoor" style={{ width: `${e.value}%` }} />
              </span>
              <span className="font-mono text-xs text-ink-2 sm:text-right">{e.value}%</span>
            </div>
          ))}
        </div>
        <div className="grid gap-px border border-rule bg-rule sm:grid-cols-3">
          <Tile label="Strongest number"
            value={c.scope.dominant ? `${c.scope.dominant.number} × ${c.scope.dominant.count}` : '—'}
            note={c.scope.dominant ? `Ruled by ${c.scope.dominant.ruler}. The loudest voice in your grid.` : ''} />
          <Tile label="Second voice"
            value={c.scope.supporting ? `${c.scope.supporting.number}` : '—'}
            note={c.scope.supporting ? `Ruled by ${c.scope.supporting.ruler}. Where you turn under pressure.` : ''} />
          <Tile label="Absent"
            value={c.scope.missing.length ? c.scope.missing.map((m) => m.number).join(' · ') : 'None'}
            note={c.scope.missing.length ? `${c.scope.weakPlanets.join(', ')} — the planets with no seat in your grid.` : 'Every cell filled.'} />
        </div>
        <Prose>{prose('lifePathReading')}</Prose>
        <Prose>{prose('destinyReading')}</Prose>
        <Prose>{prose('soulUrgeReading')}</Prose>
        <Prose>{prose('personalityReading')}</Prose>
      </Section>

      <Section n="03" title="Strengths and challenges">
        {prose('verdict') && <Lede>{prose('verdict')}</Lede>}
        <div className="grid gap-6 lg:grid-cols-2">
          <StrengthList title="Strengths you can lean on" items={arrayOf(sections?.strengths)} tone="leaf" />
          <StrengthList title="Challenges that recur" items={arrayOf(sections?.challenges)} tone="sindoor" />
        </div>
      </Section>

      <Section n="04" title="The year ahead">
        <Prose>{prose('yearAhead')}</Prose>
      </Section>

      <Section n="05" title="Everyday numbers you get to choose">
        <div className="grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
          <Tile label="Mobile number" value={c.guidance.totals.join(' · ')}
            note={`Endings that work well: ${c.guidance.mobileEndings.join(', ')}`} />
          <Tile label="Vehicle number" value={c.guidance.vehicleEndings.join(' · ')}
            note="Reduce the digits on the plate." />
          <Tile label="PIN or passcode" value={c.guidance.pins.slice(0, 2).join('  ')}
            note={`Also fine: ${c.guidance.pins.slice(2).join(', ') || '—'}.`} />
          <Tile label="Dates to prefer" value={c.lucky.numbers.join(' · ')}
            note="For signing, starting and launching." />
        </div>
      </Section>

      <Section n="06" title="Lucky elements and remedies">
        <div className="grid gap-px border border-rule bg-rule sm:grid-cols-2">
          <Tile label="Numbers" value={c.lucky.numbers.join(' · ')} note="Dates and choices that tend to favour you." />
          <Tile label="Colours" value={c.lucky.colours.join(' · ')} note="For interviews and first meetings." />
          <Tile label="Days" value={c.lucky.days.join(' · ')} note="Begin new work here where you can." />
          <Tile label="Direction" value={c.lucky.direction} note={`Your ruling planet is ${c.lucky.ruler}.`} />
        </div>
        <Steps items={remedies(c, sections)} />
        <Prose>{prose('closing')}</Prose>
      </Section>

      {c.nameAnalysis.best && (
        <Section n="07" title="Making the change stick">
          <p className="max-w-[72ch] text-[15px] text-ink-2">
            You do not need to touch a single official document to begin. A spelling carries its effect through daily
            use, so start where use is heaviest.
          </p>
          <div className="grid gap-px border border-rule bg-rule sm:grid-cols-2">
            <div className="flex flex-col gap-2.5 bg-paper-card p-5">
              <span className="lbl text-leaf">Start here — today</span>
              <ul className="flex flex-col gap-1.5 text-[14.5px]">
                {['WhatsApp display name', 'Email signature', 'Social media handles', 'Visiting card and résumé', 'How you introduce yourself'].map((x) => (
                  <li key={x} className="flex gap-2.5"><Check size={14} className="mt-1 text-leaf" />{x}</li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-2.5 bg-paper-card p-5">
              <span className="lbl text-ink-3">Leave alone for now</span>
              <ul className="flex flex-col gap-1.5 text-[14.5px] text-ink-2">
                {['PAN card', 'Aadhaar', 'Passport', 'Bank accounts', 'Property and legal papers'].map((x) => (
                  <li key={x} className="flex gap-2.5"><span className="mt-1 w-3.5 text-center text-ink-3">—</span>{x}</li>
                ))}
              </ul>
            </div>
          </div>
          <Callout>
            Give it ninety days of consistent use before you judge it. A spelling change is a habit first — used
            occasionally, it is simply a typo.
          </Callout>
        </Section>
      )}
    </>
  );
}

/* ── helpers ──────────────────────────────────────────────────────── */

function arrayOf(v: unknown): { title: string; body: string }[] {
  return Array.isArray(v) ? (v as { title: string; body: string }[]).filter((x) => x?.title && x?.body) : [];
}

function StrengthList({ title, items, tone }: { title: string; items: { title: string; body: string }[]; tone: 'leaf' | 'sindoor' }) {
  if (!items.length) return null;
  return (
    <div className="flex flex-col gap-3">
      <span className="lbl">{title}</span>
      {items.map((it) => (
        <div key={it.title} className="flex gap-3 border-b border-[#E3E0D8] pb-3 last:border-0">
          <Check size={15} className={tone === 'leaf' ? 'mt-1 shrink-0 text-leaf' : 'mt-1 shrink-0 text-sindoor'} />
          <span className="flex flex-col gap-1">
            <span className="text-[15px] font-semibold">{it.title}</span>
            <span className="text-[14px] leading-relaxed text-ink-2">{it.body}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

interface Remedy { title: string; detail: string }

function remedies(c: Computed, sections: Record<string, unknown> | null): Remedy[] {
  const fromModel = sections?.remedies;
  if (Array.isArray(fromModel) && fromModel.length)
    return (fromModel as Remedy[]).filter((r) => r?.title && r?.detail).slice(0, 5);

  const out: Remedy[] = [];
  if (c.nameAnalysis.best)
    out.push({
      title: 'Adopt the corrected spelling in writing first',
      detail: 'Signature, email display name, WhatsApp, social handles. The daily use carries the change.',
    });
  out.push({
    title: 'Give any change ninety days',
    detail: 'A spelling change is a habit before it is anything else. Use it consistently for three months before judging it.',
  });
  for (const m of c.grid.missing.slice(0, 2)) {
    const meaning = c.grid.cells.find((x) => x.number === m)?.meaning.toLowerCase() ?? '';
    out.push({
      title: `Strengthen the absent ${m}`,
      detail: `Your grid has no ${m}, which points at ${meaning}. Build one small fixed habit around it.`,
    });
  }
  out.push({
    title: `Use your ${c.lucky.days[0] ?? 'best'} for anything that matters`,
    detail: `Start new work, send the difficult message, or sign on ${c.lucky.days.join(' or ')} where the choice is yours.`,
  });
  return out.slice(0, 5);
}

const Pair = ({ label, value, accent }: { label: string; value: string; accent?: boolean }) => (
  <span className="flex items-baseline gap-2.5"><span className="lbl">{label}</span>
    <span className={`disp text-3xl ${accent ? 'text-sindoor' : ''}`}>{value}</span></span>
);
