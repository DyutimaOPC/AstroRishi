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
  RESEND_API_KEY: z.string().min(1).optional(),
  ADMIN_PASSWORD: z.string().min(8).optional(),
  NEXT_PUBLIC_META_PIXEL_ID: z.string().optional(),
  META_CAPI_TOKEN: z.string().optional(),
  ADMIN_EMAIL: z.string().email().optional(),
  WHATSAPP_TOKEN: z.string().min(1).optional(),
  WHATSAPP_PHONE_ID: z.string().min(1).optional(),
  PRICE_NAME_NUMEROLOGY: z.coerce.number().int().positive().optional(),
  PRICE_CAREER_RELATIONSHIP: z.coerce.number().int().positive().optional(),
  PRICE_BOTH: z.coerce.number().int().positive().optional(),
  PRICE_KUNDLI: z.coerce.number().int().positive().optional(),
  COMPARE_NAME_NUMEROLOGY: z.coerce.number().int().positive().optional(),
  COMPARE_CAREER_RELATIONSHIP: z.coerce.number().int().positive().optional(),
  COMPARE_BOTH: z.coerce.number().int().positive().optional(),
  COMPARE_KUNDLI: z.coerce.number().int().positive().optional(),
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
  email: () => !!env.RESEND_API_KEY,
  whatsapp: () => !!(env.WHATSAPP_TOKEN && env.WHATSAPP_PHONE_ID),
};
