import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { AnnouncementBar, Header, Footer, DISCLAIMER } from '@/components/Chrome';
import { NameChanges, HowItWorks, Reviews, Faq, FinalCta, FAQS } from '@/components/Blocks';
import { Cover } from '@/components/Cover';
import { TrackEvent } from '@/components/TrackEvent';
import { ArrowRight, Check, Lock } from '@/components/icons';
import { PRODUCTS, PRODUCT_SLUGS, isProductSlug, rupees, type ProductSlug } from '@/lib/config/products';
import { SITE } from '@/lib/config/site';

export const dynamicParams = false;
export function generateStaticParams() {
  return PRODUCT_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (!isProductSlug(slug)) return {};
  const p = PRODUCTS[slug];
  return {
    title: `${p.name} Report — ${rupees(p.pricePaise)}`,
    description: `${p.question} ${p.promise} A personalised ${p.name.toLowerCase()} report, delivered on WhatsApp and email.`,
    alternates: { canonical: `/reports/${p.slug}` },
    openGraph: { title: `${p.name} Report`, description: p.promise, url: `/reports/${p.slug}` },
  };
}

const DISCOVER: Record<ProductSlug, readonly (readonly [string, string])[]> = {
  'name-numerology': [
    ['Your score', 'A number out of 100 for how well your current spelling sits with your birth date.'],
    ['Your numbers', 'Life path, destiny, soul urge and personality — worked out, not guessed.'],
    ['Your grid', 'The Lo Shu square from your birth date, every plane read out.'],
    ['Your options', 'Corrected spellings, each scored, so the choice is yours.'],
    ['Your plan', 'Lucky elements, remedies and what to do first.'],
  ],
  'career-relationship': [
    ['Your career', 'A career strength score, job-versus-business verdict and earning capacity.'],
    ['Your pattern', 'How the two of you communicate, named plainly.'],
    ['Your fit', 'What you do now, measured against what the chart is built for.'],
    ['Your friction', 'Where the pressure is really coming from — career and relationship.'],
    ['Your plan', 'A 90-day career plan and a 30-day relationship conversation guide.'],
  ],
  kundli: [
    ['Your chart', 'Planetary positions worked from your date, time and place of birth.'],
    ['Your houses', 'A house-by-house reading in ordinary language.'],
    ['Your doshas', 'What is present, what it means, and the remedies that apply.'],
    ['Your periods', 'The dashas ahead and the character of each.'],
    ['Your plan', 'What to prioritise, and when to be patient.'],
  ],
};

const CONTENTS: Record<ProductSlug, readonly (readonly [string, number])[]> = {
  'name-numerology': [
    ['At a glance — your four numbers', 3], ['How your name reads today', 4],
    ['Which numbers suit you', 6], ['Your corrected name options, scored', 8],
    ['Your Lo Shu grid', 10], ['Your energy profile', 12],
    ['Strengths and challenges', 14], ['The year ahead', 16],
    ['Everyday numbers you get to choose', 18],
    ['Lucky elements and remedies', 20], ['Making the change stick', 22],
  ],
  'career-relationship': [
    ['Where you stand — career strength', 3], ['The numbers this is built on', 5],
    ['What you are built to do', 7], ['Your occupation vs your chart', 9],
    ['Your earning capacity', 11], ['Job or business', 13],
    ['What is actually in the way', 15], ['The next three years', 17],
    ['Your 90-day career plan', 19],
    ['Your relationship pattern', 21], ['The two of you, in numbers', 23],
    ['Where you agree, and where you grate', 25],
    ['Where the friction sits', 27], ['A conversation guide', 29],
    ['Your 30-day relationship plan', 31],
  ],
  kundli: [
    ['At a glance — your chart', 3], ['Planetary positions', 5], ['House by house', 8],
    ['Doshas present', 20], ['Dasha periods ahead', 26], ['Remedies', 34],
  ],
};

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isProductSlug(slug)) notFound();
  const p = PRODUCTS[slug];
  const contents = CONTENTS[slug];
  const pages = p.pages ?? contents[contents.length - 1][1];

  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'Product',
    name: `${p.name} Report`, description: p.promise, brand: { '@type': 'Brand', name: 'AstroRishi' },
    offers: {
      '@type': 'Offer', priceCurrency: 'INR', price: (p.pricePaise / 100).toFixed(2),
      availability: p.live ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
      url: `/reports/${p.slug}`,
    },
    disclaimer: DISCLAIMER,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TrackEvent name="ViewContent" params={{ content_name: p.name, content_ids: [p.slug], value: p.pricePaise / 100, currency: 'INR' }} />
      <AnnouncementBar />
      <Header current="/reports" />
      <main>
        <section className="ruled border-b border-rule">
          <div className="wrap grid items-center gap-10 py-12 lg:grid-cols-[1fr_300px] lg:gap-16 lg:py-16">
            <div className="flex flex-col gap-5">
              <nav aria-label="Breadcrumb" className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[.2em]">
                <Link href="/reports" className="text-ink-3 hover:text-sindoor">Reports</Link>
                <span className="text-rule">/</span>
                <span className="text-sindoor">{p.name}</span>
              </nav>
              <h1 className="disp max-w-[15ch] text-[40px] leading-[1.02] lg:text-[60px]">{p.question}</h1>
              <p className="max-w-[50ch] text-[17px] leading-relaxed text-ink-2 lg:text-[18.5px]">{p.promise}</p>
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-baseline gap-2.5">
                  <span className="font-mono text-[17px] text-ink-3 line-through">{rupees(p.comparePaise)}</span>
                  <span className="disp text-[48px] leading-none">{rupees(p.pricePaise)}</span>
                </div>
                {p.live ? (
                  <Link href={`/start/${p.slug}`} className="btn min-h-[58px] px-8 text-[16.5px]">
                    Get my report <ArrowRight size={18} />
                  </Link>
                ) : (
                  <div className="flex flex-col gap-2">
                    <span className="btn-o min-h-[58px] cursor-default border-rule px-8 text-[16.5px] text-ink-2">Coming soon</span>
                    <span className="text-[13px] text-ink-3">Expected {SITE.kundliEta}.</span>
                  </div>
                )}
              </div>
              <ul className="flex flex-wrap gap-x-6 gap-y-2 border-t border-rule pt-4 text-[13.5px] text-ink-2">
                <li className="flex items-center gap-2"><Check className="text-leaf" />{pages}+ pages</li>
                <li className="flex items-center gap-2"><Check className="text-leaf" />Delivered instantly</li>
                <li className="flex items-center gap-2"><Check className="text-leaf" />WhatsApp and email</li>
                <li className="flex items-center gap-2"><Lock className="text-ink-3" />Razorpay secured</li>
              </ul>
            </div>
            <div className="justify-self-center"><Cover slug={p.slug} width={278} uid={`${p.slug}-hero`} /></div>
          </div>
        </section>

        <section className="wrap py-16 lg:py-[76px]">
          <div className="flex flex-col gap-2.5 border-b-[1.5px] border-ink pb-5">
            <span className="lbl text-sindoor">What you will discover</span>
            <h2 className="disp text-[32px] leading-tight lg:text-[42px]">Five answers, not five paragraphs.</h2>
          </div>
          <div className="grid gap-px border-b border-rule bg-rule sm:grid-cols-2 lg:grid-cols-5">
            {DISCOVER[slug].map(([t, d], i) => (
              <div key={t} className="flex flex-col gap-2.5 bg-paper p-6">
                <span className="font-mono text-[10px] tracking-[.16em] text-sindoor">0{i + 1}</span>
                <span className="disp text-[23px] leading-tight">{t}</span>
                <span className="text-sm leading-relaxed text-ink-2">{d}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-rule bg-paper-2">
          <div className="wrap grid gap-12 py-16 lg:grid-cols-[340px_1fr] lg:gap-[60px] lg:py-[72px]">
            <div className="flex flex-col gap-4">
              <span className="lbl text-sindoor">What is inside</span>
              <h2 className="disp text-[32px] leading-tight lg:text-[42px]">
                {contents.length} sections across {pages}+ pages.
              </h2>
              <p className="text-[15px] leading-relaxed text-ink-2">
                Every one of them written from your details. No filler chapters, no general astrology padding.
              </p>
              <div className="mt-2"><Cover slug={p.slug} width={176} uid={`${p.slug}-contents`} /></div>
            </div>
            <div className="border border-rule bg-paper-card p-6 sm:p-8">
              <div className="flex items-baseline justify-between border-b-[1.5px] border-ink pb-3.5">
                <span className="disp text-2xl">Contents</span><span className="lbl">Page</span>
              </div>
              {contents.map(([t, pg]) => (
                <div key={t} className="flex items-baseline gap-3 border-b border-paper-2 py-2.5">
                  <Check size={14} className="text-leaf" />
                  <span className="flex-1 text-[15px]">{t}</span>
                  <span className="font-mono text-xs text-ink-3">{pg}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {slug === 'name-numerology' && <NameChanges />}
        <HowItWorks />
        <Reviews />
        <Faq items={FAQS} />
        <FinalCta product={p.slug} />
      </main>
      <Footer />
    </>
  );
}
