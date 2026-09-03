type P = { size?: number; className?: string; style?: React.CSSProperties };
const base = (size: number, className?: string) => ({
  width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
  stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const, className: `shrink-0 ${className ?? ''}`,
});

export const ArrowRight = ({ size = 16, className, style }: P) => (
  <svg {...base(size, className)} style={style}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
);
export const ArrowLeft = ({ size = 16, className }: P) => (
  <svg {...base(size, className)}><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
);
export const Check = ({ size = 15, className }: P) => (
  <svg {...base(size, className)} strokeWidth={2.4}><polyline points="20 6 9 17 4 12" /></svg>
);
export const Lock = ({ size = 14, className }: P) => (
  <svg {...base(size, className)}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
);
export const Shield = ({ size = 18, className }: P) => (
  <svg {...base(size, className)} strokeWidth={1.8}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
);
export const Chat = ({ size = 18, className }: P) => (
  <svg {...base(size, className)} strokeWidth={1.8}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
);
export const User = ({ size = 18, className }: P) => (
  <svg {...base(size, className)} strokeWidth={1.8}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);
export const Card = ({ size = 18, className }: P) => (
  <svg {...base(size, className)} strokeWidth={1.8}><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
);
export const Star = ({ size = 13, className }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={`shrink-0 ${className ?? ''}`}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
export const Whatsapp = ({ size = 24, className }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={`shrink-0 ${className ?? ''}`}>
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.9-4.45 9.9-9.91C21.95 6.45 17.5 2 12.04 2zm5.8 14.16c-.24.68-1.2 1.26-1.96 1.42-.52.11-1.2.2-3.5-.75-2.94-1.22-4.83-4.2-4.98-4.4-.14-.2-1.18-1.57-1.18-3s.75-2.13 1.02-2.42c.27-.29.59-.36.78-.36.2 0 .39 0 .56.01.18.01.42-.07.66.5.24.58.82 2 .89 2.15.07.14.12.31.02.5-.09.2-.14.32-.28.49-.14.17-.3.37-.42.5-.14.14-.29.29-.12.57.16.29.73 1.2 1.56 1.95 1.08.96 1.98 1.26 2.27 1.4.29.14.45.12.62-.07.17-.2.71-.83.9-1.11.19-.29.38-.24.64-.14.26.09 1.67.79 1.96.93.29.14.48.22.55.34.07.12.07.7-.17 1.38z" />
  </svg>
);
