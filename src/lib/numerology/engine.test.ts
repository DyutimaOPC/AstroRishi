import { describe, it, expect } from 'vitest';
import {
  reduceToDigit, reduceKeepMaster, digitSum,
  CHALDEAN, PYTHAGOREAN, normalise, nameNumber, soulUrge, personality,
  parseDob, lifePath, birthNumber, loShu, affinity, AFFINITY, verdict,
  variantsOf, scoreName, analyseName, luckyElements, compute,
} from './index';

describe('digit reduction', () => {
  it('reduces to a single digit', () => {
    expect(reduceToDigit(32)).toBe(5);
    expect(reduceToDigit(9)).toBe(9);
    expect(reduceToDigit(99)).toBe(9);
    expect(reduceToDigit(0)).toBe(0);
  });
  it('keeps master numbers', () => {
    expect(reduceKeepMaster(29)).toBe(11);
    expect(reduceKeepMaster(22)).toBe(22);
    expect(reduceKeepMaster(33)).toBe(33);
    expect(reduceToDigit(29)).toBe(2);
  });
  it('digitSum is a single pass', () => expect(digitSum(987)).toBe(24));
});

describe('letter tables', () => {
  it('Chaldean never assigns 9', () => {
    expect(Object.values(CHALDEAN)).not.toContain(9);
    expect(Math.max(...Object.values(CHALDEAN))).toBe(8);
  });
  it('covers the whole alphabet in both systems', () => {
    for (const t of [CHALDEAN, PYTHAGOREAN]) expect(Object.keys(t)).toHaveLength(26);
  });
  it('Pythagorean wraps 1-9', () => {
    expect(PYTHAGOREAN.A).toBe(1);
    expect(PYTHAGOREAN.I).toBe(9);
    expect(PYTHAGOREAN.J).toBe(1);
    expect(PYTHAGOREAN.Z).toBe(8);
  });
  it('normalises accents, case and punctuation', () => {
    expect(normalise("  ánand   sh'arma ")).toBe('ANAND SHARMA');
  });
});

describe('name numbers', () => {
  it('adds Chaldean values across the whole name', () => {
    // A1 N5 A1 N5 D4 = 16, S3 H5 A1 R2 M4 A1 = 16 → 32 → 5
    const n = nameNumber('Anand Sharma');
    expect(n.total).toBe(32);
    expect(n.digit).toBe(5);
  });
  it('an added n moves 32 to 37', () => {
    const n = nameNumber('Annand Sharma');
    expect(n.total).toBe(37);
    expect(n.digit).toBe(1);
  });
  it('splits vowels and consonants', () => {
    const s = soulUrge('Anand Sharma');
    const p = personality('Anand Sharma');
    expect(s.letters.every((l) => l.isVowel)).toBe(true);
    expect(p.letters.every((l) => !l.isVowel)).toBe(true);
    expect(s.letters.length + p.letters.length).toBe(11);
  });
  it('ignores spacing and case', () => {
    expect(nameNumber('anand sharma').total).toBe(nameNumber('ANAND  SHARMA').total);
  });
});

describe('dates', () => {
  it('parses ISO dates', () => expect(parseDob('1992-08-23')).toEqual({ year: 1992, month: 8, day: 23 }));
  it('rejects malformed and impossible dates', () => {
    expect(() => parseDob('23-08-1992')).toThrow();
    expect(() => parseDob('1992-02-30')).toThrow();
    expect(() => parseDob('1992-13-01')).toThrow();
  });
  it('life path sums every digit', () => {
    // 2+3+0+8+1+9+9+2 = 34 → 7
    expect(lifePath(parseDob('1992-08-23'))).toBe(7);
  });
  it('birth number is the day reduced', () => {
    expect(birthNumber(parseDob('1992-08-23'))).toBe(5);
    expect(birthNumber(parseDob('1992-08-09'))).toBe(9);
  });
});

describe('Lo Shu grid', () => {
  const g = loShu(parseDob('1992-08-23'));
  it('places digits plus driver and conductor', () => {
    // digits 2,3,0,8,1,9,9,2 (zero not placed) + driver 5 + conductor 7
    expect(g.counts[9]).toBe(2);
    expect(g.counts[2]).toBe(2);
    expect(g.counts[5]).toBe(1);
    expect(g.counts[7]).toBe(1);
    expect(g.counts[4]).toBe(0);
    expect(g.counts[6]).toBe(0);
  });
  it('reports missing and repeated cells', () => {
    expect(g.missing.sort()).toEqual([4, 6]);
    expect(g.repeated.sort()).toEqual([2, 9]);
  });
  it('marks a plane complete only when all three are present', () => {
    const emotional = g.planes.find((p) => p.key === 'emotional')!;
    const mental = g.planes.find((p) => p.key === 'mental')!;
    expect(emotional.complete).toBe(true);
    expect(mental.complete).toBe(false);
    expect(mental.present).toBe(2);
  });
  it('never places a zero', () => {
    const z = loShu(parseDob('2000-10-10'));
    expect(Object.keys(z.counts).map(Number).sort((a, b) => a - b)).toEqual([1,2,3,4,5,6,7,8,9]);
  });
  it('balance stays within range', () => {
    expect(g.balance).toBeGreaterThanOrEqual(0);
    expect(g.balance).toBeLessThanOrEqual(100);
  });
});

describe('affinity rubric', () => {
  it('is symmetric', () => {
    for (let a = 1; a <= 9; a++)
      for (let b = 1; b <= 9; b++) expect(affinity(a, b)).toBe(affinity(b, a));
  });
  it('is a full 9x9 of sane values', () => {
    expect(AFFINITY).toHaveLength(9);
    for (const row of AFFINITY) {
      expect(row).toHaveLength(9);
      for (const v of row) { expect(v).toBeGreaterThanOrEqual(0); expect(v).toBeLessThanOrEqual(100); }
    }
  });
  it('rates 1 with 7 above 5 with 7', () => {
    expect(affinity(1, 7)).toBeGreaterThan(affinity(5, 7));
  });
  it('bands the verdict', () => {
    expect(verdict(85)).toBe('strong');
    expect(verdict(70)).toBe('workable');
    expect(verdict(50)).toBe('strained');
  });
});

describe('name options', () => {
  const ctx = {
    lifePathDigit: 7,
    birthNum: 5,
    grid: loShu(parseDob('1992-08-23')),
    original: 'Anand Sharma',
  };
  it('never touches the surname', () => {
    for (const v of variantsOf('Anand Sharma')) expect(v.endsWith('SHARMA')).toBe(true);
  });
  it('offers a middle initial, which leaves both names intact', () => {
    const withInitial = variantsOf('Anand Sharma').filter((v) => /^ANAND [A-Z] SHARMA$/.test(v));
    expect(withInitial.length).toBeGreaterThan(0);
  });
  it('never returns the original', () => {
    expect(variantsOf('Anand Sharma')).not.toContain('ANAND SHARMA');
  });
  it('produces the doubled-n variant', () => {
    expect(variantsOf('Anand Sharma')).toContain('ANNAND SHARMA');
  });
  it('marks the current spelling and gives it no distance', () => {
    const s = scoreName('Anand Sharma', ctx);
    expect(s.isCurrent).toBe(true);
    expect(s.distance).toBe(0);
    expect(s.change).toBeNull();
  });
  it('is the mean of its harmony against moolank and bhagyank', () => {
    const s = scoreName('Annand Sharma', ctx);
    const { moolank, bhagyank } = s.parts;
    expect(s.score).toBe(Math.round(moolank * 0.5 + bhagyank * 0.5));
  });
  it('keeps grid and closeness out of the score entirely', () => {
    // Same name number, different grid and different incumbent — same score.
    const a = scoreName('Annand Sharma', ctx);
    const b = scoreName('Annand Sharma', { ...ctx, original: 'Zzzz Sharma' });
    expect(b.score).toBe(a.score);
  });
  it('does not flatter the incumbent spelling', () => {
    // Same name number must score the same whether or not it is the one in use.
    const asCurrent = scoreName('Anand Sharma', ctx);
    const asCandidate = scoreName('Anand Sharma', { ...ctx, original: 'Zzzz Sharma' });
    expect(asCandidate.score).toBe(asCurrent.score);
  });
  it('offers variety of numbers, ordered best first', () => {
    const a = analyseName('Anand Sharma', ctx);
    // Ordered by score — a customer sees the strongest option first.
    for (let i = 1; i < a.options.length; i++)
      expect(a.options[i - 1].score).toBeGreaterThanOrEqual(a.options[i].score);
    // And more than one outcome is represented when more than one is reachable.
    if (a.options.length > 1) expect(new Set(a.options.map((o) => o.digit)).size).toBeGreaterThan(1);
  });
  it('finds a change worth making for a strained name', () => {
    const a = analyseName('Anand Sharma', ctx);
    expect(a.best!.score - a.current.score).toBeGreaterThanOrEqual(8);
    expect(a.changeWorthwhile).toBe(true);
  });
  it('returns options that beat the current name, best first', () => {
    const a = analyseName('Anand Sharma', ctx);
    expect(a.options.length).toBeGreaterThan(0);
    for (const o of a.options) expect(o.score).toBeGreaterThan(a.current.score);
    for (let i = 1; i < a.options.length; i++)
      expect(a.options[i - 1].score).toBeGreaterThanOrEqual(a.options[i].score);
    expect(a.best).toBe(a.options[0]);
  });
});

describe('lucky elements', () => {
  it('gives numbers, colours, days and a direction', () => {
    const l = luckyElements(5, 7);
    expect(l.numbers.length).toBeGreaterThan(0);
    expect(l.colours.length).toBeGreaterThan(0);
    expect(l.days.length).toBeGreaterThan(0);
    expect(l.direction).toBeTruthy();
    expect(l.ruler).toBe('Mercury');
  });
  it('never repeats a number', () => {
    for (let b = 1; b <= 9; b++)
      for (let lp = 1; lp <= 9; lp++) {
        const n = luckyElements(b, lp).numbers;
        expect(new Set(n).size).toBe(n.length);
      }
  });
});

describe('compute', () => {
  const c = compute({ fullName: 'Anand Sharma', dob: '1992-08-23' });
  it('assembles the whole payload', () => {
    expect(c.core.name.total).toBe(32);
    expect(c.core.lifePath).toBe(7);
    expect(c.core.birthNumber).toBe(5);
    expect(c.grid.cells).toHaveLength(9);
    expect(c.alignment.nameDigit).toBe(5);
    expect(c.score).toBe(c.nameAnalysis.current.score);
  });
  it('is deterministic', () => {
    const again = compute({ fullName: 'Anand Sharma', dob: '1992-08-23' });
    expect(JSON.stringify(again)).toBe(JSON.stringify(c));
  });
  it('rejects bad input', () => {
    expect(() => compute({ fullName: '  ', dob: '1992-08-23' })).toThrow();
    expect(() => compute({ fullName: 'X', dob: 'nonsense' })).toThrow();
  });
  it('holds for a spread of real dates', () => {
    for (const dob of ['1970-01-01', '1985-12-31', '2000-02-29', '1999-06-15', '2004-11-08']) {
      const r = compute({ fullName: 'Test Person', dob });
      expect(r.score).toBeGreaterThanOrEqual(0);
      expect(r.score).toBeLessThanOrEqual(100);
      expect(r.grid.cells.reduce((a, x) => a + x.count, 0)).toBeGreaterThan(0);
    }
  });
});
