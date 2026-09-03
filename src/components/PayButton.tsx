'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Lock } from './icons';

declare global {
  interface Window { Razorpay?: new (options: Record<string, unknown>) => { open: () => void } }
}

export function PayButton({ orderId, amountLabel, devMode }: { orderId: string; amountLabel: string; devMode: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pay() {
    setBusy(true); setError(null);
    try {
      if (devMode) {
        const res = await fetch('/api/dev/pay', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId }),
        });
        if (!res.ok) throw new Error((await res.json()).error ?? 'Could not complete the test payment.');
        router.push(`/thank-you/${orderId}`);
        return;
      }

      const res = await fetch('/api/razorpay/order', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? 'Could not start the payment.');
      const o = await res.json();

      await loadRazorpay();
      if (!window.Razorpay) throw new Error('The payment window could not load. Check your connection and try again.');

      new window.Razorpay({
        key: o.keyId, amount: o.amount, currency: o.currency, order_id: o.razorpayOrderId,
        name: 'AstroRishi', description: `Report ${o.reference}`,
        prefill: { name: o.name, email: o.email, contact: o.phone },
        theme: { color: '#BE3A2B' },
        handler: () => router.push(`/thank-you/${orderId}`),
        modal: { ondismiss: () => { setBusy(false); setError('Payment was cancelled. Nothing has been charged.'); } },
      }).open();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <button type="button" onClick={pay} disabled={busy} className="btn w-full text-[17px] disabled:opacity-60">
        {busy ? 'Opening payment…' : `Pay ${amountLabel} securely`} <ArrowRight size={17} />
      </button>
      {error && <p role="alert" className="border-l-2 border-sindoor bg-sindoor-wash px-3 py-2 text-sm">{error}</p>}
      {devMode && (
        <p className="border border-dashed border-sindoor px-3 py-2 text-center text-xs text-ink-2">
          Razorpay keys are not configured, so this button completes a test payment without charging anything.
        </p>
      )}
      <p className="flex items-center justify-center gap-2 text-center text-[12.5px] text-ink-3">
        <Lock size={13} /> Payment handled by Razorpay. We never see your card.
      </p>
    </div>
  );
}

function loadRazorpay(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Could not reach Razorpay.'));
    document.body.appendChild(s);
  });
}
