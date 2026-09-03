import Link from 'next/link';
import { AnnouncementBar, Header, Footer, TrustStrip } from '@/components/Chrome';
import { ProductCard, NameChanges, HowItWorks, Reviews, Faq, FinalCta } from '@/components/Blocks';
import { FreeCheckForm } from '@/components/FreeCheckForm';
import { ArrowRight } from '@/components/icons';
import { liveProducts, PRODUCTS } from '@/lib/config/products';
import { SITE } from '@/lib/config/site';

export default function Home() {
  const products = liveProducts();
  return (
    <>
      <AnnouncementBar />
      <Header current="/" />
      <main>
        <section className="ruled border-b border-rule">
          <div className="wrap grid gap-12 py-12 lg:grid-cols-[1.08fr_428px] lg:gap-[76px] lg:py-16">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <span className="h-0.5 w-8 bg-sindoor" />
                <span className="lbl text-sindoor">Personalised reports · from ₹249</span>
              </div>
              <h1 className="disp text-[42px] leading-[1.02] sm:text-[56px] lg:text-[70px]">
                Is your name working <span className="text-sindoor">against</span> you?
              </h1>
              <p className="max-w-[46ch] text-[17px] leading-relaxed text-ink-2 lg:text-[19px]">
                Answer a few short questions and get a detailed report worked out from your own name, birth date and
                situation — not a horoscope everyone else is reading.
              </p>
              <div className="flex flex-wrap items-center gap-3.5">
                <Link href="/check" className="btn">Check my name free <ArrowRight size={17} /></Link>
                <Link href="/reports" className="btn-o">See both reports</Link>
              </div>
              <dl className="mt-2 flex flex-wrap gap-7 border-t border-rule pt-5">
                <Stat label="Reports" value="2" />
                <Stat label="From" value="₹249" />
                <Stat label="Delivery" value={SITE.turnaround} />
              </dl>
            </div>
            <FreeCheckForm />
          </div>
        </section>

        <TrustStrip />

        <section className="wrap py-16 lg:py-20">
          <div className="flex flex-col justify-between gap-6 border-b-[1.5px] border-ink pb-5 lg:flex-row lg:items-end lg:gap-10">
            <div className="flex flex-col gap-2.5">
              <span className="lbl text-sindoor">The catalogue</span>
              <h2 className="disp text-[32px] leading-tight lg:text-[44px]">Two reports. Each answers a different question.</h2>
            </div>
            <p className="max-w-[34ch] pb-1 text-[15px] text-ink-2">
              Every report lists exactly what you receive before you pay.
            </p>
          </div>
          <div className="grid gap-px border-b border-rule bg-rule lg:grid-cols-2">
            {products.filter((p) => p.slug !== 'kundli').map((p) => <ProductCard key={p.slug} p={p} />)}
            <ProductCard p={PRODUCTS.kundli} />
          </div>
        </section>

        <NameChanges />
        <HowItWorks />
        <Reviews />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dd className="disp text-[27px] leading-tight">{value}</dd>
      <dt className="lbl">{label}</dt>
    </div>
  );
}
