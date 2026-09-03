import { reduceToDigit, reduceKeepMaster } from './reduce';

export interface BirthDate {
  day: number;
  month: number;
  year: number;
}

export function parseDob(iso: string): BirthDate {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!m) throw new Error(`Date of birth must be YYYY-MM-DD, got "${iso}"`);
  const [year, month, day] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const d = new Date(Date.UTC(year, month - 1, day));
  if (d.getUTCFullYear() !== year || d.getUTCMonth() !== month - 1 || d.getUTCDate() !== day)
    throw new Error(`"${iso}" is not a real calendar date`);
  return { day, month, year };
}

const digitsOf = (b: BirthDate): number[] =>
  `${String(b.day).padStart(2, '0')}${String(b.month).padStart(2, '0')}${b.year}`
    .split('')
    .map(Number);

/** Sum of every digit in the date of birth, reduced. Masters preserved. */
export function lifePath(b: BirthDate): number {
  return reduceKeepMaster(digitsOf(b).reduce((a, d) => a + d, 0));
}

/** Day of the month reduced. Also called mulank or the driver number. */
export const birthNumber = (b: BirthDate): number => reduceToDigit(b.day);

/** Life path reduced to a single digit. Also called bhagyank or the conductor. */
export const destinyNumber = (b: BirthDate): number => reduceToDigit(lifePath(b));

export const dobDigits = digitsOf;
