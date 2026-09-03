const fs = require('fs');
const P = require('./patch.js');
const F = require('./footers.js');

const FONTS_ADD = '&family=Noto+Serif+Bengali:wght@500;600&family=Noto+Serif+Devanagari:wght@500;600';

function patch(file, opts) {
  let s = fs.readFileSync(file, 'utf8');
  // fonts
  s = s.replace('&display=swap"', FONTS_ADD + '&display=swap"');
  // animation css before the reduced-motion block
  s = s.replace('    @media (prefers-reduced-motion: reduce) {', P.NC_CSS + '\n    @media (prefers-reduced-motion: reduce) {');
  s = s.replace(/(\.rot > span:nth-child\(2\), \.rot > span:nth-child\(3\)\{ display:none; \})/, '$1' + P.NC_REDUCED);
  // sections
  s = P.splice(s, opts.nameStart, opts.nameEnd, opts.namesHtml, 'names ' + file);
  s = P.splice(s, opts.consStart, opts.consEnd, opts.consHtml, 'consult ' + file);
  s = P.splice(s, opts.footStart, opts.footEnd, opts.footHtml, 'footer ' + file);
  fs.writeFileSync(file, s);
  console.log('patched', file, s.length, 'bytes');
}

patch('Main.tpl.html', {
  nameStart: '  <!-- name changes / social proof of the practice -->', nameEnd: '  <!-- how it works -->',
  consStart: '  <!-- consultation -->', consEnd: '  <!-- faq -->',
  footStart: '  <!-- footer : same information architecture as the reference site -->', footEnd: '  <!-- purchase ticker',
  namesHtml: P.NAMES_DESKTOP, consHtml: P.CONSULT_DESKTOP, footHtml: F.FOOTER_DESKTOP,
});
patch('Mobile.tpl.html', {
  nameStart: '  <!-- name changes -->', nameEnd: '  <!-- how it works -->',
  consStart: '  <!-- consultation -->', consEnd: '  <!-- final cta -->',
  footStart: '  <!-- footer -->', footEnd: '  <!-- purchase ticker -->',
  namesHtml: P.NAMES_MOBILE, consHtml: P.CONSULT_MOBILE, footHtml: F.FOOTER_MOBILE,
});
