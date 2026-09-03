import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env, configured } from './env';

let cached: SupabaseClient | null = null;

/**
 * Server-only client using the service role key. Every table has RLS enabled
 * with no policies, so nothing is reachable except through here.
 */
export function db(): SupabaseClient {
  if (!configured.db())
    throw new Error('Database not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
  return (cached ??= createClient(env.SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  }));
}

/** JN-2026-0417 — short, sayable over the phone, not sequential enough to enumerate. */
export function orderReference(now = new Date()): string {
  const n = Math.floor(Math.random() * 9000) + 1000;
  return `JN-${now.getUTCFullYear()}-${n}`;
}

/** 32 url-safe characters. Long enough that a report link cannot be guessed. */
export function accessToken(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Buffer.from(bytes).toString('base64url');
}
