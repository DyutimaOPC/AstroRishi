import type { OrderState } from '@/lib/orders/state';
import type { ProductSlug } from '@/lib/config/products';

export interface Attribution {
  utm_source?: string; utm_medium?: string; utm_campaign?: string;
  utm_content?: string; utm_term?: string; fbclid?: string; gclid?: string;
  landing_path?: string; referrer?: string;
}

export interface Lead {
  id: string; full_name: string; dob: string;
  phone?: string; email?: string; created_at: string;
  attribution?: Attribution;
}

export interface Order {
  id: string;
  reference: string;
  product_slug: ProductSlug;
  state: OrderState;
  amount_paise: number;
  full_name: string;
  dob?: string;
  phone?: string;
  email?: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  attribution?: Attribution;
  created_at: string;
  paid_at?: string;
  delivered_at?: string;
}

export interface ReportRow {
  id: string;
  order_id: string;
  version: number;
  computed: unknown;
  sections: unknown | null;
  engine_version: string;
  model?: string;
  claims_passed: boolean;
  created_at: string;
}

export interface Store {
  createLead(l: Omit<Lead, 'id' | 'created_at'>): Promise<Lead>;
  getLead(id: string): Promise<Lead | null>;
  createOrder(o: Omit<Order, 'id' | 'reference' | 'created_at'>): Promise<Order>;
  getOrder(id: string): Promise<Order | null>;
  getOrderByReference(ref: string): Promise<Order | null>;
  getOrderByRazorpayId(rzpOrderId: string): Promise<Order | null>;
  updateOrder(id: string, patch: Partial<Order>): Promise<Order>;
  listOrders(limit?: number): Promise<Order[]>;
  saveAnswers(orderId: string, answers: Record<string, string>): Promise<void>;
  getAnswers(orderId: string): Promise<Record<string, string> | null>;
  saveReport(r: Omit<ReportRow, 'id' | 'created_at'>): Promise<ReportRow>;
  getReport(orderId: string): Promise<ReportRow | null>;
  createToken(orderId: string, token: string): Promise<void>;
  orderForToken(token: string): Promise<Order | null>;
  tokenForOrder(orderId: string): Promise<string | null>;
  track(name: string, props?: Record<string, unknown>): Promise<void>;
}
