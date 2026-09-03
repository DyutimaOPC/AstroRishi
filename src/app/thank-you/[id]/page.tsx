import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Header, Footer } from '@/components/Chrome';
import { Ph } from '@/components/Placeholder';
import { TrackEvent } from '@/components/TrackEvent';
import { ArrowRight, Check, Whatsapp } from '@/components/icons';
import { store } from '@/lib/store';
import { SITE, PANDIT, CONSULTATION_ENABLED } from '@/lib/config/site';
import { isPaid } from '@/lib/orders/state';

export const metadata: Metadata = { title: 'Order confirmed', robots: { index: false, follow: false } };

export default async function ThankYou({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await store.getOrder(id);
  if (!order) notFound();

  const paid = isPaid(order.state);
  const token = await store.tokenForOrder(order.id);
  const ready = order.state === 'REPORT_READY' || order.state === 'REVIEWED' || order.state === 'DELIVERED';

  const steps = [
    ['Your report is being written', 'Worked out from the details you gave us.', paid],
    ['Checked before it is sent', 'A person reads it through first.', ready],
    ['Delivered to you', 'On WhatsApp and email.', order.state === 'DELIVERED'],
  ] as const;

  return (
    <>
      {paid && (
        <TrackEvent name="Purchase" eventId={order.reference}
          params={{ content_ids: [order.product_slug], value: order.amount_paise / 100, currency: 'INR' }} />
      )}
      <Header />
      <main className="wrap flex max-w-[560px] flex-col gap-6 py-10 lg:py-14">
        <div className="flex flex-col items-start gap-4">
          <span className="flex h-13 w-13 items-center justify-center bg-leaf p-3 text-paper">
            <Check size={26} className="text-paper" />
          </span>
          <h1 className="disp text-[32px] leading-tight lg:text-[36px]">
            {paid ? 'Payment received. Your report is being prepared.' : 'Order created.'}
          </h1>
          <div className="flex flex-col gap-0.5">
            <span className="font-mono text-[10px] uppercase tracking-[.14em] text-ink-3">Order</span>
            <span className="font-mono text-[15px]">{order.reference}</span>
          </div>
        </div>

        <div className="flex flex-col border border-rule bg-paper-card p-5">
          <span className="lbl mb-2">What happens now</span>
          {steps.map(([t, d, done], i) => (
            <div key={t} className={`grid grid-cols-[26px_1fr] gap-3.5 py-3 ${i < steps.length - 1 ? 'border-b border-paper-2' : ''}`}>
              <span className={`flex h-[22px] w-[22px] items-center justify-center border-[1.5px] ${done ? 'border-leaf bg-leaf text-paper' : 'border-rule text-ink-3'}`}>
                {done ? <Check size={13} className="text-paper" /> : <span className="font-mono text-[10px]">{i + 1}</span>}
              </span>
              <span className="flex flex-col gap-0.5">
                <span className={`text-[15.5px] font-semibold ${done ? '' : 'text-ink-2'}`}>{t}</span>
                <span className="text-[13.5px] leading-snug text-ink-3">
                  {d}{i === 2 && <> Within <Ph value={SITE.turnaround} />.</>}
                </span>
              </span>
            </div>
          ))}
        </div>

        {ready && token && (
          <Link href={`/r/${token}`} className="btn w-full">Read my report now <ArrowRight size={17} /></Link>
        )}

        <div className="flex items-center gap-3.5 bg-[#1F7A45] p-4 text-paper">
          <Whatsapp size={24} />
          <span className="flex flex-col gap-0.5">
            <span className="text-[15px] font-semibold">Save our number</span>
            <span className="text-[13px] opacity-90">So your report does not land in spam.</span>
          </span>
        </div>

        {CONSULTATION_ENABLED && (
          <div className="flex flex-col gap-3.5 bg-ink-dark p-5 text-paper">
            <span className="lbl text-haldi">While you wait</span>
            <span className="disp text-2xl leading-tight">Ask {PANDIT.name}.</span>
            <p className="text-sm leading-relaxed text-[#B8B0A6]">
              Fifteen minutes on the phone once your report lands, to go through what to actually do with it.
            </p>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="flex items-baseline gap-2">
                <span className="font-mono text-[13.5px] text-ink-3 line-through">₹1,499</span>
                <span className="disp text-[32px] leading-none">₹999</span>
              </span>
              <button type="button" className="btn-gold min-h-[48px] px-5 text-sm">Add the call</button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
