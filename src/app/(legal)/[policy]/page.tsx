import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { AnnouncementBar, Header, Footer } from '@/components/Chrome';
import { POLICIES, policyBySlug } from '@/lib/content/policies';

export const dynamicParams = false;
export function generateStaticParams() { return POLICIES.map((p) => ({ policy: p.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ policy: string }> }): Promise<Metadata> {
  const { policy } = await params;
  const doc = policyBySlug(policy);
  if (!doc) return {};
  return { title: doc.title, description: doc.summary, alternates: { canonical: `/${doc.slug}` } };
}

export default async function PolicyPage({ params }: { params: Promise<{ policy: string }> }) {
  const { policy } = await params;
  const doc = policyBySlug(policy);
  if (!doc) notFound();

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="wrap max-w-[820px] py-12 lg:py-16">
        <div className="flex flex-col gap-3 border-b border-rule pb-8">
          <span className="lbl text-sindoor">Policies</span>
          <h1 className="disp text-[38px] leading-tight lg:text-[48px]">{doc.title}</h1>
          <p className="max-w-[60ch] text-[17px] leading-relaxed text-ink-2">{doc.summary}</p>
          <p className="font-mono text-[10px] uppercase tracking-[.14em] text-ink-3">
            Last updated {doc.updated}
          </p>
        </div>
        <div className="flex flex-col gap-9 pt-9">
          {doc.sections.map((s) => (
            <section key={s.heading} className="flex flex-col gap-3">
              <h2 className="disp text-[24px] leading-tight">{s.heading}</h2>
              {s.body.map((b, i) => (
                <p key={i} className="max-w-[68ch] text-[15.5px] leading-relaxed text-ink-2">{b}</p>
              ))}
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
