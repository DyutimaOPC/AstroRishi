import { describe, it, expect } from 'vitest';
import { careerReport } from './index';
import { occupationNumber, VOCATION } from './vocation';

const base = {
  fullName: 'Ronak Jain', dob: '1990-04-17', occupation: 'Software engineer',
  experience: '10 to 20', employment: 'Salaried', income: '₹75,000 to ₹2 lakh',
  concern: 'Growth has stalled', satisfaction: 'Somewhat',
  preference: 'Undecided', risk: 'Moderate', goal: 'A clearer path.',
};
const at = new Date('2026-06-01T00:00:00Z');

describe('occupation matching', () => {
  it('places common Indian occupations', () => {
    expect(occupationNumber('Software Engineer')?.number).toBe(4);
    expect(occupationNumber('Chartered Accountant')?.number).toBe(8);
    expect(occupationNumber('school teacher')?.number).toBe(3);
    expect(occupationNumber('surgeon')?.number).toBe(9);
  });

  it('prefers the longer phrase when two keywords overlap', () => {
    // "business development" is sales (5), not ownership (1).
    expect(occupationNumber('Business Development Manager')?.number).toBe(5);
  });

  it('returns null rather than guessing', () => {
    expect(occupationNumber('sdfghjkl')).toBeNull();
    expect(occupationNumber('')).toBeNull();
    expect(occupationNumber(undefined)).toBeNull();
  });
});

describe('careerReport', () => {
  it('is deterministic for the same input', () => {
    expect(JSON.stringify(careerReport(base, at))).toBe(JSON.stringify(careerReport(base, at)));
  });

  it('actually uses the birth chart — a different date gives a different reading', () => {
    const a = careerReport(base, at);
    const b = careerReport({ ...base, dob: '1977-11-02' }, at);
    expect(b.workNature.number === a.workNature.number && b.grid.balance === a.grid.balance).toBe(false);
  });

  it('uses the name as well as the date', () => {
    const a = careerReport(base, at);
    const b = careerReport({ ...base, fullName: 'Vipul Kothari' }, at);
    expect(b.numbers.find((n) => n.key === 'naamank')!.value)
      .not.toBe(a.numbers.find((n) => n.key === 'naamank')!.value);
  });

  it('signal weights still total 100 and the score is the sum of the parts', () => {
    const r = careerReport(base, at);
    expect(r.signals.reduce((t, s) => t + s.weight, 0)).toBe(100);
    expect(r.score).toBe(r.signals.reduce((t, s) => t + s.points, 0));
  });

  it('reports an unknown fit instead of guessing at the trade', () => {
    const r = careerReport({ ...base, occupation: 'qwertyuiop' }, at);
    expect(r.fit.verdict).toBe('unknown');
    expect(r.fit.statedNumber).toBeNull();
  });

  it('calls it aligned when the occupation matches the working number', () => {
    const r = careerReport(base, at);
    const matching = Object.values(VOCATION).find((v) => v.number === r.workNature.number)!;
    expect(matching).toBeDefined();
    // Construct an occupation that maps to the chart's own number.
    const word = { 1: 'founder', 2: 'hr manager', 3: 'teacher', 4: 'engineer', 5: 'sales manager', 6: 'designer', 7: 'researcher', 8: 'accountant', 9: 'doctor' }[r.workNature.number]!;
    expect(careerReport({ ...base, occupation: word }, at).fit.verdict).toBe('aligned');
  });

  it('gives three years, the first of which is the year asked for', () => {
    const r = careerReport(base, at);
    expect(r.years).toHaveLength(3);
    expect(r.years[0].year).toBe(2026);
    expect(r.years[0].current).toBe(true);
    expect(r.years.every((y) => y.career.length > 40)).toBe(true);
  });

  it('gives twelve monthly windows and marks the favourable ones', () => {
    const r = careerReport(base, at);
    expect(r.windows).toHaveLength(12);
    expect(r.windows.every((w) => w.number >= 1 && w.number <= 9)).toBe(true);
    expect(r.windows.some((w) => w.favourable)).toBe(true);
  });

  it('separates what the reader wants from what the chart leans towards', () => {
    const wants = careerReport({ ...base, preference: 'Definitely business', risk: 'Very high', employment: 'Business owner' }, at);
    const avoids = careerReport({ ...base, preference: 'Definitely a job', risk: 'Very low', employment: 'Salaried' }, at);
    expect(wants.path.stated).toBeGreaterThan(avoids.path.stated);
    expect(wants.path.chart).toBe(avoids.path.chart); // same chart, same lean
  });

  it('names the tension when stated preference and chart disagree', () => {
    const r = careerReport({ ...base, preference: 'Definitely business', risk: 'Very high', employment: 'Business owner' }, at);
    if (r.path.stated - r.path.chart > 25) expect(r.path.tension).toBeTruthy();
  });

  it('flags name friction only when the harmony is genuinely low', () => {
    const r = careerReport(base, at);
    if (r.nameFriction) expect(r.nameFriction.harmony).toBeLessThan(55);
  });

  it('makes no dated or guaranteed claims anywhere in the deterministic text', () => {
    for (const dob of ['1990-04-17', '1977-11-02', '2001-01-01', '1965-12-31']) {
      const r = careerReport({ ...base, dob }, at);
      const text = JSON.stringify(r);
      expect(text).not.toMatch(/\bguarantee/i);
      expect(text).not.toMatch(/\byou will (get|earn|be promoted|become rich)\b/i);
      expect(text).not.toMatch(/\bwithin (six|three|twelve|\d+) (months?|weeks?)\b/i);
    }
  });

  it('survives a questionnaire with nothing but identity', () => {
    const r = careerReport({ fullName: 'A B', dob: '1990-04-17' }, at);
    expect(r.score).toBeGreaterThanOrEqual(0);
    expect(r.workNature).toBeDefined();
    expect(r.plan).toHaveLength(3);
  });
});
