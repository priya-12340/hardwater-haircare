'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import { cancelOrder, getOrders } from '../../../lib/api';
import { money } from '../../../lib/utils';

export default function Orders() {
  const { user, logout } = useStore();
  const [orders, setOrders] = useState([]);
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function refreshOrders() {
    setLoading(true);
    setError('');
    try {
      const result = await getOrders({ page: 1 });
      setOrders(result.items);
    } catch (requestError) {
      setError(requestError.message || 'Could not load your orders.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user?.email) refreshOrders();
    else setLoading(false);
  }, [user]);

  async function handleCancel(order) {
    if (!['placed', 'processing'].includes(order.status || 'placed')) return;
    if (!window.confirm(`Are you sure you want to cancel order ${order.number}?`)) return;

    try {
      await cancelOrder(order.number);
      await refreshOrders();
      setNotice(`Demo order ${order.number} has been cancelled.`);
    } catch (requestError) {
      setNotice(requestError.message || 'We could not cancel this order.');
    }
  }

  return (
    <div className="page-shell">
      <div className="page-heading">
        <span className="eyebrow">Your account</span>
        <h1>My orders</h1>
      </div>
      {!user ? (
        <div className="empty-state">
          <p>Log in to view your orders.</p>
          <Link className="btn btn-primary" href="/login?next=/account/orders">
            Log in
          </Link>
        </div>
      ) : (
        <div className="account-panel">
          <div>
            <h2>Hello, {user.name}</h2>
            <p className="muted">{user.email}</p>
            <div className="hero-buttons">
              <Link className="text-link" href="/account/addresses">
                Manage saved addresses →
              </Link>
              <button className="text-link" onClick={() => logout().catch(() => {})}>
                Log out
              </button>
            </div>
          </div>
          {notice && (
            <p className="form-message" role="status">
              {notice}
            </p>
          )}
          {loading && (
            <p className="muted" role="status">
              Loading your orders…
            </p>
          )}
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          {!loading && !error && orders.length === 0 && (
            <div className="empty-state">
              <h2>No orders just yet</h2>
              <p>Your future orders will appear here.</p>
              <Link className="btn btn-primary" href="/shop">
                Explore the collection
              </Link>
            </div>
          )}
          {!loading &&
            orders.map((order) => (
              <article className="order-card" key={order.number}>
                <div>
                  <b>{order.number}</b>
                  <span className={`status-pill status-${order.status || 'placed'}`}>
                    {(order.status || 'placed').replace('_', ' ')}
                  </span>
                </div>
                <p>
                  {order.items?.length || 0} line items · {money(order.totals?.total || 0)}
                </p>
                <small>Placed {new Date(order.date).toLocaleDateString('en-IN')}</small>
                <div className="order-actions">
                  <Link className="text-link" href={`/account/orders/${order.number}`}>
                    View order details →
                  </Link>
                  {['placed', 'processing'].includes(order.status || 'placed') && (
                    <button
                      className="text-link cancel-order-link"
                      onClick={() => handleCancel(order)}
                    >
                      Cancel order
                    </button>
                  )}
                </div>
              </article>
            ))}
        </div>
      )}
    </div>
  );
}
