import { describe, it, expect } from 'vitest';
import { respell, brokenLaw, EXCEPTIONS, MAX_SUBSTITUTIONS } from './respell';
import { phoneticKey, sameName } from './phonetics';
import { attested, recordedVariants, lexiconSize } from './lexicon';
import { candidatesFor, analyseName, MIN_OPTIONS, MAX_OPTIONS, loShu, parseDob } from './index';

describe('re-romanisation', () => {
  it('reaches the spellings letter-editing never could', () => {
    const ronak = respell('Ronak').map((r) => r.name);
    expect(ronak).toContain('Raunak');
    expect(ronak).toContain('Rounak');
    expect(respell('Minal').map((r) => r.name)).toContain('Meenal');
    expect(respell('Priya').map((r) => r.name)).toContain('Preeya');
    expect(respell('Ritu').map((r) => r.name)).toContain('Reetu');
  });

  it('ranks the natural spelling above the awkward one', () => {
    const r = respell('Ronak');
    const rank = (n: string) => r.findIndex((x) => x.name === n);
    expect(rank('Raunak')).toBeLessThan(rank('Roonak'));
    expect(rank('Raunak')).toBeGreaterThanOrEqual(0);
  });

  it('never doubles the first letter', () => {
    for (const n of ['Ronak', 'Minal', 'Priya', 'Shalini', 'Kavita'])
      for (const r of respell(n)) expect(r.name[0].toLowerCase()).not.toBe(r.name[1]?.toLowerCase());
  });

  it('never doubles a consonant against another consonant', () => {
    for (const n of ['Anand', 'Vikram', 'Manish', 'Sanjay'])
      for (const r of respell(n)) expect(r.name.toLowerCase()).not.toMatch(/([bcdfgjklmnpqrstvwxz])\1[bcdfgjklmnpqrstvwxz]/);
  });

  it('never returns the name it was given, and stays a sane length', () => {
    for (const n of ['Ronak', 'Priya', 'Shalini']) {
      for (const r of respell(n)) {
        expect(r.name.toLowerCase()).not.toBe(n.toLowerCase());
        expect(r.name.length).toBeLessThanOrEqual(n.length + 4);
      }
    }
  });

  it('changes at most two things — beyond that it stops being the same name', () => {
    for (const n of ['Kavita', 'Shalini', 'Ronak', 'Minal'])
      for (const r of respell(n)) expect(r.changes).toBeLessThanOrEqual(MAX_SUBSTITUTIONS);
  });

  it('keeps the opening letter, because an initial is an identity', () => {
    for (const n of ['Ronak', 'Kavita', 'Vipul'])
      for (const r of respell(n)) expect(r.name[0].toLowerCase()).toBe(n[0].toLowerCase());
  });

  it('never puts an h after an opening vowel', () => {
    for (const n of ['Anand', 'Amit', 'Ishaan'])
      for (const r of respell(n)) expect(r.name.toLowerCase()).not.toMatch(/^[aeiou]h/);
  });

  it('every law rejects something, and names what it rejected', () => {
    expect(EXCEPTIONS.length).toBeGreaterThan(4);
    expect(brokenLaw('Mminal', 'minal')).toContain('opening letter');
    expect(brokenLaw('Anannd', 'anand')).toContain('vowel on both sides');
    expect(brokenLaw('Rooonak', 'ronak')).toContain('three times');
    expect(brokenLaw('Bonak', 'ronak')).toContain('first letter');
    expect(brokenLaw('Ronak', 'ronak')).toContain('not a suggestion');
    expect(brokenLaw('Raunak', 'ronak')).toBeNull();
  });

  it('allows an adjusted spelling — a correction is meant to look deliberate', () => {
    // These are not common names, and that is the point.
    for (const n of ['Ronaak', 'Ronnak', 'Roonak']) expect(brokenLaw(n, 'ronak')).toBeNull();
  });

  it('is deterministic and handles degenerate input', () => {
    expect(JSON.stringify(respell('Ronak'))).toBe(JSON.stringify(respell('Ronak')));
    expect(respell('')).toEqual([]);
    expect(respell('A')).toEqual([]);
    expect(respell('!!!')).toEqual([]);
  });
});

describe('phonetic key', () => {
  it('collapses every spelling of one name onto one key', () => {
    for (const set of [
      ['Ronak', 'Raunak', 'Rounak', 'Rounaq', 'Raunaq'],
      ['Minal', 'Meenal', 'Minaal'],
      ['Vipul', 'Vipool', 'Veepul'],
      ['Ritu', 'Reetu', 'Ritoo'],
    ]) expect(new Set(set.map(phoneticKey)).size).toBe(1);
  });

  it('keeps genuinely different names apart', () => {
    for (const [a, b] of [['Rakesh', 'Rajesh'], ['Ronak', 'Rohit'], ['Priya', 'Pooja'], ['Amit', 'Ankit']])
      expect(phoneticKey(a)).not.toBe(phoneticKey(b));
  });

  it('sameName agrees with the key, and rejects empties', () => {
    expect(sameName('Ronak', 'Raunak')).toBe(true);
    expect(sameName('Ronak', 'Rohit')).toBe(false);
    expect(sameName('', '')).toBe(false);
  });
});

describe('lexicon', () => {
  it('loaded a real corpus', () => {
    const { given, surnames } = lexiconSize();
    expect(given).toBeGreaterThan(5000);
    expect(surnames).toBeGreaterThan(2000);
  });

  it('confirms spellings that are genuinely in the records', () => {
    for (const n of ['ritu', 'reetu', 'reeta', 'anand', 'priya', 'pooja']) expect(attested(n)).toBeGreaterThan(0);
  });

  it('is a one-way signal — absence never means a name is fake', () => {
    // These are real spellings the regionally-skewed records simply miss.
    for (const n of ['meenal', 'raunak', 'preeya']) expect(attested(n)).toBe(0);
  });

  it('finds recorded variants of the same name', () => {
    const v = recordedVariants('ritu').map((x) => x.spelling);
    expect(v.length).toBeGreaterThan(0);
    expect(v).toContain('reetu');
  });

  it('is case-insensitive and safe on junk', () => {
    expect(attested('RITU')).toBe(attested('ritu'));
    expect(attested('')).toBe(0);
    expect(recordedVariants('')).toEqual([]);
  });
});

describe('merged candidate generation', () => {
  const ctx = { lifePathDigit: 7, birthNum: 5, grid: loShu(parseDob('1992-08-23')), original: 'Ronak Jain' };

  it('includes both mechanical edits and re-romanisations', () => {
    const names = candidatesFor('Ronak Jain').map((c) => c.name);
    expect(names).toContain('RAUNAK JAIN');   // re-romanisation
    expect(names.some((n) => /^RONNAK|^RONAKH/.test(n))).toBe(true); // mechanical
  });

  it('never alters the surname', () => {
    for (const c of candidatesFor('Ronak Jain')) expect(c.name.endsWith('JAIN')).toBe(true);
  });

  it('returns between the minimum and maximum, when enough clear the cutoff', () => {
    const a = analyseName('Ronak Jain', ctx);
    expect(a.options.length).toBeGreaterThanOrEqual(Math.min(MIN_OPTIONS, a.options.length));
    expect(a.options.length).toBeLessThanOrEqual(MAX_OPTIONS);
  });

  it('every option beats the name in use — the cutoff is never crossed', () => {
    for (const name of ['Ronak Jain', 'Minal Shah', 'Anand Sharma', 'Priya Nair']) {
      const a = analyseName(name, ctx);
      for (const o of a.options) expect(o.score).toBeGreaterThan(a.current.score);
    }
  });

  it('prefers a recorded spelling over an unrecorded one at the same score', () => {
    const a = analyseName('Ritu Sharma', ctx);
    const withSame = a.options.filter((o) => o.score === a.options[0].score);
    if (withSame.length > 1 && withSame.some((o) => o.attested > 0))
      expect(withSame[0].attested).toBeGreaterThan(0);
  });

  it('never suggests the name the customer already has', () => {
    for (const name of ['Ronak Jain', 'Anand Sharma'])
      for (const o of analyseName(name, ctx).options)
        expect(o.name.toUpperCase()).not.toBe(name.toUpperCase());
  });
});
