/* eslint-disable @next/next/no-img-element */

/**
 * The AstroRishi mark. Three prepared variants rather than CSS filters, because
 * a filtered raster loses the gold-on-maroon relationship inside the artwork:
 *
 *   full  — maroon figure, gold mandala. For light grounds.
 *   gold  — single-colour gold. For ink and for the five report cover hues.
 *   icon  — the central figure alone; the fine mandala rings dissolve below 64px.
 */
export type LogoTone = 'full' | 'gold' | 'ink';

const SRC: Record<LogoTone, string> = {
  full: '/logo.png',
  gold: '/logo-gold.png',
  ink: '/logo.png',
};

export function Logo({
  size = 40,
  tone = 'full',
  compact,
  className,
}: {
  size?: number;
  tone?: LogoTone;
  /**
   * Force the variant. Left unset, anything below 72px uses the figure-only
   * crop automatically: the mandala rings and the fine rays turn to mush at
   * chrome sizes, and every place the mark appears on this site is small.
   */
  compact?: boolean;
  className?: string;
}) {
  const useFigure = compact ?? size < 72;
  const src = useFigure
    ? (tone === 'gold' ? '/logo-icon-gold.png' : '/logo-icon.png')
    : SRC[tone];
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size, objectFit: 'contain', flex: 'none' }}
    />
  );
}

/** Mark plus wordmark, for the header and the report cover band. */
export function Wordmark({
  size = 30,
  tone = 'full',
  showDevanagari = true,
}: {
  size?: number;
  tone?: LogoTone;
  showDevanagari?: boolean;
}) {
  return (
    <span className={`flex items-center gap-2.5 ${tone === 'gold' ? 'text-haldi' : 'text-ink'}`}>
      <Logo size={size * 1.5} tone={tone} />
      <span className="flex items-baseline gap-2">
        <span className="disp leading-none" style={{ fontSize: size }}>ASTRORISHI</span>
        {showDevanagari && (
          <span className="disp leading-none opacity-60" style={{ fontSize: size * 0.42 }}>ऋषि</span>
        )}
      </span>
    </span>
  );
}
