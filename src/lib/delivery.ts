import { env, configured } from './env';
import { SITE } from './config/site';
import { PRODUCTS, rupees } from './config/products';
import type { Order } from './store';

const reportUrl = (token: string) => `${env.NEXT_PUBLIC_SITE_URL}/r/${token}`;

export async function sendReportEmail(order: Order, token: string): Promise<boolean> {
  if (!configured.email() || !order.email) return false;
  const product = PRODUCTS[order.product_slug];
  try {
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

export async function sendReportWhatsapp(order: Order, token: string): Promise<boolean> {
  if (!configured.whatsapp() || !order.phone) return false;
  const product = PRODUCTS[order.product_slug];
  const body = {
    messaging_product: 'whatsapp',
    to: `91${order.phone.replace(/\D/g, '').slice(-10)}`,
    type: 'text',
    text: {
      body: `Namaste ${order.full_name}, your ${product.name} Report is ready!\n\n${reportUrl(token)}\n\nOpen the link to read it. Use the Download PDF button to keep a copy.\n\nOrder: ${order.reference}\nQuestions? Message us here.`,
    },
  };
  try {
    const res = await fetch(`https://graph.facebook.com/v21.0/${env.WHATSAPP_PHONE_ID}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.WHATSAPP_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      console.error('[delivery] WhatsApp failed for', order.reference, res.status, await res.text());
      return false;
    }
    return true;
  } catch (e) {
    console.error('[delivery] WhatsApp failed for', order.reference, e);
    return false;
  }
}

export async function notifyAdmin(event: 'payment' | 'delivery_failed', order: Order): Promise<void> {
  if (!configured.email()) return;
  const to = env.ADMIN_EMAIL ?? SITE.supportEmail;
  const product = PRODUCTS[order.product_slug];
  const subject = event === 'payment'
    ? `New payment: ${order.full_name} — ${product.name} (${rupees(order.amount)})`
    : `Delivery failed: ${order.reference}`;
  const text = event === 'payment'
    ? [
        `Order: ${order.reference}`,
        `Customer: ${order.full_name}`,
        `Product: ${product.name}`,
        `Amount: ${rupees(order.amount)}`,
        `Phone: ${order.phone ?? '—'}`,
        `Email: ${order.email ?? '—'}`,
        '',
        'The report will be generated and delivered automatically.',
      ].join('\n')
    : `Order ${order.reference} (${order.full_name}) was paid but automatic delivery failed. Check the admin panel.`;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: `AstroRishi <${SITE.supportEmail}>`,
      to: [to],
      subject,
      text,
    }),
  }).catch((e) => console.error('[notify] admin email failed', e));
}

export const deliveryConfigured = (): boolean => configured.email();
