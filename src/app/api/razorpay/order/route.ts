import { NextResponse } from 'next/server';
import { readJson, orderIdBody } from '@/lib/http';
import { store } from '@/lib/store';
import { configured, env } from '@/lib/env';
import { createRazorpayOrder } from '@/lib/payments';

export async function POST(req: Request) {
  const body = await readJson(req, orderIdBody);
  if (!body.ok) return body.response;
  const { orderId } = body.data;

  const order = await store.getOrder(orderId);
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  if (order.state !== 'QUESTIONNAIRE_COMPLETED')
    return NextResponse.json({ error: 'This order has already been paid for.' }, { status: 409 });

  if (!configured.razorpay())
    return NextResponse.json({ error: 'Payments are not configured on this environment.' }, { status: 503 });

  const rzp = await createRazorpayOrder(order.amount_paise, order.reference);
  await store.updateOrder(orderId, { razorpay_order_id: rzp.id });
  await store.track('checkout_started', { orderId, amount: order.amount_paise });

  return NextResponse.json({
    razorpayOrderId: rzp.id,
    amount: rzp.amount,
    currency: rzp.currency,
    keyId: env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? env.RAZORPAY_KEY_ID,
    reference: order.reference,
    name: order.full_name,
    email: order.email,
    phone: order.phone,
  });
}
