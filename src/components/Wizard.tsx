'use client';

import { useActionState, useRef, useState } from 'react';
import { submitQuestionnaire, type StartState } from '@/app/start/[slug]/actions';
import { ArrowLeft, ArrowRight, Lock } from './icons';
import { satisfies, type Questionnaire, type Field } from '@/lib/questions/types';

const INITIAL: StartState = { error: null };

/**
 * Every step's fields stay mounted in the form and are hidden with the `hidden`
 * attribute rather than unmounted. The browser is then the single source of
 * truth for what has been answered — no mirrored React state to drift out of
 * sync, and every answer submits together at the end without hidden duplicates.
 */
export function Wizard({ slug, questionnaire, productName }: {
  slug: string; questionnaire: Questionnaire; productName: string;
}) {
  const [state, action, pending] = useActionState(submitQuestionnaire, INITIAL);
  const formRef = useRef<HTMLFormElement>(null);
  const [i, setI] = useState(0);
  const [missing, setMissing] = useState<string[]>([]);
  /** A cross-field rule's own wording. "Please answer this" is wrong for an optional step. */
  const [ruleNote, setRuleNote] = useState<string | null>(null);
  const attributionRef = useRef<HTMLInputElement>(null);

  const steps = questionnaire.steps;
  const refinements = questionnaire.refinements ?? [];

  // When the server rejects a field, jump back to the step holding it and mark
  // it. Without this the message appears beside the final button with no clue
  // which of thirteen answers is wrong — which reads as a form that is simply
  // stuck. Adjusting state during render is the supported pattern here; an
  // effect would cause a second render pass for the same outcome.
  const [seenError, setSeenError] = useState<string | null>(null);
  if (state.error !== seenError) {
    setSeenError(state.error);
    if (state.field) {
      const at = steps.findIndex((s) => s.fields.some((f) => f.key === state.field));
      if (at >= 0 && at !== i) setI(at);
      setMissing([]);   // the server message is the accurate one; do not shadow it
    }
  }

  const step = steps[i];
  const last = i === steps.length - 1;

  const unanswered = (): { gaps: string[]; note: string | null } => {
    const data = new FormData(formRef.current!);
    const gaps = step.fields
      .filter((f) => f.required && !String(data.get(f.key) ?? '').trim())
      .map((f) => f.key);

    // Cross-field rules run on the step that owns every field they read, so the
    // reader is told here rather than after they have paid.
    const values = Object.fromEntries([...data.entries()].map(([k, v]) => [k, String(v)]));
    const keys = new Set(step.fields.map((f) => f.key));
    let note: string | null = null;
    for (const r of refinements)
      if (r.fields.every((f) => keys.has(f)) && !satisfies(r, values)) {
        if (!gaps.includes(r.field)) gaps.push(r.field);
        note ??= r.message;
      }

    return { gaps, note };
  };

  const next = () => {
    const { gaps, note } = unanswered();
    setMissing(gaps); setRuleNote(note);
    if (!gaps.length) { setI(i + 1); setMissing([]); setRuleNote(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  };

  return (
    <form ref={formRef} action={action} className="flex min-h-[560px] flex-col"
      onSubmit={(e) => {
        const { gaps, note } = unanswered();
        if (gaps.length) { e.preventDefault(); setMissing(gaps); setRuleNote(note); return; }
        // Read attribution at submit time rather than into state on mount —
        // it is write-once data the form carries, not something React renders.
        try {
          if (attributionRef.current)
            attributionRef.current.value = sessionStorage.getItem('astrorishi_attr') ?? '';
        } catch { /* private browsing blocks sessionStorage; not worth failing an order */ }
      }}>
      <input type="hidden" name="__slug" value={slug} />
      <input ref={attributionRef} type="hidden" name="__attribution" defaultValue="" />

      <div className="flex flex-col gap-2.5 border-b border-rule pb-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[.16em] text-ink-3">Step {i + 1} of {steps.length}</span>
          <span className="font-mono text-[10px] uppercase tracking-[.16em] text-ink-3">{productName}</span>
        </div>
        <div className="flex gap-1" role="progressbar" aria-valuenow={i + 1} aria-valuemin={1}
          aria-valuemax={steps.length} aria-label={`Step ${i + 1} of ${steps.length}`}>
          {steps.map((s, k) => <span key={s.id} className={`h-1 flex-1 ${k <= i ? 'bg-sindoor' : 'bg-rule'}`} />)}
        </div>
      </div>

      {steps.map((s, k) => (
        <div key={s.id} hidden={k !== i} className="flex flex-1 flex-col gap-6 py-8">
          <div className="flex flex-col gap-2">
            <h2 className="disp text-[28px] leading-tight sm:text-[32px]">{s.title}</h2>
            {s.intro && <p className="text-[14.5px] leading-relaxed text-ink-2">{s.intro}</p>}
          </div>
          <div className="flex flex-col gap-5">
            {s.fields.map((f) => (
              <FieldInput key={f.key} f={f} previous={state.values?.[f.key] ?? ''}
                invalid={k === i && (missing.includes(f.key) || state.field === f.key)} />
            ))}
          </div>
        </div>
      ))}

      {missing.length > 0 && (
        <p role="alert" className="mb-4 border-l-2 border-sindoor bg-sindoor-wash px-3 py-2 text-sm">
          {ruleNote ?? `Please answer ${missing.length > 1 ? 'these' : 'this'} before continuing.`}
        </p>
      )}
      {state.error && (
        <p role="alert" className="mb-4 border-l-2 border-sindoor bg-sindoor-wash px-3 py-2 text-sm">
          {state.field
            ? <>
                <b>{steps.flatMap((s) => s.fields).find((f) => f.key === state.field)?.label ?? 'One answer'}:</b>{' '}
                {state.error}
              </>
            : state.error}
        </p>
      )}

      <div className="flex items-center gap-3 border-t border-rule bg-paper-card py-4">
        {i > 0 && (
          <button type="button" onClick={() => { setI(i - 1); setMissing([]); }} aria-label="Go back a step"
            className="flex min-h-[54px] w-14 shrink-0 items-center justify-center border-[1.5px] border-ink hover:bg-paper-2">
            <ArrowLeft size={18} />
          </button>
        )}
        {last ? (
          <button type="submit" disabled={pending} className="btn flex-1 disabled:opacity-60">
            {pending ? 'Saving…' : 'Continue to payment'} <ArrowRight size={17} />
          </button>
        ) : (
          <button type="button" onClick={next} className="btn flex-1">Continue <ArrowRight size={17} /></button>
        )}
      </div>

      <p className="flex items-center justify-center gap-2 pt-4 text-center text-[12.5px] text-ink-3">
        <Lock size={13} /> Your answers are used for your report and nothing else.
      </p>
    </form>
  );
}

function FieldInput({ f, invalid, previous }: { f: Field; invalid: boolean; previous: string }) {
  const id = `f-${f.key}`;
  const border = invalid ? 'border-sindoor' : 'border-rule';

  if (f.options?.length) {
    return (
      <fieldset className="flex flex-col gap-2.5">
        <legend className="lbl mb-2">{f.label}</legend>
        <div className="flex flex-col gap-2">
          {f.options.map((o) => (
            <label key={o} className={`group flex min-h-[56px] cursor-pointer items-center gap-3.5 border ${border} bg-paper-card px-4 text-base hover:border-ink-3 has-[:checked]:border-[1.5px] has-[:checked]:border-sindoor has-[:checked]:bg-sindoor-wash has-[:checked]:font-semibold`}>
              <input type="radio" name={f.key} value={o} defaultChecked={previous === o} className="peer sr-only" />
              <span className="h-[19px] w-[19px] shrink-0 rounded-full border-[1.5px] border-rule peer-checked:border-[5.5px] peer-checked:border-sindoor" />
              {o}
            </label>
          ))}
        </div>
      </fieldset>
    );
  }

  if (f.kind === 'textarea') {
    return (
      <label htmlFor={id} className="flex flex-col gap-1.5">
        <span className="lbl">{f.label}</span>
        <textarea id={id} name={f.key} rows={4} maxLength={f.maxLength} placeholder={f.placeholder}
          defaultValue={previous} className={`field ${border} resize-y`} />
        {f.help && <span className="text-xs text-ink-3">{f.help}</span>}
      </label>
    );
  }

  if (f.kind === 'date') {
    return (
      <label htmlFor={id} className="flex flex-col gap-1.5">
        <span className="lbl">{f.label}</span>
        <input id={id} name={f.key} type="date" max={new Date().toISOString().slice(0, 10)}
          min="1900-01-01" defaultValue={previous} className={`field ${border}`} />
      </label>
    );
  }

  return (
    <label htmlFor={id} className="flex flex-col gap-1.5">
      <span className="lbl">{f.label}</span>
      <input id={id} name={f.key} type={f.kind === 'tel' ? 'tel' : f.kind === 'email' ? 'email' : 'text'}
        inputMode={f.kind === 'tel' ? 'tel' : undefined}
        autoComplete={f.kind === 'email' ? 'email' : f.kind === 'tel' ? 'tel' : f.key === 'fullName' ? 'name' : 'off'}
        maxLength={f.maxLength} placeholder={f.placeholder} defaultValue={previous}
        className={`field ${border}`} />
      {f.help && <span className="text-xs text-ink-3">{f.help}</span>}
    </label>
  );
}
