import Link from 'next/link';
import type { Metadata } from 'next';
import { store } from '@/lib/store';
import { storeKind } from '@/lib/store';
import { isAdmin, adminConfigured } from '@/lib/admin';
import { AdminLogin } from '@/components/AdminLogin';
import { logout, regenerate, approve, deliver } from './actions';
import { STATE_LABEL, isPaid, canTransition } from '@/lib/orders/state';
import { PRODUCTS, rupees } from '@/lib/config/products';
import { configured } from '@/lib/env';

export const metadata: Metadata = { title: 'Admin', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  if (!adminConfigured())
    return <Shell><Notice title="Admin is not configured">
      Set <code className="font-mono">ADMIN_PASSWORD</code> in <code className="font-mono">.env.local</code> (at least 8
      characters) and restart the server.
    </Notice></Shell>;

  if (!(await isAdmin())) return <Shell><AdminLogin /></Shell>;

  const orders = await store.listOrders(200);
  const paid = orders.filter((o) => isPaid(o.state));
  const revenue = paid.reduce((t, o) => t + o.amount_paise, 0);
  const awaiting = orders.filter((o) => o.state === 'REPORT_READY').length;

  return (
    <Shell>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-rule pb-5">
        <div className="flex flex-col gap-1">
          <span className="lbl text-sindoor">Admin</span>
          <h1 className="disp text-[34px] leading-tight">Orders</h1>
        </div>
        <div className="flex items-center gap-5">
          <span className="font-mono text-[10px] uppercase tracking-[.14em] text-ink-3">
            store: {storeKind()} · payments: {configured.razorpay() ? 'live' : 'dev'} · prose: {configured.llm() ? 'on' : 'off'}
          </span>
          <form action={logout}><button className="btn-o min-h-[40px] px-4 text-sm">Sign out</button></form>
        </div>
      </div>

      <div className="grid gap-px border border-rule bg-rule sm:grid-cols-4">
        <Stat label="Orders" value={String(orders.length)} />
        <Stat label="Paid" value={String(paid.length)} />
        <Stat label="Revenue" value={rupees(revenue)} />
        <Stat label="Awaiting review" value={String(awaiting)} accent={awaiting > 0} />
      </div>

      {orders.length === 0 ? (
        <Notice title="No orders yet">Once someone completes the questionnaire, they will appear here.</Notice>
      ) : (
        <div className="overflow-x-auto border border-rule">
          <table className="w-full min-w-[900px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-ink text-[#B8B0A6]">
                {['Order', 'Customer', 'Report', 'State', 'Amount', 'Actions'].map((h) => (
                  <th key={h} className="lbl px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-rule bg-paper-card align-top">
                  <td className="px-4 py-3 font-mono text-xs">
                    {o.reference}
                    <span className="block text-ink-3">{new Date(o.created_at).toLocaleString('en-IN')}</span>
                  </td>
                  <td className="px-4 py-3">
                    {o.full_name}
                    <span className="block text-xs text-ink-3">{o.phone ?? '—'}</span>
                    <span className="block text-xs text-ink-3">{o.email ?? '—'}</span>
                  </td>
                  <td className="px-4 py-3">{PRODUCTS[o.product_slug]?.name ?? o.product_slug}</td>
                  <td className="px-4 py-3">
                    <span className={`whitespace-nowrap px-2 py-1 font-mono text-[10px] uppercase tracking-[.1em] ${
                      o.state === 'DELIVERED' ? 'bg-[#E3EFE6] text-leaf'
                      : o.state === 'REPORT_READY' ? 'bg-sindoor-wash text-sindoor'
                      : 'bg-paper-2 text-ink-2'}`}>
                      {STATE_LABEL[o.state]}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{rupees(o.amount_paise)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <ActionButton action={regenerate} orderId={o.id} label="Regenerate"
                        enabled={canTransition(o.state, 'REPORT_GENERATING')} />
                      <ActionButton action={approve} orderId={o.id} label="Approve"
                        enabled={canTransition(o.state, 'REVIEWED')} />
                      <ActionButton action={deliver} orderId={o.id} label="Mark delivered"
                        enabled={canTransition(o.state, 'DELIVERED')} />
                      <ViewReport orderId={o.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Shell>
  );
}

async function ViewReport({ orderId }: { orderId: string }) {
  const token = await store.tokenForOrder(orderId);
  if (!token) return null;
  return (
    <Link href={`/r/${token}`} className="border border-rule px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[.1em] text-ink-2 hover:border-sindoor hover:text-sindoor">
      View
    </Link>
  );
}

function ActionButton({ action, orderId, label, enabled }: {
  action: (fd: FormData) => Promise<void>; orderId: string; label: string; enabled: boolean;
}) {
  if (!enabled) return null;
  return (
    <form action={action}>
      <input type="hidden" name="orderId" value={orderId} />
      <button className="border border-rule px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[.1em] text-ink-2 hover:border-sindoor hover:text-sindoor">
        {label}
      </button>
    </form>
  );
}

const Shell = ({ children }: { children: React.ReactNode }) => (
  <main className="wrap flex max-w-[1200px] flex-col gap-6 py-10">{children}</main>
);
const Stat = ({ label, value, accent }: { label: string; value: string; accent?: boolean }) => (
  <div className={`flex flex-col gap-1 p-5 ${accent ? 'bg-sindoor-wash' : 'bg-paper-card'}`}>
    <span className={`lbl ${accent ? 'text-sindoor' : ''}`}>{label}</span>
    <span className={`disp text-[32px] leading-none ${accent ? 'text-sindoor' : ''}`}>{value}</span>
  </div>
);
const Notice = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="border border-rule bg-paper-card p-6">
    <h2 className="disp mb-2 text-2xl">{title}</h2>
    <p className="text-[15px] leading-relaxed text-ink-2">{children}</p>
  </div>
);
