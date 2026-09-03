const fs = require('fs');
const covers = JSON.parse(fs.readFileSync('covers.json', 'utf8'));

const REVIEWS = [
  ['A','Ananya R.','Pune','I had spelled my name the same way for 34 years. The report gave me two options and explained exactly what changed with each. Went with the second.'],
  ['K','Karthik S.','Chennai','Bought it for the career section. The job-versus-business verdict was blunter than I expected, which is what I needed.'],
  ['M','Meera J.','Jaipur','Detailed and clearly written. My mother read the whole thing too and understood every part of it.'],
  ['R','Rohit B.','Indore','Was expecting two vague paragraphs. Got a proper report with my own numbers actually worked out and explained.'],
  ['S','Sneha K.','Hyderabad','The 30-day plan at the end is the part I keep going back to. Everything else was interesting; that part was useful.'],
  ['A','Aditya M.','Lucknow','Came through on WhatsApp quickly. Asked a follow-up question and someone replied the same evening.'],
  ['P','Priya N.','Kochi','Honestly bought it out of curiosity. The Lo Shu grid section explained a pattern I had wondered about for years.'],
  ['V','Vikram T.','Ahmedabad','Straightforward and worth the money. No pressure to buy anything else while reading it.'],
];

const PRODUCTS = [
  { k:'name',  title:'Name Correction',      promise:'Is your spelling helping you or quietly working against you? Find out, and see what to change.',
    pages:'18+ pages', badge:'Most chosen', was:'₹999', now:'₹399',
    inc:['Name vibration score','Corrected spelling options','Lucky number, colour and day','Lo Shu grid and remedies'] },
  { k:'numer', title:'Complete Numerology',  promise:'Why do the same patterns keep repeating? Your core numbers, read together, year by year.',
    pages:null, badge:null, was:'₹999', now:'₹399',
    inc:['Life path, destiny and soul urge','Lo Shu grid and numeroscope','Strengths and challenges','Year-wise personal forecast'] },
  { k:'career',title:'Career &amp; Money',   promise:'Stay in the job or start something of your own? A straight verdict, and ninety days of steps.',
    pages:null, badge:null, was:'₹999', now:'₹399',
    inc:['Career strength score','Job versus business verdict','Growth openings and risks','90-day action plan'] },
  { k:'rel',   title:'Relationship Clarity', promise:'Is it a rough patch or the real thing? What is going on, and the next conversation to have.',
    pages:null, badge:null, was:'₹999', now:'₹399',
    inc:['Relationship clarity score','Where the friction sits','A conversation guide','30-day plan'] },
  { k:'kundli',title:'Premium Kundli',       promise:'What does your birth chart actually say, and which periods ahead are worth planning around?',
    pages:null, badge:'Most detailed', was:'₹1,499', now:'₹499', dark:true,
    inc:['Birth chart and planetary positions','House-by-house reading','Doshas and their remedies','Dasha periods and what they bring'] },
];

const star = '<svg width="13" height="13" viewBox="0 0 24 24" fill="#D99A2B"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
const arrow = c => `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;
const check = c => `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" class="tick"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

function reviewCards(w) {
  return REVIEWS.map(([ini, name, city, text]) => `
<div class="rev">
  <div style="display:flex; gap:3px;">${star.repeat(5)}</div>
  <p style="font-size:${w}px; line-height:1.55; color:#1A1714; margin:0;">${text}</p>
  <div style="display:flex; align-items:center; gap:10px; margin-top:auto; padding-top:4px;">
    <div style="width:30px; height:30px; flex:none; background:#F7EDEB; border:1px solid #E3CBC6; display:flex; align-items:center; justify-content:center;"><span class="disp" style="font-size:14px; color:#BE3A2B;">${ini}</span></div>
    <div style="display:flex; flex-direction:column;">
      <span style="font-size:13.5px; font-weight:600;">${name}</span>
      <span class="mono" style="font-size:9.5px; letter-spacing:.12em; text-transform:uppercase; color:#8A8279;">${city} · verified purchase</span>
    </div>
  </div>
</div>`).join('');
}

function mobileCard(p) {
  const d = p.dark;
  const ink = d ? '#F2F1EC' : '#1A1714', sub = d ? '#B8B0A6' : '#57514A';
  const acc = d ? '#D99A2B' : '#2F6B4F', rule = d ? '#3A332C' : '#D5D1C6';
  const pagesChip = p.pages
    ? `<span class="mono" style="background:${d?'#2E2822':'#E9E7DF'}; color:${d?'#B8B0A6':'#57514A'}; padding:4px 7px; font-size:8.5px; letter-spacing:.13em; text-transform:uppercase;">${p.pages}</span>`
    : `<span class="mono" style="background:${d?'#2E2822':'#E9E7DF'}; color:${d?'#B8B0A6':'#57514A'}; padding:4px 7px; font-size:8.5px; letter-spacing:.13em; text-transform:uppercase;"><span style="color:#8A8279; border-bottom:1px dotted ${d?'#D99A2B':'#BE3A2B'};">[[ n ]]</span>+ pages</span>`;
  const badge = p.badge
    ? `<span class="mono" style="border:1px solid ${d?'#D99A2B':'#BE3A2B'}; color:${d?'#D99A2B':'#BE3A2B'}; padding:4px 7px; font-size:8.5px; letter-spacing:.13em; text-transform:uppercase;">${p.badge}</span>` : '';
  return `
    <div class="card"${d ? ' style="background:#1A1714; color:#F2F1EC; padding:22px 20px; display:flex; flex-direction:column; gap:15px;"' : ''}>
      <div style="display:flex; gap:16px; align-items:flex-start;">
        <div class="bookshadow" style="width:104px;">${covers[p.k].replace('width="150" height="210"', 'width="104" height="146"')}</div>
        <div style="display:flex; flex-direction:column; gap:8px; flex:1; min-width:0;">
          <div style="display:flex; gap:6px; flex-wrap:wrap;">${badge}${pagesChip}</div>
          <h3 class="disp" style="font-size:24px; line-height:1.06; margin:0; color:${ink};">${p.title}</h3>
          <p style="font-size:14px; color:${sub}; margin:0; line-height:1.45;">${p.promise}</p>
        </div>
      </div>
      <div style="height:1px; background:${rule};"></div>
      <div style="display:flex; flex-direction:column; gap:7px;">
        ${p.inc.map(i => `<div class="inc">${check(acc)}${i}</div>`).join('\n        ')}
      </div>
      <div style="display:flex; align-items:center; justify-content:space-between; gap:14px;">
        <div style="display:flex; align-items:baseline; gap:7px;">
          <span class="mono" style="font-size:13px; color:#8A8279; text-decoration:line-through;">${p.was}</span>
          <span class="disp" style="font-size:32px; line-height:1; color:${ink};">${p.now}</span>
        </div>
        <div class="btn" style="flex:1; max-width:170px;${d ? ' background:#D99A2B; color:#241F1A;' : ''}">Get report ${arrow('currentColor')}</div>
      </div>
    </div>`;
}

function build(tpl, out, revSize) {
  let html = fs.readFileSync(tpl, 'utf8');
  for (const [k, v] of Object.entries(covers)) html = html.split(`@@COVER:${k}@@`).join(v);
  html = html.split('@@CARDS@@').join(PRODUCTS.map(mobileCard).join('\n'));
  html = html.split('@@REVIEWS@@').join(reviewCards(revSize));
  const left = html.match(/@@[A-Za-z:]+@@/);
  if (left) { console.error('UNRESOLVED', left[0]); process.exit(1); }
  const ids = [...html.matchAll(/ id="([^"]+)"/g)].map(m => m[1]);
  const dup = ids.filter((v, i) => ids.indexOf(v) !== i);
  if (dup.length) { console.error('DUPLICATE SVG IDS in ' + out + ':', [...new Set(dup)]); process.exit(1); }
  fs.writeFileSync(out, html);
  console.log(out.padEnd(20), html.length, 'bytes ·', ids.length, 'unique svg ids');
}

build('Main.tpl.html', 'Main.dc.html', 14.5);
build('Mobile.tpl.html', 'HomeMobile.dc.html', 13.5);
build('StyleTile.tpl.html', 'StyleTile.dc.html', 14);
