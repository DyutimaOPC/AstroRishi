import { describe, it, expect } from 'vitest';
import { checkNames } from './names';

const APPROVED = ['Anandh Sharma', 'Aanand Sharma', 'Anand A Sharma', 'Anand Sharma'];

describe('fabricated-name validator', () => {
  it('passes prose that only uses spellings the engine produced', () => {
    expect(checkNames({
      recommendation: 'Anandh Sharma moves your total from 32 to 37.',
      whatChanges: [{ title: 'A steadier read', body: 'Aanand Sharma is the gentler option if you prefer it.' }],
    }, APPROVED).ok).toBe(true);
  });

  it('blocks a spelling the engine never generated', () => {
    const r = checkNames({ recommendation: 'We suggest Annand Sharma instead.' }, APPROVED);
    expect(r.ok).toBe(false);
    expect(r.findings[0].token).toBe('Annand');
    expect(r.findings[0].nearest).toBe('ANAND'); // one edit away from the real first name
  });

  it('reports where it found it', () => {
    const r = checkNames({ a: { b: [{ c: 'Try Anandhh Sharma.' }] } }, APPROVED);
    expect(r.ok).toBe(false);
    expect(r.findings[0].path).toBe('a.b[0].c');
  });

  it('leaves ordinary capitalised prose alone', () => {
    expect(checkNames({
      verdict: 'Your Chaldean total is 32. Mercury rules this number, and Saturn tends to delay it.',
      closing: 'Monday and Wednesday are the days to prefer. Nothing here is guaranteed.',
    }, APPROVED).ok).toBe(true);
  });

  it('accepts a middle initial, which is a single letter by design', () => {
    expect(checkNames({ recommendation: 'Anand A Sharma keeps both names untouched.' }, APPROVED).ok).toBe(true);
  });

  it('does not fire on a word that merely shares a few letters', () => {
    expect(checkNames({ verdict: 'The change is small and the effect is gradual.' }, APPROVED).ok).toBe(true);
  });

  it('handles empty input and an empty approved list', () => {
    expect(checkNames({}, APPROVED).ok).toBe(true);
    expect(checkNames({ x: 'Anything at all here.' }, []).ok).toBe(true);
  });

  it('reports each distinct fabrication once', () => {
    const r = checkNames({ a: 'Annand Sharma', b: 'Annand Sharma again' }, APPROVED);
    expect(r.findings).toHaveLength(2); // once per location, not per occurrence
    expect(new Set(r.findings.map((f) => f.token)).size).toBe(1);
  });
});
