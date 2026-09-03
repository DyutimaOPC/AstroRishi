import type { MetadataRoute } from 'next';
import { liveProducts } from '@/lib/config/products';
import { POLICIES } from '@/lib/content/policies';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (path: string, priority: number, changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly') =>
    ({ url: `${BASE}${path}`, lastModified: now, changeFrequency, priority });

  return [
    page('/', 1, 'weekly'),
    page('/reports', 0.9, 'weekly'),
    page('/check', 0.9, 'weekly'),
    ...liveProducts().map((p) => page(`/reports/${p.slug}`, 0.9, 'weekly')),
    page('/how-it-works', 0.6, 'monthly'),
    page('/samples', 0.7, 'monthly'),
    page('/faq', 0.6, 'monthly'),
    page('/about', 0.4, 'yearly'),
    page('/contact', 0.4, 'yearly'),
    page('/access', 0.3, 'yearly'),
    ...POLICIES.map((p) => page(`/${p.slug}`, 0.2, 'yearly')),
  ];
}
