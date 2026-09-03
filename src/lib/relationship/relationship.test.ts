import { describe, it, expect } from 'vitest';
import { relationshipReport } from './index';
import { safetyScan } from './safety';

const base = {
  fullName: 'Ronak Jain', dob: '1990-04-17',
  status: 'Married', duration: '3 to 7 years',
  concern: 'We keep having the same fight',
  communication: 'We avoid the hard things', changed: 'Money pressure',
  outcome: 'Repair and stay together', context: 'We argue about the same things.',
};
const paired = { ...base, partnerName: 'Minal Shah', partnerDob: '1992-08-09' };
const at = new Date('2026-06-01T00:00:00Z');

describe('safetyScan', () => {
  it('catches descriptions of physical harm', () => {
    for (const t of ['he hits me sometimes', 'there is domestic violence', 'I am afraid of him', 'he threatened to kill me'])
      expect(safetyScan({ context: t }).flagged).toBe(true);
  });

  it('catches self-harm separately', () => {
    const r = safetyScan({ context: 'sometimes I want to end my life' });
    expect(r.flagged).toBe(true);
    expect(r.kind).toBe('selfHarm');
  });

  it('does not fire on ordinary distress', () => {
    for (const t of [
      'he hurt me deeply when he said that',
      'we fight a lot and it is exhausting',
      'I am not sure I love him any more',
      'my family is against the marriage',
    ]) expect(safetyScan({ context: t }).flagged).toBe(false);
  });

  it('scans every free-text answer, not just one', () => {
    expect(safetyScan({ goal: 'x', context: 'he beats me' }).flagged).toBe(true);
  });
});

describe('relationshipReport', () => {
  it('is deterministic', () => {
    expect(JSON.stringify(relationshipReport(paired, at))).toBe(JSON.stringify(relationshipReport(paired, at)));
  });

  it('carries no score anywhere — that is the point', () => {
    const r = relationshipReport(paired, at) as unknown as Record<string, unknown>;
    expect(r.score).toBeUndefined();
    expect(r.band).toBeUndefined();
    expect(JSON.stringify(r)).not.toMatch(/relationship (score|rating)/i);
  });

  it('works without the partner, and says what is missing', () => {
    const r = relationshipReport(base, at);
    expect(r.paired).toBe(false);
    expect(r.them).toBeNull();
    expect(r.composite).toBeNull();
    expect(r.affinity).toBeNull();
    expect(r.soloBrings.length + r.soloGaps.length).toBe(9);
    expect(r.pattern).toBeDefined();
    expect(r.branch).toBeDefined();
  });

  it('builds the composite grid once both charts are there', () => {
    const r = relationshipReport(paired, at);
    expect(r.paired).toBe(true);
    const c = r.composite!;
    expect(c.theyBring.length + c.youBring.length + c.shared.length + c.blindSpot.length).toBe(9);
    expect(c.coverage).toBe(Math.round(((9 - c.blindSpot.length) / 9) * 100));
  });

  it('the blind spot is exactly what neither grid carries', () => {
    const r = relationshipReport(paired, at);
    for (const m of r.composite!.blindSpot) {
      expect(r.you.grid.counts[m.number] ?? 0).toBe(0);
      expect(r.them!.grid.counts[m.number] ?? 0).toBe(0);
    }
    for (const m of r.composite!.theyBring) {
      expect(r.you.grid.counts[m.number] ?? 0).toBe(0);
      expect(r.them!.grid.counts[m.number] ?? 0).toBeGreaterThan(0);
    }
  });

  it('names a different pattern for a different concern', () => {
    const names = new Set(
      ['We keep having the same fight', 'We have grown apart', 'Trust has been broken', 'Family is against it', 'They will not commit', 'I am not sure I want this']
        .map((concern) => relationshipReport({ ...paired, concern }, at).pattern.key),
    );
    expect(names.size).toBeGreaterThanOrEqual(5);
  });

  it('branches on what the reader said they want', () => {
    const keys = (['Repair and stay together', 'Decide whether to stay', 'Leave well', 'Understand myself better'] as const)
      .map((outcome) => relationshipReport({ ...paired, outcome }, at).branch.key);
    expect(keys).toEqual(['repair', 'decide', 'leave', 'understand']);
  });

  it('a leave-well report never argues for staying', () => {
    const r = relationshipReport({ ...paired, outcome: 'Leave well' }, at);
    const text = `${r.branch.body} ${r.branch.steps.map((s) => s.detail).join(' ')}`;
    expect(text).not.toMatch(/give it (more )?time|be patient|work on it together|try again/i);
  });

  it('flags safety and changes the verdict when harm is described', () => {
    const r = relationshipReport({ ...paired, context: 'he hits me when he is angry' }, at);
    expect(r.safety.flagged).toBe(true);
    expect(r.safety.kind).toBe('harm');
    expect(r.verdict).toMatch(/needs a person/i);
  });

  it('never states another person’s private thoughts as fact', () => {
    for (const concern of ['We keep having the same fight', 'Trust has been broken', 'They will not commit'])
      for (const outcome of ['Repair and stay together', 'Leave well']) {
        const text = JSON.stringify(relationshipReport({ ...paired, concern, outcome }, at));
        expect(text).not.toMatch(/\b(he|she|they|your partner) (is|does|thinks?|feels?|wants?|needs?) /i);
        expect(text).not.toMatch(/secretly/i);
      }
  });

  it('makes no prediction about how the relationship ends', () => {
    for (const outcome of ['Repair and stay together', 'Decide whether to stay', 'Leave well', 'Understand myself better']) {
      const text = JSON.stringify(relationshipReport({ ...paired, outcome }, at));
      expect(text).not.toMatch(/will (end|fail|not last)|is doomed|beyond saving/i);
    }
  });

  it('explains a timing mismatch only when the years actually differ', () => {
    const r = relationshipReport(paired, at);
    if (r.timing.them && r.timing.you.number !== r.timing.them.number)
      expect(r.timing.mismatch).toMatch(/different clocks|personal/i);
  });

  it('ignores a partial partner — a name without a date proves nothing', () => {
    expect(relationshipReport({ ...base, partnerName: 'Minal Shah' }, at).paired).toBe(false);
    expect(relationshipReport({ ...base, partnerDob: '1992-08-09' }, at).paired).toBe(false);
  });
});
