import { Check } from '@/components/icons';
import { GRID_ORDER } from '@/lib/numerology/loshu';

/** Shared furniture for the report templates, so every product looks like one house. */

export interface Item { title: string; body: string }
export interface Step { title: string; detail: string; when?: string }

export const list = (v: unknown): Item[] =>
  Array.isArray(v) ? (v as Item[]).filter((x) => x?.title && x?.body) : [];
export const steps = (v: unknown): Step[] =>
  Array.isArray(v) ? (v as Step[]).filter((x) => x?.title && x?.detail) : [];

/** Reads one prose field out of whatever the model returned, or null. */
export const proseOf = (sections: Record<string, unknown> | null) => (k: string): string | null =>
  typeof sections?.[k] === 'string' && (sections[k] as string).length > 0 ? (sections[k] as string) : null;

export function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
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

export const Lede = ({ children }: { children: React.ReactNode }) => (
  <div className="border-l-[3px] border-sindoor pl-4">
    <p className="max-w-[70ch] text-[16.5px] leading-relaxed">{children}</p>
  </div>
);

export const Callout = ({ children }: { children: React.ReactNode }) => (
  <div className="border border-[#E3E0D8] bg-[#F5F3EC] p-5">
    <p className="max-w-[76ch] text-[15px] leading-relaxed">{children}</p>
  </div>
);

export const Prose = ({ children }: { children: React.ReactNode }) =>
  children ? <p className="max-w-[74ch] whitespace-pre-line text-[15.5px] leading-relaxed">{children}</p> : null;

export const Tile = ({ label, value, note, accent }: { label: string; value: string; note?: string; accent?: boolean }) => (
  <div className={`flex flex-col gap-1 p-4 ${accent ? 'bg-ink text-paper' : 'bg-paper-card'}`}>
    <span className={`font-mono text-[10px] uppercase tracking-[.18em] ${accent ? 'text-haldi' : 'text-ink-3'}`}>{label}</span>
    <span className="disp text-[30px] leading-none">{value}</span>
    {note && <span className={`text-[12.5px] leading-snug ${accent ? 'text-[#B8B0A6]' : 'text-ink-2'}`}>{note}</span>}
  </div>
);

export function Column({ title, items, tone, fallback }: {
  title: string; items: Item[]; tone: 'leaf' | 'sindoor'; fallback?: string;
}) {
  if (!items.length) return fallback ? <div className="flex flex-col gap-2"><span className="lbl">{title}</span><p className="text-sm text-ink-2">{fallback}</p></div> : null;
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

export function Steps({ items }: { items: Step[] }) {
  return (
    <div className="flex flex-col">
      {items.map((s, i) => (
        <div key={s.title} className="grid grid-cols-[34px_1fr] gap-4 border-t border-[#E3E0D8] py-4">
          <span className="disp text-[22px] leading-tight text-sindoor">{i + 1}</span>
          <span className="flex flex-col gap-1">
            <span className="text-base font-semibold">{s.title}</span>
            <span className="text-[14.5px] leading-relaxed text-ink-2">{s.detail}</span>
            {s.when && <span className="font-mono text-[10px] uppercase tracking-[.14em] text-ink-3">{s.when}</span>}
          </span>
        </div>
      ))}
    </div>
  );
}

export function Meter({ value, label, caption }: { value: number; label: string; caption?: string }) {
  return (
    <div className="flex flex-col gap-1.5 bg-paper-card p-5">
      <span className="lbl">{label}</span>
      <span className="disp text-[52px] leading-none">{value}<span className="text-lg text-ink-3">/100</span></span>
      {caption && <span className="font-mono text-[11px] uppercase tracking-widest text-sindoor">{caption}</span>}
      <span className="mt-2 h-2 bg-paper-2"><span className="block h-full bg-sindoor" style={{ width: `${value}%` }} /></span>
    </div>
  );
}

/**
 * The Lo Shu square. `mine` and `theirs` let one grid show two people at once —
 * which is the whole point of the paired relationship reading.
 */
export function LoShuGrid({ mine, theirs, caption }: {
  mine: Record<number, number>; theirs?: Record<number, number>; caption?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="grid w-full max-w-[280px] grid-cols-3 gap-px bg-rule">
        {GRID_ORDER.map((n) => {
          const a = mine[n] ?? 0;
          const b = theirs ? theirs[n] ?? 0 : 0;
          const empty = theirs ? a === 0 && b === 0 : a === 0;
          return (
            <div
              key={n}
              className={`flex aspect-square flex-col items-center justify-center gap-0.5 ${empty ? 'bg-[#F5F3EC]' : 'bg-paper-card'}`}
            >
              {empty ? (
                <span className="font-mono text-[13px] text-ink-3">{n}</span>
              ) : (
                <>
                  <span className="disp text-[19px] leading-none">{String(n).repeat(Math.min(a || b, 3))}</span>
                  {theirs && (
                    <span className="font-mono text-[9px] uppercase tracking-[.1em] text-ink-3">
                      {a > 0 && b > 0 ? 'both' : a > 0 ? 'you' : 'them'}
                    </span>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
      {caption && <span className="text-[12.5px] text-ink-3">{caption}</span>}
    </div>
  );
}

export function Footnote({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#F5F3EC] p-6 sm:p-10 lg:px-12">
      <p className="max-w-[80ch] text-sm leading-relaxed text-ink-2">{children}</p>
    </div>
  );
}
