const NAMES = [
  { lang:'Hindi cinema',   before:'Ajay Devgan',    after:'Ajay Devgn',      note:'Dropped the “a”. Ten letters became nine.' },
  { lang:'Hindi cinema',   before:'Tushar Kapoor',  after:'Tusshar Kapoor',  note:'A doubled consonant — the commonest correction of all.' },
  { lang:'Bengali cinema', before:'Rani Mukherjee', after:'Rani Mukerji',    note:'Lost an “h”, and the double “e” became a single “i”.' },
  { lang:'Marathi cinema', before:'Swapnil Joshi',  after:'Swwapnil Joshi',  note:'A doubled “w” — the spelling he brands himself with.' },
  { lang:'Hindi cinema',   before:'Rajkumar Yadav', after:'Rajkummar Rao',   note:'A doubled “m”, and a new surname to go with it.' },
];

const GOLD = '#D99A2B';

// returns an ARRAY of card strings so callers can add grid spans without string surgery
function nameCards({ delayStep = 0.85, afterSize = 27, beforeSize = 20, pad = '24px 20px' } = {}) {
  return NAMES.map((n, i) => {
    const d = (i * delayStep).toFixed(2) + 's';
    return `<div style="background:#221D19; padding:${pad}; display:flex; flex-direction:column; gap:14px;">
          <span class="mono" style="font-size:9px; letter-spacing:.16em; text-transform:uppercase; color:#8A8279;">${n.lang}</span>
          <div style="display:flex; flex-direction:column; gap:9px;">
            <div style="position:relative; align-self:flex-start;">
              <span class="disp nc-before" style="font-size:${beforeSize}px; line-height:1.2; color:#7E766D; animation-delay:${d};">${n.before}</span>
              <i class="nc-strike" style="position:absolute; left:0; right:0; top:52%; height:1.5px; background:${GOLD}; transform-origin:left center; animation-delay:${d};"></i>
            </div>
            <div style="display:flex; align-items:center; gap:10px;">
              <svg class="nc-arrow" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="${GOLD}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex:none; animation-delay:${d};"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
              <div style="display:flex; flex-direction:column; gap:4px; align-items:flex-start;">
                <span class="disp nc-after" style="font-size:${afterSize}px; line-height:1.1; color:#F2F1EC; animation-delay:${d};">${n.after}</span>
                <i class="nc-rule" style="height:2px; width:100%; background:${GOLD}; transform-origin:left center; animation-delay:${d};"></i>
              </div>
            </div>
          </div>
          <span style="font-size:13px; color:#B8B0A6; line-height:1.5; margin-top:auto;">${n.note}</span>
        </div>`;
  });
}

const NC_CSS = `
    .nc-before { animation:ncBefore 8s infinite; }
    .nc-strike { animation:ncStrike 8s infinite; }
    .nc-after  { animation:ncAfter 8s infinite; }
    .nc-rule   { animation:ncRule 8s infinite; }
    .nc-arrow  { animation:ncArrow 8s infinite; }
    @keyframes ncBefore { 0%,22%{opacity:1} 38%,92%{opacity:.42} 100%{opacity:1} }
    @keyframes ncStrike { 0%,9%{transform:scaleX(0)} 24%,92%{transform:scaleX(1)} 100%{transform:scaleX(0)} }
    @keyframes ncAfter  { 0%,30%{opacity:0; transform:translateY(8px)} 46%,92%{opacity:1; transform:none} 100%{opacity:0; transform:translateY(8px)} }
    @keyframes ncRule   { 0%,46%{transform:scaleX(0)} 62%,92%{transform:scaleX(1)} 100%{transform:scaleX(0)} }
    @keyframes ncArrow  { 0%,28%{opacity:0} 42%,92%{opacity:1} 100%{opacity:0} }`;

module.exports = { NAMES, nameCards, NC_CSS, GOLD };
