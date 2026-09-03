import { NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * Parse and VALIDATE a JSON body.
 *
 * `(await req.json()) as { orderId?: string }` is a type assertion, not a check
 * — at runtime the value can be anything at all. Every route that takes a body
 * goes through here instead.
 */
export async function readJson<T>(
  req: Request,
  schema: z.ZodType<T>,
): Promise<{ ok: true; data: T } | { ok: false; response: NextResponse }> {
  const bad = (message: string, status = 400) =>
    ({ ok: false as const, response: NextResponse.json({ error: message }, { status }) });

  // A body large enough to be an attack is not a body we need to read.
  const declared = Number(req.headers.get('content-length') ?? 0);
  if (declared > 32_000) return bad('Request body is too large', 413);

  let raw: unknown;
  try { raw = await req.json(); }
  catch { return bad('Expected a JSON body'); }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) return bad(parsed.error.issues[0]?.message ?? 'Invalid request');
  return { ok: true, data: parsed.data };
}

/** Order ids are UUIDs. Anything else is not worth a database round trip. */
export const orderIdBody = z.object({
  orderId: z.string().uuid('That is not a valid order reference'),
});
