import { cookies } from 'next/headers';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { env } from './env';

const COOKIE = 'astrorishi_admin';

const sign = (v: string) => createHmac('sha256', env.ADMIN_PASSWORD ?? 'unset').update(v).digest('hex');

export async function isAdmin(): Promise<boolean> {
  if (!env.ADMIN_PASSWORD) return false;
  const jar = await cookies();
  const raw = jar.get(COOKIE)?.value;
  if (!raw) return false;
  const [issued, mac] = raw.split('.');
  if (!issued || !mac) return false;
  const expected = sign(issued);
  const a = Buffer.from(mac), b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  // Sessions last a week; an admin cookie is not a permanent grant.
  return Date.now() - Number(issued) < 7 * 24 * 60 * 60 * 1000;
}

export async function signIn(password: string): Promise<boolean> {
  if (!env.ADMIN_PASSWORD) return false;
  const a = Buffer.from(password), b = Buffer.from(env.ADMIN_PASSWORD);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  const issued = String(Date.now());
  (await cookies()).set(COOKIE, `${issued}.${sign(issued)}`, {
    httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production',
    path: '/admin', maxAge: 7 * 24 * 60 * 60,
  });
  return true;
}

export async function signOut(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

export const adminConfigured = (): boolean => !!env.ADMIN_PASSWORD;
