import crypto from 'node:crypto';
import { env, configured } from './env';

export interface RzpOrder { id: string; amount: number; currency: string; }

/** Razorpay's REST API directly — the npm package pulls a large dependency tree for two calls. */
export async function createRazorpayOrder(amountPaise: number, receipt: string): Promise<RzpOrder> {
  const auth = Buffer.from(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`).toString('base64');
  const res = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: amountPaise, currency: 'INR', receipt, payment_capture: 1 }),
  });
  if (!res.ok) throw new Error(`Razorpay rejected the order (${res.status}): ${await res.text()}`);
  return (await res.json()) as RzpOrder;
}

/** Signature on the checkout callback: HMAC of "<order_id>|<payment_id>" with the key secret. */
export function verifyCheckoutSignature(orderId: string, paymentId: string, signature: string): boolean {
  if (!configured.razorpay()) return false;
  const expected = crypto.createHmac('sha256', env.RAZORPAY_KEY_SECRET!)
    .update(`${orderId}|${paymentId}`).digest('hex');
  return timingSafeEqual(expected, signature);
}

/** Webhook signature: HMAC of the raw body with the webhook secret — never the key secret. */
export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  if (!env.RAZORPAY_WEBHOOK_SECRET) return false;
  const expected = crypto.createHmac('sha256', env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody).digest('hex');
  return timingSafeEqual(expected, signature);
}

function timingSafeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a), bb = Buffer.from(b);
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
}
