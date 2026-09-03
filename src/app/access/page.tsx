import type { Metadata } from 'next';
import { AnnouncementBar, Header, Footer } from '@/components/Chrome';
import { AccessForm } from '@/components/AccessForm';
import { Ph } from '@/components/Placeholder';
import { SITE } from '@/lib/config/site';

export const metadata: Metadata = {
  title: 'Access my report',
  description: 'Lost the link to a report you have already paid for? Find it again with your order number.',
  alternates: { canonical: '/access' },
};

export default function Page() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="wrap grid max-w-[900px] gap-10 py-12 lg:grid-cols-[1fr_400px] lg:gap-14 lg:py-16">
        <div className="flex flex-col gap-4">
          <span className="lbl text-sindoor">Already paid?</span>
          <h1 className="disp text-[38px] leading-tight lg:text-[46px]">Find your report again.</h1>
          <p className="max-w-[46ch] text-[16.5px] leading-relaxed text-ink-2">
            Your report does not expire and it is not deleted. If the WhatsApp message is buried or the email is gone,
            your order number will bring it straight back.
          </p>
          <p className="max-w-[46ch] text-[15px] leading-relaxed text-ink-2">
            The order number looks like <span className="font-mono">JN-2026-0417</span> and is on your confirmation
            message. If you cannot find that either, message us on <Ph value={SITE.whatsapp} /> and we will look it up.
          </p>
        </div>
        <AccessForm />
      </main>
      <Footer />
    </>
  );
}
