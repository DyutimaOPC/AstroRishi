import { promises as fs } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { orderReference } from '@/lib/db';
import type { Store, Order, Lead, ReportRow } from './types';

/**
 * File-backed store for local development so the whole funnel runs before any
 * Supabase project exists. Single process, no concurrency guarantees — it is a
 * development convenience, never a production driver.
 */
const DIR = process.env.VERCEL ? '/tmp' : path.join(process.cwd(), '.data');
const FILE = path.join(DIR, 'dev-store.json');

interface Shape {
  leads: Lead[]; orders: Order[];
  answers: Record<string, Record<string, string>>;
  reports: ReportRow[]; tokens: Record<string, string>;
  events: { name: string; props?: Record<string, unknown>; at: string }[];
}
const EMPTY: Shape = { leads: [], orders: [], answers: {}, reports: [], tokens: {}, events: [] };

async function read(): Promise<Shape> {
  try { return { ...EMPTY, ...JSON.parse(await fs.readFile(FILE, 'utf8')) }; }
  catch { return structuredClone(EMPTY); }
}
async function write(d: Shape): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(d, null, 2));
}

export const devStore: Store = {
  async createLead(l) {
    const d = await read();
    const lead: Lead = { ...l, id: randomUUID(), created_at: new Date().toISOString() };
    d.leads.push(lead); await write(d); return lead;
  },
  async getLead(id) { return (await read()).leads.find((l) => l.id === id) ?? null; },
  async createOrder(o) {
    const d = await read();
    const order: Order = { ...o, id: randomUUID(), reference: orderReference(), created_at: new Date().toISOString() };
    d.orders.push(order); await write(d); return order;
  },
  async getOrder(id) { return (await read()).orders.find((o) => o.id === id) ?? null; },
  async getOrderByReference(ref) { return (await read()).orders.find((o) => o.reference === ref) ?? null; },
  async getOrderByRazorpayId(r) { return (await read()).orders.find((o) => o.razorpay_order_id === r) ?? null; },
  async updateOrder(id, patch) {
    const d = await read();
    const i = d.orders.findIndex((o) => o.id === id);
    if (i < 0) throw new Error(`No order ${id}`);
    d.orders[i] = { ...d.orders[i], ...patch };
    await write(d); return d.orders[i];
  },
  async listOrders(limit = 100) {
    return (await read()).orders.sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, limit);
  },
  async saveAnswers(orderId, answers) {
    const d = await read(); d.answers[orderId] = answers; await write(d);
  },
  async getAnswers(orderId) { return (await read()).answers[orderId] ?? null; },
  async saveReport(r) {
    const d = await read();
    const row: ReportRow = { ...r, id: randomUUID(), created_at: new Date().toISOString() };
    d.reports = d.reports.filter((x) => !(x.order_id === r.order_id && x.version === r.version));
    d.reports.push(row); await write(d); return row;
  },
  async getReport(orderId) {
    const d = await read();
    return d.reports.filter((r) => r.order_id === orderId).sort((a, b) => b.version - a.version)[0] ?? null;
  },
  async createToken(orderId, token) { const d = await read(); d.tokens[token] = orderId; await write(d); },
  async orderForToken(token) {
    const d = await read(); const id = d.tokens[token];
    return id ? d.orders.find((o) => o.id === id) ?? null : null;
  },
  async tokenForOrder(orderId) {
    const d = await read();
    return Object.entries(d.tokens).find(([, v]) => v === orderId)?.[0] ?? null;
  },
  async track(name, props) {
    const d = await read(); d.events.push({ name, props, at: new Date().toISOString() });
    if (d.events.length > 2000) d.events = d.events.slice(-2000);
    await write(d);
  },
};
