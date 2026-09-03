'use client';

import { useActionState } from 'react';
import { findMyReport, type AccessState } from '@/app/access/actions';
import { ArrowRight } from './icons';

const INITIAL: AccessState = { error: null };

export function AccessForm() {
  const [state, action, pending] = useActionState(findMyReport, INITIAL);
  return (
    <form action={action} className="flex flex-col gap-4 border border-ink bg-paper-card p-6 sm:p-8">
      <label className="flex flex-col gap-1.5">
        <span className="lbl">Order number</span>
        <input name="reference" required placeholder="JN-2026-0417" autoComplete="off" className="field font-mono" />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="lbl">Phone or email you used</span>
        <input name="contact" required placeholder="9876543210" autoComplete="off" className="field" />
      </label>
      {state.error && (
        <p role="alert" className="border-l-2 border-sindoor bg-sindoor-wash px-3 py-2 text-sm">{state.error}</p>
      )}
      <button type="submit" disabled={pending} className="btn w-full disabled:opacity-60">
        {pending ? 'Looking…' : 'Open my report'} <ArrowRight size={17} />
      </button>
    </form>
  );
}
