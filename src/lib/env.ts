import { z } from 'zod';

const schema = z.object({
  NEXT_PUBLIC_SITE_URL: z.preprocess(
    (v) => (typeof v === 'string' && v.length > 0 ? v : undefined),
    z.string().url().default('https://astrorishi.org'),
  ),
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  RAZORPAY_KEY_ID: z.string().min(1).optional(),
  RAZORPAY_KEY_SECRET: z.string().min(1).optional(),
  RAZORPAY_WEBHOOK_SECRET: z.string().min(1).optional(),
  NEXT_PUBLIC_RAZORPAY_KEY_ID: z.string().min(1).optional(),
  GOOGLE_API_KEY: z.string().min(1).optional(),
  GOOGLE_MODEL: z.string().default('gemini-3.6-flash'),
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
  llm: () => !!env.GOOGLE_API_KEY,
  email: () => !!env.RESEND_API_KEY,
};
