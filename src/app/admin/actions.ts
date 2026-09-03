'use server';

import { revalidatePath } from 'next/cache';
import { signIn, signOut, isAdmin } from '@/lib/admin';
import { store } from '@/lib/store';
import { generateReport } from '@/lib/report/pipeline';
import { assertTransition } from '@/lib/orders/state';
import { sendReportEmail, sendReportWhatsapp } from '@/lib/delivery';

export interface LoginState { error: string | null }

export async function login(_prev: LoginState, form: FormData): Promise<LoginState> {
  const ok = await signIn(String(form.get('password') ?? ''));
  if (!ok) return { error: 'That password is not right.' };
  revalidatePath('/admin');
  return { error: null };
}

export async function logout(): Promise<void> {
  await signOut();
  revalidatePath('/admin');
}

export async function regenerate(formData: FormData): Promise<void> {
  if (!(await isAdmin())) throw new Error('Not signed in');
  const orderId = String(formData.get('orderId'));
  const order = await store.getOrder(orderId);
  if (!order) return;
  if (order.state === 'REPORT_READY' || order.state === 'REVIEWED')
    await store.updateOrder(orderId, { state: order.state });
  await generateReport(orderId);
  revalidatePath('/admin');
}

export async function approve(formData: FormData): Promise<void> {
  if (!(await isAdmin())) throw new Error('Not signed in');
  const orderId = String(formData.get('orderId'));
  const order = await store.getOrder(orderId);
  if (!order) return;
  assertTransition(order.state, 'REVIEWED');
  await store.updateOrder(orderId, { state: 'REVIEWED', });
  revalidatePath('/admin');
}

export async function deliver(formData: FormData): Promise<void> {
  if (!(await isAdmin())) throw new Error('Not signed in');
  const orderId = String(formData.get('orderId'));
  const order = await store.getOrder(orderId);
  if (!order) return;
  const token = await store.tokenForOrder(orderId);
  if (!token) throw new Error('That order has no report link yet.');

  const [email, whatsapp] = await Promise.all([
    sendReportEmail(order, token),
    sendReportWhatsapp(order, token),
  ]);

  assertTransition(order.state, 'DELIVERED');
  await store.updateOrder(orderId, { state: 'DELIVERED', delivered_at: new Date().toISOString() });
  await store.track('report_delivered', { orderId, email, whatsapp });
  revalidatePath('/admin');
}
