import { store } from '@/lib/store';
import { accessToken } from '@/lib/db';
import { assertTransition, canTransition } from './state';
import { generateReport } from '@/lib/report/pipeline';
import { sendPurchase } from '@/lib/meta';
import { sendReportEmail, notifyAdmin } from '@/lib/delivery';

/**
 * Idempotent. A replayed webhook, or a customer refreshing the callback, must
 * not double-charge state or start a second generation.
 */
export async function markPaid(orderId: string, razorpayPaymentId?: string): Promise<{ token: string }> {
  const order = await store.getOrder(orderId);
  if (!order) throw new Error(`No order ${orderId}`);

  if (order.state !== 'QUESTIONNAIRE_COMPLETED') {
    const existing = await tokenFor(orderId);
    if (existing) return { token: existing };
  }

  if (order.state === 'QUESTIONNAIRE_COMPLETED') {
    assertTransition(order.state, 'PAID');
    await store.updateOrder(orderId, {
      state: 'PAID', paid_at: new Date().toISOString(), razorpay_payment_id: razorpayPaymentId,
    });
    await store.track('purchase', { orderId, amount: order.amount, product: order.product_slug });
    await sendPurchase({
      eventId: order.reference,
      value: order.amount,
      email: order.email,
      phone: order.phone,
    });
    notifyAdmin('payment', order).catch(() => {});
  }

  const token = (await tokenFor(orderId)) ?? (await mint(orderId));
  await generateReport(orderId).catch((e) => {
    console.error('[report] generation failed for', orderId, e);
  });

  const updated = await store.getOrder(orderId);
  if (updated && canTransition(updated.state, 'DELIVERED')) {
    const sent = await sendReportEmail(updated, token);
    if (sent) {
      await store.updateOrder(orderId, { state: 'DELIVERED', delivered_at: new Date().toISOString() });
      await store.track('report_delivered', { orderId, auto: true });
    } else {
      notifyAdmin('delivery_failed', updated).catch(() => {});
    }
  }

  return { token };
}

async function tokenFor(orderId: string): Promise<string | null> {
  return store.tokenForOrder(orderId);
}

async function mint(orderId: string): Promise<string> {
  const t = accessToken();
  await store.createToken(orderId, t);
  return t;
}
