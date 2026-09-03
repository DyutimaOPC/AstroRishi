import Link from 'next/link';
import { SITE, CONSULTATION_ENABLED } from '@/lib/config/site';
import { liveProducts } from '@/lib/config/products';
import { Card, Chat, Shield, User, Whatsapp } from './icons';
import { Logo } from './Logo';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/reports', label: 'Reports' },
  { href: '/how-it-works', label: 'How it works' },
  { href: '/samples', label: 'Sample reports' },
  { href: '/faq', label: 'FAQ' },
];

export function AnnouncementBar() {
  return (
    <div className="bg-ink py-2.5 text-paper-2">
      <div className="wrap flex flex-wrap items-center justify-center gap-x-3.5 gap-y-1 text-center">
        <span className="font-mono text-[11px] uppercase tracking-[.18em] text-haldi">Launch offer</span>
        <span className="text-[13.5px]">
          60% off every report — ends {SITE.offerEndsOn}
        </span>
      </div>
    </div>
  );
}

export function Header({ current }: { current?: string }) {
  return (
    <header className="border-b border-rule bg-paper">
      <div className="wrap flex items-center justify-between gap-6 py-5">
        <Link href="/" className="flex items-center gap-2.5 text-ink hover:text-ink">
          <Logo size={46} tone="full" />
          <span className="flex items-baseline gap-2">
            <span className="disp text-[26px] leading-none sm:text-[30px]">ASTRORISHI</span>
            <span className="disp text-xs text-ink-3">ऋषि</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-[15px] font-medium lg:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href}
              className={n.href === current ? 'text-ink' : 'text-ink-2 hover:text-sindoor'}>
              {n.label}
            </Link>
          ))}
        </nav>
        <Link href="/check" className="btn min-h-[46px] px-5 text-[14.5px]">Get your report</Link>
      </div>
    </header>
  );
}

const POLICIES = [
  ['/privacy-policy', 'Privacy Policy'], ['/terms', 'Terms & Conditions'],
  ['/refund-policy', 'Refund & Cancellation Policy'], ['/shipping-policy', 'Shipping & Delivery Policy'],
  ['/cookie-policy', 'Cookie Policy'], ['/pricing-policy', 'Pricing & Payments'], ['/disclaimer', 'Disclaimer'],
] as const;

const COMPANY: readonly (readonly [string, string])[] = [
  ['/about', 'About Us'], ['/contact', 'Contact Us'], ['/how-it-works', 'How It Works'],
  ['/samples', 'Sample Reports'], ['/faq', 'FAQ'], ['/access', 'Access my report'],
  ...(CONSULTATION_ENABLED ? ([['/consultation', 'Consultation with Pandit Maya']] as const) : []),
];

export const DISCLAIMER =
  'AstroRishi reports are interpretive guidance prepared for personal reflection. They are not predictions, and they are not medical, psychological, legal or financial advice. No outcome is guaranteed.';

export function Footer() {
  return (
    <footer className="bg-ink text-[#B8B0A6]">
      <div className="wrap grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(4,1fr)]">
        <div className="flex flex-col gap-3.5">
          <div className="flex items-center gap-2.5">
            <Logo size={42} tone="gold" />
            <span className="flex items-baseline gap-2">
              <span className="disp text-[25px] leading-none text-haldi">ASTRORISHI</span>
              <span className="disp text-[11px] text-ink-3">ऋषि</span>
            </span>
          </div>
          <p className="max-w-[32ch] text-[13.5px] leading-relaxed">
            Numerology and Vedic astrology reports, personalised to your name and birth details and delivered as a full written report.
          </p>
          <div className="flex flex-col gap-2 pt-1">
            <span className="font-mono text-[9.5px] uppercase tracking-[.16em] text-ink-3">Payments accepted</span>
            <div className="flex flex-wrap gap-1.5">
              {['UPI', 'Cards', 'Net banking', 'Wallets'].map((p) => (
                <span key={p} className="border border-rule-dark px-2 py-1 font-mono text-[9.5px] uppercase tracking-wider text-[#A79E93]">{p}</span>
              ))}
            </div>
            <span className="text-xs leading-relaxed text-ink-3">Processed securely by Razorpay. AstroRishi never stores your card details.</span>
          </div>
        </div>

        <FooterCol title="Reports" links={liveProducts().map((p) => [`/reports/${p.slug}`, `${p.name} Report`] as const)} />
        <FooterCol title="Company" links={COMPANY} />
        <FooterCol title="Policies" links={POLICIES} />

        <div className="flex flex-col gap-3">
          <span className="disp text-[19px] text-haldi">Get in touch</span>
          <a href={SITE.whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:text-haldi">
            <Whatsapp size={16} className="text-[#1F7A45]" />{SITE.whatsapp}
          </a>
          <a href={`mailto:${SITE.supportEmail}`} className="flex items-center gap-2 text-sm hover:text-haldi">
            <Chat size={16} className="text-sindoor" />{SITE.supportEmail}
          </a>
        </div>
      </div>

      <div className="wrap">
        <div className="h-px bg-rule-dark" />
        <div className="flex flex-col justify-between gap-4 py-6 text-ink-3 md:flex-row">
          <span className="text-[12.5px]">
            © {new Date().getFullYear()} AstroRishi. All rights reserved.
          </span>
          <span className="max-w-[78ch] text-xs leading-relaxed md:text-right">{DISCLAIMER}</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: readonly (readonly [string, string])[] }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="disp text-[19px] text-haldi">{title}</span>
      <div className="flex flex-col gap-2 text-sm">
        {links.map(([href, label]) => (
          <Link key={href} href={href} className="text-[#B8B0A6] hover:text-haldi">{label}</Link>
        ))}
      </div>
    </div>
  );
}

export function TrustStrip() {
  const items = [
    [<User key="u" className="text-sindoor" size={20} />, '12,000+ happy customers'],
    [<Chat key="c" className="text-sindoor" size={20} />, 'Delivered on WhatsApp & email'],
    [<Shield key="s" className="text-sindoor" size={20} />, 'Your details stay private'],
    [<Card key="p" className="text-sindoor" size={20} />, 'Secure payment by Razorpay'],
  ] as const;
  return (
    <div className="border-b border-rule bg-paper-2">
      <div className="wrap grid grid-cols-2 gap-x-8 gap-y-4 py-7 lg:grid-cols-4">
        {items.map(([icon, label]) => (
          <div key={label} className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sindoor-wash">{icon}</span>
            <span className="text-[13.5px] font-medium leading-tight md:text-[14.5px]">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
