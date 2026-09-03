import { z } from 'zod';

export const PRODUCT_SLUGS = [
  'name-correction', 'numerology', 'career-money', 'relationship', 'kundli',
] as const;
export type ProductSlug = (typeof PRODUCT_SLUGS)[number];

export interface Product {
  slug: ProductSlug;
  name: string;
  /** The clickbait question the ad and hero lead with. */
  question: string;
  promise: string;
  /** paise — never store rupees as floats */
  pricePaise: number;
  comparePaise: number;
  pages: number | null;
  cover: string;
  badge: string | null;
  inclusions: string[];
  /** Which engine feeds this product's report. */
  engine: 'numerology' | 'rubric' | 'kundli';
  live: boolean;
}

export const PRODUCTS: Readonly<Record<ProductSlug, Product>> = {
  'name-correction': {
    slug: 'name-correction', name: 'Name Correction', engine: 'numerology', live: true,
    question: 'Is your name working against you?',
    promise: "Is your spelling helping you or quietly working against you? Find out, and see what to change.",
    pricePaise: 39900, comparePaise: 99900, pages: 18, cover: '#A11C1C', badge: 'Most chosen',
    inclusions: ['Name vibration score', 'Corrected spelling options', 'Lucky number, colour and day', 'Lo Shu grid and remedies'],
  },
  numerology: {
    slug: 'numerology', name: 'Complete Numerology', engine: 'numerology', live: true,
    question: 'Why do the same patterns keep repeating?',
    promise: 'Your core numbers, read together, year by year.',
    pricePaise: 39900, comparePaise: 99900, pages: null, cover: '#C25A0A', badge: null,
    inclusions: ['Life path, destiny and soul urge', 'Lo Shu grid and numeroscope', 'Strengths and challenges', 'Year-wise personal forecast'],
  },
  'career-money': {
    slug: 'career-money', name: 'Career & Money', engine: 'rubric', live: true,
    question: 'A job, or your own business?',
    promise: 'A straight verdict, and ninety days of steps.',
    pricePaise: 39900, comparePaise: 99900, pages: null, cover: '#1F5D3A', badge: null,
    inclusions: ['What you are built to do', 'Job versus business verdict', 'Your earning capacity', '90-day action plan'],
  },
  relationship: {
    slug: 'relationship', name: 'Relationship Clarity', engine: 'rubric', live: true,
    question: 'Where is this relationship actually going?',
    promise: 'What is going on, and the next conversation to have.',
    pricePaise: 39900, comparePaise: 99900, pages: null, cover: '#96143F', badge: null,
    inclusions: ['Your pattern, named and explained', 'Both charts read together', 'Where the friction sits', 'A conversation guide'],
  },
  kundli: {
    slug: 'kundli', name: 'Premium Kundli', engine: 'kundli', live: false,
    question: 'What does your birth chart actually say?',
    promise: 'Worked from your date, time and place of birth.',
    pricePaise: 49900, comparePaise: 149900, pages: null, cover: '#6B1010', badge: 'Most detailed',
    inclusions: ['Birth chart and planetary positions', 'House-by-house reading', 'Doshas and their remedies', 'Dasha periods and what they bring'],
  },
};

export const productList = (): Product[] => PRODUCT_SLUGS.map((s) => PRODUCTS[s]);
export const liveProducts = (): Product[] => productList().filter((p) => p.live);
export const isProductSlug = (s: string): s is ProductSlug =>
  (PRODUCT_SLUGS as readonly string[]).includes(s);
export const productSchema = z.enum(PRODUCT_SLUGS);

export const rupees = (paise: number): string =>
  '₹' + (paise / 100).toLocaleString('en-IN', { maximumFractionDigits: 0 });

export const CONSULTATION = {
  name: 'Personal consultation with Pandit Maya',
  pricePaise: 99900,
  comparePaise: 149900,
  minutes: 15,
};
