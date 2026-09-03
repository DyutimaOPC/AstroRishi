/**
 * Generates the same report under several models and writes them side by side.
 *
 *   npx tsx scripts/compare-models.ts career-money
 *   npx tsx scripts/compare-models.ts relationship gemini-3.6-flash
 */
import { writeFileSync } from 'node:fs';
import { careerReport } from '../src/lib/career';
import { relationshipReport } from '../src/lib/relationship';
import { compute } from '../src/lib/numerology';
import { generateSections } from '../src/lib/report/generate';
import type { SectionKey } from '../src/lib/config/products';

const ANSWERS: Record<string, Record<string, string>> = {
  'career-money': {
    fullName: 'Anand Sharma', dob: '1992-08-23', occupation: 'Operations manager',
    experience: '5 to 10', employment: 'Salaried', income: '₹75,000 to ₹2 lakh',
    concern: 'Growth has stalled', satisfaction: 'Somewhat', preference: 'Leaning business',
    risk: 'Moderate', goal: 'To stop feeling like I am running to stand still.',
  },
  relationship: {
    fullName: 'Anand Sharma', dob: '1992-08-23', partnerName: 'Meera Iyer', partnerDob: '1994-02-11',
    status: 'Married', duration: '3 to 7 years', concern: 'We keep having the same fight',
    communication: 'We avoid the hard things', changed: 'Money pressure',
    outcome: 'Decide whether to stay', context: 'We are polite with each other and it feels wrong.',
  },
};

const key = (process.argv[2] ?? 'career-money') as SectionKey;
const models = (process.argv[3] ?? 'gemini-3.6-flash').split(',');

const computedFor = (s: SectionKey) =>
  s === 'career-money' ? careerReport(ANSWERS[s])
  : s === 'relationship' ? relationshipReport(ANSWERS[s])
  : compute({ fullName: ANSWERS['career-money'].fullName, dob: ANSWERS['career-money'].dob });

async function main() {
  if (!process.env.GOOGLE_API_KEY) {
    console.error('Set GOOGLE_API_KEY in your environment first.');
    process.exit(1);
  }
  const answers = ANSWERS[key] ?? ANSWERS['career-money'];
  const computed = computedFor(key);
  const panels: string[] = [];

  for (const model of models) {
    process.env.GOOGLE_MODEL = model;
    const t0 = Date.now();
    try {
      const g = await generateSections(key, computed, answers);
      const words = JSON.stringify(g.sections).split(/\s+/).length;
      console.log(`  ${model.padEnd(30)} ${((Date.now() - t0) / 1000).toFixed(1)}s  ${words} words  attempts ${g.attempts}  warnings ${g.findings.length}`);
      panels.push(`<section><h2>${model}</h2>
        <p class="meta">${((Date.now() - t0) / 1000).toFixed(1)}s · ${words} words · ${g.attempts} attempt(s) · ${g.findings.length} warning(s)</p>
        ${Object.entries(g.sections as Record<string, unknown>).map(([k, v]) =>
          `<h3>${k}</h3><div>${typeof v === 'string' ? v : `<pre>${JSON.stringify(v, null, 1)}</pre>`}</div>`).join('')}
      </section>`);
    } catch (e) {
      console.log(`  ${model.padEnd(30)} FAILED: ${(e as Error).message}`);
      panels.push(`<section><h2>${model}</h2><p class="fail">FAILED: ${(e as Error).message}</p></section>`);
    }
  }

  const out = `scratchpad-model-comparison-${key}.html`;
  writeFileSync(out, `<!doctype html><meta charset="utf-8"><title>${key} — model comparison</title>
<style>body{font:15px/1.6 ui-sans-serif,system-ui;margin:0;background:#EFEDE6;color:#1C1814;
display:grid;grid-template-columns:repeat(${models.length},1fr);gap:1px;background:#D8D4C8}
section{background:#FBFAF6;padding:22px}h2{font-size:17px;margin:0 0 4px}
h3{font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#8A8177;margin:18px 0 4px}
.meta{font:12px ui-monospace,monospace;color:#8A8177;margin:0 0 8px}.fail{color:#A11C1C}
pre{white-space:pre-wrap;font-size:12px;background:#F2F0E8;padding:8px}</style>${panels.join('')}`);
  console.log(`\n  wrote ${out}`);
}

void main();
