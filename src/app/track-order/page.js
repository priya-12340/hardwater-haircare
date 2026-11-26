'use client';

import { useState } from 'react';
import Link from 'next/link';
import { trackOrder } from '../../lib/api';
import { money } from '../../lib/utils';

export default function Track() {
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function lookup(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const number = String(form.get('number') || '')
      .trim()
      .toUpperCase();
    const contact = String(form.get('contact') || '')
      .trim()
      .toLowerCase();
    setBusy(true);
    setError('');
    setOrder(null);

    try {
      setOrder(await trackOrder(number, contact));
    } catch (requestError) {
      setError(requestError.message || 'Unable to look up this demo order.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-shell">
      <form className="auth-card" onSubmit={lookup}>
        <span className="eyebrow">A little reassurance</span>
        <h1>Track your order</h1>
        <p>Enter your order number and the email or phone used at checkout.</p>
        <label>
          Order number
          <input name="number" required placeholder="HW-1234567" />
        </label>
        <label>
          Email or phone
          <input name="contact" required placeholder="you@example.com or 10-digit phone" />
        </label>
        <button className="btn btn-primary full" disabled={busy}>
          {busy ? 'Checking…' : 'Check status'}
        </button>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        {order && (
          <div className="track-result">
            <b>{order.number}</b>
            <span className={`status-pill status-${order.status || 'placed'}`}>
              {(order.status || 'placed').replace('_', ' ')}
            </span>
            <p>
              {order.status === 'cancelled' ? (
                'This order has been cancelled.'
              ) : (
                <>
                  This is a demo order. Live courier updates will be available after tracking API
                  integration.
                </>
              )}
            </p>
            <p>
              <b>Order total:</b> {money(order.totals?.total || 0)}
            </p>
            <Link className="text-link" href={`/account/orders/${order.number}`}>
              View order details →
            </Link>
          </div>
        )}
      </form>
    </div>
  );
}
