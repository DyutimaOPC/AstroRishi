'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/reports', label: 'Reports' },
  { href: '/how-it-works', label: 'How it works' },
  { href: '/samples', label: 'Sample reports' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-11 w-11 items-center justify-center text-ink"
        aria-label={open ? 'Close menu' : 'Open menu'}
      >
        <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
          {open ? (
            <>
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="6" y1="18" x2="18" y2="6" />
            </>
          ) : (
            <>
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </>
          )}
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 top-[calc(var(--header-h,110px))] z-40 bg-paper">
          <nav className="wrap flex flex-col gap-1 py-6">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`flex items-center border-b border-rule py-4 text-[17px] font-medium ${
                  pathname === n.href ? 'text-sindoor' : 'text-ink'
                }`}
              >
                {n.label}
              </Link>
            ))}
            <Link
              href="/check"
              className="btn mt-4 w-full"
            >
              Get your report
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
