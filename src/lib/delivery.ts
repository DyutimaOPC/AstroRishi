import { env, configured } from './env';
import { SITE } from './config/site';
import { PRODUCTS } from './config/products';
import type { Order } from './store';

const reportUrl = (token: string) => `${env.NEXT_PUBLIC_SITE_URL}/r/${token}`;

/**
 * Delivery is best-effort and never throws: an order that is paid and has a
 * report must not be rolled back because an email provider had a bad minute.
 * Failures are logged for the admin queue to retry.
 */
export async function sendReportEmail(order: Order, token: string): Promise<boolean> {
  if (!configured.email() || !order.email) return false;
  const product = PRODUCTS[order.product_slug];
  try {
    // Resend's REST API directly. Their SDK pulls in @react-email/render at
    // module load for JSX emails we do not send, and a missing optional peer
    // there breaks the whole server build.
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: `AstroRishi <${SITE.supportEmail}>`,
        to: [order.email],
        subject: `Your ${product.name} Report is ready`,
        text: [
          `Namaste ${order.full_name},`,
          '',
          `Your ${product.name} Report is ready to read.`,
          '',
          reportUrl(token),
          '',
          'The link does not expire — open it any time, and use the Download PDF button to keep a copy.',
          `Your order number is ${order.reference}.`,
          '',
          `Questions? Reply to this email or message us on ${SITE.whatsapp}.`,
          '',
          'AstroRishi',
          '',
          '—',
          'AstroRishi reports are interpretive guidance for personal reflection. They are not predictions, and not medical,',
          'psychological, legal or financial advice. No outcome is guaranteed.',
        ].join('\n'),
      }),
    });
    if (!res.ok) {
      console.error('[delivery] Resend rejected the email for', order.reference, res.status, await res.text());
      return false;
    }
    return true;
  } catch (e) {
    console.error('[delivery] email failed for', order.reference, e);
    return false;
  }
}

/**
 * WhatsApp delivery needs an approved template through a Business Solution
 * Provider. Until one is connected this records what would have been sent so
 * the admin queue can show it and a person can send it by hand.
 */
export async function sendReportWhatsapp(order: Order, token: string): Promise<boolean> {
  const message = `Namaste ${order.full_name}, your ${PRODUCTS[order.product_slug].name} Report is ready: ${reportUrl(token)} (order ${order.reference})`;
  console.info('[delivery] WhatsApp not configured — message queued for manual send:', message);
  return false;
}

export const deliveryConfigured = (): boolean => configured.email();
