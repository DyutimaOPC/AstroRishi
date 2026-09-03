'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { compute } from '@/lib/numerology';

const freeCheck = z.object({
  fullName: z.string().trim().min(1, 'Please enter your full name.').max(80, 'That name is too long.')
    .regex(/^[A-Za-z][A-Za-z .'-]*$/, 'Use letters only — no numbers or symbols.'),
  day: z.coerce.number().int().min(1).max(31),
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(1900).max(new Date().getFullYear()),
});

export interface CheckState { error: string | null }

const pad = (n: string) => n.padStart(2, '0');

export async function runFreeCheck(_prev: CheckState, form: FormData): Promise<CheckState> {
  const parsed = freeCheck.safeParse({
    fullName: form.get('fullName'), day: form.get('day'),
    month: form.get('month'), year: form.get('year'),
  });
  if (!parsed.success)
    return { error: parsed.error.issues[0]?.message ?? 'Please check your name and date of birth.' };

  const { fullName } = parsed.data;
  const dob = `${parsed.data.year}-${pad(String(parsed.data.month))}-${pad(String(parsed.data.day))}`;
  try {
    compute({ fullName, dob });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Something went wrong.';
    return { error: msg.includes('calendar date') ? 'That date does not exist — please check it.' : msg };
  }
  const token = Buffer.from(`${fullName}|${dob}`).toString('base64url');
  redirect(`/check/${token}`);
}
