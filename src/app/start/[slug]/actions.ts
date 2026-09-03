'use server';

import { redirect } from 'next/navigation';
import { store } from '@/lib/store';
import { PRODUCTS, isProductSlug } from '@/lib/config/products';
import { QUESTIONNAIRES } from '@/lib/questions';
import { schemaFor } from '@/lib/questions/types';
import { compute } from '@/lib/numerology';
import { assertTransition } from '@/lib/orders/state';

export interface StartState {
  error: string | null;
  /** The field that failed, so the wizard can jump back to it. */
  field?: string;
  /**
   * Everything the customer typed, echoed back. A server action re-renders the
   * route, which remounts the form and empties every uncontrolled input — so
   * without this a single rejected field silently wipes the whole
   * questionnaire and the customer can never get past it.
   */
  values?: Record<string, string>;
}

export async function submitQuestionnaire(_prev: StartState, form: FormData): Promise<StartState> {
  const slug = String(form.get('__slug') ?? '');
  if (!isProductSlug(slug)) return { error: 'Unknown report.' };

  const raw: Record<string, string> = {};
  for (const [k, v] of form.entries()) if (!k.startsWith('__')) raw[k] = String(v);

  let attribution: Record<string, string> | undefined;
  try {
    const j = String(form.get('__attribution') ?? '');
    if (j) attribution = JSON.parse(j) as Record<string, string>;
  } catch { /* attribution is nice to have, never a reason to fail an order */ }

  const parsed = schemaFor(QUESTIONNAIRES[slug]).safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return {
      error: first?.message ?? 'Please check your answers and try again.',
      field: typeof first?.path?.[0] === 'string' ? first.path[0] : undefined,
      values: raw,
    };
  }
  const answers = parsed.data;

  let computed: unknown = null;
  if ((slug === 'name-numerology' || slug === 'both') && answers.fullName && answers.dob) {
    try { computed = compute({ fullName: answers.fullName, dob: answers.dob }); }
    catch (e) {
      return {
        error: e instanceof Error ? e.message : 'Those birth details did not work.',
        field: 'dob', values: raw,
      };
    }
  }

  const order = await store.createOrder({
    product_slug: slug,
    state: 'NEW',
    amount_paise: PRODUCTS[slug].pricePaise,
    full_name: answers.fullName ?? 'Customer',
    dob: answers.dob,
    phone: answers.phone,
    email: answers.email,
    attribution,
  });
  await store.saveAnswers(order.id, answers);
  assertTransition('NEW', 'QUESTIONNAIRE_COMPLETED');
  await store.updateOrder(order.id, { state: 'QUESTIONNAIRE_COMPLETED' });

  if (computed) {
    await store.saveReport({
      order_id: order.id, version: 1, computed, sections: null,
      engine_version: (computed as { engineVersion: string }).engineVersion, claims_passed: false,
    });
  }
  await store.track('questionnaire_completed', { orderId: order.id, product: slug });
  redirect(`/checkout/${order.id}`);
}
