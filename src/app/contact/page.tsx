import type { Metadata } from 'next';
import { AnnouncementBar, Header, Footer } from '@/components/Chrome';
import { Ph } from '@/components/Placeholder';
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
          <div className="flex flex-col gap-2.5 bg-paper-card p-6">
            <Whatsapp size={22} className="text-[#1F7A45]" />
            <span className="disp text-[22px]">WhatsApp</span>
            <span className="text-[15px] text-ink-2">Fastest for anything about an order.</span>
            <span className="font-mono text-[15px]"><Ph value={SITE.whatsapp} /></span>
          </div>
          <div className="flex flex-col gap-2.5 bg-paper-card p-6">
            <Chat size={22} className="text-sindoor" />
            <span className="disp text-[22px]">Email</span>
            <span className="text-[15px] text-ink-2">Best if you need to attach something.</span>
            <span className="font-mono text-[15px]"><Ph value={SITE.supportEmail} /></span>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-2.5 border border-rule bg-paper-2 p-6">
          <span className="lbl">Registered details</span>
          <span className="text-[15px]"><Ph value={SITE.companyName} /></span>
          <span className="text-[15px]"><Ph value={SITE.address} /></span>
          <span className="text-[15px]">GST <Ph value={SITE.gst} /></span>
        </div>
      </main>
      <Footer />
    </>
  );
}
