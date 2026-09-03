import type { Metadata } from 'next';
import { AnnouncementBar, Header, Footer, DISCLAIMER } from '@/components/Chrome';
import { Faq, FAQS, FinalCta } from '@/components/Blocks';

export const metadata: Metadata = {
  title: 'Frequently asked questions',
  description: 'What we need from you, how long a report takes, how it reaches you, what it costs, and what a AstroRishi report does and does not claim to be.',
  alternates: { canonical: '/faq' },
};

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: FAQS.map(([q, a]) => ({
      '@type': 'Question', name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
    disclaimer: DISCLAIMER,
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AnnouncementBar />
      <Header current="/faq" />
      <main>
        <section className="ruled border-b border-rule">
          <div className="wrap flex flex-col gap-4 py-12 lg:py-16">
            <span className="lbl text-sindoor">Questions</span>
            <h1 className="disp max-w-[16ch] text-[40px] leading-[1.03] lg:text-[58px]">Before you buy.</h1>
          </div>
        </section>
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
