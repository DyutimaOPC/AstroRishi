import { z } from 'zod';
import { env } from '@/lib/env';

export const PRODUCT_SLUGS = ['name-numerology', 'career-relationship', 'both', 'kundli'] as const;
export type ProductSlug = (typeof PRODUCT_SLUGS)[number];

export const SECTION_KEYS = [
  'name-correction', 'numerology', 'career-money', 'relationship', 'kundli',
] as const;
export type SectionKey = (typeof SECTION_KEYS)[number];

export interface Product {
  slug: ProductSlug;
  name: string;
  question: string;
  promise: string;
  price: number;
  comparePrice: number;
  pages: number | null;
  cover: string;
  badge: string | null;
  inclusions: string[];
  parts: readonly SectionKey[];
  live: boolean;
}

export const PRODUCTS: Readonly<Record<ProductSlug, Product>> = {
  'name-numerology': {
    slug: 'name-numerology', parts: ['name-correction', 'numerology'], live: true,
    name: 'Name & Numerology',
    question: 'Is your name working against you?',
    promise: 'Your name scored against your birth date, corrected spellings, core numbers, Lo Shu grid and a year-ahead reading — all in one report.',
    price: env.PRICE_NAME_NUMEROLOGY ?? 249, comparePrice: env.COMPARE_NAME_NUMEROLOGY ?? 799, pages: 28, cover: '#A11C1C', badge: 'Most chosen',
    inclusions: [
      'Name vibration score & corrected spellings',
      'Life path, destiny, soul urge & personality',
      'Lo Shu grid with plane-by-plane reading',
      'Year-ahead personal forecast',
      'Lucky numbers, colours & days',
      'Remedies and a 90-day plan',
    ],
  },
  'career-relationship': {
    slug: 'career-relationship', parts: ['career-money', 'relationship'], live: true,
    name: 'Career & Relationship',
    question: 'A job or a business — and where is this relationship going?',
    promise: 'A straight career verdict, your earning capacity, a relationship pattern named plainly, and a plan for both.',
    price: env.PRICE_CAREER_RELATIONSHIP ?? 249, comparePrice: env.COMPARE_CAREER_RELATIONSHIP ?? 799, pages: 22, cover: '#1F5D3A', badge: null,
    inclusions: [
      'Career strength score & job-vs-business verdict',
      'Earning capacity & 90-day career plan',
      'Relationship pattern named & explained',
      'Partner compatibility (if details given)',
      'Conversation guide & 30-day relationship plan',
      'Working numbers & lucky elements',
    ],
  },
  both: {
    slug: 'both', parts: ['name-correction', 'numerology', 'career-money', 'relationship'], live: true,
    name: 'Complete Report',
    question: 'Your name, career and relationship — all in one.',
    promise: 'Everything from the Name and Career reports, bundled together at a lower price.',
    price: env.PRICE_BOTH ?? 349, comparePrice: env.COMPARE_BOTH ?? 498, pages: 50, cover: '#2E1A47', badge: 'Best value',
    inclusions: [
      'Name vibration score & corrected spellings',
      'Life path, destiny, soul urge & personality',
      'Lo Shu grid with plane-by-plane reading',
      'Career strength score & job-vs-business verdict',
      'Earning capacity & 90-day career plan',
      'Relationship pattern & 30-day plan',
    ],
  },
  kundli: {
    slug: 'kundli', parts: ['kundli'], live: false,
    name: 'Premium Kundli',
    question: 'What does your birth chart actually say?',
    promise: 'Worked from your date, time and place of birth.',
    price: env.PRICE_KUNDLI ?? 499, comparePrice: env.COMPARE_KUNDLI ?? 1499, pages: null, cover: '#6B1010', badge: 'Most detailed',
    inclusions: ['Birth chart and planetary positions', 'House-by-house reading', 'Doshas and their remedies', 'Dasha periods and what they bring'],
  },
};

export const productList = (): Product[] => PRODUCT_SLUGS.map((s) => PRODUCTS[s]).filter(Boolean);
export const liveProducts = (): Product[] => productList().filter((p) => p.live);
export const isProductSlug = (s: string): s is ProductSlug =>
  (PRODUCT_SLUGS as readonly string[]).includes(s);
export const productSchema = z.enum(PRODUCT_SLUGS);

export const rupees = (amount: number): string =>
  '₹' + amount.toLocaleString('en-IN', { maximumFractionDigits: 0 });

export const CONSULTATION = {
  name: 'Personal consultation with Pandit Maya',
  price: 999,
  comparePrice: 1499,
  minutes: 15,
};
