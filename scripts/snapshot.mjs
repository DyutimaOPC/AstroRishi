// Fetches each rendered report and inlines its stylesheets, so the saved file
// looks exactly as the customer would see it without needing the dev server.
import { readFileSync, writeFileSync } from 'node:fs';
const BASE = 'http://localhost:3100';
const OUT = process.argv[2];
const samples = JSON.parse(readFileSync('.data/samples.json', 'utf8'));

for (const s of samples) {
  let html = await (await fetch(`${BASE}/r/${s.token}`)).text();
  const links = [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"[^>]*>/g)];
  for (const [tag, href] of links) {
    const css = await (await fetch(href.startsWith('http') ? href : BASE + href)).text();
    html = html.replace(tag, `<style>${css}</style>`);
  }
  html = html.replace(/<script[\s\S]*?<\/script>/g, '');           // no hydration needed
  const file = `${OUT}/${s.slug}-${s.name.split(' ')[0].toLowerCase()}.html`;
  writeFileSync(file, html);
  console.log(`${(html.length / 1024).toFixed(0).padStart(4)}KB  ${file.split('/').pop()}`);
}
