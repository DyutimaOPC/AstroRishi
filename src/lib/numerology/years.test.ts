import { describe, it, expect } from 'vitest';
import { personalYears, parseDob, reduceToDigit } from './index';

const BIRTH = parseDob('1992-08-23');

describe('personal years', () => {
  it('returns the run asked for, starting at the year given', () => {
    const y = personalYears(BIRTH, 2026, 5);
    expect(y).toHaveLength(5);
    expect(y.map((x) => x.year)).toEqual([2026, 2027, 2028, 2029, 2030]);
    expect(y[0].current).toBe(true);
    expect(y.slice(1).every((x) => !x.current)).toBe(true);
  });

  it('is the reduced sum of birth day, birth month and the year', () => {
    for (const y of personalYears(BIRTH, 2026, 9))
      expect(y.number).toBe(reduceToDigit(reduceToDigit(23) + reduceToDigit(8) + reduceToDigit(y.year)));
  });

  it('runs a nine-year cycle, so every number appears across nine years', () => {
    const nums = personalYears(BIRTH, 2026, 9).map((y) => y.number);
    expect(new Set(nums).size).toBe(9);
  });

  it('gives every year a ruler and a written theme', () => {
    for (const y of personalYears(BIRTH, 2026, 9)) {
      expect(y.ruler).toBeTruthy();
      expect(y.title).toBeTruthy();
      expect(y.body.length).toBeGreaterThan(60);
    }
  });

  it('describes a period, never a dated event', () => {
    for (const y of personalYears(BIRTH, 2026, 9)) {
      expect(y.body).not.toMatch(/\byou will\b/i);
      expect(y.body).not.toMatch(/guarantee/i);
      expect(y.body).not.toMatch(/\bin (January|March|June|October)\b/);
    }
  });

  it('is deterministic', () => {
    expect(JSON.stringify(personalYears(BIRTH, 2026))).toBe(JSON.stringify(personalYears(BIRTH, 2026)));
  });
});
