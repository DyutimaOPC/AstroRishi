import { db, orderReference } from '@/lib/db';
import type { Store, Order, Lead, ReportRow } from './types';

const rows = <T>(d: T[] | null): T[] => d ?? [];
const one = <T>(d: T[] | null): T | null => (d && d.length ? d[0] : null);

export const supabaseStore: Store = {
  async createLead(l) {
    const { data, error } = await db().from('leads')
      .insert({ full_name: l.full_name, dob: l.dob, phone: l.phone, email: l.email }).select().limit(1);
    if (error) throw error;
    return one<Lead>(data as Lead[])!;
  },
  async getLead(id) {
    const { data } = await db().from('leads').select('*').eq('id', id).limit(1);
    return one<Lead>(data as Lead[]);
  },
  async createOrder(o) {
    const { data, error } = await db().from('orders')
      .insert({
        product_slug: o.product_slug,
        state: o.state,
        amount: o.amount,
        currency: 'INR',
        full_name: o.full_name,
        dob: o.dob,
        phone: o.phone,
        email: o.email,
        reference: orderReference(),
      }).select().limit(1);
    if (error) throw error;
    return one<Order>(data as Order[])!;
  },
  async getOrder(id) {
    const { data } = await db().from('orders').select('*').eq('id', id).limit(1);
    return one<Order>(data as Order[]);
  },
  async getOrderByReference(ref) {
    const { data } = await db().from('orders').select('*').eq('reference', ref).limit(1);
    return one<Order>(data as Order[]);
  },
  async getOrderByRazorpayId(r) {
    const { data } = await db().from('orders').select('*').eq('razorpay_order_id', r).limit(1);
    return one<Order>(data as Order[]);
  },
  async updateOrder(id, patch) {
    const { state, amount, razorpay_order_id, razorpay_payment_id, paid_at, delivered_at } = patch;
    const row: Record<string, unknown> = {};
    if (state !== undefined) row.state = state;
    if (amount !== undefined) row.amount = amount;
    if (razorpay_order_id !== undefined) row.razorpay_order_id = razorpay_order_id;
    if (razorpay_payment_id !== undefined) row.razorpay_payment_id = razorpay_payment_id;
    if (paid_at !== undefined) row.paid_at = paid_at;
    if (delivered_at !== undefined) row.delivered_at = delivered_at;
    const { data, error } = await db().from('orders').update(row).eq('id', id).select().limit(1);
    if (error) throw error;
    return one<Order>(data as Order[])!;
  },
  async listOrders(limit = 100) {
    const { data } = await db().from('orders').select('*').order('created_at', { ascending: false }).limit(limit);
    return rows<Order>(data as Order[]);
  },
  async saveAnswers(order_id, answers) {
    const { error } = await db().from('responses').upsert({ order_id, answers }, { onConflict: 'order_id' });
    if (error) throw error;
  },
  async getAnswers(order_id) {
    const { data } = await db().from('responses').select('answers').eq('order_id', order_id).limit(1);
    return (one(data as { answers: Record<string, string> }[])?.answers) ?? null;
  },
  async saveReport(r) {
    const { data, error } = await db().from('reports').upsert(r, { onConflict: 'order_id,version' }).select().limit(1);
    if (error) throw error;
    return one<ReportRow>(data as ReportRow[])!;
  },
  async getReport(order_id) {
    const { data } = await db().from('reports').select('*').eq('order_id', order_id)
      .order('version', { ascending: false }).limit(1);
    return one<ReportRow>(data as ReportRow[]);
  },
  async createToken(order_id, token) {
    const { error } = await db().from('access_tokens').insert({ token, order_id });
    if (error) throw error;
  },
  async orderForToken(token) {
    const { data } = await db().from('access_tokens').select('order_id').eq('token', token).limit(1);
    const t = one(data as { order_id: string }[]);
    return t ? this.getOrder(t.order_id) : null;
  },
  async tokenForOrder(order_id) {
    const { data } = await db().from('access_tokens').select('token').eq('order_id', order_id).limit(1);
    return one(data as { token: string }[])?.token ?? null;
  },
  async track(name, props) { await db().from('events').insert({ name, props }); },
};
