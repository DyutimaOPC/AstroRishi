const BASE = process.env.BASE ?? 'http://localhost:3100';

const ROUTES = [
  ['/', 'Is your name working'],
  ['/reports', 'Five reports'],
  ['/reports/name-correction', 'Name Correction'],
  ['/reports/numerology', 'Complete Numerology'],
  ['/reports/career-money', 'Career &amp; Money'],
  ['/reports/relationship', 'Relationship Clarity'],
  ['/reports/kundli', 'Premium Kundli'],
  ['/check', 'Check your name free'],
  ['/start/name-correction', 'exactly as you write it'],
  ['/start/career-money', 'Step 1 of'],
  ['/how-it-works', 'Four steps'],
  ['/samples', 'not a teaser'],
  ['/faq', 'Before you buy'],
  ['/about', 'About us'],
  ['/contact', 'A person replies'],
  ['/access', 'Find your report again'],
  ['/admin', 'Admin'],
  ['/privacy-policy', 'Privacy Policy'],
  ['/terms', 'Terms &amp; Conditions'],
  ['/refund-policy', 'Refund'],
  ['/shipping-policy', 'Shipping'],
  ['/cookie-policy', 'Cookie'],
  ['/pricing-policy', 'Pricing'],
  ['/disclaimer', 'Disclaimer'],
  ['/sitemap.xml', '<urlset'],
  ['/robots.txt', 'Sitemap'],
  ['/no-such-page', 'not here', 404],
];

try {
  await fetch(BASE, { signal: AbortSignal.timeout(3000) });
} catch {
  console.error(`Cannot reach ${BASE} — start the dev server first (npm run dev).`);
  process.exit(1);
}

let fail = 0;
for (const [path, needle, expect = 200] of ROUTES) {
  try {
    const res = await fetch(BASE + path, { redirect: 'manual' });
    const body = await res.text();
    const okStatus = res.status === expect;
    const okBody = body.includes(needle);
    const ok = okStatus && okBody;
    if (!ok) fail++;
    console.log(`${ok ? 'ok  ' : 'FAIL'}  ${String(res.status).padEnd(3)} ${path.padEnd(28)} ${okBody ? '' : `missing "${needle}"`}`);
  } catch (e) {
    fail++; console.log(`FAIL  ERR ${path.padEnd(28)} ${e.message}`);
  }
}

// Private routes must be noindex.
for (const p of ['/check', '/access']) {
  const body = await (await fetch(BASE + p)).text();
  if (body.includes('noindex')) { console.log(`FAIL      ${p} is marked noindex but should be indexable`); fail++; }
}
console.log(`\n${ROUTES.length} routes · ${fail ? fail + ' failure(s)' : 'all passed'}`);
process.exit(fail ? 1 : 0);
