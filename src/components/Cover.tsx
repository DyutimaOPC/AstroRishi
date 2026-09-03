import { PRODUCTS, type ProductSlug } from '@/lib/config/products';

const GOLD = '#D9AE55', GOLD2 = '#F0D492';

/** Deeper shade for the spine, lighter for the front board, per product hue. */
const SHADE: Record<ProductSlug, [string, string]> = {
  'name-correction': ['#7B1010', '#B92626'],
  numerology: ['#8E3D06', '#D96D12'],
  'career-money': ['#13452A', '#276F46'],
  relationship: ['#6E0E2E', '#AC1B4C'],
  kundli: ['#4E0C0C', '#7E1616'],
};

const TITLE: Record<ProductSlug, [string, string]> = {
  'name-correction': ['NAME', 'CORRECTION'],
  numerology: ['COMPLETE', 'NUMEROLOGY'],
  'career-money': ['CAREER', '& MONEY'],
  relationship: ['RELATIONSHIP', 'CLARITY'],
  kundli: ['PREMIUM', 'KUNDLI'],
};

function corners(x: number, y: number, w: number, h: number) {
  const r = 7, o = 2.4;
  const one = (px: number, py: number, sx: number, sy: number, k: string) => (
    <g key={k}>
      <path d={`M${px} ${py + sy * r} V${py + sy * o} a${o} ${o} 0 0 ${sx * sy > 0 ? 1 : 0} ${sx * o} ${-sy * o} H${px + sx * r}`} fill="none" stroke={GOLD} strokeWidth={0.7} />
      <circle cx={px + sx * 2.6} cy={py + sy * 2.6} r={1} fill={GOLD} />
    </g>
  );
  return [one(x, y, 1, 1, 'tl'), one(x + w, y, -1, 1, 'tr'), one(x, y + h, 1, -1, 'bl'), one(x + w, y + h, -1, -1, 'br')];
}

/** One motif per report, so the five read as a set without being interchangeable. */
function motif(slug: ProductSlug, cx: number, cy: number) {
  if (slug === 'name-correction')
    return (
      <g>
        <circle cx={cx} cy={cy} r={22} fill="none" stroke={GOLD} strokeWidth={0.8} />
        <circle cx={cx} cy={cy} r={17} fill="none" stroke={GOLD} strokeWidth={0.4} opacity={0.7} />
        {Array.from({ length: 9 }, (_, i) => {
          const a = (i / 9) * Math.PI * 2 - Math.PI / 2;
          return (
            <g key={i}>
              <line x1={cx + Math.cos(a) * 17} y1={cy + Math.sin(a) * 17} x2={cx + Math.cos(a) * 22} y2={cy + Math.sin(a) * 22} stroke={GOLD} strokeWidth={0.4} opacity={0.8} />
              <text x={cx + Math.cos(a) * 12.4} y={cy + Math.sin(a) * 12.4 + 2.2} fontSize={5.2} fill={GOLD2} textAnchor="middle" fontFamily="Georgia, serif">{i + 1}</text>
            </g>
          );
        })}
      </g>
    );
  if (slug === 'numerology') {
    const n = [4, 9, 2, 3, 5, 7, 8, 1, 6], k = 10.5;
    return (
      <g>
        <circle cx={cx} cy={cy} r={23} fill="none" stroke={GOLD} strokeWidth={0.8} />
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <line x1={cx - 15.5} y1={cy - 15.5 + i * k} x2={cx + 15.5} y2={cy - 15.5 + i * k} stroke={GOLD} strokeWidth={0.4} opacity={0.75} />
            <line x1={cx - 15.5 + i * k} y1={cy - 15.5} x2={cx - 15.5 + i * k} y2={cy + 15.5} stroke={GOLD} strokeWidth={0.4} opacity={0.75} />
          </g>
        ))}
        {n.map((v, i) => (
          <text key={i} x={cx - 15.5 + (i % 3) * k + k / 2} y={cy - 15.5 + Math.floor(i / 3) * k + k / 2 + 2.1} fontSize={6} fill={GOLD2} textAnchor="middle" fontFamily="Georgia, serif">{v}</text>
        ))}
      </g>
    );
  }
  if (slug === 'career-money')
    return (
      <g>
        <circle cx={cx} cy={cy} r={23} fill="none" stroke={GOLD} strokeWidth={0.8} />
        <circle cx={cx} cy={cy} r={6} fill="none" stroke={GOLD} strokeWidth={0.7} />
        <circle cx={cx} cy={cy} r={2} fill={GOLD} />
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * Math.PI * 2, b = a + Math.PI / 8;
          return (
            <g key={i}>
              <line x1={cx + Math.cos(a) * 6} y1={cy + Math.sin(a) * 6} x2={cx + Math.cos(a) * 23} y2={cy + Math.sin(a) * 23} stroke={GOLD} strokeWidth={0.5} opacity={0.85} />
              <circle cx={cx + Math.cos(b) * 16} cy={cy + Math.sin(b) * 16} r={1.5} fill={GOLD} opacity={0.9} />
            </g>
          );
        })}
      </g>
    );
  if (slug === 'relationship')
    return (
      <g>
        <circle cx={cx - 8} cy={cy} r={16} fill="none" stroke={GOLD} strokeWidth={0.8} />
        <circle cx={cx + 8} cy={cy} r={16} fill="none" stroke={GOLD} strokeWidth={0.8} />
        <circle cx={cx - 8} cy={cy} r={12} fill="none" stroke={GOLD} strokeWidth={0.35} opacity={0.65} />
        <circle cx={cx + 8} cy={cy} r={12} fill="none" stroke={GOLD} strokeWidth={0.35} opacity={0.65} />
        <circle cx={cx} cy={cy} r={1.6} fill={GOLD2} />
      </g>
    );
  const h = 23;
  return (
    <g>
      <rect x={cx - h} y={cy - h} width={h * 2} height={h * 2} fill="none" stroke={GOLD} strokeWidth={0.8} />
      <path d={`M${cx - h} ${cy - h} L${cx + h} ${cy + h} M${cx + h} ${cy - h} L${cx - h} ${cy + h}`} stroke={GOLD} strokeWidth={0.4} opacity={0.8} />
      <path d={`M${cx} ${cy - h} L${cx - h} ${cy} L${cx} ${cy + h} L${cx + h} ${cy} Z`} fill="none" stroke={GOLD} strokeWidth={0.6} />
      <circle cx={cx} cy={cy} r={2} fill={GOLD} />
    </g>
  );
}

/**
 * `uid` must differ between two covers for the same product on one page —
 * SVG gradient ids are document-global and silently collide otherwise.
 */
export function Cover({ slug, width = 150, uid }: { slug: ProductSlug; width?: number; uid?: string }) {
  const W = 150, H = 210, sp = 9;
  const [dark, light] = SHADE[slug];
  const mid = PRODUCTS[slug].cover;
  const [t1, t2] = TITLE[slug];
  const id = uid ?? slug;
  const cx = (W + sp) / 2, fx = 16, fy = 11, fw = W - 16 - fx, fh = H - 11 - fy;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={width} height={(width * H) / W} role="img"
      aria-label={`${PRODUCTS[slug].name} Report cover`}
      style={{ filter: 'drop-shadow(0 2px 3px rgba(26,23,20,.22)) drop-shadow(0 16px 28px rgba(26,23,20,.32))' }}>
      <defs>
        <linearGradient id={`bg-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={dark} /><stop offset=".08" stopColor={light} />
          <stop offset=".55" stopColor={mid} /><stop offset="1" stopColor={dark} />
        </linearGradient>
        <linearGradient id={`sp-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={dark} /><stop offset="1" stopColor="#000" stopOpacity=".28" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#bg-${id})`} />
      <rect width={sp} height={H} fill={`url(#sp-${id})`} />
      <line x1={sp + 0.8} y1={0} x2={sp + 0.8} y2={H} stroke={GOLD} strokeWidth={0.5} opacity={0.55} />
      <rect x={fx} y={fy} width={fw} height={fh} fill="none" stroke={GOLD} strokeWidth={0.9} />
      <rect x={fx + 3} y={fy + 3} width={fw - 6} height={fh - 6} fill="none" stroke={GOLD} strokeWidth={0.35} opacity={0.6} />
      {corners(fx + 6, fy + 6, fw - 12, fh - 12)}
      <text x={cx} y={fy + 34} fontSize={13} fill={GOLD2} textAnchor="middle" fontFamily="Georgia, serif" letterSpacing="1.1">{t1}</text>
      <text x={cx} y={fy + 49} fontSize={13} fill={GOLD2} textAnchor="middle" fontFamily="Georgia, serif" letterSpacing="1.1">{t2}</text>
      <text x={cx} y={fy + 62} fontSize={7} fill={GOLD} textAnchor="middle" fontFamily="Georgia, serif" letterSpacing="3.4">REPORT</text>
      <line x1={cx - 20} y1={fy + 70} x2={cx + 20} y2={fy + 70} stroke={GOLD} strokeWidth={0.5} opacity={0.8} />
      {motif(slug, cx, fy + 100)}
      <line x1={cx - 26} y1={H - 52} x2={cx + 26} y2={H - 52} stroke={GOLD} strokeWidth={0.4} opacity={0.6} />
      <image href="/logo-icon-gold.png" x={cx - 14} y={H - 47} width={28} height={28} preserveAspectRatio="xMidYMid meet" />
      <text x={cx} y={H - 18} fontSize={8} fill={GOLD2} textAnchor="middle" fontFamily="Georgia, serif" letterSpacing="1.4">ASTRORISHI</text>
      <text x={cx} y={H - 10} fontSize={4.2} fill={GOLD} textAnchor="middle" fontFamily="Georgia, serif" letterSpacing="1.5" opacity={0.85}>PREPARED FOR YOU</text>
    </svg>
  );
}
