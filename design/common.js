const FONTS = 'https://fonts.googleapis.com/css2?family=Rozha+One&family=Familjen+Grotesk:ital,wght@0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@400;500;600&display=swap';

const BASE_CSS = `
    body { margin:0; background:#F2F1EC; color:#1A1714;
      font-family:"Familjen Grotesk","Helvetica Neue",Helvetica,Arial,sans-serif;
      font-size:16px; line-height:1.6; -webkit-font-smoothing:antialiased; }
    a { color:#BE3A2B; text-decoration:none; } a:hover { color:#8F2B20; }
    .disp { font-family:"Rozha One",Georgia,"Times New Roman",serif; font-weight:400; letter-spacing:-.005em; }
    .mono { font-family:"IBM Plex Mono",ui-monospace,Menlo,monospace; }
    .lbl { font-family:"IBM Plex Mono",ui-monospace,Menlo,monospace; font-size:10px;
      letter-spacing:.2em; text-transform:uppercase; color:#8A8279; }
    .ph { color:#8A8279; border-bottom:1px dotted #BE3A2B; }
    .rule { height:1px; background:#D5D1C6; }
    .btn { background:#BE3A2B; color:#F9F1EF; padding:16px 28px; font-weight:600; font-size:15.5px;
      display:inline-flex; align-items:center; justify-content:center; gap:10px; }
    .btn-o { border:1.5px solid #1A1714; color:#1A1714; padding:14.5px 26px; font-weight:600;
      font-size:15.5px; display:inline-flex; align-items:center; justify-content:center; gap:10px; }
    .tick { flex:none; }`;

const head = extra => `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
  <link rel="stylesheet" href="${FONTS}">
  <style>${BASE_CSS}${extra || ''}
  </style>
</helmet>
`;
const foot = '</x-dc>\n</body>\n</html>\n';

const arrow = (s = 16, c = 'currentColor') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tick"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;
const check = (c = '#2F6B4F', s = 15) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" class="tick"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
const star = (c = '#D99A2B', s = 13) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="${c}"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
const lock = (c = '#8A8279', s = 13) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tick"><rect x="3" y="11" width="18" height="11" rx="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`;

// Chaldean letter values
const CH = { A:1,B:2,C:3,D:4,E:5,F:8,G:3,H:5,I:1,J:1,K:2,L:3,M:4,N:5,O:7,P:8,Q:1,R:2,S:3,T:4,U:6,V:6,W:6,X:5,Y:1,Z:7 };
const letters = w => w.toUpperCase().split('').filter(c => CH[c]);
const sum = w => letters(w).reduce((a, c) => a + CH[c], 0);
const reduce1 = n => { while (n > 9) n = String(n).split('').reduce((a, d) => a + +d, 0); return n; };
const nameNum = n => ({ total: sum(n), digit: reduce1(sum(n)) });

module.exports = { head, foot, arrow, check, star, lock, CH, letters, sum, reduce1, nameNum, BASE_CSS };
