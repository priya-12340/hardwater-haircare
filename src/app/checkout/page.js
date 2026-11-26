'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { createOrder, getAddresses, saveAddress } from '../../lib/api';
import { money } from '../../lib/utils';

const blankAddress = {
  name: '',
  email: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  pincode: '',
};

const states = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

export default function Checkout() {
  const { cart, user, totals, clearCart } = useStore();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState(blankAddress);
  const [addresses, setAddresses] = useState([]);
  const [selected, setSelected] = useState('');
  const [saveForLater, setSaveForLater] = useState(true);
  const [error, setError] = useState('');
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  useEffect(() => {
    if (!user?.email) return;
    let active = true;
    setLoadingAddresses(true);
    getAddresses()
      .then((saved) => {
        if (!active) return;
        setAddresses(saved);
        const preferred = saved.find((address) => address.isDefault) || saved[0];
        setForm({
          ...blankAddress,
          name: preferred?.name || user.name || '',
          email: user.email,
          phone: preferred?.phone || '',
          line1: preferred?.line1 || '',
          line2: preferred?.line2 || '',
          city: preferred?.city || '',
          state: preferred?.state || '',
          pincode: preferred?.pincode || '',
        });
        if (preferred) setSelected(String(preferred.id));
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || 'Could not load saved addresses.');
      })
      .finally(() => {
        if (active) setLoadingAddresses(false);
      });

    return () => {
      active = false;
    };
  }, [user]);

  function change(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setError('');
  }

  function chooseAddress(id) {
    setSelected(id);
    const address = addresses.find((item) => String(item.id) === id);
    setForm((current) =>
      address
        ? { ...current, ...address, email: user.email }
        : { ...blankAddress, name: user.name || '', email: user.email },
    );
    setError('');
  }

  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    if (!cart.length) {
      setError('Your bag is empty. Add an item before checking out.');
      return;
    }

    setBusy(true);
    setError('');
    const orderData = {
      items: cart.map((item) => ({ ...item })),
      totals: { ...totals },
      address: { ...form },
      status: 'placed',
      paymentMethod: 'cod_demo',
    };

    try {
      const order = await createOrder(orderData);
      if (saveForLater) {
        try {
          const duplicate = addresses.some(
            (address) =>
              address.line1?.trim().toLowerCase() === form.line1.trim().toLowerCase() &&
              address.pincode === form.pincode,
          );
          if (!duplicate) {
            await saveAddress({
              ...form,
              isDefault: addresses.length === 0,
            });
          }
        } catch {
          // Saving an address is optional and must not undo a saved order.
        }
      }
      clearCart();
      router.push(`/order-confirmation/${order.number}`);
    } catch (requestError) {
      setError(requestError.message || 'We could not place this demo order.');
      setBusy(false);
    }
  }

  if (!cart.length) {
    return (
      <div className="page-shell empty-state">
        <h1>Your bag is empty</h1>
        <p>Add something to your bag before checkout.</p>
        <Link className="btn btn-primary" href="/shop">
          Shop now
        </Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="page-shell empty-state">
        <h1>Log in to continue</h1>
        <p>This demo checkout requires a demo account.</p>
        <Link className="btn btn-primary" href="/login?next=/checkout">
          Log in
        </Link>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-heading">
        <span className="eyebrow">Almost there</span>
        <h1>Delivery details</h1>
        <p>Review your details before placing this demo order.</p>
      </div>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={submit}>
          <h2>Contact</h2>
          <label>
            Full name
            <input
              name="name"
              autoComplete="name"
              value={form.name}
              onChange={change}
              required
              minLength="2"
              maxLength="60"
              pattern="[A-Za-z .'-]{2,60}"
              title="Use 2 to 60 letters, spaces, dots or hyphens"
            />
          </label>
          <label>
            Email
            <input
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              readOnly
              required
            />
          </label>
          <label>
            Phone
            <input
              name="phone"
              type="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={change}
              pattern="[6-9][0-9]{9}"
              inputMode="numeric"
              maxLength="10"
              placeholder="10-digit mobile number"
              required
            />
          </label>
          <h2>Delivery address</h2>
          {loadingAddresses && <p className="muted">Loading saved addresses…</p>}
          {addresses.length > 0 && (
            <label>
              Choose a saved address
              <select value={selected} onChange={(event) => chooseAddress(event.target.value)}>
                <option value="">Enter a new address</option>
                {addresses.map((address) => (
                  <option key={address.id} value={address.id}>
                    {address.name} · {address.city} · {address.pincode}
                    {address.isDefault ? ' (Default)' : ''}
                  </option>
                ))}
              </select>
            </label>
          )}
          <label>
            Address line 1
            <input
              name="line1"
              autoComplete="address-line1"
              value={form.line1}
              onChange={change}
              required
              minLength="5"
              maxLength="120"
            />
          </label>
          <label>
            Address line 2 <small>Optional</small>
            <input
              name="line2"
              autoComplete="address-line2"
              value={form.line2}
              onChange={change}
              maxLength="120"
            />
          </label>
          <div className="form-two">
            <label>
              City
              <input
                name="city"
                autoComplete="address-level2"
                value={form.city}
                onChange={change}
                required
                minLength="2"
                maxLength="60"
              />
            </label>
            <label>
              State
              <select
                name="state"
                autoComplete="address-level1"
                value={form.state}
                onChange={change}
                required
              >
                <option value="">Choose state</option>
                {states.map((state) => (
                  <option key={state}>{state}</option>
                ))}
              </select>
            </label>
          </div>
          <label>
            PIN code
            <input
              name="pincode"
              autoComplete="postal-code"
              value={form.pincode}
              onChange={change}
              inputMode="numeric"
              pattern="[1-9][0-9]{5}"
              maxLength="6"
              title="Enter a 6-digit PIN code"
              required
            />
          </label>
          <label className="check-label">
            <input
              type="checkbox"
              checked={saveForLater}
              onChange={(event) => setSaveForLater(event.target.checked)}
            />
            Save this address to my account
          </label>
          <h2>Payment</h2>
          <div className="demo-payment">
            <b>Cash on delivery (demo)</b>
            <p>
              No real payment is taken in this release. Payment gateway integration can be added
              later.
            </p>
          </div>
          <label className="check-label">
            <input type="checkbox" required /> I agree to the demo checkout conditions.
          </label>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <button className="btn btn-primary full" disabled={busy || loadingAddresses}>
            {busy ? 'Placing order…' : `Place demo order · ${money(totals.total)}`}
          </button>
          <p className="muted tiny">
            Demo only: order details are saved in this browser, not sent to a store backend.
          </p>
        </form>
        <aside className="summary-card">
          <h2>Your order</h2>
          {cart.map((item) => (
            <div className="summary-row" key={item.id}>
              <span>
                {item.name} × {item.quantity}
              </span>
              <b>{money(item.unitPrice * item.quantity)}</b>
            </div>
          ))}
          <hr />
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
          <Link className="continue-link" href="/cart">
            Edit bag
          </Link>
        </aside>
      </div>
    </div>
  );
}
