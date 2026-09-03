import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { AnnouncementBar, Header, Footer } from '@/components/Chrome';
import { Cover } from '@/components/Cover';
import { ArrowRight, Lock } from '@/components/icons';
import { store } from '@/lib/store';
import { compute } from '@/lib/numerology';
import { PRODUCTS, rupees } from '@/lib/config/products';

const BLOCK = '\u2588';

export const metadata: Metadata = { title: 'Your free result', robots: { index: false, follow: false } };

const TONE: Record<number, string> = {
  1: 'independent and self-starting', 2: 'attuned to other people and slow to force things',
  3: 'expressive and quick to connect', 4: 'methodical and happier with a system',
  5: 'restless, sociable and quick to start', 6: 'responsible, and pulled towards home',
  7: 'reflective, private and needing depth', 8: 'structural, patient and built for the long haul',
  9: 'driven, direct and impatient with delay',
};

export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const found = await store.getLead(id);
  if (!found) notFound();

  const c = compute({ fullName: found.full_name, dob: found.dob });
  const p = PRODUCTS['name-correction'];
  // One measure faces the customer — the fit score. The raw name↔life-path
  // affinity stays internal so two different words never describe one thing.
  const band = c.nameAnalysis.current.verdict;

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="wrap flex max-w-[760px] flex-col gap-6 py-10 lg:py-14">
        <div className="flex flex-col gap-1.5">
          <span className="lbl text-sindoor">
            {found.full_name} · {new Date(found.dob + 'T00:00:00Z').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })}
          </span>
          <h1 className="disp text-[34px] leading-tight lg:text-[42px]">
            {band === 'strong'
              ? 'Your name and your birth date sit well together.'
              : band === 'workable'
                ? 'Your name and your birth date work, but they pull against each other.'
                : 'Your name and your birth date do not agree.'}
          </h1>
        </div>

        <div className="grid gap-px border border-rule bg-rule sm:grid-cols-2">
          <Tile label="Name number" value={String(c.core.name.digit)} note={TONE[c.core.name.digit]} />
          <Tile label="Life path" value={String(c.core.lifePath)} note={TONE[c.core.lifePathDigit]} />
        </div>

        <div className="flex flex-col gap-3 border border-rule bg-paper-card p-5 sm:p-6">
          <div className="flex items-baseline justify-between">
            <span className="lbl">Fit score</span>
            <span className="font-mono text-xs uppercase tracking-widest text-sindoor">{band} fit</span>
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="disp text-[56px] leading-none">{c.score}</span>
            <span className="font-mono text-[13px] text-ink-3">/ 100</span>
          </div>
          <div className="h-2 bg-paper-2"><div className="h-full bg-sindoor" style={{ width: `${c.score}%` }} /></div>
          <p className="text-[14.5px] leading-relaxed text-ink-2">
            A {c.core.name.digit} name is {TONE[c.core.name.digit]}. A {c.core.lifePathDigit} life path is{' '}
            {TONE[c.core.lifePathDigit]}.{' '}
            {band === 'strong'
              ? 'They reinforce each other, which usually shows up as effort that lands.'
              : band === 'workable'
                ? 'They can work together, but they ask different things of you, and that costs energy.'
                : 'They do not pull the same way, which usually shows up as effort that does not convert.'}
          </p>
        </div>

        <div className="flex flex-col gap-2.5 bg-ink p-5 text-paper sm:p-6">
          <span className="lbl text-haldi">One thing worth knowing</span>
          <p className="text-[15.5px] leading-relaxed">{gridInsight(c)}</p>
        </div>

        <div className="relative flex flex-col gap-3.5 border border-rule bg-paper-card p-5 sm:p-6">
          <span className="lbl">Your corrected spellings</span>
          {/* The real spellings never reach the DOM — a blur is a visual effect,
              not a paywall. Only the count crosses the line. */}
          <div className="flex select-none flex-col gap-px border border-rule bg-rule blur-[5px]" aria-hidden>
            {Array.from({ length: Math.max(2, c.nameAnalysis.options.length) }, (_, i) => (
              <div key={i} className="flex justify-between bg-paper-card px-3.5 py-2.5">
                <span className="disp text-lg">{BLOCK.repeat(6 + ((i * 3) % 5))} {BLOCK.repeat(5)}</span>
                <span className="font-mono text-[11px] text-sindoor">{BLOCK.repeat(2)}</span>
              </div>
            ))}
          </div>
          <p className="flex items-center justify-center gap-2 text-[13px] text-ink-3">
            <Lock size={14} />
            {c.nameAnalysis.options.length
              ? `${c.nameAnalysis.options.length} scored spelling${c.nameAnalysis.options.length > 1 ? 's' : ''} in the full report`
              : 'Full analysis in the complete report'}
          </p>
        </div>

        <div className="flex flex-col gap-4 border border-sindoor bg-sindoor-wash p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <Cover slug="name-correction" width={84} uid="result-cover" />
            <div className="flex flex-col gap-1.5">
              <span className="disp text-[23px] leading-tight">Name Correction Report</span>
              <span className="text-sm leading-snug text-ink-2">
                Eighteen pages: your full grid, every scored spelling, lucky elements and a plan for making a change stick.
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-sm text-ink-3 line-through">{rupees(p.comparePaise)}</span>
              <span className="disp text-[38px] leading-none">{rupees(p.pricePaise)}</span>
            </div>
            <Link href="/start/name-correction" className="btn flex-1 sm:max-w-[210px]">
              Get my report <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <p className="text-center text-xs leading-relaxed text-ink-3">
          This free result is a summary. It is interpretive guidance, not a prediction.
        </p>
      </main>
      <Footer />
    </>
  );
}

function gridInsight(c: ReturnType<typeof compute>): string {
  const rep = c.grid.repeated[0];
  const miss = c.grid.missing[0];
  const complete = c.grid.completePlanes[0];
  if (rep) {
    const meaning = c.grid.cells.find((x) => x.number === rep)?.meaning.toLowerCase();
    return `Your birth date puts a ${rep} in your grid more than once. That doubles ${meaning} in you — usually a strength, and occasionally the thing you overdo when you are under pressure.`;
  }
  if (complete) return `Your ${complete.label.toLowerCase()} is complete — all of ${complete.numbers.join(', ')} present. That is the steadying line in your grid.`;
  if (miss) {
    const meaning = c.grid.cells.find((x) => x.number === miss)?.meaning.toLowerCase();
    return `The ${miss} is absent from your grid, which points at ${meaning}. It is the most useful gap to work on first.`;
  }
  return 'Your grid is unusually even, with no number dominating. That tends to read as steadiness rather than intensity.';
}

function Tile({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="flex flex-col gap-1 bg-paper-card p-5">
      <span className="lbl">{label}</span>
      <span className="disp text-[46px] leading-none">{value}</span>
      <span className="text-[12.5px] text-ink-2">{note}</span>
    </div>
  );
}
