import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { Header, Footer } from '@/components/Chrome';
import { Cover } from '@/components/Cover';
import { PayButton } from '@/components/PayButton';
import { TrackEvent } from '@/components/TrackEvent';
import { store } from '@/lib/store';
import { configured } from '@/lib/env';
import { PRODUCTS, rupees } from '@/lib/config/products';
import { isPaid } from '@/lib/orders/state';

export const metadata: Metadata = { title: 'Checkout', robots: { index: false, follow: false } };

export default async function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await store.getOrder(id);
  if (!order) notFound();
  if (isPaid(order.state)) redirect(`/thank-you/${order.id}`);

  const p = PRODUCTS[order.product_slug];
  const discount = p.comparePaise - p.pricePaise;

  return (
    <>
      <TrackEvent name="InitiateCheckout" params={{ content_ids: [p.slug], value: order.amount_paise / 100, currency: 'INR' }} />
      <Header />
      <main className="wrap flex max-w-[560px] flex-col gap-5 py-8 lg:py-12">
        <h1 className="disp text-[32px] leading-tight">Your order</h1>

        <div className="flex items-start gap-4 border border-rule bg-paper-card p-4 sm:p-5">
          <Cover slug={p.slug} width={72} uid={`${p.slug}-checkout`} />
          <div className="flex flex-1 flex-col gap-1.5">
            <span className="disp text-[21px] leading-tight">{p.name} Report</span>
            <span className="text-[13.5px] leading-snug text-ink-2">
              {p.pages ? `${p.pages}+ pages · ` : ''}personalised PDF · delivered on WhatsApp and email
            </span>
            <span className="pt-0.5 font-mono text-[10px] uppercase tracking-[.12em] text-ink-3">
              For {order.full_name}{order.dob ? ` · ${order.dob}` : ''}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 border border-rule bg-paper-card p-4 sm:p-5">
          <Row label="Report price" value={rupees(p.comparePaise)} />
          <Row label="Launch offer (60% off)" value={`− ${rupees(discount)}`} tone="leaf" />
          <div className="h-px bg-paper-2" />
          <div className="flex items-baseline justify-between">
            <span className="text-base font-semibold">Total payable</span>
            <span className="disp text-4xl leading-none">{rupees(order.amount_paise)}</span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[.1em] text-ink-3">Inclusive of all taxes</span>
        </div>

        <div className="flex flex-col gap-2 border border-rule bg-paper-card p-4 sm:p-5">
          <span className="lbl">Where we will send it</span>
          <span className="text-[15px]">{order.phone ?? '—'}</span>
          <span className="text-[15px]">{order.email ?? '—'}</span>
          <span className="font-mono text-[10px] uppercase tracking-[.12em] text-ink-3">Order {order.reference}</span>
        </div>

        <PayButton orderId={order.id} amountLabel={rupees(order.amount_paise)} devMode={!configured.razorpay()} />
      </main>
      <Footer />
    </>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone?: 'leaf' }) {
  return (
    <div className="flex justify-between text-[15px]">
      <span className={tone === 'leaf' ? 'text-leaf' : 'text-ink-2'}>{label}</span>
      <span className={`font-mono ${tone === 'leaf' ? 'text-leaf' : ''}`}>{value}</span>
    </div>
  );
}
