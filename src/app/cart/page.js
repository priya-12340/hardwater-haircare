'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { validateDiscount } from '../../lib/api';
import { money } from '../../lib/utils';

export default function Cart() {
  const { cart, update, remove, code, setCode, applyCode, totals } = useStore();
  const [message, setMessage] = useState('');
  const [checking, setChecking] = useState(false);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  async function applyDiscount() {
    setChecking(true);
    setMessage('');
    try {
      const result = await validateDiscount(code, cart);
      applyCode(result.valid ? code : '');
      setMessage(result.message);
    } catch {
      applyCode('');
      setMessage('We could not validate this code. Please try again.');
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="page-shell">
      <div className="page-heading">
        <span className="eyebrow">Your selection</span>
        <h1>
          Your bag <small>({itemCount} items)</small>
        </h1>
      </div>
      {!cart.length ? (
        <div className="empty-state">
          <h2>Your bag is taking a little breather</h2>
          <p>There’s nothing here just yet. Explore the collection when you’re ready.</p>
          <Link className="btn btn-primary" href="/shop">
            Shop the collection
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-layout">
            <div className="cart-lines">
              {cart.map((item) => (
                <div className="cart-line" key={item.id}>
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={118}
                    height={130}
                    sizes="118px"
                    style={{ objectFit: 'cover', mixBlendMode: 'multiply' }}
                  />
                  <div className="cart-line-main">
                    <Link href={`/products/${item.slug}`}>
                      <h3>{item.name}</h3>
                    </Link>
                    <small>
                      {item.sizeMl} ml ·{' '}
                      {item.stock > 0
                        ? `${item.stock} available in demo stock`
                        : 'Stock to be confirmed'}
                    </small>
                    <b>{money(item.unitPrice)}</b>
                    <div className="quantity">
                      <button
                        onClick={() => update(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        aria-label={`Decrease ${item.name} quantity`}
                      >
                        <Minus size={14} />
                      </button>
                      <b>{item.quantity}</b>
                      <button
                        onClick={() => update(item.id, item.quantity + 1)}
                        disabled={item.quantity >= (item.stock || 10)}
                        aria-label={`Increase ${item.name} quantity`}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="cart-line-end">
                    <b>{money(item.unitPrice * item.quantity)}</b>
                    <button className="remove" onClick={() => remove(item.id)}>
                      <Trash2 size={15} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <aside className="summary-card">
              <h2>Order summary</h2>
              <div className="coupon">
                <input
                  value={code}
                  onChange={(event) => {
                    setCode(event.target.value);
                    applyCode('');
                    setMessage('');
                  }}
                  placeholder="Discount code"
                  aria-label="Discount code"
                />
                <button onClick={applyDiscount} disabled={checking}>
                  {checking ? 'Checking…' : 'Apply'}
                </button>
              </div>
              {message && (
                <small className="form-message" role="status">
                  {message}
                </small>
              )}
              <div className="summary-row">
                <span>Subtotal</span>
                <b>{money(totals.subtotal)}</b>
              </div>
              <div className="summary-row">
                <span>Discount</span>
                <b>−{money(totals.discount)}</b>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <b>{totals.shipping ? money(totals.shipping) : 'Free'}</b>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <b>{money(totals.total)}</b>
              </div>
              <p className="muted tiny">
                Shipping is free on orders above ₹999. Demo checkout — no real payment is taken.
              </p>
              <Link className="btn btn-primary full" href="/checkout">
                Proceed to checkout
              </Link>
              <Link className="continue-link" href="/shop">
                Continue shopping
              </Link>
            </aside>
          </div>
          <div className="reassurance-strip">
            <span>
              <b>Thoughtful delivery</b>
              <br />
              Shipping estimate shown at checkout
            </span>
            <span>
              <b>Demo payment</b>
              <br />
              No real payment is taken
            </span>
            <span>
              <b>Need a hand?</b>
              <br />
              Support contact details will be added before launch
            </span>
          </div>
        </>
      )}
    </div>
  );
}
