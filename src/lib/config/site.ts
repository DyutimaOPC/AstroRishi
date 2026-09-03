export const SITE = {
  whatsapp: '7976042047',
  whatsappLink: 'https://wa.me/7976042047',
  supportEmail: 'help@astrorishi.org',
  offerEndsOn: '31 October 2026',
  turnaround: 'Instant',
  kundliEta: 'October 2026',
} as const;

export const DOMAIN = 'astrorishi.org';
export const BRAND = { name: 'AstroRishi', devanagari: 'ऋषि' } as const;

export const isPlaceholder = (v: string): boolean => v.trimStart().startsWith('[[');

export const CONSULTATION_ENABLED = false;
