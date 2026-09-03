import { z } from 'zod';

export type FieldKind = 'text' | 'email' | 'tel' | 'date' | 'radio' | 'select' | 'textarea';

export interface Field {
  key: string;
  kind: FieldKind;
  label: string;
  help?: string;
  placeholder?: string;
  options?: string[];
  required?: boolean;
  maxLength?: number;
}

export interface Step {
  id: string;
  title: string;
  intro?: string;
  fields: Field[];
}

/**
 * A rule that spans more than one field. Optional fields that only mean
 * something together — a partner's name and their date of birth — cannot be
 * expressed by `required`, and silently accepting half of a pair gives the
 * customer a lesser report without ever telling them why.
 *
 * It is DATA, not a predicate. The questionnaire is handed from a server
 * component to the client wizard, and a function cannot cross that boundary —
 * so the rule names its kind and `satisfies` interprets it on both sides.
 */
export type Refinement = {
  kind: 'together';
  fields: [string, string];
  /** The field to mark when it fails, and what to say. */
  field: string;
  message: string;
};

const filled = (v: Record<string, string>, k: string) => Boolean(String(v[k] ?? '').trim());

/** Evaluates a rule. Used by the zod schema on the server and the wizard on the client. */
export function satisfies(r: Refinement, v: Record<string, string>): boolean {
  switch (r.kind) {
    case 'together':
      return filled(v, r.fields[0]) === filled(v, r.fields[1]);
    default:
      return true;
  }
}

export interface Questionnaire {
  steps: Step[];
  refinements?: Refinement[];
}

/** Both given, or neither. Half a pair is the failure case. */
export const together = (a: string, b: string, field: string, message: string): Refinement =>
  ({ kind: 'together', fields: [a, b], field, message });

/**
 * People type their own mobile number a dozen ways — with a space in the
 * middle, a leading zero, a country code, brackets. Rejecting those is a
 * conversion bug, not validation. Strip it to ten digits and check that.
 * The normalised form is also what WhatsApp delivery needs.
 */
export function normalisePhone(input: string): string {
  let d = input.replace(/\D/g, '');
  if (d.length === 12 && d.startsWith('91')) d = d.slice(2);
  if (d.length === 13 && d.startsWith('091')) d = d.slice(3);
  if (d.length === 11 && d.startsWith('0')) d = d.slice(1);
  return d;
}

/** One renderer drives every product; adding a product adds config, not components. */
export function schemaFor(q: Questionnaire): z.ZodType<Record<string, string>> {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const step of q.steps)
    for (const f of step.fields) {
      let s: z.ZodString = z.string().trim();
      if (f.kind === 'email') s = s.email('That does not look like an email address');
      if (f.kind === 'tel') {
        shape[f.key] = z.string()
          .transform(normalisePhone)
          .refine((v) => /^[6-9]\d{9}$/.test(v), 'Enter a 10-digit Indian mobile number');
        continue;
      }
      if (f.kind === 'date') s = s.regex(/^\d{4}-\d{2}-\d{2}$/, 'Pick a date');
      if (f.maxLength) s = s.max(f.maxLength, `Keep this under ${f.maxLength} characters`);
      if (f.options?.length) {
        shape[f.key] = f.required
          ? z.enum(f.options as [string, ...string[]])
          : z.enum(f.options as [string, ...string[]]).optional().or(z.literal(''));
        continue;
      }
      shape[f.key] = f.required ? s.min(1, `${f.label} is required`) : s.optional().or(z.literal(''));
    }
  const object = z.object(shape);
  if (!q.refinements?.length) return object as unknown as z.ZodType<Record<string, string>>;
  return object.superRefine((v, ctx) => {
    for (const r of q.refinements!)
      if (!satisfies(r, v as Record<string, string>))
        ctx.addIssue({ code: 'custom', message: r.message, path: [r.field] });
  }) as unknown as z.ZodType<Record<string, string>>;
}

export const stepCount = (q: Questionnaire): number => q.steps.length;
