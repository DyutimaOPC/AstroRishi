'use client';

import Script from 'next/script';
import { useEffect } from 'react';

const PIXEL = process.env.NEXT_PUBLIC_META_PIXEL_ID;

/** Captured on first landing and carried through to the order row. */
const ATTRIBUTION_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid'] as const;

export function Analytics() {
  useEffect(() => {
    try {
      // First touch wins: a later organic visit must not overwrite the ad that
      // actually brought this person in.
      if (sessionStorage.getItem('astrorishi_attr')) return;
      const params = new URLSearchParams(window.location.search);
      const attr: Record<string, string> = {};
      for (const k of ATTRIBUTION_KEYS) { const v = params.get(k); if (v) attr[k] = v; }
      attr.landing_path = window.location.pathname;
      if (document.referrer) attr.referrer = document.referrer;
      sessionStorage.setItem('astrorishi_attr', JSON.stringify(attr));
    } catch {
      // Private browsing can throw on sessionStorage. Attribution is not worth
      // breaking a page over.
    }
  }, []);

  if (!PIXEL) return null;
  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">{`
        !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
        n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
        document,'script','https://connect.facebook.net/en_US/fbevents.js');
        fbq('init','${PIXEL}');fbq('track','PageView');
      `}</Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img height="1" width="1" alt="" style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${PIXEL}&ev=PageView&noscript=1`} />
      </noscript>
    </>
  );
}

type Fbq = (...args: unknown[]) => void;

/** Fire a standard Meta event. No-ops when the pixel is not configured. */
export function track(event: string, params?: Record<string, unknown>, eventId?: string): void {
  const fbq = (window as unknown as { fbq?: Fbq }).fbq;
  if (typeof fbq === 'function') fbq('track', event, params ?? {}, eventId ? { eventID: eventId } : undefined);
}
