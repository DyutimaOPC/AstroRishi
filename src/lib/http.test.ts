import { describe, it, expect } from 'vitest';
import { readJson, orderIdBody } from './http';

const post = (body: unknown, headers: Record<string, string> = {}) =>
  new Request('http://x/', {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });

describe('JSON body validation', () => {
  it('accepts a well-formed body', async () => {
    const r = await readJson(post({ orderId: '4d1a6f2e-9c3b-4a7e-8f21-2b6c9d0e5a13' }), orderIdBody);
    expect(r.ok).toBe(true);
  });

  it('rejects the shapes a type assertion would have let through', async () => {
    for (const body of [{}, { orderId: 42 }, { orderId: { evil: true } }, { orderId: ['a'] },
                        { orderId: 'not-a-uuid' }, { orderId: null }, []])
      expect((await readJson(post(body), orderIdBody)).ok).toBe(false);
  });

  it('rejects a body that is not JSON at all', async () => {
    expect((await readJson(post('<html>'), orderIdBody)).ok).toBe(false);
  });

  it('refuses an oversized body before reading it', async () => {
    const r = await readJson(post({ orderId: 'x' }, { 'content-length': '999999' }), orderIdBody);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.response.status).toBe(413);
  });

  it('answers with a message, never an unhandled throw', async () => {
    const r = await readJson(post({ orderId: 9 }), orderIdBody);
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.response.status).toBe(400);
      expect((await r.response.json()).error).toBeTruthy();
    }
  });
});
