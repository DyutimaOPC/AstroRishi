/**
 * Everything still waiting on the business. One file to fill in before launch —
 * every value below renders with a dotted underline until it stops starting
 * with "[[", so a placeholder can never quietly ship looking like real data.
 */
export const SITE = {
  companyName: '[[ COMPANY_NAME ]]',
  gst: '[[ GST_NUMBER ]]',
  address: '[[ REGISTERED_ADDRESS ]]',
  whatsapp: '[[ WHATSAPP ]]',
  supportEmail: '[[ SUPPORT_EMAIL ]]',
  offerEndsOn: '[[ OFFER_END_DATE ]]',
  turnaround: '[[ 24h ]]',
  rating: '[[ 4.8 ]]',
  reviewCount: '[[ n ]]',
  callsPerWeek: '[[ n ]]',
  panditBio: '[[ PANDIT MAYA — ONE LINE OF BACKGROUND ]]',
  pagesUnknown: '[[ n ]]',
  kundliEta: '[[ KUNDLI_LAUNCH_MONTH ]]',
} as const;

export const isPlaceholder = (v: string): boolean => v.trimStart().startsWith('[[');

/**
 * The consultation upsell is switched off until there is an astrologer to take
 * the calls. Everything for it is still here and still typed — flip this to true
 * and it returns everywhere at once. Do not ship it on without someone rostered:
 * selling a call nobody answers is worse than not selling one.
 */
export const DOMAIN = 'astrorishi.org';
export const BRAND = { name: 'AstroRishi', devanagari: 'ऋषि' } as const;

export const CONSULTATION_ENABLED = false;

export const PANDIT = { name: 'Pandit Maya', role: "AstroRishi's in-house jyotish" } as const;
