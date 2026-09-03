import { reduceToDigit, reduceKeepMaster } from './reduce';

/**
 * Chaldean values run 1-8; 9 is never assigned to a letter because it is held
 * to be sacred. This is what separates Chaldean from Pythagorean and it is the
 * system the name reports use.
 */
export const CHALDEAN: Readonly<Record<string, number>> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 8, G: 3, H: 5, I: 1,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 7, P: 8, Q: 1, R: 2,
  S: 3, T: 4, U: 6, V: 6, W: 6, X: 5, Y: 1, Z: 7,
};

/** Pythagorean values run 1-9 in alphabet order. Used for destiny/soul/personality. */
export const PYTHAGOREAN: Readonly<Record<string, number>> = Object.fromEntries(
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((c, i) => [c, (i % 9) + 1]),
);

export const VOWELS = new Set(['A', 'E', 'I', 'O', 'U']);

export type System = 'chaldean' | 'pythagorean';
const table = (s: System) => (s === 'chaldean' ? CHALDEAN : PYTHAGOREAN);

/** Uppercase A-Z only; spaces, punctuation and digits are dropped. */
export function normalise(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase()
    .replace(/[^A-Z ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export const lettersOf = (name: string): string[] =>
  normalise(name).split('').filter((c) => c !== ' ');

export interface LetterValue {
  letter: string;
  value: number;
  isVowel: boolean;
}

export function breakdown(name: string, system: System = 'chaldean'): LetterValue[] {
  const t = table(system);
  return lettersOf(name).map((letter) => ({
    letter,
    value: t[letter] ?? 0,
    isVowel: VOWELS.has(letter),
  }));
}

export interface NameNumber {
  total: number;
  /** Reduced, preserving 11/22/33. */
  number: number;
  /** Always a single digit, for compatibility lookups. */
  digit: number;
  letters: LetterValue[];
}

function tally(letters: LetterValue[]): Omit<NameNumber, 'letters'> {
  const total = letters.reduce((a, l) => a + l.value, 0);
  return { total, number: reduceKeepMaster(total), digit: reduceToDigit(total) };
}

/** Full name value. Chaldean by default — this is the "name number". */
export function nameNumber(name: string, system: System = 'chaldean'): NameNumber {
  const letters = breakdown(name, system);
  return { ...tally(letters), letters };
}

/** Vowels only. Pythagorean by convention. */
export function soulUrge(name: string): NameNumber {
  const letters = breakdown(name, 'pythagorean').filter((l) => l.isVowel);
  return { ...tally(letters), letters };
}

/** Consonants only. Pythagorean by convention. */
export function personality(name: string): NameNumber {
  const letters = breakdown(name, 'pythagorean').filter((l) => !l.isVowel);
  return { ...tally(letters), letters };
}

/** All letters, Pythagorean — the destiny / expression number. */
export const destiny = (name: string): NameNumber => nameNumber(name, 'pythagorean');
