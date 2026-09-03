'use client';

import { useActionState } from 'react';
import { runFreeCheck, type CheckState } from '@/app/check/actions';
import { Lock } from './icons';

const INITIAL: CheckState = { error: null };

export function FreeCheckForm({ compact = false }: { compact?: boolean }) {
  const [state, action, pending] = useActionState(runFreeCheck, INITIAL);
  const years = Array.from({ length: 90 }, (_, i) => new Date().getFullYear() - 12 - i);

  return (
    <form action={action} className="flex flex-col gap-4 border border-ink bg-paper-card p-6 sm:p-8">
      <div className="flex flex-col gap-1.5 border-b border-rule pb-4">
        <span className="lbl text-sindoor">Free · no payment</span>
        <h2 className={`disp leading-tight ${compact ? 'text-2xl' : 'text-[30px]'}`}>Check your name free</h2>
        <p className="text-[14.5px] leading-snug text-ink-2">
          Your name number, your birth number, and whether the two agree. Thirty seconds.
        </p>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="lbl">Full name</span>
        <input name="fullName" required maxLength={80} autoComplete="name"
          placeholder="As written today" className="field" />
      </label>

      <fieldset className="flex flex-col gap-1.5">
        <legend className="lbl mb-1.5">Date of birth</legend>
        <div className="grid grid-cols-3 gap-2">
          <select name="day" required aria-label="Day of birth" className="field" defaultValue="">
            <option value="" disabled>Day</option>
            {Array.from({ length: 31 }, (_, i) => <option key={i}>{i + 1}</option>)}
          </select>
          <select name="month" required aria-label="Month of birth" className="field" defaultValue="">
            <option value="" disabled>Month</option>
            {['January','February','March','April','May','June','July','August','September','October','November','December']
              .map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
          </select>
          <select name="year" required aria-label="Year of birth" className="field" defaultValue="">
            <option value="" disabled>Year</option>
            {years.map((y) => <option key={y}>{y}</option>)}
          </select>
        </div>
      </fieldset>

      {state.error && (
        <p role="alert" className="border-l-2 border-sindoor bg-sindoor-wash px-3 py-2 text-sm text-ink">{state.error}</p>
      )}

      <button type="submit" disabled={pending} className="btn w-full disabled:opacity-60">
        {pending ? 'Working it out…' : 'Show my result'}
      </button>

      <p className="flex items-center justify-center gap-2 text-center text-[12.5px] text-ink-3">
        <Lock size={13} /> No signup. Your details are never shown to anyone else.
      </p>
    </form>
  );
}
