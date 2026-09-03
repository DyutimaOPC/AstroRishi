import { affinity } from './affinity';
import { RULER } from './lucky';
import { reduceToDigit } from './reduce';
import { normalise, lettersOf, CHALDEAN } from './letters';
import type { BirthDate } from './core';
import type { LoShu } from './loshu';

/* ------------------------------------------------------------------ *
 * Named numbers — the terms customers already know from a jyotish.
 * ------------------------------------------------------------------ */

export interface NamedNumber {
  key: 'moolank' | 'bhagyank' | 'naamank';
  label: string;
  hindi: string;
  value: number;
  ruler: string;
  how: string;
}

export function namedNumbers(birth: BirthDate, lifePathValue: number, nameDigit: number): NamedNumber[] {
  const moolank = reduceToDigit(birth.day);
  return [
    { key: 'moolank', label: 'Birth number', hindi: 'मूलांक', value: moolank,
      ruler: RULER[moolank], how: `Your day of birth, ${birth.day}, reduced to a single digit.` },
    { key: 'bhagyank', label: 'Destiny number', hindi: 'भाग्यांक', value: reduceToDigit(lifePathValue),
      ruler: RULER[reduceToDigit(lifePathValue)], how: 'Every digit of your birth date, added and reduced.' },
    { key: 'naamank', label: 'Name number', hindi: 'नामांक', value: nameDigit,
      ruler: RULER[nameDigit], how: 'Chaldean values of every letter of your name, added and reduced.' },
  ];
}

/** The arithmetic trail, so a reader can check the number themselves. */
export function lifePathWorking(birth: BirthDate): string[] {
  const d = String(birth.day).padStart(2, '0');
  const m = String(birth.month).padStart(2, '0');
  const y = String(birth.year);
  const digits = `${d}${m}${y}`.split('').map(Number);
  const total = digits.reduce((a, n) => a + n, 0);
  const steps = [`${d} ${m} ${y}  →  ${digits.join(' + ')} = ${total}`];
  let v = total;
  while (v > 9) {
    const parts = String(v).split('').map(Number);
    const next = parts.reduce((a, n) => a + n, 0);
    steps.push(`${v}  →  ${parts.join(' + ')} = ${next}`);
    v = next;
  }
  return steps;
}

export interface WordValue {
  word: string;
  letters: { letter: string; value: number }[];
  total: number;
  digit: number;
}

/** Each part of a name valued separately — first name and surname carry their own vibration. */
export function wordBreakdown(fullName: string): WordValue[] {
  return normalise(fullName).split(' ').filter(Boolean).map((word) => {
    const letters = lettersOf(word).map((l) => ({ letter: l, value: CHALDEAN[l] ?? 0 }));
    const total = letters.reduce((a, l) => a + l.value, 0);
    return { word, letters, total, digit: reduceToDigit(total) };
  });
}

/* ------------------------------------------------------------------ *
 * Which name numbers actually suit this person.
 * ------------------------------------------------------------------ */

/**
 * How well a candidate name number sits with the two numbers that matter:
 * the birth number and the destiny number. This is the figure the report
 * shows as a harmony percentage, and it is what ranks corrected spellings.
 */
export const harmony = (nameDigit: number, moolank: number, bhagyank: number): number =>
  Math.round(affinity(nameDigit, moolank) * 0.5 + affinity(nameDigit, bhagyank) * 0.5);

export interface NumberVerdict { number: number; harmony: number; ruler: string }

export interface AllowedNumbers {
  ranked: NumberVerdict[];
  /** Numbers that sit well with both core numbers. */
  suits: number[];
  /** Numbers that fight at least one of them. */
  avoid: number[];
}

/**
 * Derived from the affinity rubric rather than a second hand-written table, so
 * there is one source of truth for what agrees with what.
 */
export function allowedNumbers(moolank: number, bhagyank: number): AllowedNumbers {
  const ranked = Array.from({ length: 9 }, (_, i) => i + 1)
    .map((n) => ({ number: n, harmony: harmony(n, moolank, bhagyank), ruler: RULER[n] }))
    .sort((a, b) => b.harmony - a.harmony || a.number - b.number);
  // Relative, not absolute. When the birth and destiny numbers are themselves in
  // tension no number can score highly against both, and an absolute cut-off
  // would hand that person an empty list. The honest answer is still "these are
  // the best available to you", which the ranked table above lets them check.
  const best = ranked[0].harmony;
  const worst = ranked[ranked.length - 1].harmony;
  const suits = ranked.filter((r, i) => i < 4 && r.harmony >= best - 8);
  const avoid = ranked.filter((r) => r.harmony <= Math.min(worst + 4, best - 15));
  return {
    ranked,
    suits: suits.map((r) => r.number).sort((a, b) => a - b),
    avoid: avoid.map((r) => r.number).sort((a, b) => a - b),
  };
}

/* ------------------------------------------------------------------ *
 * Everyday numbers people actually choose.
 * ------------------------------------------------------------------ */

export interface NumberGuidance {
  totals: number[];
  mobileEndings: string[];
  vehicleEndings: number[];
  pins: string[];
}

/**
 * Mobile, vehicle and PIN suggestions. Every value is generated by reducing
 * digits against the suitable set, so nothing here is decorative.
 */
export function numberGuidance(suits: number[]): NumberGuidance {
  const good = suits.length ? suits : [1, 3, 5, 6];
  const isGood = (n: number) => good.includes(reduceToDigit(n));

  const mobileEndings: string[] = [];
  for (let a = 0; a <= 9 && mobileEndings.length < 4; a++)
    for (let b = 0; b <= 9 && mobileEndings.length < 4; b++)
      if (a + b > 0 && isGood(a + b)) mobileEndings.push(`…${a}${b}`);

  const pins: string[] = [];
  for (let n = 1000; n <= 9999 && pins.length < 4; n += 137) {
    const sum = String(n).split('').reduce((t, d) => t + Number(d), 0);
    if (isGood(sum) && new Set(String(n)).size >= 3) pins.push(String(n));
  }

  return {
    totals: good,
    mobileEndings,
    vehicleEndings: good.slice(0, 4),
    pins,
  };
}

/* ------------------------------------------------------------------ *
 * The grid, summarised.
 * ------------------------------------------------------------------ */

export interface EnergyBar { label: string; value: number; from: string }

/** Reads the grid into five plain-language strengths. Weights are declared, not tuned. */
export function energyProfile(grid: LoShu): EnergyBar[] {
  const c = (n: number) => Math.min(grid.counts[n] ?? 0, 3);
  const pct = (parts: number[]) => Math.min(100, Math.round((parts.reduce((a, b) => a + b, 0) / parts.length) * 100));
  const lvl = (n: number) => [0.25, 0.6, 0.85, 1][c(n)];

  return [
    { label: 'Drive and leadership', value: pct([lvl(1), lvl(8), lvl(9)]), from: '1 · 8 · 9' },
    { label: 'Communication', value: pct([lvl(3), lvl(5)]), from: '3 · 5' },
    { label: 'Structure and follow-through', value: pct([lvl(4), lvl(8)]), from: '4 · 8' },
    { label: 'Emotional steadiness', value: pct([lvl(2), lvl(6)]), from: '2 · 6' },
    { label: 'Reflection and depth', value: pct([lvl(7), lvl(2)]), from: '7 · 2' },
  ];
}

export interface Numeroscope {
  dominant: { number: number; count: number; ruler: string } | null;
  supporting: { number: number; count: number; ruler: string } | null;
  missing: { number: number; ruler: string }[];
  strongPlanets: string[];
  weakPlanets: string[];
  filled: number;
}

export function numeroscope(grid: LoShu): Numeroscope {
  const present = Object.keys(grid.counts).map(Number)
    .filter((n) => grid.counts[n] > 0)
    .sort((a, b) => grid.counts[b] - grid.counts[a] || a - b);
  const [d, s] = present;
  return {
    dominant: d ? { number: d, count: grid.counts[d], ruler: RULER[d] } : null,
    supporting: s ? { number: s, count: grid.counts[s], ruler: RULER[s] } : null,
    missing: grid.missing.map((n) => ({ number: n, ruler: RULER[n] })),
    strongPlanets: present.map((n) => RULER[n]),
    weakPlanets: grid.missing.map((n) => RULER[n]),
    filled: present.length,
  };
}
