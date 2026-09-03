import { z } from 'zod';
import type { ProductSlug } from '@/lib/config/products';

/**
 * The model returns JSON against these shapes and nothing else. A designed
 * template renders them, which is what keeps every report visually identical
 * regardless of what the model felt like writing that day, and lets an editor
 * regenerate one section instead of a whole document.
 */
const para = z.string().min(40).max(1200);
const line = z.string().min(8).max(240);

const insight = z.object({ title: line, body: para });
const step = z.object({ title: line, detail: para, when: line.optional() });

export const nameCorrectionSections = z.object({
  headline: line,
  verdict: para,
  currentNameReading: para,
  alignment: para,
  gridReading: para,
  gridGaps: z.array(insight).min(1).max(4),
  recommendation: para,
  whatChanges: z.array(insight).min(2).max(4),
  remedies: z.array(step).min(3).max(5),
  closing: para,
});

export const numerologySections = z.object({
  headline: line,
  verdict: para,
  lifePathReading: para,
  destinyReading: para,
  soulUrgeReading: para,
  personalityReading: para,
  gridReading: para,
  strengths: z.array(insight).min(2).max(5),
  challenges: z.array(insight).min(2).max(5),
  yearAhead: para,
  remedies: z.array(step).min(3).max(5),
  closing: para,
});

export const careerSections = z.object({
  headline: line,
  verdict: para,
  workNatureReading: para,
  /** The gap between what they do and what the chart is built for. The paid insight. */
  fitReading: para,
  earningReading: para,
  jobVsBusiness: para,
  blockerReading: para,
  strengths: z.array(insight).min(3).max(5),
  risks: z.array(insight).min(2).max(4),
  openings: z.array(insight).min(2).max(4),
  yearsReading: para,
  timingReading: para,
  decisionFramework: para,
  ninetyDayPlan: z.array(step).min(3).max(6),
  /** Written only when the engine flagged name friction; omitted otherwise. */
  nameNote: para.optional(),
  closing: para,
});

export const relationshipSections = z.object({
  headline: line,
  verdict: para,
  patternReading: para,
  /** Written only when the reader gave us the partner's details. */
  pairReading: para.optional(),
  agreementReading: para.optional(),
  exchangeReading: para.optional(),
  /** The numbers neither of them carries. The centrepiece of the paired report. */
  blindSpotReading: para.optional(),
  frictionReading: para,
  timingReading: para,
  branchReading: para,
  strengths: z.array(insight).min(2).max(4),
  friction: z.array(insight).min(2).max(4),
  overlooked: para,
  nextStep: para,
  conversationGuide: z.array(step).min(4).max(6),
  thirtyDayPlan: z.array(step).min(3).max(5),
  closing: para,
});

export const kundliSections = z.object({
  headline: line,
  verdict: para,
  chartReading: para,
  houseReading: z.array(insight).min(3).max(12),
  doshas: z.array(insight).max(4),
  periods: z.array(step).min(2).max(6),
  remedies: z.array(step).min(3).max(5),
  closing: para,
});

export const SECTION_SCHEMAS = {
  'name-correction': nameCorrectionSections,
  numerology: numerologySections,
  'career-money': careerSections,
  relationship: relationshipSections,
  kundli: kundliSections,
} as const satisfies Record<ProductSlug, z.ZodTypeAny>;

export type Sections<S extends ProductSlug> = z.infer<(typeof SECTION_SCHEMAS)[S]>;
export type AnySections = z.infer<(typeof SECTION_SCHEMAS)[ProductSlug]>;
