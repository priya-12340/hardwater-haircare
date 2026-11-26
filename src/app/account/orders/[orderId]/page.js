'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cancelOrder, getOrder } from '../../../../lib/api';
import { money } from '../../../../lib/utils';

export default function OrderDetail() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    getOrder(orderId)
      .then((result) => {
        if (active) setOrder(result);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || 'Could not load this order.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [orderId]);

  async function handleCancel() {
    if (!order || !['placed', 'processing'].includes(order.status || 'placed')) return;
    if (!window.confirm(`Are you sure you want to cancel order ${order.number}?`)) return;

    try {
      const updated = await cancelOrder(order.number);
      setOrder(updated);
      setNotice('Your demo order has been cancelled.');
    } catch (requestError) {
      setNotice(requestError.message || 'We could not update this order.');
    }
  }

  if (loading) {
    return (
      <div className="page-shell">
        <p className="muted" role="status">
          Loading order details…
        </p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="page-shell empty-state">
        <h1>Order not found</h1>
        <p>{error || 'We could not find this order.'}</p>
        <Link className="btn btn-primary" href="/account/orders">
          Back to my orders
        </Link>
      </div>
    );
  }

  const canCancel = ['placed', 'processing'].includes(order.status || 'placed');

  return (
    <div className="page-shell">
      <div className="page-heading">
        <span className="eyebrow">Your account</span>
        <h1>Order details</h1>
        <p>
          {order.number} · Placed {new Date(order.date).toLocaleDateString('en-IN')}
        </p>
      </div>
      <div className="account-panel order-detail-panel">
        <div className="order-status-heading">
          <h2>Order status</h2>
          <span className={`status-pill status-${order.status || 'placed'}`}>
            {(order.status || 'placed').replace('_', ' ')}
          </span>
        </div>
        {notice && (
          <p className="form-message" role="status">
            {notice}
          </p>
        )}
        <h3>Items</h3>
        {order.items?.map((item) => (
          <div className="summary-row" key={item.id}>
            <span>
              {item.name} × {item.quantity}
            </span>
            <b>{money(item.unitPrice * item.quantity)}</b>
          </div>
        ))}
        <div className="summary-row total">
          <span>Order total</span>
          <b>{money(order.totals?.total || 0)}</b>
        </div>
        <h3>Delivery address</h3>
        <p>
          {order.address?.name}
          <br />
          {order.address?.line1}
          {order.address?.line2 ? `, ${order.address.line2}` : ''}
          <br />
          {order.address?.city}, {order.address?.state} {order.address?.pincode}
          <br />
          {order.address?.phone}
        </p>
        <div className="hero-buttons">
          {canCancel && (
            <button className="btn btn-outline" onClick={handleCancel}>
              Cancel order
            </button>
          )}
          <Link className="btn btn-primary" href="/track-order">
            Track order
          </Link>
          <Link className="text-link" href="/account/orders">
            Back to my orders
          </Link>
        </div>
        {!canCancel && order.status !== 'cancelled' && (
          <p className="muted tiny">
            This order can no longer be cancelled because it has moved beyond the cancellation
            window.
          </p>
        )}
      </div>
    </div>
  );
}
