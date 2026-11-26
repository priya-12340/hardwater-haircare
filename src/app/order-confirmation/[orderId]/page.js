'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { getOrder } from '../../../lib/api';
import { money } from '../../../lib/utils';

export default function Confirmation() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    getOrder(orderId)
      .then((result) => {
        if (active) setOrder(result);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || 'Order details are unavailable.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [orderId]);

  return (
    <div className="page-shell">
      <div className="confirmation-card">
        <CheckCircle2 size={54} />
        <span className="eyebrow">Thank you</span>
        <h1>Your demo order is placed.</h1>
        {loading && (
          <p className="muted" role="status">
            Loading order details…
          </p>
        )}
        {!loading && error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        {order && (
          <>
            <p>
              Order number <b>{order.number}</b>
            </p>
            <p className="muted">
              This is a frontend demo. No real payment or fulfilment has taken place.
            </p>
            <span className={`status-pill status-${order.status || 'placed'}`}>
              {(order.status || 'placed').replace('_', ' ')}
            </span>
            <div className="summary-card confirmation-summary">
              <h2>Order summary</h2>
              {order.items.map((item) => (
                <div className="summary-row" key={item.id}>
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <b>{money(item.unitPrice * item.quantity)}</b>
                </div>
              ))}
              <div className="summary-row total">
                <span>Total</span>
                <b>{money(order.totals.total)}</b>
              </div>
            </div>
          </>
        )}
        <div className="hero-buttons">
          <Link className="btn btn-primary" href="/shop">
            Continue shopping
          </Link>
          {order && (
            <Link className="btn btn-outline" href={`/account/orders/${order.number}`}>
              View order details
            </Link>
          )}
          <Link className="text-link" href="/account/orders">
            My orders
          </Link>
        </div>
      </div>
    </div>
  );
}
