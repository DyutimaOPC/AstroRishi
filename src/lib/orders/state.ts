export const ORDER_STATES = [
  'NEW', 'QUESTIONNAIRE_COMPLETED', 'PAID',
  'REPORT_GENERATING', 'REPORT_READY', 'REVIEWED', 'DELIVERED',
] as const;
export type OrderState = (typeof ORDER_STATES)[number];

/** The only moves the system permits. Nothing may skip sideways or backwards. */
const ALLOWED: Readonly<Record<OrderState, readonly OrderState[]>> = {
  NEW: ['QUESTIONNAIRE_COMPLETED'],
  QUESTIONNAIRE_COMPLETED: ['PAID'],
  PAID: ['REPORT_GENERATING'],
  // generation may fail and be retried, so it can return to itself
  REPORT_GENERATING: ['REPORT_READY', 'REPORT_GENERATING'],
  // review is skippable once a product's generation quality is proven
  REPORT_READY: ['REVIEWED', 'DELIVERED', 'REPORT_GENERATING'],
  REVIEWED: ['DELIVERED', 'REPORT_GENERATING'],
  DELIVERED: [],
};

export const canTransition = (from: OrderState, to: OrderState): boolean =>
  ALLOWED[from].includes(to);

export class IllegalTransition extends Error {
  constructor(public from: OrderState, public to: OrderState) {
    super(`An order cannot move from ${from} to ${to}`);
    this.name = 'IllegalTransition';
  }
}

/** Throws rather than returning a boolean, so no call site can ignore it. */
export function assertTransition(from: OrderState, to: OrderState): void {
  if (!canTransition(from, to)) throw new IllegalTransition(from, to);
}

export const isPaid = (s: OrderState): boolean =>
  ORDER_STATES.indexOf(s) >= ORDER_STATES.indexOf('PAID');

export const STATE_LABEL: Readonly<Record<OrderState, string>> = {
  NEW: 'Started',
  QUESTIONNAIRE_COMPLETED: 'Questions answered',
  PAID: 'Paid',
  REPORT_GENERATING: 'Writing report',
  REPORT_READY: 'Ready to review',
  REVIEWED: 'Approved',
  DELIVERED: 'Delivered',
};
