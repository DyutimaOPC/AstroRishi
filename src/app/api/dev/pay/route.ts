import { NextResponse } from 'next/server';
import { readJson, orderIdBody } from '@/lib/http';
import { configured } from '@/lib/env';
import { markPaid } from '@/lib/orders/pay';

/**
 * Development-only shortcut so the funnel can be walked end to end before a
 * Razorpay account exists. Refuses to run the moment real keys are present.
 */
export async function POST(req: Request) {
  if (configured.razorpay() || process.env.NODE_ENV === 'production')
    return NextResponse.json({ error: 'Not available' }, { status: 404 });

  const body = await readJson(req, orderIdBody);
  if (!body.ok) return body.response;
  const { orderId } = body.data;

  const { token } = await markPaid(orderId, 'dev_simulated_payment');
  return NextResponse.json({ ok: true, token });
}
