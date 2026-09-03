import { describe, it, expect } from 'vitest';
import { checkClaims } from './claims';

const ok = (s: unknown) => checkClaims(s).ok;

describe('claims validator', () => {
  it('passes ordinary interpretive language', () => {
    expect(ok({
      summary: 'Your name number is 5 and your life path is 7. The two pull in different directions.',
      advice: 'Consider using the corrected spelling in your signature first, and give it three months.',
      plan: ['Update your email display name', 'Tell close colleagues once', 'Review in ninety days'],
    })).toBe(true);
  });

  it('blocks guarantees', () => {
    for (const s of [
      'This change is guaranteed to improve your career.',
      'Your success is 100% certain after the correction.',
      'You will certainly get the promotion.',
    ]) expect(ok({ t: s })).toBe(false);
  });

  it('blocks wealth promises', () => {
    expect(ok({ t: 'With this name you will become rich within a year.' })).toBe(false);
    expect(ok({ t: 'This spelling brings assured returns.' })).toBe(false);
  });

  it('blocks regulated financial advice', () => {
    expect(ok({ t: 'You should invest in mutual funds during this period.' })).toBe(false);
    expect(ok({ t: 'Put your savings into gold ETF this year.' })).toBe(false);
  });

  it('blocks medical claims', () => {
    expect(ok({ t: 'This remedy will cure your diabetes.' })).toBe(false);
    expect(ok({ t: 'You can stop taking your medication once you change the spelling.' })).toBe(false);
  });

  it('blocks diagnosis and mind-reading', () => {
    expect(ok({ t: 'You have depression, which the 7 explains.' })).toBe(false);
    expect(ok({ t: 'Your partner is a narcissist.' })).toBe(false);
    expect(ok({ t: 'He is cheating on you.' })).toBe(false);
    expect(ok({ t: 'Your partner secretly resents your family.' })).toBe(false);
  });

  it('warns but does not block dated predictions', () => {
    const r = checkClaims({ t: 'You will see a change in your work within 6 months.' });
    expect(r.findings.length).toBeGreaterThan(0);
    expect(r.findings[0].severity).toBe('warn');
    expect(r.ok).toBe(true);
  });

  it('reaches into nested objects and arrays', () => {
    const r = checkClaims({ a: { b: [{ c: 'This is guaranteed to work.' }] } });
    expect(r.ok).toBe(false);
    expect(r.blocking[0].path).toBe('a.b[0].c');
  });

  it('reports what it matched so an editor can find it', () => {
    const r = checkClaims({ summary: 'The outcome is guaranteed.' });
    expect(r.blocking[0].match.toLowerCase()).toContain('guaranteed');
    expect(r.blocking[0].category).toBe('guarantee');
    expect(r.blocking[0].why).toBeTruthy();
  });

  it('handles empty and non-string content without throwing', () => {
    for (const v of [null, undefined, {}, [], 42, { n: 1, b: true }]) expect(ok(v)).toBe(true);
  });

  it('does not fire on innocent uses of trigger words', () => {
    expect(ok({ t: 'Numbers 4 and 6 are absent from your grid.' })).toBe(true);
    expect(ok({ t: 'Money tends to arrive in bursts rather than steadily.' })).toBe(true);
  });

  it('allows honest hedging, which is the language reports should use', () => {
    for (const s of [
      'There is no guarantee in any of this, and we will not pretend otherwise.',
      'Nothing here is guaranteed.',
      'This cannot be guaranteed, and anyone who says otherwise is selling something.',
      'Results are not assured.',
    ]) expect(ok({ t: s })).toBe(true);
  });

  it('still blocks the claim when the negation belongs to a different clause', () => {
    expect(ok({ t: 'You will not regret it, and success is guaranteed.' })).toBe(false);
  });
});
