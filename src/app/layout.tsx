import type { Metadata } from 'next';
import { Rozha_One, Familjen_Grotesk, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { Analytics } from '@/components/Analytics';
import { SaleToast } from '@/components/SaleToast';

const disp = Rozha_One({ weight: '400', subsets: ['latin', 'devanagari'], variable: '--font-disp', display: 'swap' });
const sans = Familjen_Grotesk({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const mono = IBM_Plex_Mono({ weight: ['400', '500', '600'], subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://astrorishi.org'),
  title: { default: 'AstroRishi — personalised numerology and astrology reports', template: '%s · AstroRishi' },
  description:
    'Answer a few short questions and receive a detailed report worked out from your own name, birth date and situation. Reports from ₹249.',
  openGraph: {
    type: 'website', siteName: 'AstroRishi', locale: 'en_IN',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'AstroRishi — personalised numerology and astrology reports' }],
  },
  twitter: { card: 'summary_large_image', images: ['/og.png'] },
  icons: { icon: '/logo-tile.png', apple: '/logo-tile.png' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${disp.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        {children}
        <SaleToast />
        <Analytics />
      </body>
    </html>
  );
}
