import { z } from 'zod';
import type { SectionKey } from '@/lib/config/products';

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
  nameNote: para.optional(),
  closing: para,
});

export const relationshipSections = z.object({
  headline: line,
  verdict: para,
  patternReading: para,
  pairReading: para.optional(),
  agreementReading: para.optional(),
  exchangeReading: para.optional(),
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
} as const satisfies Record<SectionKey, z.ZodTypeAny>;

export type Sections<S extends SectionKey> = z.infer<(typeof SECTION_SCHEMAS)[S]>;
export type AnySections = z.infer<(typeof SECTION_SCHEMAS)[SectionKey]>;
