import { createHash } from 'node:crypto';
import { env } from './env';

/** Meta requires PII to be SHA-256 of a normalised value, never plaintext. */
const hash = (v?: string | null): string | undefined => {
  if (!v) return undefined;
  const norm = v.trim().toLowerCase().replace(/\s+/g, '');
  return norm ? createHash('sha256').update(norm).digest('hex') : undefined;
};

const phoneHash = (v?: string | null): string | undefined => {
  if (!v) return undefined;
  const digits = v.replace(/\D/g, '');
  // Meta expects country code with no plus sign; Indian numbers get 91.
  const withCc = digits.length === 10 ? `91${digits}` : digits;
  return withCc ? createHash('sha256').update(withCc).digest('hex') : undefined;
};

export interface CapiPurchase {
  eventId: string;
  value: number;
  currency?: string;
  email?: string;
  phone?: string;
  fbp?: string;
  fbc?: string;
  clientIp?: string;
  userAgent?: string;
  sourceUrl?: string;
}

/**
 * Server-side Purchase. Sent with the same eventId the browser pixel uses so
 * Meta deduplicates the pair rather than counting the sale twice.
 * Never throws — a reporting failure must not affect an order.
 */
export async function sendPurchase(p: CapiPurchase): Promise<void> {
  if (!env.META_CAPI_TOKEN || !env.NEXT_PUBLIC_META_PIXEL_ID) return;
  try {
    const body = {
      data: [{
        event_name: 'Purchase',
        event_time: Math.floor(Date.now() / 1000),
        event_id: p.eventId,
        action_source: 'website',
        event_source_url: p.sourceUrl,
        user_data: {
          em: hash(p.email) ? [hash(p.email)] : undefined,
          ph: phoneHash(p.phone) ? [phoneHash(p.phone)] : undefined,
          fbp: p.fbp, fbc: p.fbc,
          client_ip_address: p.clientIp, client_user_agent: p.userAgent,
        },
        custom_data: { currency: p.currency ?? 'INR', value: p.value },
      }],
    };
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${env.NEXT_PUBLIC_META_PIXEL_ID}/events?access_token=${env.META_CAPI_TOKEN}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) },
    );
    if (!res.ok) console.error('[meta] CAPI rejected the event:', res.status, await res.text());
  } catch (e) {
    console.error('[meta] CAPI request failed:', e);
  }
}
