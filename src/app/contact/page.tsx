import type { Metadata } from 'next';
import { AnnouncementBar, Header, Footer } from '@/components/Chrome';
import { Chat, Whatsapp } from '@/components/icons';
import { SITE } from '@/lib/config/site';

export const metadata: Metadata = {
  title: 'Contact us',
  description: 'Message us on WhatsApp or by email. A person replies.',
  alternates: { canonical: '/contact' },
};

export default function Page() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="wrap max-w-[720px] py-12 lg:py-16">
        <div className="flex flex-col gap-4 border-b border-rule pb-8">
          <span className="lbl text-sindoor">Contact us</span>
          <h1 className="disp text-[38px] leading-tight lg:text-[48px]">A person replies.</h1>
          <p className="max-w-[56ch] text-[17px] leading-relaxed text-ink-2">
            Questions before you buy, a correction to a report you have already received, or anything about an order —
            write to us and you will get an answer.
          </p>
        </div>
        <div className="grid gap-px border border-rule bg-rule sm:grid-cols-2">
          <a href={SITE.whatsappLink} target="_blank" rel="noopener noreferrer"
            className="flex flex-col gap-2.5 bg-paper-card p-6 transition-colors hover:bg-sindoor-wash">
            <Whatsapp size={22} className="text-[#1F7A45]" />
            <span className="disp text-[22px]">WhatsApp</span>
            <span className="text-[15px] text-ink-2">Fastest for anything about an order.</span>
            <span className="font-mono text-[15px]">{SITE.whatsapp}</span>
          </a>
          <a href={`mailto:${SITE.supportEmail}`}
            className="flex flex-col gap-2.5 bg-paper-card p-6 transition-colors hover:bg-sindoor-wash">
            <Chat size={22} className="text-sindoor" />
            <span className="disp text-[22px]">Email</span>
            <span className="text-[15px] text-ink-2">Best if you need to attach something.</span>
            <span className="font-mono text-[15px]">{SITE.supportEmail}</span>
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
