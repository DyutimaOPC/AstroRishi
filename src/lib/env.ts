import { z } from 'zod';

/**
 * Every integration is optional at build time and checked at the point of use,
 * so the site renders and the engine runs before any account exists.
 */
const schema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  RAZORPAY_KEY_ID: z.string().min(1).optional(),
  RAZORPAY_KEY_SECRET: z.string().min(1).optional(),
  RAZORPAY_WEBHOOK_SECRET: z.string().min(1).optional(),
  NEXT_PUBLIC_RAZORPAY_KEY_ID: z.string().min(1).optional(),
  ANTHROPIC_API_KEY: z.string().min(1).optional(),
  /**
   * The engine supplies every fact; the model only writes prose around them.
   * That is a constrained writing task, not a reasoning one, so it does not
   * need the largest model — Opus 5 costs about 2.5x Sonnet 5 here for work
   * Sonnet does well. Haiku 4.5 is a further 2.5x cheaper again and is the
   * likely end state; run `npm run compare:models` against a real key and
   * move this default down if the prose holds up.
   */
  ANTHROPIC_MODEL: z.string().default('claude-sonnet-5'),
  RESEND_API_KEY: z.string().min(1).optional(),
  ADMIN_PASSWORD: z.string().min(8).optional(),
  NEXT_PUBLIC_META_PIXEL_ID: z.string().optional(),
  META_CAPI_TOKEN: z.string().optional(),
});

export const env = schema.parse(process.env);

export class MissingConfig extends Error {
  constructor(keys: string[], what: string) {
    super(`${what} needs ${keys.join(', ')} in your environment. Add it to .env.local and restart.`);
    this.name = 'MissingConfig';
  }
}

export function require_(keys: (keyof typeof env)[], what: string) {
  const missing = keys.filter((k) => !env[k]);
  if (missing.length) throw new MissingConfig(missing as string[], what);
}

export const configured = {
  db: () => !!(env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY),
  razorpay: () => !!(env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET),
  anthropic: () => !!env.ANTHROPIC_API_KEY,
  email: () => !!env.RESEND_API_KEY,
};
