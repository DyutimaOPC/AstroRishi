'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { compute } from '@/lib/numerology';
import { store } from '@/lib/store';
import { configured } from '@/lib/env';
import { normalisePhone } from '@/lib/questions/types';

const freeCheck = z.object({
  fullName: z.string().trim().min(1, 'Please enter your full name.').max(80, 'That name is too long.')
    .regex(/^[A-Za-z][A-Za-z .'-]*$/, 'Use letters only — no numbers or symbols.'),
  day: z.coerce.number().int().min(1).max(31),
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(1900).max(new Date().getFullYear()),
  phone: z.string().transform(normalisePhone)
    .refine((v) => /^[6-9]\d{9}$/.test(v), 'Enter a 10-digit Indian mobile number.'),
  email: z.string().trim().email('That does not look like an email address.'),
});

export interface CheckState {
  error: string | null;
  values?: Record<string, string>;
}

const pad = (n: string) => n.padStart(2, '0');

export async function runFreeCheck(_prev: CheckState, form: FormData): Promise<CheckState> {
  const raw: Record<string, string> = {};
  for (const [k, v] of form.entries()) raw[k] = String(v);

  const parsed = freeCheck.safeParse({
    fullName: form.get('fullName'), day: form.get('day'),
    month: form.get('month'), year: form.get('year'),
    phone: form.get('phone'), email: form.get('email'),
  });
  if (!parsed.success)
    return { error: parsed.error.issues[0]?.message ?? 'Please check your details and try again.', values: raw };

  const { fullName, phone, email } = parsed.data;
  const dob = `${parsed.data.year}-${pad(String(parsed.data.month))}-${pad(String(parsed.data.day))}`;
  try {
    compute({ fullName, dob });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Something went wrong.';
    return { error: msg.includes('calendar date') ? 'That date does not exist — please check it.' : msg, values: raw };
  }

  if (configured.db()) {
    try {
      await store.createLead({ full_name: fullName, dob, phone, email });
    } catch (e) {
      console.error('[free-check] failed to save lead', e);
    }
  }

  const token = Buffer.from(`${fullName}|${dob}`).toString('base64url');
  redirect(`/check/${token}`);
}
