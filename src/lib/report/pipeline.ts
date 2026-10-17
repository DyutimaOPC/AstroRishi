import { store } from '@/lib/store';
import { PRODUCTS, type ProductSlug } from '@/lib/config/products';
import { compute } from '@/lib/numerology';
import { careerReport } from '@/lib/career';
import { relationshipReport } from '@/lib/relationship';
import { assertTransition, canTransition } from '@/lib/orders/state';
import { deterministicSections } from './deterministic';

function relAnswers(answers: Record<string, string>): Record<string, string> {
  const out = { ...answers };
  if (out.relStatus) { out.status = out.relStatus; delete out.relStatus; }
  if (out.relConcern) { out.concern = out.relConcern; delete out.relConcern; }
  if (out.relContext) { out.context = out.relContext; delete out.relContext; }
  return out;
}

export function computeFor(slug: ProductSlug, answers: Record<string, string>): unknown {
  if (!answers.fullName || !answers.dob) return null;
  if (slug === 'name-numerology')
    return compute({ fullName: answers.fullName, dob: answers.dob });
  if (slug === 'career-relationship')
    return {
      career: careerReport(answers),
      relationship: relationshipReport(relAnswers(answers)),
    };
  if (slug === 'both')
    return {
      numerology: compute({ fullName: answers.fullName, dob: answers.dob }),
      career: careerReport(answers),
      relationship: relationshipReport(relAnswers(answers)),
    };
  return null;
}

export async function generateReport(orderId: string): Promise<void> {
  const order = await store.getOrder(orderId);
  if (!order) throw new Error(`No order ${orderId}`);
  if (!canTransition(order.state, 'REPORT_GENERATING')) return;

  assertTransition(order.state, 'REPORT_GENERATING');
  await store.updateOrder(orderId, { state: 'REPORT_GENERATING' });

  const answers = (await store.getAnswers(orderId)) ?? {};
  const existing = await store.getReport(orderId);
  const computed = existing?.computed ?? computeFor(order.product_slug, answers);
  const engineVersion =
    (computed as { engineVersion?: string } | null)?.engineVersion ?? '1.0.0';

  const product = PRODUCTS[order.product_slug];
  const allSections: Record<string, unknown> = {};

  if (computed) {
    for (const part of product.parts) {
      let partComputed: unknown = computed;
      if (order.product_slug === 'career-relationship') {
        if (part === 'career-money') partComputed = (computed as { career: unknown }).career;
        else if (part === 'relationship') partComputed = (computed as { relationship: unknown }).relationship;
      } else if (order.product_slug === 'both') {
        const c = computed as { numerology: unknown; career: unknown; relationship: unknown };
        if (part === 'name-correction' || part === 'numerology') partComputed = c.numerology;
        else if (part === 'career-money') partComputed = c.career;
        else if (part === 'relationship') partComputed = c.relationship;
      }
      allSections[part] = deterministicSections(part, partComputed);
    }
  }

  const sections = Object.keys(allSections).length > 0 ? allSections : null;

  const version = (existing?.version ?? 0) + (existing?.sections ? 1 : 0) || 1;
  await store.saveReport({
    order_id: orderId, version, computed, sections,
    engine_version: engineVersion, model: 'deterministic', claims_passed: true,
  });

  await store.updateOrder(orderId, { state: 'REPORT_READY' });
  await store.track('report_ready', { orderId, hasProse: !!sections, model: 'deterministic' });
}
