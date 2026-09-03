// generates the 5 report cover SVGs (auspicious palettes + gold foil)
const P = {
  name:   { id:'nm', d:'#7B1010', m:'#A11C1C', l:'#B92626', t:['NAME','CORRECTION'] },
  numer:  { id:'nu', d:'#8E3D06', m:'#C25A0A', l:'#D96D12', t:['COMPLETE','NUMEROLOGY'] },
  career: { id:'cr', d:'#13452A', m:'#1F5D3A', l:'#276F46', t:['CAREER','& MONEY'] },
  rel:    { id:'rl', d:'#6E0E2E', m:'#96143F', l:'#AC1B4C', t:['RELATIONSHIP','CLARITY'] },
  kundli: { id:'kn', d:'#4E0C0C', m:'#6B1010', l:'#7E1616', t:['PREMIUM','KUNDLI'] },
};
const G = '#D9AE55', G2 = '#F0D492';

function corners(x, y, w, h) {
  const r = 7, o = 2.4;
  const c = (px, py, sx, sy) =>
    `<path d="M${px} ${py + sy * r} V${py + sy * o} a${o} ${o} 0 0 ${sx * sy > 0 ? 1 : 0} ${sx * o} ${-sy * o} H${px + sx * r}" fill="none" stroke="${G}" stroke-width=".7"/>` +
    `<circle cx="${px + sx * 2.6}" cy="${py + sy * 2.6}" r="1" fill="${G}"/>`;
  return c(x, y, 1, 1) + c(x + w, y, -1, 1) + c(x, y + h, 1, -1) + c(x + w, y + h, -1, -1);
}

const motifs = {
  // 9-segment name wheel
  nm: (cx, cy) => {
    let s = `<circle cx="${cx}" cy="${cy}" r="22" fill="none" stroke="${G}" stroke-width=".8"/>` +
            `<circle cx="${cx}" cy="${cy}" r="17" fill="none" stroke="${G}" stroke-width=".4" opacity=".7"/>`;
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2 - Math.PI / 2;
      s += `<line x1="${(cx + Math.cos(a) * 17).toFixed(1)}" y1="${(cy + Math.sin(a) * 17).toFixed(1)}" x2="${(cx + Math.cos(a) * 22).toFixed(1)}" y2="${(cy + Math.sin(a) * 22).toFixed(1)}" stroke="${G}" stroke-width=".4" opacity=".8"/>`;
      s += `<text x="${(cx + Math.cos(a) * 12.4).toFixed(1)}" y="${(cy + Math.sin(a) * 12.4 + 2.2).toFixed(1)}" font-size="5.2" fill="${G2}" text-anchor="middle" font-family="Georgia,serif">${i + 1}</text>`;
    }
    return s;
  },
  // Lo Shu 3x3
  nu: (cx, cy) => {
    let s = `<circle cx="${cx}" cy="${cy}" r="23" fill="none" stroke="${G}" stroke-width=".8"/>`;
    const n = [4,9,2,3,5,7,8,1,6], k = 10.5;
    for (let i = 0; i <= 3; i++) {
      s += `<line x1="${cx-15.5}" y1="${cy-15.5+i*k}" x2="${cx+15.5}" y2="${cy-15.5+i*k}" stroke="${G}" stroke-width=".4" opacity=".75"/>`;
      s += `<line x1="${cx-15.5+i*k}" y1="${cy-15.5}" x2="${cx-15.5+i*k}" y2="${cy+15.5}" stroke="${G}" stroke-width=".4" opacity=".75"/>`;
    }
    n.forEach((v, i) => {
      const col = i % 3, row = (i / 3) | 0;
      s += `<text x="${(cx-15.5+col*k+k/2).toFixed(1)}" y="${(cy-15.5+row*k+k/2+2.1).toFixed(1)}" font-size="6" fill="${G2}" text-anchor="middle" font-family="Georgia,serif">${v}</text>`;
    });
    return s;
  },
  // 8-spoke chakra
  cr: (cx, cy) => {
    let s = `<circle cx="${cx}" cy="${cy}" r="23" fill="none" stroke="${G}" stroke-width=".8"/>` +
            `<circle cx="${cx}" cy="${cy}" r="6" fill="none" stroke="${G}" stroke-width=".7"/>` +
            `<circle cx="${cx}" cy="${cy}" r="2" fill="${G}"/>`;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      s += `<line x1="${(cx+Math.cos(a)*6).toFixed(1)}" y1="${(cy+Math.sin(a)*6).toFixed(1)}" x2="${(cx+Math.cos(a)*23).toFixed(1)}" y2="${(cy+Math.sin(a)*23).toFixed(1)}" stroke="${G}" stroke-width=".5" opacity=".85"/>`;
      const b = a + Math.PI / 8;
      s += `<circle cx="${(cx+Math.cos(b)*16).toFixed(1)}" cy="${(cy+Math.sin(b)*16).toFixed(1)}" r="1.5" fill="${G}" opacity=".9"/>`;
    }
    return s;
  },
  // two interlocking rings
  rl: (cx, cy) => `<circle cx="${cx-8}" cy="${cy}" r="16" fill="none" stroke="${G}" stroke-width=".8"/>` +
    `<circle cx="${cx+8}" cy="${cy}" r="16" fill="none" stroke="${G}" stroke-width=".8"/>` +
    `<circle cx="${cx-8}" cy="${cy}" r="12" fill="none" stroke="${G}" stroke-width=".35" opacity=".65"/>` +
    `<circle cx="${cx+8}" cy="${cy}" r="12" fill="none" stroke="${G}" stroke-width=".35" opacity=".65"/>` +
    `<circle cx="${cx}" cy="${cy}" r="1.6" fill="${G2}"/>`,
  // north-indian kundli diamond
  kn: (cx, cy) => {
    const h = 23;
    return `<rect x="${cx-h}" y="${cy-h}" width="${h*2}" height="${h*2}" fill="none" stroke="${G}" stroke-width=".8"/>` +
      `<path d="M${cx-h} ${cy-h} L${cx+h} ${cy+h} M${cx+h} ${cy-h} L${cx-h} ${cy+h}" stroke="${G}" stroke-width=".4" opacity=".8"/>` +
      `<path d="M${cx} ${cy-h} L${cx-h} ${cy} L${cx} ${cy+h} L${cx+h} ${cy} Z" fill="none" stroke="${G}" stroke-width=".6"/>` +
      `<circle cx="${cx}" cy="${cy}" r="2" fill="${G}"/>`;
  },
};

function cover(key, W = 150, H = 210) {
  const p = P[key], sp = 9, cx = (W + sp) / 2;
  const fx = 16, fy = 11, fw = W - 16 - fx, fh = H - 11 - fy;
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${p.t.join(' ')} Report cover" style="display:block;">
<defs><linearGradient id="bg-${p.id}" x1="0" y1="0" x2="1" y2="0">
<stop offset="0" stop-color="${p.d}"/><stop offset=".08" stop-color="${p.l}"/><stop offset=".55" stop-color="${p.m}"/><stop offset="1" stop-color="${p.d}"/></linearGradient>
<linearGradient id="sp-${p.id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${p.d}"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></linearGradient></defs>
<rect width="${W}" height="${H}" fill="url(#bg-${p.id})"/>
<rect width="${sp}" height="${H}" fill="url(#sp-${p.id})"/>
<line x1="${sp + .8}" y1="0" x2="${sp + .8}" y2="${H}" stroke="${G}" stroke-width=".5" opacity=".55"/>
<rect x="${fx}" y="${fy}" width="${fw}" height="${fh}" fill="none" stroke="${G}" stroke-width=".9"/>
<rect x="${fx + 3}" y="${fy + 3}" width="${fw - 6}" height="${fh - 6}" fill="none" stroke="${G}" stroke-width=".35" opacity=".6"/>
${corners(fx + 6, fy + 6, fw - 12, fh - 12)}
<text x="${cx}" y="${fy + 34}" font-size="13" fill="${G2}" text-anchor="middle" font-family="Georgia,'Times New Roman',serif" letter-spacing="1.1">${p.t[0]}</text>
<text x="${cx}" y="${fy + 49}" font-size="13" fill="${G2}" text-anchor="middle" font-family="Georgia,'Times New Roman',serif" letter-spacing="1.1">${p.t[1]}</text>
<text x="${cx}" y="${fy + 62}" font-size="7" fill="${G}" text-anchor="middle" font-family="Georgia,serif" letter-spacing="3.4" opacity=".95">REPORT</text>
<line x1="${cx - 20}" y1="${fy + 70}" x2="${cx + 20}" y2="${fy + 70}" stroke="${G}" stroke-width=".5" opacity=".8"/>
${motifs[p.id](cx, fy + 108)}
<line x1="${cx - 26}" y1="${H - 44}" x2="${cx + 26}" y2="${H - 44}" stroke="${G}" stroke-width=".4" opacity=".6"/>
<text x="${cx}" y="${H - 29}" font-size="11.5" fill="${G2}" text-anchor="middle" font-family="Georgia,serif" letter-spacing="3">JAANO</text>
<text x="${cx}" y="${H - 19}" font-size="4.6" fill="${G}" text-anchor="middle" font-family="Georgia,serif" letter-spacing="1.6" opacity=".85">PREPARED FOR YOU</text>
</svg>`;
}
const out = {};
for (const k of Object.keys(P)) out[k] = cover(k);
out.kundliBig = cover('kundli', 200, 280);
require('fs').writeFileSync('covers.json', JSON.stringify(out));
console.log('covers ->', Object.keys(out).join(', '), '| bytes', JSON.stringify(out).length);
