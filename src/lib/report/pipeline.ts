import { store } from '@/lib/store';
import { configured } from '@/lib/env';
import { PRODUCTS, type ProductSlug } from '@/lib/config/products';
import { compute } from '@/lib/numerology';
import { careerReport } from '@/lib/career';
import { relationshipReport } from '@/lib/relationship';
import { assertTransition, canTransition } from '@/lib/orders/state';
import { generateSections } from './generate';
import { checkClaims } from './claims';
import { checkNames } from './names';
import type { Computed } from '@/lib/numerology';

/** Whatever the product's engine produces. Always present; never model output. */
export function computeFor(slug: ProductSlug, answers: Record<string, string>): unknown {
  const engine = PRODUCTS[slug].engine;
  if (engine === 'numerology' && answers.fullName && answers.dob)
    return compute({ fullName: answers.fullName, dob: answers.dob });
  // Both of these read the birth chart as well as the questionnaire, so they
  // need the identity step the same way the numerology products do.
  if (!answers.fullName || !answers.dob) return null;
  if (slug === 'career-money') return careerReport(answers);
  if (slug === 'relationship') return relationshipReport(answers);
  return null;
}

/**
 * Runs after payment. The deterministic layer always succeeds, so a report page
 * can always render; the prose layer is best-effort and its failure leaves the
 * order short of REPORT_READY for a human rather than shipping something broken.
 */
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

  let sections: unknown = null;
  let model: string | undefined;
  let claimsPassed = false;

  if (configured.anthropic() && computed) {
    try {
      const g = await generateSections(order.product_slug, computed, answers);
      const claims = checkClaims(g.sections);

      // Spellings come from the engine. If the prose mentions one the engine
      // never produced, the model has invented a name for a paying customer —
      // drop the prose and ship the computed report rather than a fabrication.
      const names = PRODUCTS[order.product_slug].engine === 'numerology'
        ? checkNames(g.sections, approvedSpellings(computed as Computed))
        : { ok: true, findings: [] };

      if (!names.ok) {
        console.error('[report] fabricated spelling for', orderId, names.findings);
      } else {
        sections = g.sections;
        model = g.model;
        claimsPassed = claims.ok;
      }
    } catch (e) {
      console.error('[report] prose generation failed for', orderId, e);
    }
  }

  const version = (existing?.version ?? 0) + (existing?.sections ? 1 : 0) || 1;
  await store.saveReport({
    order_id: orderId, version, computed, sections,
    engine_version: engineVersion, model, claims_passed: claimsPassed,
  });

  await store.updateOrder(orderId, { state: 'REPORT_READY' });
  await store.track('report_ready', { orderId, hasProse: !!sections, model });
}

/** Every spelling the engine stands behind, current last so it anchors the check. */
function approvedSpellings(c: Computed): string[] {
  return [...c.nameAnalysis.options.map((o) => o.name), c.nameAnalysis.current.name];
}
