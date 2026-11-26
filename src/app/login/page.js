'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useStore } from '../../context/StoreContext';

export default function Login() {
  const { login } = useStore();
  const router = useRouter();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') || '')
      .trim()
      .toLowerCase();
    const password = String(form.get('password') || '');

    try {
      await login('Guest Shopper', email, password);
      const next = new URLSearchParams(window.location.search).get('next');
      const safeNext =
        next && next.startsWith('/') && !next.startsWith('//') ? next : '/account/orders';
      router.push(safeNext);
    } catch (requestError) {
      setError(requestError.message || 'Unable to log in. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-shell">
      <form className="auth-card" onSubmit={submit}>
        <span className="eyebrow">Welcome back</span>
        <h1>Log in</h1>
        <p>Good to see you again.</p>
        <label>
          Email address
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
          />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            minLength="8"
            placeholder="Your password"
          />
        </label>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <button className="btn btn-primary full" disabled={busy}>
          {busy ? 'Logging in…' : 'Log in'}
        </button>
        <p className="auth-bottom">
          New here? <Link href="/signup">Create an account</Link>
        </p>
        <small className="muted">
          Demo sign-in only: any valid email and 8-character password will work. Real authentication
          will be connected to the backend.
        </small>
      </form>
    </div>
  );
}
