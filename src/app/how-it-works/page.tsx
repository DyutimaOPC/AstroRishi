import type { Metadata } from 'next';
import { CONSULTATION_ENABLED } from '@/lib/config/site';
import { AnnouncementBar, Header, Footer, TrustStrip } from '@/components/Chrome';
import { HowItWorks, Faq, FinalCta, ConsultUpsell } from '@/components/Blocks';

export const metadata: Metadata = {
  title: 'How it works',
  description: 'Four steps and about ten minutes: tell us about yourself, answer a few questions, pay securely, and receive a report written from your own details.',
  alternates: { canonical: '/how-it-works' },
};

const DETAIL = [
  ['Everything is worked out, not looked up', 'Your numbers come from a calculation engine, not a lookup table. Two people with different names or birth dates never get the same report — and the same details always produce the same result.'],
  ['A person checks it before it goes', 'Reports are read through before delivery. If something looks wrong, it is fixed before you ever see it.'],
  ['You keep it', 'Your report lives at a private link you can return to, and saves as a PDF. Losing the message does not mean losing the report.'],
] as const;

export default function Page() {
  return (
    <>
      <AnnouncementBar />
      <Header current="/how-it-works" />
      <main>
        <section className="ruled border-b border-rule">
          <div className="wrap flex flex-col gap-4 py-12 lg:py-16">
            <span className="lbl text-sindoor">How it works</span>
            <h1 className="disp max-w-[16ch] text-[40px] leading-[1.03] lg:text-[58px]">Four steps, about ten minutes.</h1>
            <p className="max-w-[54ch] text-[17px] leading-relaxed text-ink-2">
              No calls to book, no back and forth. You answer a short set of fixed questions and the report comes to you.
            </p>
          </div>
        </section>
        <TrustStrip />
        <HowItWorks />
        <section className="wrap grid gap-8 py-16 lg:grid-cols-3 lg:py-20">
          {DETAIL.map(([t, d]) => (
            <div key={t} className="flex flex-col gap-2.5 border-t-[1.5px] border-ink pt-5">
              <h2 className="disp text-[24px] leading-tight">{t}</h2>
              <p className="text-[15px] leading-relaxed text-ink-2">{d}</p>
            </div>
          ))}
        </section>
        {CONSULTATION_ENABLED && <ConsultUpsell />}
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
