import type { Metadata } from 'next';
import { AnnouncementBar, Header, Footer } from '@/components/Chrome';
import { FinalCta } from '@/components/Blocks';

export const metadata: Metadata = {
  title: 'About us',
  description: 'Who runs AstroRishi, how the reports are made, and what we will and will not claim.',
  alternates: { canonical: '/about' },
};

export default function Page() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>
        <section className="ruled border-b border-rule">
          <div className="wrap flex flex-col gap-4 py-12 lg:py-16">
            <span className="lbl text-sindoor">About us</span>
            <h1 className="disp max-w-[18ch] text-[40px] leading-[1.03] lg:text-[56px]">
              Reports worth the money, and honest about what they are.
            </h1>
          </div>
        </section>
        <section className="wrap max-w-[760px] py-14 lg:py-16">
          <div className="flex flex-col gap-7 text-[16.5px] leading-relaxed text-ink-2">
            <p>
              AstroRishi makes one kind of thing: personalised numerology and
              Vedic astrology reports, prepared from the details you give us and delivered as a proper written document.
            </p>
            <p>
              Most reports of this kind fall into one of two traps. Either they are two vague paragraphs that could
              describe anybody, or they are forty pages of padding nobody finishes. We aim for the thing in between —
              specific, structured, and short enough to actually read in one sitting.
            </p>
            <h2 className="disp pt-2 text-[26px] leading-tight text-ink">How a report is made</h2>
            <p>
              Every number in an AstroRishi report is calculated, not looked up. Your name is scored letter by letter using
              Chaldean values; your grid and life path come from your date of birth. The same details always produce the
              same result, and we can show our working for any figure on the page.
            </p>
            <p>
              The interpretation around those numbers is written to a fixed structure and checked before it goes out,
              so no two customers get the same words and nobody gets a wall of text.
            </p>
            <h2 className="disp pt-2 text-[26px] leading-tight text-ink">What we will not do</h2>
            <p>
              We do not guarantee outcomes. We do not promise wealth, marriage, promotion or recovery from illness. We
              do not give financial or medical advice, and we do not tell you what anybody else is privately thinking.
              Any business in this field that offers you those things is selling you something it cannot deliver.
            </p>
            <p>
              We also do not invent reviews. Where you see customer words on this site, they came from customers.
            </p>
          </div>
        </section>
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
