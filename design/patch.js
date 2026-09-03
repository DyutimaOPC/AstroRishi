const fs = require('fs');
const { nameCards, NC_CSS, NC_REDUCED } = require('./sections.js');

const splice = (src, startMark, endMark, replacement, label) => {
  const a = src.indexOf(startMark), b = src.indexOf(endMark);
  if (a < 0 || b < 0 || b <= a) { console.error('MARKER FAIL', label, a, b); process.exit(1); }
  return src.slice(0, a) + replacement + src.slice(b);
};

const gold = '#D99A2B';
const goldCheck = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="${gold}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" style="flex:none;"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

/* ---------- name changes ---------- */
const cards = nameCards();
const cardArr = cards.split('\n        <div style="background:#221D19;').filter(Boolean)
  .map((c, i) => (i === 0 ? c : '<div style="background:#221D19;' + c));
const spanned = cardArr.map((c, i) =>
  c.replace('padding:24px 20px;', `padding:24px 20px; grid-column:span ${i < 3 ? 2 : 3};`)).join('\n        ');

const NAMES_DESKTOP = `  <!-- name changes -->
  <div style="background:#1A1714; color:#F2F1EC;">
    <div class="wrap" style="padding-top:78px; padding-bottom:78px; display:flex; flex-direction:column; gap:32px;">
      <div style="display:flex; align-items:flex-end; justify-content:space-between; gap:44px;">
        <div style="display:flex; flex-direction:column; gap:12px;">
          <span class="lbl" style="color:${gold};">A matter of public record</span>
          <h2 class="h2 disp" style="color:#F2F1EC; max-width:22ch;">You would not be the first to change a letter.</h2>
        </div>
        <p style="font-size:15.5px; color:#B8B0A6; max-width:42ch; line-height:1.6; margin:0; padding-bottom:4px;">Across Hindi, Bengali and Marathi cinema, adjusting a spelling on a numerologist's advice is common enough to be unremarkable. Every change below has been widely reported.</p>
      </div>
      <div style="display:grid; grid-template-columns:repeat(6,minmax(0,1fr)); gap:1px; background:#3A332C; border:1px solid #3A332C;">
        ${spanned}
      </div>
      <div style="border-left:2px solid ${gold}; padding:4px 0 4px 20px;">
        <p style="font-size:16px; color:#E4DED5; margin:0; line-height:1.6; max-width:76ch;">Did the change make the difference? Nobody can prove that, and we are not going to claim it. What it does show is that the question gets taken seriously by people with a great deal to lose — and that it costs you nothing to ask it about your own name.</p>
      </div>
      <div style="display:flex; align-items:center; gap:16px;">
        <div class="btn" style="background:${gold}; color:#241F1A;">Check my name free
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></div>
        <span class="mono" style="font-size:10.5px; letter-spacing:.13em; text-transform:uppercase; color:#8A8279;">Thirty seconds · no payment</span>
      </div>
    </div>
  </div>

`;

const NAMES_MOBILE = `  <!-- name changes -->
  <div style="background:#1A1714; color:#F2F1EC;">
    <div class="pad" style="padding-top:38px; padding-bottom:38px; display:flex; flex-direction:column; gap:20px;">
      <div style="display:flex; flex-direction:column; gap:9px;">
        <span class="lbl" style="color:${gold};">A matter of public record</span>
        <h2 class="disp" style="font-size:32px; line-height:1.06; margin:0;">You would not be the first to change a letter.</h2>
        <p style="font-size:14.5px; color:#B8B0A6; line-height:1.55; margin:0;">Across Hindi, Bengali and Marathi cinema, adjusting a spelling on a numerologist's advice is common enough to be unremarkable.</p>
      </div>
      <div style="display:flex; flex-direction:column; gap:1px; background:#3A332C; border:1px solid #3A332C;">
        ${cards}
      </div>
      <div style="border-left:2px solid ${gold}; padding:2px 0 2px 16px;">
        <p style="font-size:14.5px; color:#E4DED5; margin:0; line-height:1.6;">Did the change make the difference? Nobody can prove that, and we will not claim it. What it shows is that the question gets taken seriously by people with a lot to lose.</p>
      </div>
      <div class="btn" style="background:${gold}; color:#241F1A;">Check my name free
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></div>
    </div>
  </div>

`;

/* ---------- consultation upsell ---------- */
const VALUE = [
  ['Fifteen minutes, one to one', 'On the phone, at a time you pick.'],
  ['Maya reads your report first', 'You start at your situation, not at the beginning.'],
  ['A written summary afterwards', 'What you decided, sent to you on WhatsApp.'],
];

const CONSULT_DESKTOP = `  <!-- consultation upsell -->
  <div style="background:#241F1A; color:#F2F1EC; border-top:1px solid #3A332C;">
    <div class="wrap" style="padding-top:72px; padding-bottom:72px; display:grid; grid-template-columns:minmax(0,1fr) 356px; gap:64px; align-items:start;">
      <div style="display:flex; flex-direction:column; gap:22px;">
        <div style="display:flex; align-items:center; gap:12px;">
          <div style="width:34px; height:2px; background:${gold};"></div>
          <span class="lbl" style="color:${gold};">The next step · after your report</span>
        </div>
        <h2 class="h2 disp" style="color:#F2F1EC; max-width:20ch;">Ask Maya directly.</h2>
        <p style="font-size:17px; color:#C6BEB4; line-height:1.6; margin:0; max-width:52ch;">Your report tells you where things stand. A call is for the part a report cannot do — your follow-up questions, the details you did not put in a form, and a straight answer on what to do next.</p>
        <div style="display:flex; flex-direction:column; gap:1px; background:#3A332C; border:1px solid #3A332C; margin-top:4px;">
          ${VALUE.map(([t, s]) => `<div style="background:#1F1A16; padding:16px 20px; display:flex; gap:13px; align-items:flex-start;">
            ${goldCheck}
            <div style="display:flex; flex-direction:column; gap:2px;">
              <span style="font-size:15.5px; font-weight:600; color:#F2F1EC;">${t}</span>
              <span style="font-size:13.5px; color:#A79E93; line-height:1.45;">${s}</span>
            </div>
          </div>`).join('\n          ')}
        </div>
      </div>

      <div style="background:#1A1714; border:1px solid ${gold}; padding:30px; display:flex; flex-direction:column; gap:20px;">
        <div style="display:flex; gap:16px; align-items:center;">
          <div style="width:74px; height:74px; flex:none; background:#2E2822; border:1px solid #4A4038; display:flex; align-items:center; justify-content:center;">
            <span class="mono" style="font-size:8.5px; letter-spacing:.12em; text-transform:uppercase; color:#8A8279; text-align:center; line-height:1.5;"><span style="color:#8A8279; border-bottom:1px dotted ${gold};">[[ PHOTO<br>OF MAYA ]]</span></span>
          </div>
          <div style="display:flex; flex-direction:column; gap:3px;">
            <span class="disp" style="font-size:26px; line-height:1.1;">Maya</span>
            <span class="mono" style="font-size:9.5px; letter-spacing:.14em; text-transform:uppercase; color:${gold};">In-house jyotish</span>
            <span style="font-size:12.5px; color:#A79E93; line-height:1.4;"><span style="color:#8A8279; border-bottom:1px dotted ${gold};">[[ MAYA'S BACKGROUND — ONE LINE ]]</span></span>
          </div>
        </div>
        <div style="height:1px; background:#3A332C;"></div>
        <div style="display:flex; flex-direction:column; gap:6px;">
          <span class="mono" style="font-size:10px; letter-spacing:.16em; text-transform:uppercase; color:#8A8279;">15-minute personal consultation</span>
          <div style="display:flex; align-items:baseline; gap:11px;">
            <span class="mono" style="font-size:17px; color:#8A8279; text-decoration:line-through;">₹1,499</span>
            <span class="disp" style="font-size:52px; line-height:1; color:#F2F1EC;">₹999</span>
          </div>
          <span style="font-size:13px; color:#A79E93;">Report buyers only. Applied at checkout.</span>
        </div>
        <div class="btn" style="background:${gold}; color:#241F1A; font-size:16px;">Book my call with Maya
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></div>
        <div style="display:flex; align-items:center; gap:8px; justify-content:center;">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8A8279" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex:none;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          <span class="mono" style="font-size:9.5px; letter-spacing:.12em; text-transform:uppercase; color:#8A8279;">Maya takes <span style="color:#8A8279; border-bottom:1px dotted ${gold};">[[ n ]]</span> calls a week</span>
        </div>
      </div>
    </div>
  </div>

`;

const CONSULT_MOBILE = `  <!-- consultation upsell -->
  <div style="background:#241F1A; color:#F2F1EC;">
    <div class="pad" style="padding-top:36px; padding-bottom:36px; display:flex; flex-direction:column; gap:18px;">
      <div style="display:flex; flex-direction:column; gap:9px;">
        <span class="lbl" style="color:${gold};">The next step · after your report</span>
        <h2 class="disp" style="font-size:32px; line-height:1.06; margin:0;">Ask Maya directly.</h2>
        <p style="font-size:15px; color:#C6BEB4; line-height:1.55; margin:0;">Your report tells you where things stand. A call is for the part a report cannot do — your follow-up questions and a straight answer on what to do next.</p>
      </div>
      <div style="display:flex; flex-direction:column; gap:1px; background:#3A332C; border:1px solid #3A332C;">
        ${VALUE.map(([t, s]) => `<div style="background:#1F1A16; padding:14px 16px; display:flex; gap:11px; align-items:flex-start;">
          ${goldCheck}
          <div style="display:flex; flex-direction:column; gap:1px;">
            <span style="font-size:14.5px; font-weight:600;">${t}</span>
            <span style="font-size:13px; color:#A79E93; line-height:1.45;">${s}</span>
          </div>
        </div>`).join('\n        ')}
      </div>
      <div style="background:#1A1714; border:1px solid ${gold}; padding:20px; display:flex; flex-direction:column; gap:16px;">
        <div style="display:flex; gap:14px; align-items:center;">
          <div style="width:64px; height:64px; flex:none; background:#2E2822; border:1px solid #4A4038; display:flex; align-items:center; justify-content:center;">
            <span class="mono" style="font-size:7.5px; letter-spacing:.12em; text-transform:uppercase; color:#8A8279; text-align:center; line-height:1.5;"><span style="color:#8A8279; border-bottom:1px dotted ${gold};">[[ MAYA<br>PHOTO ]]</span></span>
          </div>
          <div style="display:flex; flex-direction:column; gap:2px;">
            <span class="disp" style="font-size:23px; line-height:1.1;">Maya</span>
            <span class="mono" style="font-size:9px; letter-spacing:.14em; text-transform:uppercase; color:${gold};">In-house jyotish</span>
            <span style="font-size:12px; color:#A79E93; line-height:1.4;"><span style="color:#8A8279; border-bottom:1px dotted ${gold};">[[ BACKGROUND — ONE LINE ]]</span></span>
          </div>
        </div>
        <div style="height:1px; background:#3A332C;"></div>
        <div style="display:flex; align-items:flex-end; justify-content:space-between; gap:12px;">
          <div style="display:flex; flex-direction:column; gap:3px;">
            <span class="mono" style="font-size:9px; letter-spacing:.14em; text-transform:uppercase; color:#8A8279;">15-minute call</span>
            <div style="display:flex; align-items:baseline; gap:8px;">
              <span class="mono" style="font-size:14px; color:#8A8279; text-decoration:line-through;">₹1,499</span>
              <span class="disp" style="font-size:40px; line-height:1;">₹999</span>
            </div>
          </div>
          <span class="mono" style="font-size:9px; letter-spacing:.12em; text-transform:uppercase; color:#8A8279; text-align:right; line-height:1.5;">Maya takes<br><span style="color:#8A8279; border-bottom:1px dotted ${gold};">[[ n ]]</span> calls a week</span>
        </div>
        <div class="btn" style="background:${gold}; color:#241F1A;">Book my call with Maya
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></div>
      </div>
    </div>
  </div>

`;
module.exports = { NAMES_DESKTOP, NAMES_MOBILE, CONSULT_DESKTOP, CONSULT_MOBILE, splice, NC_CSS, NC_REDUCED, gold };
