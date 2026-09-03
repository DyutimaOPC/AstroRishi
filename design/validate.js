const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.dc.html')).sort();
let bad = 0;
const VOID = new Set(['br','hr','img','input','meta','link','polyline','polygon','line','circle','rect','path','stop','use','ellipse','source']);
for (const f of files) {
  const s = fs.readFileSync(f, 'utf8'), issues = [];
  const ids = [...s.matchAll(/ id="([^"]+)"/g)].map(m => m[1]);
  const dup = [...new Set(ids.filter((v, i) => ids.indexOf(v) !== i))];
  if (dup.length) issues.push('duplicate svg ids: ' + dup.join(', '));
  for (const t of ['div', 'span', 'svg', 'p', 'h1', 'h2', 'h3']) {
    const o = (s.match(new RegExp('<' + t + '(?=[\\s>])', 'g')) || []).length;
    const c = (s.match(new RegExp('</' + t + '>', 'g')) || []).length;
    if (o !== c) issues.push(`<${t}> unbalanced: ${o} open / ${c} close`);
  }
  if (!/<script src="\.\/support\.js"><\/script>/.test(s)) issues.push('missing support.js line');
  if (!/<x-dc>[\s\S]*<\/x-dc>/.test(s)) issues.push('missing x-dc wrapper');
  if (/@@/.test(s)) issues.push('unresolved build token');
  if (/\$\{/.test(s)) issues.push('unrendered template literal');
  if (/<a [^>]*href/.test(s) && !/\ba\s*\{|\ba:hover/.test(s)) issues.push('links without styled a/a:hover');
  // attribute values must be quoted; scan attr positions only, not inside quoted values
  const unq = [...s.matchAll(/<[a-z][a-z0-9-]*\s(?:"[^"]*"|'[^']*'|[^>"'])*?\s[a-z-]+=(?!["'])/gi)].length;
  if (unq) issues.push(unq + ' unquoted attribute value(s)');
  const ph = [...new Set([...s.matchAll(/\[\[[^\]]+\]\]/g)].map(m => m[0]))].length;
  console.log((issues.length ? 'FAIL' : 'ok  ') + '  ' + f.padEnd(24) + String(ids.length).padStart(3) + ' ids  ' + String(ph).padStart(2) + ' placeholders  ' + (s.length / 1024).toFixed(0).padStart(4) + 'kb');
  issues.forEach(i => { bad++; console.log('        ! ' + i); });
}
console.log('\n' + files.length + ' boards · ' + (bad ? bad + ' issue(s)' : 'clean'));
