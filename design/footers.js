const gold = '#D99A2B', ph = c => `<span style="color:#8A8279; border-bottom:1px dotted ${c || gold};">`;
const POLICIES = ['Privacy Policy','Terms &amp; Conditions','Refund &amp; Cancellation Policy',
  'Shipping &amp; Delivery Policy','Cookie Policy','Pricing &amp; Payments','Disclaimer'];
const REPORTS = ['Name Correction Report','Complete Numerology Report','Career &amp; Money Report',
  'Relationship Clarity Report','Premium Kundli Report','Access my report'];
const COMPANY = ['About Us','Contact Us','How It Works','Sample Reports','FAQ','Consultation with Maya'];
const PAY = ['UPI','Cards','Net banking','Wallets','EMI'];
const DISCLAIMER = 'Jaano reports are interpretive guidance prepared for personal reflection. They are not predictions, and they are not medical, psychological, legal or financial advice. No outcome is guaranteed. Consultations with Pandit Maya are for personal guidance only.';

const col = (title, items) => `
      <div style="display:flex; flex-direction:column; gap:12px;">
        <span class="disp" style="font-size:19px; color:${gold};">${title}</span>
        <div style="display:flex; flex-direction:column; gap:8px; font-size:14px;">
          ${items.map(i => `<span>${i}</span>`).join('\n          ')}
        </div>
      </div>`;

const FOOTER_DESKTOP = `  <!-- footer -->
  <div style="background:#1A1714; color:#B8B0A6;">
    <div class="wrap" style="padding-top:56px; padding-bottom:26px; display:grid; grid-template-columns:minmax(0,1.5fr) repeat(4,minmax(0,1fr)); gap:40px;">
      <div style="display:flex; flex-direction:column; gap:14px;">
        <div style="display:flex; align-items:baseline; gap:10px;">
          <div class="disp" style="font-size:27px; line-height:1; color:${gold};">JAANO</div>
          <div class="mono" style="font-size:9px; letter-spacing:.22em; text-transform:uppercase; color:#8A8279;">जानो</div>
        </div>
        <p style="font-size:13.5px; line-height:1.6; margin:0; max-width:32ch;">Numerology and Vedic astrology reports, personalised to your name and birth details and delivered as a full written report.</p>
        <div style="display:flex; flex-direction:column; gap:7px; padding-top:4px;">
          <span class="mono" style="font-size:9.5px; letter-spacing:.16em; text-transform:uppercase; color:#8A8279;">Payments accepted</span>
          <div style="display:flex; flex-wrap:wrap; gap:5px;">
            ${PAY.map(p => `<span class="mono" style="border:1px solid #3A332C; padding:4px 8px; font-size:9.5px; letter-spacing:.08em; text-transform:uppercase; color:#A79E93;">${p}</span>`).join('\n            ')}
          </div>
          <span style="font-size:12px; color:#8A8279; line-height:1.5;">Processed securely by Razorpay. Jaano never stores your card details.</span>
        </div>
      </div>
${col('Reports', REPORTS)}
${col('Company', COMPANY)}
${col('Policies', POLICIES)}
      <div style="display:flex; flex-direction:column; gap:12px;">
        <span class="disp" style="font-size:19px; color:${gold};">Company Details</span>
        <div style="display:flex; flex-direction:column; gap:9px;">
          <div style="display:flex; flex-direction:column;"><span class="mono" style="font-size:9.5px; letter-spacing:.14em; text-transform:uppercase; color:#8A8279;">Registered name</span><span style="font-size:14px;">${ph()}[[ COMPANY_NAME ]]</span></span></div>
          <div style="display:flex; flex-direction:column;"><span class="mono" style="font-size:9.5px; letter-spacing:.14em; text-transform:uppercase; color:#8A8279;">GST</span><span style="font-size:14px;">${ph()}[[ GST_NUMBER ]]</span></span></div>
          <div style="display:flex; flex-direction:column;"><span class="mono" style="font-size:9.5px; letter-spacing:.14em; text-transform:uppercase; color:#8A8279;">Address</span><span style="font-size:14px; line-height:1.5;">${ph()}[[ REGISTERED_ADDRESS ]]</span></span></div>
          <div style="display:flex; flex-direction:column;"><span class="mono" style="font-size:9.5px; letter-spacing:.14em; text-transform:uppercase; color:#8A8279;">WhatsApp</span><span style="font-size:14px;">${ph()}[[ WHATSAPP ]]</span></span></div>
          <div style="display:flex; flex-direction:column;"><span class="mono" style="font-size:9.5px; letter-spacing:.14em; text-transform:uppercase; color:#8A8279;">Email</span><span style="font-size:14px;">${ph()}[[ SUPPORT_EMAIL ]]</span></span></div>
        </div>
      </div>
    </div>
    <div class="wrap">
      <div style="height:1px; background:#3A332C;"></div>
      <div style="padding-top:18px; padding-bottom:30px; display:flex; justify-content:space-between; gap:40px; align-items:flex-start;">
        <span style="font-size:12.5px; color:#8A8279; flex:none;">© ${ph()}[[ YEAR ]]</span> ${ph()}[[ COMPANY_NAME ]]</span>. All rights reserved.</span>
        <span style="font-size:12px; color:#8A8279; max-width:78ch; text-align:right; line-height:1.55;">${DISCLAIMER}</span>
      </div>
    </div>
  </div>

`;

const mcol = (title, items, cols) => `
      <div style="display:flex; flex-direction:column; gap:9px;">
        <span class="disp" style="font-size:18px; color:${gold};">${title}</span>
        <div style="display:grid; grid-template-columns:repeat(${cols},minmax(0,1fr)); gap:8px 16px; font-size:13.5px;">
          ${items.map(i => `<span>${i}</span>`).join('\n          ')}
        </div>
      </div>`;

const FOOTER_MOBILE = `  <!-- footer -->
  <div style="background:#1A1714; color:#B8B0A6;">
    <div class="pad" style="padding-top:32px; padding-bottom:24px; display:flex; flex-direction:column; gap:24px;">
      <div style="display:flex; flex-direction:column; gap:10px;">
        <div class="disp" style="font-size:25px; line-height:1; color:${gold};">JAANO</div>
        <p style="font-size:13.5px; line-height:1.6; margin:0;">Numerology and Vedic astrology reports, personalised to your name and birth details and delivered as a full written report.</p>
      </div>
${mcol('Reports', REPORTS, 1)}
${mcol('Company', COMPANY, 2)}
${mcol('Policies', POLICIES, 2)}
      <div style="display:flex; flex-direction:column; gap:9px;">
        <span class="disp" style="font-size:18px; color:${gold};">Company Details</span>
        <div style="display:flex; flex-direction:column;"><span class="mono" style="font-size:9px; letter-spacing:.14em; text-transform:uppercase; color:#8A8279;">Registered name</span><span style="font-size:14px;">${ph()}[[ COMPANY_NAME ]]</span></span></div>
        <div style="display:flex; flex-direction:column;"><span class="mono" style="font-size:9px; letter-spacing:.14em; text-transform:uppercase; color:#8A8279;">GST</span><span style="font-size:14px;">${ph()}[[ GST_NUMBER ]]</span></span></div>
        <div style="display:flex; flex-direction:column;"><span class="mono" style="font-size:9px; letter-spacing:.14em; text-transform:uppercase; color:#8A8279;">Address</span><span style="font-size:14px; line-height:1.5;">${ph()}[[ REGISTERED_ADDRESS ]]</span></span></div>
        <div style="display:flex; flex-direction:column;"><span class="mono" style="font-size:9px; letter-spacing:.14em; text-transform:uppercase; color:#8A8279;">WhatsApp</span><span style="font-size:14px;">${ph()}[[ WHATSAPP ]]</span></span></div>
        <div style="display:flex; flex-direction:column;"><span class="mono" style="font-size:9px; letter-spacing:.14em; text-transform:uppercase; color:#8A8279;">Email</span><span style="font-size:14px;">${ph()}[[ SUPPORT_EMAIL ]]</span></span></div>
      </div>
      <div style="display:flex; flex-direction:column; gap:7px;">
        <span class="mono" style="font-size:9px; letter-spacing:.16em; text-transform:uppercase; color:#8A8279;">Payments accepted</span>
        <div style="display:flex; flex-wrap:wrap; gap:5px;">
          ${PAY.map(p => `<span class="mono" style="border:1px solid #3A332C; padding:4px 8px; font-size:9px; letter-spacing:.08em; text-transform:uppercase; color:#A79E93;">${p}</span>`).join('\n          ')}
        </div>
        <span style="font-size:11.5px; color:#8A8279; line-height:1.5;">Processed securely by Razorpay. Jaano never stores your card details.</span>
      </div>
      <div style="height:1px; background:#3A332C;"></div>
      <div style="display:flex; flex-direction:column; gap:8px;">
        <span style="font-size:12px; color:#8A8279;">© ${ph()}[[ YEAR ]]</span> ${ph()}[[ COMPANY_NAME ]]</span>. All rights reserved.</span>
        <span style="font-size:11.5px; color:#8A8279; line-height:1.55;">${DISCLAIMER}</span>
      </div>
    </div>
  </div>

`;
module.exports = { FOOTER_DESKTOP, FOOTER_MOBILE };
