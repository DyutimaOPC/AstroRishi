import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { verifyWebhookSignature } from '@/lib/payments';
import { markPaid } from '@/lib/orders/pay';

/**
 * Razorpay retries on non-2xx, so this must be idempotent and must verify the
 * signature against the RAW body — parsing first and re-serialising would
 * change bytes and break the HMAC.
 */
export async function POST(req: Request) {
  const raw = await req.text();
  const signature = req.headers.get('x-razorpay-signature') ?? '';

  if (!verifyWebhookSignature(raw, signature))
    return NextResponse.json({ error: 'Bad signature' }, { status: 400 });

  let event: { event?: string; payload?: { payment?: { entity?: { order_id?: string; id?: string } } } };
  try { event = JSON.parse(raw); }
  catch { return NextResponse.json({ error: 'Bad JSON' }, { status: 400 }); }

  if (event.event !== 'payment.captured' && event.event !== 'order.paid')
    return NextResponse.json({ ok: true, ignored: event.event });

  const entity = event.payload?.payment?.entity;
  if (!entity?.order_id) return NextResponse.json({ ok: true, ignored: 'no order id' });

  const order = await store.getOrderByRazorpayId(entity.order_id);
  if (!order) return NextResponse.json({ ok: true, ignored: 'unknown order' });

  await markPaid(order.id, entity.id);
  return NextResponse.json({ ok: true });
}
