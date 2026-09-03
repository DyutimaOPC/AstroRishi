import type { Metadata } from 'next';
import { AnnouncementBar, Header, Footer, TrustStrip } from '@/components/Chrome';
import { ProductCard, BundleCard, HowItWorks, Faq, FinalCta } from '@/components/Blocks';
import { liveProducts, PRODUCTS } from '@/lib/config/products';

export const metadata: Metadata = {
  title: 'All reports',
  description: 'Two personalised reports — name & numerology, and career & relationship — plus a premium kundli on the way. From ₹249.',
};

export default function ReportsPage() {
  return (
    <>
      <AnnouncementBar />
      <Header current="/reports" />
      <main>
        <section className="ruled border-b border-rule">
          <div className="wrap flex flex-col gap-4 py-12 lg:py-16">
            <span className="lbl text-sindoor">The catalogue</span>
            <h1 className="disp max-w-[18ch] text-[40px] leading-[1.03] lg:text-[58px]">Two reports. Each answers a different question.</h1>
            <p className="max-w-[54ch] text-[17px] leading-relaxed text-ink-2">
              Every report lists exactly what you receive before you pay, and every number in it is worked out from the
              details you give us.
            </p>
          </div>
        </section>
        <TrustStrip />
        <section className="wrap py-14 lg:py-20">
          <div className="grid gap-px border-y border-rule bg-rule lg:grid-cols-2">
            {liveProducts().filter((p) => p.slug !== 'kundli' && p.slug !== 'both').map((p) => <ProductCard key={p.slug} p={p} />)}
            <BundleCard p={PRODUCTS.both} />
            <ProductCard p={PRODUCTS.kundli} />
          </div>
        </section>
        <HowItWorks />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
