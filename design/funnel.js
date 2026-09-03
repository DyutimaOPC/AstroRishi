const fs = require('fs');
const C = require('./common.js');
const covers = JSON.parse(fs.readFileSync('covers.json', 'utf8'));

const M = `
    .pad { padding-left:20px; padding-right:20px; }
    .btn { min-height:54px; box-sizing:border-box; width:100%; }
    .field { border:1px solid #D5D1C6; background:#fff; padding:14px; font-size:16px; color:#8A8279; min-height:52px; box-sizing:border-box; }
    .opt { border:1px solid #D5D1C6; background:#FFFDF8; padding:15px 16px; display:flex; align-items:center; gap:13px; min-height:56px; box-sizing:border-box; font-size:16px; }
    .opt.on { border-color:#BE3A2B; border-width:1.5px; background:#F7EDEB; font-weight:600; }
    .dot { width:19px; height:19px; border:1.5px solid #C2BCB1; border-radius:50%; flex:none; }
    .dot.on { border-color:#BE3A2B; border-width:5.5px; }`;

const hdr = (title, sub) => `
  <div class="pad" style="display:flex; align-items:center; justify-content:space-between; padding-top:15px; padding-bottom:15px; border-bottom:1px solid #D5D1C6; background:#F2F1EC;">
    <div style="display:flex; align-items:baseline; gap:8px;">
      <div class="disp" style="font-size:23px; line-height:1;">JAANO</div>
      <div class="disp" style="font-size:11px; color:#8A8279;">जानो</div>
    </div>
    <span class="mono" style="font-size:9.5px; letter-spacing:.14em; text-transform:uppercase; color:#8A8279;">${sub}</span>
  </div>`;

/* ---------------- 1. free tool result ---------------- */
fs.writeFileSync('FreeResult.dc.html', C.head(M + `
    .blur { filter:blur(5px); user-select:none; }`) + `
<div style="background:#F2F1EC; padding-bottom:20px;">
  ${hdr('', 'Free result')}
  <div class="pad" style="padding-top:26px; padding-bottom:26px; display:flex; flex-direction:column; gap:22px;">

    <div style="display:flex; flex-direction:column; gap:5px;">
      <span class="lbl" style="color:#BE3A2B;">Anand Sharma · 23 Aug 1992</span>
      <h1 class="disp" style="font-size:34px; line-height:1.06; margin:0;">Your name and your birth date do not agree.</h1>
    </div>

    <div style="display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:1px; background:#D5D1C6; border:1px solid #D5D1C6;">
      <div style="background:#FFFDF8; padding:20px 18px; display:flex; flex-direction:column; gap:3px;">
        <span class="lbl">Name number</span>
        <span class="disp" style="font-size:46px; line-height:1;">5</span>
        <span style="font-size:12.5px; color:#57514A;">Restless · quick to start</span>
      </div>
      <div style="background:#FFFDF8; padding:20px 18px; display:flex; flex-direction:column; gap:3px;">
        <span class="lbl">Life path</span>
        <span class="disp" style="font-size:46px; line-height:1;">7</span>
        <span style="font-size:12.5px; color:#57514A;">Deep · needs solitude</span>
      </div>
    </div>

    <div style="background:#FFFDF8; border:1px solid #D5D1C6; padding:20px 18px; display:flex; flex-direction:column; gap:12px;">
      <div style="display:flex; align-items:baseline; justify-content:space-between;">
        <span class="lbl">Fit score</span>
        <span class="mono" style="font-size:12px; color:#BE3A2B; letter-spacing:.1em;">PARTIAL FIT</span>
      </div>
      <div style="display:flex; align-items:baseline; gap:10px;">
        <span class="disp" style="font-size:56px; line-height:.9;">62</span><span class="mono" style="font-size:13px; color:#8A8279;">/ 100</span>
      </div>
      <div style="height:8px; background:#E9E7DF;"><div style="width:62%; height:100%; background:#BE3A2B;"></div></div>
      <p style="font-size:14.5px; line-height:1.55; margin:0; color:#57514A;">A 5 name wants movement and variety. A 7 life path wants depth and quiet. Both are strong numbers — they just do not pull the same way, which usually shows up as effort that does not convert.</p>
    </div>

    <div style="background:#1A1714; color:#F2F1EC; padding:20px 18px; display:flex; flex-direction:column; gap:9px;">
      <span class="lbl" style="color:#D99A2B;">One thing worth knowing</span>
      <p style="font-size:15.5px; line-height:1.55; margin:0;">Your birth date puts a <b>2</b> in your grid twice over. That doubles your read on people — you usually know how a room feels before anyone says anything. It also means you take other people's moods on as your own more than you should.</p>
    </div>

    <!-- locked -->
    <div style="border:1px solid #D5D1C6; background:#FFFDF8; padding:20px 18px; display:flex; flex-direction:column; gap:14px; position:relative;">
      <div style="display:flex; flex-direction:column; gap:11px;">
        <span class="lbl">Your corrected spellings</span>
        <div class="blur" style="display:flex; flex-direction:column; gap:1px; background:#D5D1C6; border:1px solid #D5D1C6;">
          ${[['Annand Sharma','88'],['Anandh Sharma','84'],['Aanand Sharma','76']].map(([n, s]) =>
            `<div style="background:#FFFDF8; padding:11px 13px; display:flex; justify-content:space-between;"><span class="disp" style="font-size:18px;">${n}</span><span class="mono" style="font-size:11px; color:#BE3A2B;">${s}</span></div>`).join('')}
        </div>
      </div>
      <div style="display:flex; align-items:center; gap:9px; justify-content:center;">
        ${C.lock('#8A8279', 14)}<span style="font-size:13px; color:#8A8279;">Three scored spellings in the full report</span>
      </div>
    </div>

    <div style="background:#F7EDEB; border:1px solid #BE3A2B; padding:20px 18px; display:flex; flex-direction:column; gap:15px;">
      <div style="display:flex; gap:15px; align-items:flex-start;">
        <div style="filter:drop-shadow(0 2px 3px rgba(26,23,20,.22)) drop-shadow(0 10px 18px rgba(26,23,20,.28)); flex:none;">${covers.name.replace('width="150" height="210"', 'width="84" height="118"')}</div>
        <div style="display:flex; flex-direction:column; gap:6px;">
          <span class="disp" style="font-size:23px; line-height:1.08;">Name Correction Report</span>
          <span style="font-size:14px; color:#57514A; line-height:1.45;">Eighteen pages: your full grid, three scored spellings, lucky elements and a plan.</span>
        </div>
      </div>
      <div style="display:flex; align-items:center; justify-content:space-between; gap:14px;">
        <div style="display:flex; align-items:baseline; gap:8px;">
          <span class="mono" style="font-size:14px; color:#8A8279; text-decoration:line-through;">₹999</span>
          <span class="disp" style="font-size:38px; line-height:1;">₹399</span>
        </div>
        <div class="btn" style="max-width:186px; display:flex; align-items:center; justify-content:center; gap:9px; background:#BE3A2B; color:#F9F1EF; font-weight:600; font-size:16px;">Get my report ${C.arrow(16)}</div>
      </div>
    </div>

    <p style="font-size:12px; color:#8A8279; line-height:1.55; margin:0; text-align:center;">This free result is a summary. It is interpretive guidance, not a prediction.</p>
  </div>
</div>
` + C.foot);

/* ---------------- 2. questionnaire ---------------- */
const OPTS = ['Career and growth', 'Money and stability', 'Marriage or relationship', 'Health and energy', 'Peace of mind', 'Something else'];
fs.writeFileSync('Questionnaire.dc.html', C.head(M) + `
<div style="background:#F2F1EC; height:844px; display:flex; flex-direction:column;">
  ${hdr('', 'Name Correction')}

  <div class="pad" style="padding-top:18px; padding-bottom:18px; display:flex; flex-direction:column; gap:10px; border-bottom:1px solid #D5D1C6;">
    <div style="display:flex; align-items:center; justify-content:space-between;">
      <span class="mono" style="font-size:10px; letter-spacing:.16em; text-transform:uppercase; color:#8A8279;">Step 3 of 6</span>
      <span class="mono" style="font-size:10px; letter-spacing:.16em; text-transform:uppercase; color:#8A8279;">About 3 min left</span>
    </div>
    <div style="display:flex; gap:4px;">
      ${[1,1,1,0,0,0].map(on => `<div style="flex:1; height:4px; background:${on ? '#BE3A2B' : '#DDD9CF'};"></div>`).join('')}
    </div>
  </div>

  <div class="pad" style="padding-top:32px; display:flex; flex-direction:column; gap:24px; flex:1;">
    <div style="display:flex; flex-direction:column; gap:8px;">
      <h1 class="disp" style="font-size:32px; line-height:1.08; margin:0;">What matters most to you right now?</h1>
      <p style="font-size:14.5px; color:#57514A; margin:0; line-height:1.5;">This shapes which parts of your report go deepest. Pick one.</p>
    </div>
    <div style="display:flex; flex-direction:column; gap:9px;">
      ${OPTS.map((o, i) => `<div class="opt${i === 0 ? ' on' : ''}"><span class="dot${i === 0 ? ' on' : ''}"></span>${o}</div>`).join('\n      ')}
    </div>
  </div>

  <div class="pad" style="padding-top:14px; padding-bottom:16px; border-top:1px solid #D5D1C6; background:#FFFDF8; display:flex; gap:11px; align-items:center;">
    <div style="border:1.5px solid #1A1714; width:56px; min-height:54px; display:flex; align-items:center; justify-content:center; flex:none;">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A1714" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
    </div>
    <div class="btn" style="display:flex; align-items:center; justify-content:center; gap:9px; background:#BE3A2B; color:#F9F1EF; font-weight:600; font-size:16.5px;">Continue ${C.arrow(17)}</div>
  </div>
</div>
` + C.foot);

/* ---------------- 3. checkout ---------------- */
fs.writeFileSync('Checkout.dc.html', C.head(M) + `
<div style="background:#F2F1EC; padding-bottom:20px;">
  ${hdr('', 'Secure checkout')}
  <div class="pad" style="padding-top:24px; padding-bottom:24px; display:flex; flex-direction:column; gap:20px;">

    <h1 class="disp" style="font-size:32px; line-height:1.06; margin:0;">Your order</h1>

    <div style="background:#FFFDF8; border:1px solid #D5D1C6; padding:18px; display:flex; gap:15px; align-items:flex-start;">
      <div style="filter:drop-shadow(0 2px 3px rgba(26,23,20,.2)) drop-shadow(0 10px 16px rgba(26,23,20,.26)); flex:none;">${covers.name.replace('width="150" height="210"', 'width="72" height="101"')}</div>
      <div style="display:flex; flex-direction:column; gap:5px; flex:1;">
        <span class="disp" style="font-size:21px; line-height:1.1;">Name Correction Report</span>
        <span style="font-size:13.5px; color:#57514A; line-height:1.45;">18+ pages · personalised PDF · delivered on WhatsApp and email</span>
        <span class="mono" style="font-size:10px; letter-spacing:.12em; text-transform:uppercase; color:#8A8279; margin-top:2px;">For Anand Sharma · 23 Aug 1992</span>
      </div>
    </div>

    <div style="background:#FFFDF8; border:1px solid #D5D1C6; padding:18px; display:flex; flex-direction:column; gap:11px;">
      <div style="display:flex; justify-content:space-between; font-size:15px;"><span style="color:#57514A;">Report price</span><span class="mono">₹999</span></div>
      <div style="display:flex; justify-content:space-between; font-size:15px;"><span style="color:#2F6B4F;">Launch offer (60% off)</span><span class="mono" style="color:#2F6B4F;">− ₹600</span></div>
      <div style="height:1px; background:#E3E0D8;"></div>
      <div style="display:flex; justify-content:space-between; align-items:baseline;">
        <span style="font-size:16px; font-weight:600;">Total payable</span>
        <span class="disp" style="font-size:36px; line-height:1;">₹399</span>
      </div>
      <span class="mono" style="font-size:10px; letter-spacing:.1em; text-transform:uppercase; color:#8A8279;">Inclusive of all taxes</span>
    </div>

    <div style="display:flex; flex-direction:column; gap:12px;">
      <span class="lbl">Where should we send it?</span>
      <div style="display:flex; flex-direction:column; gap:6px;">
        <span class="mono" style="font-size:9.5px; letter-spacing:.16em; text-transform:uppercase; color:#8A8279;">WhatsApp number</span>
        <div class="field" style="color:#1A1714;">+91 98XXX XXXXX</div>
      </div>
      <div style="display:flex; flex-direction:column; gap:6px;">
        <span class="mono" style="font-size:9.5px; letter-spacing:.16em; text-transform:uppercase; color:#8A8279;">Email</span>
        <div class="field" style="color:#1A1714;">anand@example.com</div>
      </div>
    </div>

    <div style="background:#F7EDEB; border:1px dashed #BE3A2B; padding:15px 16px; display:flex; align-items:center; gap:13px;">
      <span class="dot" style="border-color:#BE3A2B; border-width:5.5px;"></span>
      <div style="display:flex; flex-direction:column; gap:2px; flex:1;">
        <span style="font-size:14.5px; font-weight:600;">Add Complete Numerology — ₹199</span>
        <span style="font-size:12.5px; color:#57514A; line-height:1.4;">Normally ₹399. Half price when bought together.</span>
      </div>
    </div>

    <div class="btn" style="display:flex; align-items:center; justify-content:center; gap:10px; background:#BE3A2B; color:#F9F1EF; font-weight:600; font-size:17px;">Pay ₹598 securely ${C.arrow(17)}</div>

    <div style="display:flex; flex-direction:column; gap:9px; align-items:center;">
      <div style="display:flex; align-items:center; gap:8px;">${C.lock('#8A8279', 14)}<span style="font-size:12.5px; color:#8A8279;">Payment handled by Razorpay. We never see your card.</span></div>
      <div style="display:flex; gap:5px; flex-wrap:wrap; justify-content:center;">
        ${['UPI','Cards','Net banking','Wallets'].map(p => `<span class="mono" style="border:1px solid #D5D1C6; padding:4px 8px; font-size:9.5px; letter-spacing:.08em; text-transform:uppercase; color:#8A8279;">${p}</span>`).join('')}
      </div>
    </div>
  </div>
</div>
` + C.foot);

/* ---------------- 4. thank you ---------------- */
fs.writeFileSync('ThankYou.dc.html', C.head(M) + `
<div style="background:#F2F1EC; padding-bottom:20px;">
  ${hdr('', 'Order confirmed')}
  <div class="pad" style="padding-top:30px; padding-bottom:26px; display:flex; flex-direction:column; gap:22px;">

    <div style="display:flex; flex-direction:column; gap:14px; align-items:flex-start;">
      <div style="width:52px; height:52px; background:#2F6B4F; display:flex; align-items:center; justify-content:center;">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#F2F1EC" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
      </div>
      <h1 class="disp" style="font-size:34px; line-height:1.06; margin:0;">Payment received. Your report is being prepared.</h1>
      <div style="display:flex; flex-direction:column; gap:3px;">
        <span class="mono" style="font-size:10px; letter-spacing:.14em; text-transform:uppercase; color:#8A8279;">Order</span>
        <span class="mono" style="font-size:15px;">JN-2026-0417</span>
      </div>
    </div>

    <div style="background:#FFFDF8; border:1px solid #D5D1C6; padding:20px 18px; display:flex; flex-direction:column; gap:2px;">
      <span class="lbl" style="margin-bottom:8px;">What happens now</span>
      ${[['Your report is being written','Worked out from the details you gave us.', true],
         ['Checked before it is sent','A person reads it through first.', false],
         ['Delivered to you','On WhatsApp and email, within [[ 24h ]].', false]]
        .map(([t, d, done], i, a) => `<div style="display:grid; grid-template-columns:26px minmax(0,1fr); gap:13px; padding:12px 0; ${i < a.length - 1 ? 'border-bottom:1px solid #E9E7DF;' : ''}">
        <div style="width:22px; height:22px; border:1.5px solid ${done ? '#2F6B4F' : '#C2BCB1'}; background:${done ? '#2F6B4F' : 'transparent'}; display:flex; align-items:center; justify-content:center;">
          ${done ? '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FFFDF8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>' : `<span class="mono" style="font-size:10px; color:#C2BCB1;">${i + 1}</span>`}
        </div>
        <div style="display:flex; flex-direction:column; gap:2px;">
          <span style="font-size:15.5px; font-weight:600; color:${done ? '#1A1714' : '#57514A'};">${t}</span>
          <span style="font-size:13.5px; color:#8A8279; line-height:1.45;">${d.replace('[[ 24h ]]', '<span class="ph">[[ 24h ]]</span>')}</span>
        </div>
      </div>`).join('\n      ')}
    </div>

    <div style="background:#1F7A45; color:#F2F1EC; padding:17px 18px; display:flex; align-items:center; gap:13px;">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="#F2F1EC" style="flex:none;"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.9-4.45 9.9-9.91C21.95 6.45 17.5 2 12.04 2zm5.8 14.16c-.24.68-1.2 1.26-1.96 1.42-.52.11-1.2.2-3.5-.75-2.94-1.22-4.83-4.2-4.98-4.4-.14-.2-1.18-1.57-1.18-3s.75-2.13 1.02-2.42c.27-.29.59-.36.78-.36.2 0 .39 0 .56.01.18.01.42-.07.66.5.24.58.82 2 .89 2.15.07.14.12.31.02.5-.09.2-.14.32-.28.49-.14.17-.3.37-.42.5-.14.14-.29.29-.12.57.16.29.73 1.2 1.56 1.95 1.08.96 1.98 1.26 2.27 1.4.29.14.45.12.62-.07.17-.2.71-.83.9-1.11.19-.29.38-.24.64-.14.26.09 1.67.79 1.96.93.29.14.48.22.55.34.07.12.07.7-.17 1.38z"/></svg>
      <div style="display:flex; flex-direction:column; gap:1px;">
        <span style="font-size:15px; font-weight:600;">Save our number</span>
        <span style="font-size:13px; opacity:.9;">So your report does not land in spam.</span>
      </div>
    </div>

    <div style="background:#241F1A; color:#F2F1EC; padding:22px 18px; display:flex; flex-direction:column; gap:14px;">
      <div style="display:flex; gap:14px; align-items:center;">
        <div style="width:58px; height:58px; flex:none; background:#2E2822; border:1px solid #4A4038; display:flex; align-items:center; justify-content:center;">
          <span class="mono" style="font-size:7.5px; letter-spacing:.1em; text-transform:uppercase; color:#8A8279;"><span style="border-bottom:1px dotted #D99A2B;">[[ PHOTO ]]</span></span>
        </div>
        <div style="display:flex; flex-direction:column; gap:3px;">
          <span class="lbl" style="color:#D99A2B;">While you wait</span>
          <span class="disp" style="font-size:24px; line-height:1.08;">Ask Pandit Maya.</span>
        </div>
      </div>
      <p style="font-size:14px; color:#B8B0A6; line-height:1.5; margin:0;">Fifteen minutes on the phone once your report lands, to go through what to actually do with it.</p>
      <div style="display:flex; align-items:center; justify-content:space-between; gap:14px;">
        <div style="display:flex; align-items:baseline; gap:8px;">
          <span class="mono" style="font-size:13.5px; color:#8A8279; text-decoration:line-through;">₹1,499</span>
          <span class="disp" style="font-size:32px; line-height:1;">₹999</span>
        </div>
        <div class="btn" style="max-width:170px; display:flex; align-items:center; justify-content:center; gap:8px; background:#D99A2B; color:#241F1A; font-weight:600; font-size:15px;">Add the call</div>
      </div>
    </div>
  </div>
</div>
` + C.foot);

for (const f of ['FreeResult', 'Questionnaire', 'Checkout', 'ThankYou'])
  console.log(f.padEnd(15), fs.statSync(f + '.dc.html').size, 'bytes');
