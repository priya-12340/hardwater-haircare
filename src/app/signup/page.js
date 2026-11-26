'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useStore } from '../../context/StoreContext';

export default function Signup() {
  const { signup } = useStore();
  const router = useRouter();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') || '').trim();
    const email = String(form.get('email') || '')
      .trim()
      .toLowerCase();
    const password = String(form.get('password') || '');
    const confirm = String(form.get('confirm') || '');

    if (password !== confirm) {
      setError('Your passwords do not match. Please check and try again.');
      return;
    }
    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      setError('Use at least 8 characters, including a letter and a number.');
      return;
    }

    setBusy(true);
    setError('');
    try {
      await signup({ name, email, password });
      router.push('/account/orders');
    } catch (requestError) {
      setError(requestError.message || 'Unable to create your demo account.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-shell">
      <form className="auth-card" onSubmit={submit}>
        <span className="eyebrow">A fresh start</span>
        <h1>Create an account</h1>
        <p>Keep your orders and routine in one place.</p>
        <label>
          Full name
          <input name="name" autoComplete="name" required minLength="2" maxLength="60" />
        </label>
        <label>
          Email address
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength="8"
            pattern="(?=.*[A-Za-z])(?=.*[0-9]).{8,}"
            title="Use at least 8 characters, including a letter and a number."
          />
        </label>
        <label>
          Confirm password
          <input
            name="confirm"
            type="password"
            autoComplete="new-password"
            required
            minLength="8"
          />
        </label>
        <label className="check-label">
          <input type="checkbox" required /> I agree to the demo terms.
        </label>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <button className="btn btn-primary full" disabled={busy}>
          {busy ? 'Creating account…' : 'Create account'}
        </button>
        <p className="auth-bottom">
          Already have an account? <Link href="/login">Log in</Link>
        </p>
        <small className="muted">
          Demo account only. Real registration and password security will be handled by the backend.
        </small>
      </form>
    </div>
  );
}
