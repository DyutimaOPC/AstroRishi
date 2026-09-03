import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { NameNumerologyReport } from '@/components/report/NameNumerologyReport';
import { CareerRelationshipReport } from '@/components/report/CareerRelationshipReport';
import { ArrowRight, Whatsapp } from '@/components/icons';
import { PrintReport } from '@/components/PrintReport';
import { Logo } from '@/components/Logo';
import { store } from '@/lib/store';
import { PRODUCTS, liveProducts, rupees } from '@/lib/config/products';
import { SITE, CONSULTATION_ENABLED } from '@/lib/config/site';
import type { Computed } from '@/lib/numerology';
import type { CareerResult } from '@/lib/career';
import type { RelationshipResult } from '@/lib/relationship';

const halfPrice = (paise: number) => Math.floor(paise / 2 / 100) * 100;

export const metadata: Metadata = { title: 'Your report', robots: { index: false, follow: false, nocache: true } };

export default async function ReportPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const order = await store.orderForToken(token);
  if (!order) notFound();
  const row = await store.getReport(order.id);
  if (!row) notFound();

  const p = PRODUCTS[order.product_slug];
  const sections = (row.sections ?? null) as Record<string, unknown> | null;
  const issued = new Date(order.paid_at ?? order.created_at);
  const excludeSlugs = p.slug === 'both'
    ? ['both', 'name-numerology', 'career-relationship']
    : ['both', p.slug];
  const others = liveProducts().filter((x) => !excludeSlugs.includes(x.slug)).slice(0, 2);

  return (
    <div className="bg-paper-2 pb-10">
      <div className="noprint sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 bg-ink px-5 py-3 text-[#B8B0A6] lg:px-10">
        <div className="flex items-center gap-3.5">
          <Link href="/" className="flex items-center gap-2 text-haldi hover:text-haldi">
            <Logo size={26} tone="gold" compact /><span className="disp text-xl">ASTRORISHI</span>
          </Link>
          <span className="text-[13px]">{p.name} Report</span>
        </div>
        <PrintReport />
      </div>

      <header className="bg-[#A11C1C] px-5 py-10 text-[#F0D492] sm:px-10 lg:px-12 lg:py-14"
        style={{ backgroundColor: p.cover }}>
        <div className="flex flex-col gap-6 border border-[#D9AE55] p-6 sm:p-9">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <span className="flex items-center gap-3">
              <Logo size={44} tone="gold" />
              <span className="disp text-[26px] tracking-[.14em]">ASTRORISHI</span>
            </span>
            <span className="font-mono text-[9.5px] uppercase tracking-[.18em] opacity-85">Report no. {order.reference}</span>
          </div>
          <div className="h-px bg-[#D9AE55] opacity-50" />
          <div className="flex flex-col gap-2">
            <h1 className="disp text-[38px] leading-[1.02] text-[#F7E9C8] sm:text-[52px]">{p.name} Report</h1>
            <span className="font-mono text-[11px] uppercase tracking-[.3em] opacity-80">
              {order.product_slug === 'name-numerology' ? 'Chaldean numerology' : 'Prepared from your answers'}
            </span>
          </div>
          <dl className="grid gap-5 pt-1 sm:grid-cols-3">
            <Meta label="Prepared for" value={order.full_name} />
            {order.dob && <Meta label="Date of birth" value={new Date(order.dob + 'T00:00:00Z').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })} />}
            <Meta label="Issued" value={issued.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} />
          </dl>
        </div>
      </header>

      {!row.computed
        ? <div className="bg-paper-card p-10"><p>Your report is being prepared. This page will fill in shortly.</p></div>
        : order.product_slug === 'name-numerology'
          ? <NameNumerologyReport c={row.computed as Computed} sections={sections as Parameters<typeof NameNumerologyReport>[0]['sections']} />
          : order.product_slug === 'both'
            ? <>
                <NameNumerologyReport c={(row.computed as { numerology: Computed }).numerology} sections={sections as Parameters<typeof NameNumerologyReport>[0]['sections']} />
                <CareerRelationshipReport r={(row.computed as { career: CareerResult; relationship: RelationshipResult })} sections={sections as Parameters<typeof CareerRelationshipReport>[0]['sections']} />
              </>
            : <CareerRelationshipReport r={row.computed as { career: CareerResult; relationship: RelationshipResult }} sections={sections as Parameters<typeof CareerRelationshipReport>[0]['sections']} />}

      <section className="noprint bg-ink px-5 py-11 text-paper sm:px-10 lg:px-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-5">
          <div className="flex flex-col gap-2">
            <span className="lbl text-haldi">Because you read this one</span>
            <h2 className="disp text-[28px] leading-tight">Your numbers say more than one report can hold.</h2>
          </div>
          <span className="whitespace-nowrap border border-haldi px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[.14em] text-haldi">
            50% off for report holders
          </span>
        </div>
        <div className="grid gap-px border border-rule-dark bg-rule-dark sm:grid-cols-2">
          {others.map((o) => (
            <div key={o.slug} className="flex flex-col gap-2.5 bg-[#221D19] p-5">
              <span className="disp text-[22px]">{o.name}</span>
              <span className="text-[13.5px] leading-relaxed text-[#B8B0A6]">{o.promise}</span>
              <div className="mt-auto flex items-center justify-between gap-3 pt-2.5">
                <span className="flex items-baseline gap-2">
                  <span className="font-mono text-[13px] text-ink-3 line-through">{rupees(o.pricePaise)}</span>
                  <span className="disp text-[28px]">{rupees(halfPrice(o.pricePaise))}</span>
                </span>
                <Link href={`/start/${o.slug}`} className="btn-gold min-h-[42px] px-4 text-xs">Add to my reports</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {CONSULTATION_ENABLED && (
        <section className="noprint flex flex-wrap items-center gap-6 bg-ink-dark px-5 py-9 text-paper sm:px-10 lg:px-12">
          <span className="flex h-[74px] w-[74px] shrink-0 items-center justify-center border border-[#4A4038] bg-[#2E2822] text-center">
            <span className="font-mono text-[8px] uppercase tracking-wider text-ink-3">[[ PHOTO ]]</span>
          </span>
          <div className="flex min-w-[260px] flex-1 flex-col gap-1.5">
            <span className="lbl text-haldi">The next step</span>
            <span className="disp text-[26px] leading-tight">Ask about your options.</span>
            <span className="max-w-[56ch] text-[14.5px] leading-relaxed text-[#B8B0A6]">
              Fifteen minutes on the phone to go through what to do with this and how to make it stick.
            </span>
          </div>
          <div className="flex flex-col items-start gap-2.5 sm:items-end">
            <span className="flex items-baseline gap-2.5">
              <span className="font-mono text-sm text-ink-3 line-through">₹1,499</span>
              <span className="disp text-4xl leading-none">₹999</span>
            </span>
            <button type="button" className="btn-gold">Book my call <ArrowRight size={16} /></button>
          </div>
        </section>
      )}

      <div className="noprint flex flex-wrap items-center justify-between gap-4 border-t border-rule-dark bg-ink px-5 py-5 text-ink-3 sm:px-10 lg:px-12">
        <span className="text-[12.5px]">
          Saved for you — reachable any time from <Link href="/access" className="text-[#B8B0A6] hover:text-haldi">Access my report</Link>,
          or{' '}
          <a href={SITE.whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[#B8B0A6] hover:text-haldi">
            <Whatsapp size={13} className="text-[#1F7A45]" />message us on WhatsApp
          </a>.
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[.12em]">Report no. {order.reference}</span>
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="font-mono text-[9px] uppercase tracking-[.16em] opacity-70">{label}</dt>
      <dd className="disp text-[22px] text-[#F7E9C8]">{value}</dd>
    </div>
  );
}
