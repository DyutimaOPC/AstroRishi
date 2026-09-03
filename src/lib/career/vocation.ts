/**
 * What each number tends to be good at earning a living from.
 *
 * This is the report's own declared rubric, in the same spirit as the affinity
 * matrix: a defensible reading of standard Indian numerological practice rather
 * than a received text. It is stated once, here, so the whole report agrees
 * with itself and a change is a change in one place.
 */
export interface Vocation {
  number: number;
  title: string;
  /** The verb the number works by. */
  mode: string;
  /** Kinds of work it tends to fit. */
  fields: string[];
  /** Conditions it does well in. */
  thrivesIn: string;
  /** What quietly exhausts it, however well paid. */
  drainedBy: string;
  /** How money tends to behave for this number. */
  money: string;
  /** Leaning on the job ↔ business axis, 0 = employed structure, 1 = own venture. */
  venture: number;
}

export const VOCATION: Readonly<Record<number, Vocation>> = {
  1: {
    number: 1, title: 'The one who decides', mode: 'leading',
    fields: ['running your own outfit', 'heading a function', 'independent practice', 'anything with your name on the door'],
    thrivesIn: 'clear authority and the freedom to choose the direction',
    drainedBy: 'committee decisions and having to ask permission for small things',
    money: 'arrives in steps tied to position — it moves when your authority moves, not gradually',
    venture: 0.85,
  },
  2: {
    number: 2, title: 'The one who holds it together', mode: 'partnering',
    fields: ['second-in-command roles', 'people and HR work', 'counselling and mediation', 'partnerships and alliances'],
    thrivesIn: 'a trusted pairing where your judgement is asked for privately',
    drainedBy: 'public confrontation and being made to decide alone at speed',
    money: 'steadier than most, and usually best when it comes through a partnership rather than solo effort',
    venture: 0.3,
  },
  3: {
    number: 3, title: 'The one who explains', mode: 'expressing',
    fields: ['teaching and training', 'law and advocacy', 'content, media and creative direction', 'advisory work'],
    thrivesIn: 'an audience, a platform, and variety in the subject matter',
    drainedBy: 'silent back-office detail with nobody to explain it to',
    money: 'follows visibility — when people can see your work, it pays; when you go quiet, it thins',
    venture: 0.6,
  },
  4: {
    number: 4, title: 'The one who builds the machine', mode: 'systematising',
    fields: ['engineering and operations', 'compliance and audit', 'logistics and supply', 'administration at scale'],
    thrivesIn: 'a defined brief, real constraints and time to do it properly',
    drainedBy: 'constant reinvention and vague instructions that change weekly',
    money: 'accumulates rather than spikes — slow, reliable, and easily under-asked for',
    venture: 0.25,
  },
  5: {
    number: 5, title: 'The one who moves it', mode: 'connecting',
    fields: ['sales and business development', 'trading and brokerage', 'travel, transport and import-export', 'media and communications'],
    thrivesIn: 'movement, new people, and a number to chase',
    drainedBy: 'long stretches of sameness and work with no visible scoreboard',
    money: 'comes in bursts and leaves the same way; the earning is rarely the problem, the holding is',
    venture: 0.75,
  },
  6: {
    number: 6, title: 'The one who makes it good', mode: 'caring',
    fields: ['design and the aesthetic trades', 'hospitality and food', 'healthcare and wellbeing', 'family business and luxury goods'],
    thrivesIn: 'work with a human being at the end of it and something beautiful to show',
    drainedBy: 'ugly, harsh or conflict-heavy environments, whatever they pay',
    money: 'tends to be comfortable rather than large, and is often spent on other people first',
    venture: 0.5,
  },
  7: {
    number: 7, title: 'The one who goes deep', mode: 'investigating',
    fields: ['research and analysis', 'specialist and technical practice', 'audit and forensics', 'teaching at depth, or spiritual work'],
    thrivesIn: 'quiet, difficulty, and being left alone with a hard problem',
    drainedBy: 'constant client-facing noise and being asked to be a generalist',
    money: 'lags the work for years and then corrects sharply once the expertise is undeniable',
    venture: 0.4,
  },
  8: {
    number: 8, title: 'The one who builds scale', mode: 'organising',
    fields: ['finance and accounting', 'real estate and infrastructure', 'manufacturing', 'law and large institutions'],
    thrivesIn: 'scale, measurable outcomes and long horizons',
    drainedBy: 'frivolous work with nothing to point at when it is finished',
    money: 'is the number itself — capacity is high, but it arrives late and demands discipline to keep',
    venture: 0.7,
  },
  9: {
    number: 9, title: 'The one who fights for it', mode: 'driving',
    fields: ['medicine and surgery', 'defence, safety and emergency work', 'sport and physical trades', 'turnarounds, causes and activism'],
    thrivesIn: 'urgency, a real problem, and something worth fighting for',
    drainedBy: 'passivity, slow bureaucracy and work with no stakes',
    money: 'follows effort directly and rarely arrives without it',
    venture: 0.6,
  },
};

/**
 * Free-text occupations, matched to numbers by keyword.
 *
 * Deliberately partial. When nothing matches we say so and fall back to the
 * closed employment question rather than guessing — a wrong reading of what
 * someone does for a living discredits the whole report on page one.
 */
const OCCUPATION: ReadonlyArray<readonly [number, readonly string[]]> = [
  [1, ['founder', 'ceo', 'owner', 'proprietor', 'director', 'entrepreneur', 'head', 'chief', 'md', 'managing']],
  [2, ['hr', 'human resource', 'counsel', 'therapist', 'mediat', 'partner', 'assistant', 'support', 'coordinator', 'secretary', 'diplomat']],
  [3, ['teach', 'professor', 'lectur', 'tutor', 'trainer', 'lawyer', 'advocate', 'writer', 'author', 'journalist', 'content', 'media', 'market', 'creative', 'advis', 'consult', 'coach', 'speaker']],
  [4, ['engineer', 'developer', 'programmer', 'software', 'technician', 'operations', 'admin', 'compliance', 'quality', 'logistics', 'supply', 'clerk', 'data', 'devops', 'architect']],
  [5, ['sales', 'business development', 'bd ', 'marketing', 'trader', 'trading', 'broker', 'agent', 'travel', 'transport', 'import', 'export', 'driver', 'courier', 'retail', 'shop']],
  [6, ['design', 'interior', 'fashion', 'chef', 'cook', 'hotel', 'hospitality', 'restaurant', 'nurse', 'care', 'beautic', 'salon', 'artist', 'photograph', 'event', 'jewel']],
  [7, ['research', 'scientist', 'analyst', 'analytics', 'audit', 'statist', 'librarian', 'astrolog', 'priest', 'monk', 'phd', 'academic', 'forensic']],
  [8, ['account', 'finance', 'financial', 'banker', 'banking', 'ca ', 'chartered', 'cfo', 'invest', 'real estate', 'property', 'builder', 'construct', 'manufactur', 'factory', 'insurance', 'legal', 'judge']],
  [9, ['doctor', 'surgeon', 'physician', 'dentist', 'medical', 'army', 'navy', 'air force', 'defence', 'police', 'fire', 'security', 'sport', 'athlete', 'coach', 'fitness', 'social work', 'ngo', 'activist']],
];

export interface OccupationMatch {
  number: number;
  matched: string;
}

/** The number a stated occupation belongs to, or null when we cannot tell. */
export function occupationNumber(raw: string | undefined): OccupationMatch | null {
  if (!raw) return null;
  const s = ` ${raw.toLowerCase().replace(/[^a-z ]+/g, ' ').replace(/\s+/g, ' ')} `;
  // Longest keyword wins, so "business development" beats "business".
  let best: OccupationMatch | null = null;
  let bestLen = 0;
  for (const [number, words] of OCCUPATION)
    for (const w of words)
      if (s.includes(w.trim().length === w.length ? ` ${w}` : w) && w.length > bestLen) {
        best = { number, matched: w.trim() };
        bestLen = w.length;
      }
  return best;
}

/** Fallback when the occupation text tells us nothing. A closed set always answers. */
export const EMPLOYMENT_VENTURE: Readonly<Record<string, number>> = {
  Salaried: 0.15, 'Self-employed': 0.7, 'Business owner': 0.9, 'Between roles': 0.5, Studying: 0.4,
};
