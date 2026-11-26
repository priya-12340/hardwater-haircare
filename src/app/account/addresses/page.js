'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import { deleteAddress, getAddresses, saveAddress } from '../../../lib/api';

const emptyAddress = {
  name: '',
  phone: '',
  line1: '',
  line2: '',
  landmark: '',
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

export default function Addresses() {
  const { user } = useStore();
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState(emptyAddress);
  const [editing, setEditing] = useState(null);
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function refreshAddresses() {
    setLoading(true);
    setError('');
    try {
      setAddresses(await getAddresses());
    } catch (requestError) {
      setError(requestError.message || 'Could not load saved addresses.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) refreshAddresses();
    else setLoading(false);
  }, [user]);

  async function submit(event) {
    event.preventDefault();
    if (!user || busy) return;
    setBusy(true);
    setNotice('');
    try {
      await saveAddress({ ...form, id: editing });
      await refreshAddresses();
      setForm(emptyAddress);
      setEditing(null);
      setNotice('Address book updated.');
    } catch (requestError) {
      setNotice(requestError.message || 'We could not save this address.');
    } finally {
      setBusy(false);
    }
  }

  function edit(address) {
    setForm({ ...emptyAddress, ...address });
    setEditing(address.id);
    setNotice('');
  }

  async function remove(id) {
    if (!window.confirm('Delete this saved address?')) return;
    try {
      await deleteAddress(id);
      await refreshAddresses();
      setNotice('Address deleted.');
    } catch (requestError) {
      setNotice(requestError.message || 'Could not delete this address.');
    }
  }

  async function makeDefault(address) {
    try {
      await saveAddress({ ...address, isDefault: true });
      await refreshAddresses();
    } catch (requestError) {
      setNotice(requestError.message || 'Could not update the default address.');
    }
  }

  if (!user) {
    return (
      <div className="page-shell empty-state">
        <h1>Saved addresses</h1>
        <p>Please log in to manage your addresses.</p>
        <Link className="btn btn-primary" href="/login?next=/account/addresses">
          Log in
        </Link>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-heading">
        <span className="eyebrow">Your account</span>
        <h1>Saved addresses</h1>
        <p>Keep your delivery details handy for your next order.</p>
      </div>
      <div className="account-panel">
        {loading && (
          <p className="muted" role="status">
            Loading saved addresses…
          </p>
        )}
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        {notice && (
          <p className="form-message" role="status">
            {notice}
          </p>
        )}
        {!loading && !error && addresses.length === 0 && (
          <p className="muted">You have not saved an address yet.</p>
        )}
        <div className="address-grid">
          {addresses.map((address) => (
            <article className="order-card" key={address.id}>
              <div>
                <b>{address.name}</b>
                {address.isDefault && <span className="status-pill">Default</span>}
              </div>
              <p>
                {address.phone}
                <br />
                {address.line1}
                {address.line2 && `, ${address.line2}`}
                <br />
                {address.city}, {address.state} {address.pincode}
              </p>
              <div className="hero-buttons">
                <button className="btn btn-outline" onClick={() => edit(address)}>
                  Edit
                </button>
                <button className="text-link" onClick={() => remove(address.id)}>
                  Delete
                </button>
                {!address.isDefault && (
                  <button className="text-link" onClick={() => makeDefault(address)}>
                    Set as default
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
        <form className="checkout-form address-editor" onSubmit={submit}>
          <h2>{editing === null ? 'Add a new address' : 'Edit address'}</h2>
          <label>
            Full name
            <input
              required
              minLength="2"
              maxLength="60"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
            />
          </label>
          <label>
            Phone
            <input
              required
              inputMode="numeric"
              pattern="[6-9][0-9]{9}"
              value={form.phone}
              onChange={(event) => setForm({ ...form, phone: event.target.value })}
            />
          </label>
          <label>
            Address line 1
            <input
              required
              minLength="5"
              maxLength="120"
              value={form.line1}
              onChange={(event) => setForm({ ...form, line1: event.target.value })}
            />
          </label>
          <label>
            Address line 2
            <input
              maxLength="120"
              value={form.line2}
              onChange={(event) => setForm({ ...form, line2: event.target.value })}
            />
          </label>
          <div className="form-two">
            <label>
              City
              <input
                required
                minLength="2"
                value={form.city}
                onChange={(event) => setForm({ ...form, city: event.target.value })}
              />
            </label>
            <label>
              State
              <select
                required
                value={form.state}
                onChange={(event) => setForm({ ...form, state: event.target.value })}
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
              required
              inputMode="numeric"
              pattern="[1-9][0-9]{5}"
              value={form.pincode}
              onChange={(event) => setForm({ ...form, pincode: event.target.value })}
            />
          </label>
          <div className="hero-buttons">
            <button className="btn btn-primary" disabled={busy || loading}>
              {busy ? 'Saving…' : editing === null ? 'Save address' : 'Update address'}
            </button>
            {editing !== null && (
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setEditing(null);
                  setForm(emptyAddress);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
