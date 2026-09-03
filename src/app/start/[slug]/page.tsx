import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Header, Footer } from '@/components/Chrome';
import { Wizard } from '@/components/Wizard';
import { Cover } from '@/components/Cover';
import { PRODUCTS, PRODUCT_SLUGS, isProductSlug, rupees } from '@/lib/config/products';
import { QUESTIONNAIRES } from '@/lib/questions';

export const dynamicParams = false;
export function generateStaticParams() { return PRODUCT_SLUGS.map((slug) => ({ slug })); }
export const metadata: Metadata = { title: 'Your details', robots: { index: false, follow: false } };

export default async function StartPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isProductSlug(slug)) notFound();
  const p = PRODUCTS[slug];
  if (!p.live) notFound();

  return (
    <>
      <Header />
      <main className="wrap grid max-w-[1000px] gap-10 py-8 lg:grid-cols-[1fr_260px] lg:gap-14 lg:py-12">
        <Wizard slug={slug} questionnaire={QUESTIONNAIRES[slug]} productName={p.name} />
        <aside className="order-first flex flex-row items-center gap-4 border border-rule bg-paper-card p-4 lg:order-last lg:flex-col lg:items-start lg:gap-4 lg:p-6">
          <Cover slug={slug} width={92} uid={`${slug}-start`} />
          <div className="flex flex-col gap-1.5">
            <span className="disp text-xl leading-tight">{p.name} Report</span>
            <span className="text-[13px] leading-snug text-ink-2">{p.promise}</span>
            <div className="flex items-baseline gap-2 pt-1">
              <span className="font-mono text-[13px] text-ink-3 line-through">{rupees(p.comparePaise)}</span>
              <span className="disp text-[28px] leading-none">{rupees(p.pricePaise)}</span>
            </div>
          </div>
        </aside>
      </main>
      <Footer />
    </>
  );
}
