import { describe, it, expect } from 'vitest';
import { normalisePhone, schemaFor } from './types';
import { QUESTIONNAIRES } from './index';
import { PRODUCT_SLUGS } from '@/lib/config/products';

const FULL = {
  fullName: 'Priya Nair', dob: '1988-04-11', occupation: 'Operations manager',
  experience: '10 to 20', employment: 'Salaried', income: '₹75,000 to ₹2 lakh',
  concern: 'Growth has stalled', satisfaction: 'A little', preference: 'Leaning business',
  risk: 'Moderate', goal: 'Start a consultancy.',
  relStatus: 'Married', duration: '3 to 7 years',
  relConcern: 'We keep having the same fight', communication: 'We avoid the hard things',
  changed: 'Money pressure', outcome: 'Decide whether to stay', relContext: '',
  phone: '9876543210', email: 'priya@example.com',
};
const careerRel = schemaFor(QUESTIONNAIRES['career-relationship']);

describe('phone normalisation', () => {
  it('accepts every way an Indian mobile is actually typed', () => {
    for (const p of ['9876543210', '98765 43210', '98765-43210', '+91 9876543210', '+919876543210',
                     '+91 98765 43210', '09876543210', '919876543210', '(+91) 9876543210', ' 9876543210 '])
      expect(normalisePhone(p)).toBe('9876543210');
  });

  it('still rejects what is genuinely not a mobile number', () => {
    for (const p of ['12345', '5876543210', 'abcdefghij', '', '98765432100000'])
      expect(careerRel.safeParse({ ...FULL, phone: p }).success).toBe(false);
  });

  it('stores the normalised ten digits, whatever was typed', () => {
    const r = careerRel.safeParse({ ...FULL, phone: '+91 98765 43210' });
    expect(r.success && r.data.phone).toBe('9876543210');
  });
});

describe('questionnaire validation', () => {
  it('accepts a complete career-relationship submission', () => {
    expect(careerRel.safeParse(FULL).success).toBe(true);
  });

  it('names the field that failed, so the wizard can point at it', () => {
    const r = careerRel.safeParse({ ...FULL, phone: '123' });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues[0].path[0]).toBe('phone');
  });

  it('every product can be completed — no questionnaire is unsubmittable', () => {
    for (const slug of PRODUCT_SLUGS) {
      const q = QUESTIONNAIRES[slug];
      const answers: Record<string, string> = {};
      for (const step of q.steps)
        for (const f of step.fields)
          answers[f.key] = f.options?.length ? f.options[0]
            : f.kind === 'date' ? '1990-01-01'
            : f.kind === 'email' ? 'a@b.com'
            : f.kind === 'tel' ? '9876543210'
            : 'Something a person would write here';
      const r = schemaFor(q).safeParse(answers);
      if (!r.success) console.error(slug, r.error.issues);
      expect(r.success).toBe(true);
    }
  });

  it('accepts a normal email and rejects a malformed one', () => {
    expect(careerRel.safeParse({ ...FULL, email: 'Priya@Example.com' }).success).toBe(true);
    expect(careerRel.safeParse({ ...FULL, email: 'priya@gmail' }).success).toBe(false);
  });
});

describe('cross-field rules', () => {
  const base = {
    ...FULL, partnerName: '', partnerDob: '',
  };

  it('accepts both partner fields, or neither', () => {
    expect(careerRel.safeParse({ ...base, partnerName: '', partnerDob: '' }).success).toBe(true);
    expect(careerRel.safeParse({ ...base, partnerName: 'Meera Iyer', partnerDob: '1994-02-11' }).success).toBe(true);
  });

  it('rejects half a pair, and blames the missing field', () => {
    for (const half of [{ partnerName: 'Meera Iyer', partnerDob: '' }, { partnerName: '', partnerDob: '1994-02-11' }]) {
      const r = careerRel.safeParse({ ...base, ...half });
      expect(r.success).toBe(false);
      if (!r.success) expect(r.error.issues[0].path).toEqual(['partnerDob']);
    }
  });

  it('leaves questionnaires without refinements alone', () => {
    expect(QUESTIONNAIRES['name-numerology'].refinements).toBeUndefined();
    expect(schemaFor(QUESTIONNAIRES['name-numerology']).safeParse({
      fullName: 'A B', dob: '1990-04-17', gender: 'Woman', focus: 'Peace of mind',
      changedBefore: 'No, never', context: '', phone: '9876543210', email: 'a@b.com',
    }).success).toBe(true);
  });
});
