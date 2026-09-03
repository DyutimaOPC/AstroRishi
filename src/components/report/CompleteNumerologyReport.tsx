import type { Computed } from '@/lib/numerology';
import { Check } from '@/components/icons';

/**
 * The Complete Numerology Report. Deliberately NOT the Name Correction report:
 * this one reads the core numbers together as one picture and does not offer
 * corrected spellings — that is the other product, and selling it twice would
 * be a poor deal for anyone who bought both.
 */

const CORE_MEANING: Readonly<Record<number, { title: string; short: string }>> = {
  1: { title: 'The initiator', short: 'independent, self-starting, uneasy taking orders' },
  2: { title: 'The mediator', short: 'attuned to people, patient, slow to force a decision' },
  3: { title: 'The communicator', short: 'expressive, quick to connect, easily scattered' },
  4: { title: 'The builder', short: 'methodical, reliable, happier with a system than without' },
  5: { title: 'The restless one', short: 'quick, sociable, better at starting than finishing' },
  6: { title: 'The carer', short: 'responsible, pulled towards home and duty' },
  7: { title: 'The seeker', short: 'reflective, private, needing depth over pace' },
  8: { title: 'The builder of scale', short: 'structural, patient, built for long horizons' },
  9: { title: 'The finisher', short: 'driven, direct, impatient with delay' },
};

interface Item { title: string; body: string }
interface Step { title: string; detail: string }
const list = (v: unknown): Item[] => (Array.isArray(v) ? (v as Item[]).filter((x) => x?.title && x?.body) : []);
const steps = (v: unknown): Step[] => (Array.isArray(v) ? (v as Step[]).filter((x) => x?.title && x?.detail) : []);

export function CompleteNumerologyReport({ c, sections }: {
  c: Computed; sections: Record<string, unknown> | null;
}) {
  const prose = (k: string): string | null => (typeof sections?.[k] === 'string' ? (sections[k] as string) : null);

  const CORE = [
    { key: 'lifePath', label: 'Life path', hindi: 'भाग्यांक', value: c.core.lifePath, digit: c.core.lifePathDigit,
      how: 'Every digit of your birth date, added and reduced. The number you are working with all your life.',
      reading: prose('lifePathReading') },
    { key: 'destiny', label: 'Destiny', hindi: 'नामांक', value: c.core.destiny.number, digit: c.core.destiny.digit,
      how: `All the letters of your name (${c.core.destiny.total}). What you are here to build.`,
      reading: prose('destinyReading') },
    { key: 'soul', label: 'Soul urge', hindi: 'अंतर्मन', value: c.core.soulUrge.number, digit: c.core.soulUrge.digit,
      how: `The vowels of your name (${c.core.soulUrge.total}). What you actually want, whether or not you say so.`,
      reading: prose('soulUrgeReading') },
    { key: 'personality', label: 'Personality', hindi: 'व्यक्तित्व', value: c.core.personality.number, digit: c.core.personality.digit,
      how: `The consonants of your name (${c.core.personality.total}). How you come across before you speak.`,
      reading: prose('personalityReading') },
    { key: 'birth', label: 'Birth number', hindi: 'मूलांक', value: c.core.birthNumber, digit: c.core.birthNumber,
      how: 'Your day of birth reduced. The temperament you were handed.', reading: null },
  ];

  return (
    <div className="flex flex-col">
      <Section n="01" title="Your five core numbers">
        <div className="grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-5">
          {CORE.map((n) => (
            <div key={n.key} className="flex flex-col gap-1 bg-paper-card p-5">
              <span className="flex items-baseline gap-2">
                <span className="lbl">{n.label}</span>
                <span className="disp text-[12px] text-ink-3">{n.hindi}</span>
              </span>
              <span className="disp text-[40px] leading-none">{n.value}</span>
              <span className="font-mono text-[10px] uppercase tracking-[.12em] text-sindoor">
                {CORE_MEANING[n.digit]?.title}
              </span>
            </div>
          ))}
        </div>
        <Lede>
          {prose('verdict') ?? (
            <>Read together, your numbers describe someone{' '}
              <b>{CORE_MEANING[c.core.lifePathDigit]?.short}</b> by disposition, whose name pulls towards{' '}
              <b>{CORE_MEANING[c.core.destiny.digit]?.short}</b>. Where those two agree you will feel effortless;
              where they differ is where the friction in your life tends to sit.</>
          )}
        </Lede>
      </Section>

      <Section n="02" title="What each number is doing">
        <p className="max-w-[72ch] text-[15px] text-ink-2">
          Four numbers, four different jobs. The interesting part is rarely a single number — it is where two of them
          disagree.
        </p>
        <div className="flex flex-col">
          {CORE.slice(0, 4).map((n) => (
            <div key={n.key} className="grid grid-cols-[64px_1fr] gap-5 border-t border-[#E3E0D8] py-5">
              <span className="flex flex-col items-center gap-1">
                <span className="disp text-[34px] leading-none text-sindoor">{n.value}</span>
                <span className="font-mono text-[9px] uppercase tracking-[.1em] text-ink-3">{n.label}</span>
              </span>
              <span className="flex flex-col gap-1.5">
                <span className="text-base font-semibold">{CORE_MEANING[n.digit]?.title}</span>
                <span className="text-[13px] text-ink-3">{n.how}</span>
                <span className="text-[14.5px] leading-relaxed text-ink-2">
                  {n.reading ?? `A ${n.digit} here reads as ${CORE_MEANING[n.digit]?.short}.`}
                </span>
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section n="03" title="Your Lo Shu grid">
        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          <div className="grid grid-cols-3 gap-0.5 self-start border border-rule bg-rule p-0.5">
            {c.grid.cells.map((cell) => {
              const on = cell.count > 0, many = cell.count > 1;
              return (
                <span key={cell.number}
                  className={`flex h-[88px] flex-col items-center justify-center gap-1 ${many ? 'bg-sindoor-wash' : on ? 'bg-paper-card' : 'bg-[#EDEBE4]'}`}>
                  <span className={`disp leading-none ${many ? 'text-[28px] text-sindoor' : on ? 'text-[28px]' : 'text-[22px] text-[#C2BCB1]'}`}>
                    {on ? String(cell.number).repeat(cell.count) : cell.number}
                  </span>
                  <span className={`font-mono text-[8px] uppercase tracking-wider ${on ? 'text-ink-3' : 'text-[#C2BCB1]'}`}>
                    {on ? cell.meaning : 'absent'}
                  </span>
                </span>
              );
            })}
          </div>
          <div className="flex flex-col gap-4">
            <p className="max-w-[62ch] text-[15px] leading-relaxed">
              {prose('gridReading') ?? (
                <>{c.grid.completePlanes.length} of the eight planes are complete.{' '}
                  {c.grid.missing.length
                    ? `Nothing sits at ${c.grid.missing.join(', ')} — those are the qualities you supply by effort rather than by nature.`
                    : 'Every cell is filled, which is uncommon.'}
                  {c.grid.repeated.length ? ` ${c.grid.repeated.join(' and ')} appear more than once and shout loudest.` : ''}</>
              )}
            </p>
            <div className="grid gap-px border border-rule bg-rule sm:grid-cols-3">
              <Tile label="Strongest" value={c.scope.dominant ? `${c.scope.dominant.number} × ${c.scope.dominant.count}` : '—'}
                note={c.scope.dominant ? `${c.scope.dominant.ruler} — the loudest voice in your grid.` : ''} />
              <Tile label="Second voice" value={c.scope.supporting ? String(c.scope.supporting.number) : '—'}
                note={c.scope.supporting ? `${c.scope.supporting.ruler} — where you turn under pressure.` : ''} />
              <Tile label="Absent" value={c.scope.missing.length ? c.scope.missing.map((m) => m.number).join(' · ') : 'None'}
                note={c.scope.missing.length ? `${c.scope.weakPlanets.join(', ')} have no seat here.` : 'Every cell filled.'} />
            </div>
            <div className="flex flex-col gap-2.5">
              {c.energy.map((e) => (
                <div key={e.label} className="grid grid-cols-[1fr_auto] items-center gap-x-4 sm:grid-cols-[200px_1fr_44px]">
                  <span className="text-[14px] font-medium">{e.label}</span>
                  <span className="order-3 h-2.5 bg-[#DDD9CF] sm:order-none">
                    <span className="block h-full bg-sindoor" style={{ width: `${e.value}%` }} />
                  </span>
                  <span className="font-mono text-xs text-ink-2 sm:text-right">{e.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section n="04" title="Strengths and challenges">
        <div className="grid gap-8 lg:grid-cols-2">
          <Column title="What you can rely on" items={list(sections?.strengths)} tone="leaf"
            fallback={c.grid.repeated.map((n) => ({
              title: `A doubled ${n}`,
              body: `${c.grid.cells.find((x) => x.number === n)?.meaning} appears twice in your grid, which makes it your loudest instinct — and the one you overplay under pressure.`,
            }))} />
          <Column title="What keeps recurring" items={list(sections?.challenges)} tone="sindoor"
            fallback={c.grid.missing.map((n) => ({
              title: `No ${n} in the grid`,
              body: `${c.grid.cells.find((x) => x.number === n)?.meaning} is absent, so it runs on effort rather than supply. This is the gap worth building a habit around.`,
            }))} />
        </div>
      </Section>

      <Section n="05" title="The years ahead">
        <p className="max-w-[72ch] text-[15px] text-ink-2">
          Your personal year turns over on your birthday and runs a nine-year cycle. It describes the character of a
          period — what it tends to reward and what it tends to punish — not events, and not dates.
        </p>
        {prose('yearAhead') && (
          <Callout>{prose('yearAhead')}</Callout>
        )}
        <div className="flex flex-col">
          {c.years.map((y) => (
            <div key={y.year}
              className={`grid grid-cols-[72px_1fr] gap-5 border-t border-[#E3E0D8] py-4 ${y.current ? 'bg-sindoor-wash' : ''}`}>
              <span className="flex flex-col items-center gap-0.5">
                <span className={`disp text-[30px] leading-none ${y.current ? 'text-sindoor' : ''}`}>{y.number}</span>
                <span className="font-mono text-[10px] text-ink-3">{y.year}</span>
              </span>
              <span className="flex flex-col gap-1">
                <span className="flex flex-wrap items-baseline gap-2">
                  <span className="text-base font-semibold">{y.title}</span>
                  <span className="font-mono text-[9px] uppercase tracking-[.12em] text-ink-3">{y.ruler}</span>
                  {y.current && <span className="border border-sindoor px-1.5 py-0.5 font-mono text-[8.5px] uppercase tracking-[.13em] text-sindoor">This year</span>}
                </span>
                <span className="text-[14.5px] leading-relaxed text-ink-2">{y.body}</span>
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section n="06" title="Your lucky elements and what to do next">
        <div className="grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
          <Tile label="Numbers" value={c.lucky.numbers.join(' · ')} note="For dates and choices that are yours to pick." />
          <Tile label="Colours" value={c.lucky.colours.join(' · ')} note="For interviews and first meetings." />
          <Tile label="Days" value={c.lucky.days.join(' · ')} note="Begin new work here where you can." />
          <Tile label="Direction" value={c.lucky.direction} note={`Your ruling planet is ${c.lucky.ruler}.`} />
        </div>
        <div className="flex flex-col">
          {(steps(sections?.remedies).length ? steps(sections?.remedies) : fallbackRemedies(c)).map((r, i) => (
            <div key={r.title} className="grid grid-cols-[34px_1fr] gap-4 border-t border-[#E3E0D8] py-4">
              <span className="disp text-[22px] leading-tight text-sindoor">{i + 1}</span>
              <span className="flex flex-col gap-1">
                <span className="text-base font-semibold">{r.title}</span>
                <span className="text-[14.5px] leading-relaxed text-ink-2">{r.detail}</span>
              </span>
            </div>
          ))}
        </div>
      </Section>

      <div className="bg-[#F5F3EC] p-6 sm:p-10 lg:px-12">
        <p className="max-w-[80ch] text-sm leading-relaxed text-ink-2">
          <b>About this report.</b> Every number above was worked out from the name and birth date you gave us. It is
          interpretive guidance meant to help you think, not a prediction and not a guarantee. Nothing here is medical,
          psychological, legal or financial advice.
        </p>
      </div>
    </div>
  );
}

function fallbackRemedies(c: Computed): Step[] {
  const out: Step[] = [];
  for (const m of c.grid.missing.slice(0, 2)) {
    const meaning = c.grid.cells.find((x) => x.number === m)?.meaning.toLowerCase() ?? '';
    out.push({ title: `Build a habit around the missing ${m}`,
      detail: `Your grid has no ${m}, which points at ${meaning}. One small fixed routine does more here than trying harder at everything.` });
  }
  out.push({ title: `Use your ${c.lucky.days[0] ?? 'best day'} deliberately`,
    detail: `Where the timing is yours to choose, favour ${c.lucky.days.join(' or ')} for anything you want to stick.` });
  out.push({ title: 'Read the year you are in, not the one you want',
    detail: `You are in a ${c.years[0].number} year — ${c.years[0].title.toLowerCase()}. Working with its grain costs less than working against it.` });
  return out.slice(0, 5);
}

function Column({ title, items, fallback, tone }: {
  title: string; items: Item[]; fallback: Item[]; tone: 'leaf' | 'sindoor';
}) {
  const shown = items.length ? items : fallback;
  if (!shown.length) return null;
  return (
    <div className="flex flex-col gap-3">
      <span className="lbl">{title}</span>
      {shown.map((it) => (
        <div key={it.title} className="flex gap-3 border-b border-[#E3E0D8] pb-3">
          <Check size={15} className={`mt-1 ${tone === 'leaf' ? 'text-leaf' : 'text-sindoor'}`} />
          <span className="flex flex-col gap-1">
            <span className="text-[15px] font-semibold">{it.title}</span>
            <span className="text-[14px] leading-relaxed text-ink-2">{it.body}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-5 border-b border-rule bg-paper-card p-6 sm:p-10 lg:px-12">
      <div className="flex items-center gap-3">
        <span className="border border-sindoor px-2 py-1 font-mono text-[10px] tracking-[.18em] text-sindoor">{n}</span>
        <h2 className="disp text-[26px] leading-tight sm:text-[29px]">{title}</h2>
      </div>
      {children}
    </section>
  );
}
const Lede = ({ children }: { children: React.ReactNode }) => (
  <div className="border-l-[3px] border-sindoor pl-4"><p className="max-w-[70ch] text-[16.5px] leading-relaxed">{children}</p></div>
);
const Callout = ({ children }: { children: React.ReactNode }) => (
  <div className="border border-[#E3E0D8] bg-[#F5F3EC] p-5"><p className="max-w-[76ch] text-[15px] leading-relaxed">{children}</p></div>
);
const Tile = ({ label, value, note }: { label: string; value: string; note: string }) => (
  <div className="flex flex-col gap-1.5 bg-paper-card p-5">
    <span className="lbl">{label}</span>
    <span className="disp text-2xl leading-none">{value}</span>
    <span className="text-[12.5px] leading-snug text-ink-2">{note}</span>
  </div>
);
