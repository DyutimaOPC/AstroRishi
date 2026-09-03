'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { store } from '@/lib/store';

const lookup = z.object({
  reference: z.string().trim().min(4).max(40),
  contact: z.string().trim().min(3).max(120),
});

export interface AccessState { error: string | null }

const norm = (s: string) => s.replace(/[^\d a-z@.]/gi, '').trim().toLowerCase();

export async function findMyReport(_prev: AccessState, form: FormData): Promise<AccessState> {
  const parsed = lookup.safeParse({ reference: form.get('reference'), contact: form.get('contact') });
  if (!parsed.success)
    return { error: 'Please give both your order number and the phone or email you used.' };
  const reference = parsed.data.reference.toUpperCase();
  const contact = parsed.data.contact;

  const order = await store.getOrderByReference(reference);
  // One message for "no such order" and "wrong contact" alike, so this cannot
  // be used to test whether a given order number exists.
  const fail = { error: 'We could not find an order matching those details. Check them and try again, or message us on WhatsApp.' };
  if (!order) return fail;

  const given = norm(contact);
  const matches = [order.phone, order.email]
    .filter(Boolean)
    .some((v) => norm(String(v)).endsWith(given) || norm(String(v)) === given);
  if (!matches) return fail;

  const token = await store.tokenForOrder(order.id);
  if (!token) return { error: 'That order does not have a report yet. If you have paid, message us and we will sort it out.' };

  redirect(`/r/${token}`);
}
