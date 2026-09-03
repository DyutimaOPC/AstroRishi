/**
 * How well two single-digit numbers sit together, 0-100.
 *
 * Numerology has no canonical compatibility table, so this is AstroRishi's declared
 * rubric rather than a received one. It is built from the planetary rulerships
 * (1 Sun, 2 Moon, 3 Jupiter, 4 Rahu, 5 Mercury, 6 Venus, 7 Ketu, 8 Saturn,
 * 9 Mars) and their traditional friendships, then hand-tuned for the pairs that
 * matter most in name work. It is symmetric and every value is deliberate;
 * the tests assert both properties so it cannot drift.
 */
const M: readonly (readonly number[])[] = [
  /*        1   2   3   4   5   6   7   8   9 */
  /* 1 */ [90, 80, 85, 45, 70, 50, 85, 40, 80],
  /* 2 */ [80, 85, 75, 50, 65, 80, 80, 45, 60],
  /* 3 */ [85, 75, 90, 45, 70, 65, 75, 40, 85],
  /* 4 */ [45, 50, 45, 75, 80, 75, 60, 85, 40],
  /* 5 */ [70, 65, 70, 80, 85, 80, 55, 75, 50],
  /* 6 */ [50, 80, 65, 75, 80, 90, 60, 80, 45],
  /* 7 */ [85, 80, 75, 60, 55, 60, 90, 45, 55],
  /* 8 */ [40, 45, 40, 85, 75, 80, 45, 85, 40],
  /* 9 */ [80, 60, 85, 40, 50, 45, 55, 40, 90],
];

export const AFFINITY = M;

export function affinity(a: number, b: number): number {
  const x = ((a - 1) % 9 + 9) % 9;
  const y = ((b - 1) % 9 + 9) % 9;
  return M[x][y];
}

export type Verdict = 'strong' | 'workable' | 'strained';

export const verdict = (score: number): Verdict =>
  score >= 78 ? 'strong' : score >= 62 ? 'workable' : 'strained';
