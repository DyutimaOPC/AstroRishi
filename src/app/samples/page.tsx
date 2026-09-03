import type { Metadata } from 'next';
import Link from 'next/link';
import { AnnouncementBar, Header, Footer } from '@/components/Chrome';
import { NumerologyReport } from '@/components/report/NumerologyReport';
import { CompleteNumerologyReport } from '@/components/report/CompleteNumerologyReport';
import { CareerReport } from '@/components/report/CareerReport';
import { RelationshipReport } from '@/components/report/RelationshipReport';
import { FinalCta } from '@/components/Blocks';
import { ArrowRight } from '@/components/icons';
import { compute } from '@/lib/numerology';
import { careerReport } from '@/lib/career';
import { relationshipReport } from '@/lib/relationship';
import { PRODUCTS } from '@/lib/config/products';

export const metadata: Metadata = {
  title: 'Sample report',
  description: 'Four complete reports — name correction, complete numerology, career and money, and relationship clarity — worked out for a sample person. Every number is really calculated.',
  alternates: { canonical: '/samples' },
};

/** A real report for an invented person — the engine runs for this page too. */
const SAMPLE = { fullName: 'Anand Sharma', dob: '1992-08-23' };

/** The same person, answering each questionnaire. Every engine really runs. */
const CAREER_ANSWERS = {
  ...SAMPLE, occupation: 'Operations manager', experience: '5 to 10', employment: 'Salaried',
  income: '₹75,000 to ₹2 lakh', concern: 'Growth has stalled', satisfaction: 'Somewhat',
  preference: 'Leaning business', risk: 'Moderate',
  goal: 'To stop feeling like I am running to stand still.',
};
const RELATIONSHIP_ANSWERS = {
  ...SAMPLE, partnerName: 'Meera Iyer', partnerDob: '1994-02-11',
  status: 'Married', duration: '3 to 7 years', concern: 'We keep having the same fight',
  communication: 'We avoid the hard things', changed: 'Money pressure',
  outcome: 'Decide whether to stay', context: 'We are polite with each other and it feels wrong.',
};

export default function Page() {
  const c = compute(SAMPLE);
  return (
    <>
      <AnnouncementBar />
      <Header current="/samples" />
      <main>
        <section className="ruled border-b border-rule">
          <div className="wrap flex flex-col gap-4 py-12 lg:py-16">
            <span className="lbl text-sindoor">Sample report</span>
            <h1 className="disp max-w-[18ch] text-[40px] leading-[1.03] lg:text-[56px]">
              This is the whole thing, not a teaser.
            </h1>
            <p className="max-w-[58ch] text-[17px] leading-relaxed text-ink-2">
              Below are four complete reports for an invented person — Anand Sharma, born 23 August 1992. Every
              number on them is genuinely calculated by the same engine that will run on your details, including the
              relationship reading, which is worked against a second real chart. Nothing here is mocked up for show.
            </p>
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link href="/check" className="btn">Check my own name free <ArrowRight size={17} /></Link>
              <Link href="/reports/name-correction" className="btn-o">See what it costs</Link>
            </div>
          </div>
        </section>

        <div className="bg-paper-2 pb-12">
          <Frame slug="name-correction" title="Name Correction Report" note="Sample · not a real customer" who="Anand Sharma · 23 Aug 1992">
            <NumerologyReport c={c} sections={null} />
          </Frame>
          <Frame slug="numerology" title="Complete Numerology Report" note="Second sample · a different report" who="Anand Sharma · 23 Aug 1992">
            <CompleteNumerologyReport c={c} sections={null} />
          </Frame>
          <Frame slug="career-money" title="Career &amp; Money Report" note="Third sample · built from the chart and the questionnaire" who="Anand Sharma · operations manager">
            <CareerReport r={careerReport(CAREER_ANSWERS)} sections={null} />
          </Frame>
          <Frame slug="relationship" title="Relationship Clarity Report" note="Fourth sample · both charts read together" who="Anand Sharma and Meera Iyer">
            <RelationshipReport r={relationshipReport(RELATIONSHIP_ANSWERS)} sections={null} />
          </Frame>
        </div>
        <FinalCta product="name-correction" />
      </main>
      <Footer />
    </>
  );
}

/** One sample, dressed in its own product's cover colour. */
function Frame({ slug, title, note, who, children }: {
  slug: keyof typeof PRODUCTS; title: string; note: string; who: string; children: React.ReactNode;
}) {
  return (
    <div className="mx-auto mt-12 max-w-[900px] border-x border-rule first:mt-0">
      <div className="flex flex-wrap items-baseline justify-between gap-3 bg-ink px-6 py-3 text-[#B8B0A6] sm:px-10">
        <span className="font-mono text-[10px] uppercase tracking-[.14em]">{note}</span>
        <span className="font-mono text-[10px] uppercase tracking-[.14em]">{who}</span>
      </div>
      <header className="px-6 py-10 text-[#F0D492] sm:px-10" style={{ backgroundColor: PRODUCTS[slug].cover }}>
        <div className="flex flex-col gap-5 border border-[#D9AE55] p-6 sm:p-8">
          <span className="disp text-[24px] tracking-[.14em]">ASTRORISHI</span>
          <div className="h-px bg-[#D9AE55] opacity-50" />
          <h2 className="disp text-[34px] leading-[1.03] text-[#F7E9C8] sm:text-[46px]">{title}</h2>
          <span className="font-mono text-[10px] uppercase tracking-[.3em] opacity-80">Chaldean numerology</span>
        </div>
      </header>
      {children}
    </div>
  );
}
