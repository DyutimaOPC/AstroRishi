import Link from 'next/link';
import { Header, Footer } from '@/components/Chrome';
import { ArrowRight } from '@/components/icons';

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="wrap flex max-w-[620px] flex-col gap-5 py-20 lg:py-28">
        <span className="lbl text-sindoor">404</span>
        <h1 className="disp text-[38px] leading-tight lg:text-[46px]">That page is not here.</h1>
        <p className="text-[16.5px] leading-relaxed text-ink-2">
          The link may be old, or mistyped. If you were looking for a report you have already paid for, you can find it
          again with your order number.
        </p>
        <div className="flex flex-wrap gap-3.5 pt-2">
          <Link href="/" className="btn">Back to the homepage <ArrowRight size={17} /></Link>
          <Link href="/access" className="btn-o">Find my report</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
