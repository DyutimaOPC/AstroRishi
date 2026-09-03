'use client';

import { useActionState } from 'react';
import { login, type LoginState } from '@/app/admin/actions';

const INITIAL: LoginState = { error: null };

export function AdminLogin() {
  const [state, action, pending] = useActionState(login, INITIAL);
  return (
    <form action={action} className="mx-auto flex w-full max-w-[380px] flex-col gap-4 border border-ink bg-paper-card p-7">
      <div className="flex flex-col gap-1">
        <span className="lbl text-sindoor">Admin</span>
        <h1 className="disp text-2xl">Sign in</h1>
      </div>
      <label className="flex flex-col gap-1.5">
        <span className="lbl">Password</span>
        <input name="password" type="password" required autoComplete="current-password" className="field" />
      </label>
      {state.error && (
        <p role="alert" className="border-l-2 border-sindoor bg-sindoor-wash px-3 py-2 text-sm">{state.error}</p>
      )}
      <button type="submit" disabled={pending} className="btn w-full disabled:opacity-60">
        {pending ? 'Checking…' : 'Sign in'}
      </button>
    </form>
  );
}
