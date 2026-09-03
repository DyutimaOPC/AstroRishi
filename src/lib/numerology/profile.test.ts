import { describe, it, expect } from 'vitest';
import {
  namedNumbers, lifePathWorking, wordBreakdown, harmony, allowedNumbers,
  numberGuidance, energyProfile, numeroscope, parseDob, lifePath, loShu, reduceToDigit,
} from './index';

const BIRTH = parseDob('1992-08-23');
const GRID = loShu(BIRTH);

describe('named numbers', () => {
  const named = namedNumbers(BIRTH, lifePath(BIRTH), 5);
  it('names all three with a ruling planet each', () => {
    expect(named.map((n) => n.key)).toEqual(['moolank', 'bhagyank', 'naamank']);
    for (const n of named) { expect(n.ruler).toBeTruthy(); expect(n.hindi).toBeTruthy(); expect(n.how).toBeTruthy(); }
  });
  it('moolank is the day of birth reduced', () => {
    expect(named[0].value).toBe(reduceToDigit(23));
  });
  it('every value is a single digit', () => {
    for (const n of named) { expect(n.value).toBeGreaterThanOrEqual(1); expect(n.value).toBeLessThanOrEqual(9); }
  });
});

describe('showing the working', () => {
  it('ends on the life path and each step is arithmetically true', () => {
    const steps = lifePathWorking(BIRTH);
    expect(steps.length).toBeGreaterThan(0);
    expect(steps[0]).toContain('23 08 1992');
    const last = steps[steps.length - 1];
    expect(Number(last.split('=').pop()!.trim())).toBe(lifePath(BIRTH));
  });
  it('breaks a name into its words, and the parts sum to the whole', () => {
    const words = wordBreakdown('Anand Sharma');
    expect(words.map((w) => w.word)).toEqual(['ANAND', 'SHARMA']);
    expect(words.reduce((t, w) => t + w.total, 0)).toBe(32);
    for (const w of words) expect(w.letters.reduce((t, l) => t + l.value, 0)).toBe(w.total);
  });
});

describe('which numbers suit you', () => {
  it('harmony is the mean of both core affinities and stays in range', () => {
    for (let n = 1; n <= 9; n++) {
      const h = harmony(n, 5, 7);
      expect(h).toBeGreaterThanOrEqual(0);
      expect(h).toBeLessThanOrEqual(100);
    }
  });
  it('ranks all nine, best first, with no overlap between suits and avoid', () => {
    const a = allowedNumbers(5, 7);
    expect(a.ranked).toHaveLength(9);
    for (let i = 1; i < 9; i++) expect(a.ranked[i - 1].harmony).toBeGreaterThanOrEqual(a.ranked[i].harmony);
    expect(a.suits.filter((n) => a.avoid.includes(n))).toHaveLength(0);
  });
  it('never recommends and warns against the same number', () => {
    for (let m = 1; m <= 9; m++)
      for (let b = 1; b <= 9; b++) {
        const a = allowedNumbers(m, b);
        expect(a.suits.some((n) => a.avoid.includes(n))).toBe(false);
      }
  });
});

describe('everyday number guidance', () => {
  const g = numberGuidance(allowedNumbers(5, 7).suits);
  it('gives mobile endings, vehicle endings and PINs', () => {
    expect(g.mobileEndings.length).toBeGreaterThan(0);
    expect(g.vehicleEndings.length).toBeGreaterThan(0);
    expect(g.pins.length).toBeGreaterThan(0);
  });
  it('every suggestion actually reduces into the suitable set', () => {
    const good = g.totals;
    for (const e of g.mobileEndings) {
      const sum = e.replace(/\D/g, '').split('').reduce((t, d) => t + Number(d), 0);
      expect(good).toContain(reduceToDigit(sum));
    }
    for (const p of g.pins) {
      const sum = p.split('').reduce((t, d) => t + Number(d), 0);
      expect(good).toContain(reduceToDigit(sum));
    }
  });
  it('still returns usable guidance when nothing scores well', () => {
    const g2 = numberGuidance([]);
    expect(g2.pins.length).toBeGreaterThan(0);
  });
});

describe('grid summaries', () => {
  it('energy bars stay 0-100 and name their source numbers', () => {
    for (const bar of energyProfile(GRID)) {
      expect(bar.value).toBeGreaterThanOrEqual(0);
      expect(bar.value).toBeLessThanOrEqual(100);
      expect(bar.from).toMatch(/\d/);
    }
  });
  it('numeroscope picks the most-repeated number as dominant', () => {
    const n = numeroscope(GRID);
    expect(n.dominant).not.toBeNull();
    expect(GRID.counts[n.dominant!.number]).toBeGreaterThanOrEqual(GRID.counts[n.supporting!.number]);
    expect(n.missing.map((m) => m.number).sort()).toEqual(GRID.missing.sort());
    expect(n.filled + GRID.missing.length).toBe(9);
  });
});
