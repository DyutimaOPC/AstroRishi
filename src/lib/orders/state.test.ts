import { describe, it, expect } from 'vitest';
import { ORDER_STATES, canTransition, assertTransition, IllegalTransition, isPaid, STATE_LABEL } from './state';

describe('order state machine', () => {
  it('walks the happy path end to end', () => {
    const path = ['NEW','QUESTIONNAIRE_COMPLETED','PAID','REPORT_GENERATING','REPORT_READY','REVIEWED','DELIVERED'] as const;
    for (let i = 1; i < path.length; i++) expect(canTransition(path[i - 1], path[i])).toBe(true);
  });
  it('refuses to skip payment', () => {
    expect(canTransition('QUESTIONNAIRE_COMPLETED', 'REPORT_GENERATING')).toBe(false);
    expect(canTransition('NEW', 'DELIVERED')).toBe(false);
  });
  it('refuses to go backwards', () => {
    expect(canTransition('PAID', 'NEW')).toBe(false);
    expect(canTransition('DELIVERED', 'REVIEWED')).toBe(false);
  });
  it('lets review be skipped once generation is trusted', () => {
    expect(canTransition('REPORT_READY', 'DELIVERED')).toBe(true);
  });
  it('allows regeneration from ready and reviewed', () => {
    expect(canTransition('REPORT_READY', 'REPORT_GENERATING')).toBe(true);
    expect(canTransition('REVIEWED', 'REPORT_GENERATING')).toBe(true);
    expect(canTransition('REPORT_GENERATING', 'REPORT_GENERATING')).toBe(true);
  });
  it('DELIVERED is terminal', () => {
    for (const s of ORDER_STATES) expect(canTransition('DELIVERED', s)).toBe(false);
  });
  it('throws a typed error, not a boolean to ignore', () => {
    expect(() => assertTransition('NEW', 'PAID')).toThrow(IllegalTransition);
    expect(() => assertTransition('NEW', 'QUESTIONNAIRE_COMPLETED')).not.toThrow();
  });
  it('knows which states are past payment', () => {
    expect(isPaid('QUESTIONNAIRE_COMPLETED')).toBe(false);
    expect(isPaid('PAID')).toBe(true);
    expect(isPaid('DELIVERED')).toBe(true);
  });
  it('labels every state', () => {
    for (const s of ORDER_STATES) expect(STATE_LABEL[s]).toBeTruthy();
  });
});
