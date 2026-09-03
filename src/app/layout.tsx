import type { Metadata } from 'next';
import { Rozha_One, Familjen_Grotesk, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { Analytics } from '@/components/Analytics';

const disp = Rozha_One({ weight: '400', subsets: ['latin', 'devanagari'], variable: '--font-disp', display: 'swap' });
const sans = Familjen_Grotesk({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const mono = IBM_Plex_Mono({ weight: ['400', '500', '600'], subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: { default: 'AstroRishi — personalised numerology and astrology reports', template: '%s · AstroRishi' },
  description:
    'Answer a few short questions and receive a detailed report worked out from your own name, birth date and situation. Reports from ₹399.',
  openGraph: { type: 'website', siteName: 'AstroRishi', locale: 'en_IN' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${disp.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
