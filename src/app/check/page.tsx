import type { Metadata } from 'next';
import { AnnouncementBar, Header, Footer, TrustStrip } from '@/components/Chrome';
import { FreeCheckForm } from '@/components/FreeCheckForm';
import { NameChanges, Faq } from '@/components/Blocks';

export const metadata: Metadata = {
  title: 'Check your name free',
  description: 'Your name number, your birth number, and whether the two agree. Takes about thirty seconds, no signup and no payment.',
};

export default function CheckPage() {
  return (
    <>
      <AnnouncementBar />
      <Header current="/check" />
      <main>
        <section className="ruled border-b border-rule">
          <div className="wrap grid gap-10 py-12 lg:grid-cols-[1fr_428px] lg:gap-16 lg:py-16">
            <div className="flex flex-col gap-5">
              <span className="lbl text-sindoor">Free name check</span>
              <h1 className="disp text-[40px] leading-[1.03] lg:text-[58px]">
                Does your name agree with your birth date?
              </h1>
              <p className="max-w-[48ch] text-[17px] leading-relaxed text-ink-2">
                Your name adds up to a number. So does your birth date. When the two pull in different directions, the
                effort you put in tends not to convert the way it should. Find out where yours stand — free.
              </p>
              <ul className="flex flex-col gap-2 border-t border-rule pt-5 text-[15px] text-ink-2">
                <li>Your name number, worked out letter by letter</li>
                <li>Your birth number and life path</li>
                <li>Whether the two sit well together</li>
              </ul>
            </div>
            <FreeCheckForm />
          </div>
        </section>
        <TrustStrip />
        <NameChanges />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
