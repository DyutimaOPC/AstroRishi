import { writeFileSync } from 'node:fs';
const res = await fetch('http://localhost:3100/reports');
const html = await res.text();
const svgs = [...html.matchAll(/<svg[^>]*role="img"[^>]*aria-label="[^"]*Report cover"[\s\S]*?<\/svg>/g)].map(m => m[0]);
writeFileSync(process.argv[2], `<!doctype html><html><head><meta charset="utf-8"><title>Covers</title>
<style>body{background:#F2F1EC;margin:0;padding:40px;display:flex;gap:28px;flex-wrap:wrap;font-family:system-ui}
div{filter:drop-shadow(0 2px 3px rgba(26,23,20,.22)) drop-shadow(0 16px 28px rgba(26,23,20,.32))}</style>
</head><body>${svgs.map(s => `<div>${s.replace(/width="\d+" height="\d+"/, 'width="200" height="280"')}</div>`).join('')}</body></html>`);
console.log(`${svgs.length} covers captured`);
