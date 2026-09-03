const fs = require('fs');
const C = require('./common.js');
const covers = JSON.parse(fs.readFileSync('covers.json', 'utf8'));
const { nameCards, NC_CSS, GOLD } = require('./sections.js');

const DISCOVER = [
  ['Your score', 'A number out of 100 for how well your current spelling sits with your birth date.', 'M12 2a10 10 0 1 0 10 10h-10z'],
  ['Your options', 'Three corrected spellings, each scored, so the choice is yours and not ours.', ''],
  ['Your analysis', 'Letter by letter, what your name adds up to and what that number behaves like.', ''],
  ['Your grid', 'The Lo Shu square from your birth date, with every plane read out.', ''],
  ['Your plan', 'What to change first, what to leave alone, and how long to give it.', ''],
];

const CONTENTS = [
  ['At a glance — your four numbers', 3],
  ['How your name reads today', 4],
  ['Letter-by-letter Chaldean breakdown', 5],
  ['Your name against your birth date', 7],
  ['Where the friction shows up', 8],
  ['Your Lo Shu grid', 9],
  ['The six planes, read one by one', 10],
  ['What your grid is missing', 12],
  ['Your corrected name options, scored', 13],
  ['What changes with the recommended spelling', 15],
  ['Your lucky numbers, colours and days', 16],
  ['Remedies and what to do first', 17],
  ['Making the change stick', 18],
];

const WHY = [
  ['Personal, not generic', 'Every number is worked out from your name and your birth date. Nothing is picked off a shelf.'],
  ['Plainly written', 'No jargon you have to look up. Readable in one sitting, in English or Hindi.'],
  ['Properly presented', 'Laid out as a real report with tables and charts, not a wall of text.'],
  ['Private by default', 'Your details are used for your report and nothing else, ever.'],
];

const FAQ = [
  ['What information do you need from me?', 'Your full name as you write it today, your date of birth, and how to reach you. Nothing else.'],
  ['How long does the report take?', null], ['Is the report really written for me?', null],
  ['Do I have to change my name legally?', null], ['How will I receive it?', null],
  ['Who can see my information?', null], ['What is your refund policy?', null],
  ['What does this report represent — and what does it not?', null],
];

const REVIEWS = [
  ['A','Ananya R.','Pune','I had spelled my name the same way for 34 years. The report gave me two options and explained exactly what changed with each. Went with the second.'],
  ['R','Rohit B.','Indore','Was expecting two vague paragraphs. Got a proper report with my own numbers actually worked out and explained.'],
  ['M','Meera J.','Jaipur','Detailed and clearly written. My mother read the whole thing too and understood every part of it.'],
  ['P','Priya N.','Kochi','Honestly bought it out of curiosity. The Lo Shu grid section explained a pattern I had wondered about for years.'],
  ['A','Aditya M.','Lucknow','Came through on WhatsApp quickly. Asked a follow-up question and someone replied the same evening.'],
  ['V','Vikram T.','Ahmedabad','Straightforward and worth the money. No pressure to buy anything else while reading it.'],
];
const revCards = REVIEWS.map(([i, n, c, t]) => `<div class="rev">
      <div style="display:flex; gap:3px;">${C.star().repeat(5)}</div>
      <p style="font-size:14.5px; line-height:1.55; margin:0;">${t}</p>
      <div style="display:flex; align-items:center; gap:10px; margin-top:auto; padding-top:4px;">
        <div style="width:30px; height:30px; flex:none; background:#F7EDEB; border:1px solid #E3CBC6; display:flex; align-items:center; justify-content:center;"><span class="disp" style="font-size:14px; color:#BE3A2B;">${i}</span></div>
        <div style="display:flex; flex-direction:column;">
          <span style="font-size:13.5px; font-weight:600;">${n}</span>
          <span class="mono" style="font-size:9.5px; letter-spacing:.12em; text-transform:uppercase; color:#8A8279;">${c} · verified purchase</span>
        </div>
      </div>
    </div>`).join('');

const EXTRA = `
    .wrap { max-width:1200px; margin:0 auto; padding:0 60px; }
    .h2 { font-size:42px; line-height:1.06; margin:0; }
    .bookshadow { filter:drop-shadow(0 3px 5px rgba(26,23,20,.24)) drop-shadow(0 22px 40px rgba(26,23,20,.34)); }
    .marquee { display:flex; gap:18px; width:max-content; animation:slide 42s linear infinite; }
    @keyframes slide { to { transform:translateX(-50%); } }
    .rev { background:#FFFDF8; border:1px solid #D5D1C6; padding:22px; width:318px; display:flex; flex-direction:column; gap:12px; box-sizing:border-box; }
${NC_CSS}
    @media (prefers-reduced-motion: reduce) {
      .marquee,.nc-before,.nc-strike,.nc-after,.nc-rule,.nc-arrow { animation:none !important; }
      .nc-strike,.nc-rule { transform:scaleX(1); } .nc-before { opacity:.42; }
    }`;

const html = C.head(EXTRA) + `
<div>
  <div style="background:#1A1714; color:#E9E7DF; padding:11px 0;">
    <div class="wrap" style="display:flex; align-items:center; justify-content:center; gap:14px;">
      <span class="mono" style="font-size:11px; letter-spacing:.18em; text-transform:uppercase; color:${GOLD};">Launch offer</span>
      <span style="font-size:13.5px;">60% off — ends <span class="ph">[[ OFFER_END_DATE ]]</span></span>
    </div>
  </div>
  <div style="background:#F2F1EC; border-bottom:1px solid #D5D1C6;">
    <div class="wrap" style="display:flex; align-items:center; justify-content:space-between; padding:22px 60px;">
      <div style="display:flex; align-items:baseline; gap:11px;">
        <div class="disp" style="font-size:30px; line-height:1;">JAANO</div>
        <div class="disp" style="font-size:12px; color:#8A8279;">जानो</div>
      </div>
      <div style="display:flex; gap:34px; font-size:15px; font-weight:500;">
        <span style="color:#57514A;">Home</span><span style="color:#1A1714;">Reports</span>
        <span style="color:#57514A;">How it works</span><span style="color:#57514A;">Sample reports</span><span style="color:#57514A;">FAQ</span>
      </div>
      <div class="btn" style="padding:13px 22px; font-size:14.5px;">Get your report</div>
    </div>
  </div>

  <!-- hero -->
  <div style="background:repeating-linear-gradient(to bottom, transparent 0 31px, #E3E0D6 31px 32px), #F2F1EC; border-bottom:1px solid #D5D1C6;">
    <div class="wrap" style="display:grid; grid-template-columns:minmax(0,1fr) 300px; gap:64px; padding-top:60px; padding-bottom:60px; align-items:center;">
      <div style="display:flex; flex-direction:column; gap:22px;">
        <div style="display:flex; align-items:center; gap:11px;">
          <span class="mono" style="font-size:10px; letter-spacing:.2em; text-transform:uppercase; color:#8A8279;">Reports</span>
          <span style="color:#C2BCB1;">/</span>
          <span class="mono" style="font-size:10px; letter-spacing:.2em; text-transform:uppercase; color:#BE3A2B;">Name Correction</span>
        </div>
        <h1 class="disp" style="font-size:64px; line-height:1.0; margin:0; max-width:15ch;">Is your name working <span style="color:#BE3A2B;">against</span> you?</h1>
        <p style="font-size:18.5px; line-height:1.55; color:#57514A; margin:0; max-width:50ch;">Your name adds up to a number. So does your birth date. When the two disagree, the effort you put in tends not to convert. This report tells you where you stand and gives you three corrected spellings, each scored.</p>
        <div style="display:flex; align-items:center; gap:26px; padding-top:4px;">
          <div style="display:flex; align-items:baseline; gap:10px;">
            <span class="mono" style="font-size:17px; color:#8A8279; text-decoration:line-through;">₹999</span>
            <span class="disp" style="font-size:52px; line-height:1;">₹399</span>
          </div>
          <div class="btn" style="font-size:16.5px; padding:18px 32px;">Get my report ${C.arrow(18)}</div>
        </div>
        <div style="display:flex; gap:22px; flex-wrap:wrap; padding-top:14px; border-top:1px solid #D5D1C6;">
          <span style="display:flex; align-items:center; gap:8px; font-size:13.5px; color:#57514A;">${C.check('#2F6B4F', 15)}18+ pages</span>
          <span style="display:flex; align-items:center; gap:8px; font-size:13.5px; color:#57514A;">${C.check('#2F6B4F', 15)}Delivered in <span class="ph">[[ 24h ]]</span></span>
          <span style="display:flex; align-items:center; gap:8px; font-size:13.5px; color:#57514A;">${C.check('#2F6B4F', 15)}WhatsApp and email</span>
          <span style="display:flex; align-items:center; gap:8px; font-size:13.5px; color:#57514A;">${C.lock('#8A8279', 15)}Razorpay secured</span>
        </div>
      </div>
      <div class="bookshadow" style="justify-self:center;">${covers.name.replace('width="150" height="210"', 'width="278" height="389"')}</div>
    </div>
  </div>

  <!-- what you'll discover -->
  <div class="wrap" style="padding-top:76px; padding-bottom:76px;">
    <div style="display:flex; flex-direction:column; gap:10px; padding-bottom:22px; border-bottom:1.5px solid #1A1714;">
      <span class="lbl" style="color:#BE3A2B;">What you will discover</span>
      <h2 class="h2 disp">Five answers, not five paragraphs.</h2>
    </div>
    <div style="display:grid; grid-template-columns:repeat(5,minmax(0,1fr)); gap:1px; background:#D5D1C6; border-bottom:1px solid #D5D1C6;">
      ${DISCOVER.map(([t, d], i) => `<div style="background:#F2F1EC; padding:26px 20px 28px; display:flex; flex-direction:column; gap:11px;">
        <span class="mono" style="font-size:10px; letter-spacing:.16em; color:#BE3A2B;">0${i + 1}</span>
        <span class="disp" style="font-size:23px; line-height:1.1;">${t}</span>
        <span style="font-size:14px; color:#57514A; line-height:1.5;">${d}</span>
      </div>`).join('\n      ')}
    </div>
  </div>

  <!-- contents -->
  <div style="background:#E9E7DF; border-top:1px solid #D5D1C6; border-bottom:1px solid #D5D1C6;">
    <div class="wrap" style="padding-top:72px; padding-bottom:72px; display:grid; grid-template-columns:340px minmax(0,1fr); gap:60px; align-items:start;">
      <div style="display:flex; flex-direction:column; gap:18px;">
        <span class="lbl" style="color:#BE3A2B;">What is inside</span>
        <h2 class="h2 disp">Thirteen sections across eighteen pages.</h2>
        <p style="font-size:15px; color:#57514A; line-height:1.6; margin:0;">Every one of them written from your name and your birth date. No filler chapters, no general astrology padding.</p>
        <div class="bookshadow" style="margin-top:10px;">${covers.name.replace('width="150" height="210"', 'width="176" height="246"').replace(/(bg|sp)-nm/g, '$1-nm2')}</div>
      </div>
      <div style="background:#FFFDF8; border:1px solid #D5D1C6; padding:32px 34px;">
        <div style="display:flex; align-items:baseline; justify-content:space-between; padding-bottom:14px; border-bottom:1.5px solid #1A1714;">
          <span class="disp" style="font-size:24px;">Contents</span>
          <span class="lbl">Page</span>
        </div>
        ${CONTENTS.map(([t, p]) => `<div style="display:flex; align-items:baseline; gap:12px; padding:11px 0; border-bottom:1px solid #E9E7DF;">
          ${C.check('#2F6B4F', 14)}
          <span style="font-size:15px; flex:1;">${t}</span>
          <span class="mono" style="font-size:12px; color:#8A8279;">${p}</span>
        </div>`).join('\n        ')}
      </div>
    </div>
  </div>

  <!-- sample -->
  <div class="wrap" style="padding-top:76px; padding-bottom:76px;">
    <div style="display:flex; align-items:flex-end; justify-content:space-between; gap:40px; padding-bottom:30px;">
      <div style="display:flex; flex-direction:column; gap:10px;">
        <span class="lbl" style="color:#BE3A2B;">Sample pages</span>
        <h2 class="h2 disp">Real pages, personal details removed.</h2>
      </div>
      <div class="btn-o">View the full sample</div>
    </div>
    <div style="display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:24px;">
      <div style="background:#FFFDF8; border:1px solid #D5D1C6; padding:26px 24px; display:flex; flex-direction:column; gap:15px; min-height:320px;">
        <span class="lbl">Page 3 — at a glance</span>
        <div style="display:flex; align-items:baseline; gap:11px;"><span class="disp" style="font-size:62px; line-height:.9;">62</span><span class="mono" style="font-size:13px; color:#8A8279;">/ 100</span></div>
        <div style="height:7px; background:#E9E7DF;"><div style="width:62%; height:100%; background:#BE3A2B;"></div></div>
        <p style="font-size:14px; color:#57514A; line-height:1.55; margin:0;">A 5 name against a 7 life path. Workable, but the two pull in different directions.</p>
      </div>
      <div style="background:#FFFDF8; border:1px solid #D5D1C6; padding:26px 24px; display:flex; flex-direction:column; gap:15px; min-height:320px;">
        <span class="lbl">Page 9 — your Lo Shu grid</span>
        <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:2px; background:#D5D1C6; border:1px solid #D5D1C6; align-self:flex-start;">
          ${[['4',0],['99',2],['22',2],['3',1],['5',1],['7',1],['8',1],['1',1],['6',0]].map(([v, on]) =>
            `<div style="background:${on > 1 ? '#F7EDEB' : (on ? '#FFFDF8' : '#EDEBE4')}; width:56px; height:50px; display:flex; align-items:center; justify-content:center;"><span class="disp" style="font-size:20px; color:${on > 1 ? '#BE3A2B' : (on ? '#1A1714' : '#C2BCB1')};">${v}</span></div>`).join('')}
        </div>
        <p style="font-size:14px; color:#57514A; line-height:1.55; margin:0;">Three complete planes, with 4 and 6 absent — structure and home.</p>
      </div>
      <div style="background:#FFFDF8; border:1px solid #D5D1C6; padding:26px 24px; display:flex; flex-direction:column; gap:15px; min-height:320px;">
        <span class="lbl">Page 13 — your options</span>
        <div style="display:flex; flex-direction:column; gap:1px; background:#D5D1C6; border:1px solid #D5D1C6;">
          ${[['Annand Sharma','88 · BEST','#F7EDEB','#BE3A2B'],['Anandh Sharma','84','#FFFDF8','#57514A'],['Aanand Sharma','76','#FFFDF8','#57514A'],['Anand Sharma','62 · CURRENT','#EDEBE4','#8A8279']]
            .map(([n, s, bg, col]) => `<div style="background:${bg}; padding:11px 13px; display:flex; justify-content:space-between; align-items:center;"><span class="disp" style="font-size:18px; color:${col === '#8A8279' ? '#8A8279' : '#1A1714'};">${n}</span><span class="mono" style="font-size:10.5px; color:${col}; letter-spacing:.08em;">${s}</span></div>`).join('')}
        </div>
      </div>
    </div>
  </div>

  <!-- name changes -->
  <div style="background:#1A1714; color:#F2F1EC;">
    <div class="wrap" style="padding-top:74px; padding-bottom:74px; display:flex; flex-direction:column; gap:30px;">
      <div style="display:flex; align-items:flex-end; justify-content:space-between; gap:44px;">
        <div style="display:flex; flex-direction:column; gap:12px;">
          <span class="lbl" style="color:${GOLD};">A matter of public record</span>
          <h2 class="h2 disp" style="color:#F2F1EC; max-width:22ch;">You would not be the first to change a letter.</h2>
        </div>
        <p style="font-size:15.5px; color:#B8B0A6; max-width:42ch; line-height:1.6; margin:0;">Across Hindi, Bengali and Marathi cinema, adjusting a spelling on a numerologist's advice is common enough to be unremarkable.</p>
      </div>
      <div style="display:grid; grid-template-columns:repeat(6,minmax(0,1fr)); gap:1px; background:#3A332C; border:1px solid #3A332C;">
        ${nameCards().map((c, i) => c.replace('padding:24px 20px;', `padding:26px 22px; grid-column:span ${i < 3 ? 2 : 3};`)).join('\n        ')}
      </div>
    </div>
  </div>

  <!-- how it works + why -->
  <div style="background:#E9E7DF; border-bottom:1px solid #D5D1C6;">
    <div class="wrap" style="padding-top:72px; padding-bottom:72px; display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:60px;">
      <div style="display:flex; flex-direction:column; gap:22px;">
        <div style="display:flex; flex-direction:column; gap:9px;">
          <span class="lbl" style="color:#BE3A2B;">How it works</span>
          <h2 class="disp" style="font-size:34px; line-height:1.08; margin:0;">Four steps, about ten minutes.</h2>
        </div>
        ${[['Tell us about yourself','Your name as you write it, and your date of birth.'],
           ['Answer a few questions','Six short screens, one question at a time.'],
           ['Complete your payment','UPI, card or net banking through Razorpay.'],
           ['Receive your report','On WhatsApp and email, ready to read and save.']]
          .map(([t, d], i) => `<div style="display:grid; grid-template-columns:36px minmax(0,1fr); gap:16px; padding:14px 0; border-top:1px solid #D5D1C6;">
          <span class="disp" style="font-size:28px; color:#BE3A2B; line-height:1;">${i + 1}</span>
          <div style="display:flex; flex-direction:column; gap:2px;"><span style="font-size:16.5px; font-weight:600;">${t}</span><span style="font-size:14px; color:#57514A; line-height:1.5;">${d}</span></div>
        </div>`).join('\n        ')}
      </div>
      <div style="display:flex; flex-direction:column; gap:22px;">
        <div style="display:flex; flex-direction:column; gap:9px;">
          <span class="lbl" style="color:#BE3A2B;">Why Jaano</span>
          <h2 class="disp" style="font-size:34px; line-height:1.08; margin:0;">Built to be read and acted on.</h2>
        </div>
        <div style="display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:1px; background:#D5D1C6; border:1px solid #D5D1C6;">
          ${WHY.map(([t, d]) => `<div style="background:#E9E7DF; padding:20px; display:flex; flex-direction:column; gap:6px;">
            <span style="font-size:16px; font-weight:600;">${t}</span>
            <span style="font-size:13.5px; color:#57514A; line-height:1.5;">${d}</span>
          </div>`).join('\n          ')}
        </div>
      </div>
    </div>
  </div>

  <!-- reviews -->
  <div style="padding-top:66px; padding-bottom:66px; overflow:hidden;">
    <div class="wrap" style="display:flex; align-items:flex-end; justify-content:space-between; padding-bottom:28px;">
      <div style="display:flex; flex-direction:column; gap:10px;">
        <span class="lbl" style="color:#BE3A2B;">In their words</span>
        <h2 class="h2 disp">What people say afterwards.</h2>
      </div>
      <div style="display:flex; align-items:center; gap:10px;">
        <span class="disp" style="font-size:30px;"><span class="ph">[[ 4.8 ]]</span></span>
        <div style="display:flex; gap:2px;">${C.star('#D99A2B', 14).repeat(5)}</div>
      </div>
    </div>
    <div class="marquee">${revCards}${revCards}</div>
  </div>

  <!-- faq -->
  <div class="wrap" style="padding-top:66px; padding-bottom:66px; display:grid; grid-template-columns:minmax(0,.6fr) minmax(0,1fr); gap:66px; align-items:start;">
    <div style="display:flex; flex-direction:column; gap:12px;">
      <span class="lbl" style="color:#BE3A2B;">Questions</span>
      <h2 class="h2 disp">Before you buy.</h2>
      <p style="font-size:15px; color:#57514A; line-height:1.6; margin:0;">Anything else, message us on WhatsApp at <span class="ph">[[ WHATSAPP ]]</span> — a person replies.</p>
    </div>
    <div style="display:flex; flex-direction:column; border-top:1px solid #D5D1C6;">
      ${FAQ.map(([q, a]) => `<div style="padding:19px 0; border-bottom:1px solid #D5D1C6; display:flex; flex-direction:column; gap:7px;">
        <div style="display:flex; justify-content:space-between; align-items:center; gap:20px;">
          <span style="font-size:17px; font-weight:600;">${q}</span>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="${a ? '#BE3A2B' : '#8A8279'}" stroke-width="2" stroke-linecap="round" class="tick"><line x1="5" y1="12" x2="19" y2="12"></line>${a ? '' : '<line x1="12" y1="5" x2="12" y2="19"></line>'}</svg>
        </div>
        ${a ? `<p style="font-size:15px; color:#57514A; line-height:1.6; margin:0; max-width:62ch;">${a}</p>` : ''}
      </div>`).join('\n      ')}
    </div>
  </div>

  <!-- final cta -->
  <div style="background:#BE3A2B; color:#F9F1EF;">
    <div class="wrap" style="padding-top:60px; padding-bottom:60px; display:flex; align-items:center; justify-content:space-between; gap:50px;">
      <div style="display:flex; flex-direction:column; gap:11px;">
        <h2 class="disp" style="font-size:44px; line-height:1.04; margin:0; max-width:17ch;">Name Correction Report</h2>
        <p style="font-size:16.5px; color:#F3D9D4; margin:0; max-width:44ch; line-height:1.5;">Eighteen pages, three scored spellings, and a plan for making the change stick.</p>
      </div>
      <div style="display:flex; flex-direction:column; gap:12px; align-items:flex-end;">
        <div style="display:flex; align-items:baseline; gap:11px;">
          <span class="mono" style="font-size:17px; color:#EFC7C0; text-decoration:line-through;">₹999</span>
          <span class="disp" style="font-size:56px; line-height:1;">₹399</span>
        </div>
        <div style="background:#1A1714; color:#F2F1EC; padding:18px 34px; font-weight:600; font-size:16.5px; display:inline-flex; align-items:center; gap:11px;">Get my personalised report ${C.arrow(18)}</div>
        <span class="mono" style="font-size:10.5px; letter-spacing:.13em; text-transform:uppercase; color:#EFC7C0;">Secure payment · instant start</span>
      </div>
    </div>
  </div>

  <div style="background:#1A1714; color:#8A8279; padding:26px 0;">
    <div class="wrap" style="display:flex; justify-content:space-between; gap:30px;">
      <span style="font-size:12.5px;">© <span class="ph">[[ YEAR ]]</span> <span class="ph">[[ COMPANY_NAME ]]</span></span>
      <span style="font-size:12px; max-width:70ch; text-align:right; line-height:1.55;">Jaano reports are interpretive guidance for personal reflection. Not predictions, and not medical, psychological, legal or financial advice.</span>
    </div>
  </div>
</div>
` + C.foot;

fs.writeFileSync('ProductPage.dc.html', html);
console.log('ProductPage.dc.html', html.length, 'bytes');
