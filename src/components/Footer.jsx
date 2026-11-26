'use client';
import Link from 'next/link';
import { Leaf, Mail } from 'lucide-react';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  function subscribe(e) {
    e.preventDefault();
    const clean = email.trim().toLowerCase();
    if (!clean) return;
    setBusy(true);
    try {
      const list = JSON.parse(localStorage.getItem('hw-newsletter-subscribers') || '[]');
      if (list.includes(clean)) setMessage('You are already subscribed with this email.');
      else {
        localStorage.setItem('hw-newsletter-subscribers', JSON.stringify([...list, clean]));
        setMessage(
          'Thanks! This demo has saved your email in this browser. Email delivery will be enabled after backend integration.',
        );
      }
      setEmail('');
    } catch {
      setMessage('We could not save your subscription. Please try again.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <section className="newsletter">
        <div>
          <Mail />
          <div>
            <h2>A little care in your inbox</h2>
            <p>Haircare notes, thoughtful tips and occasional offers.</p>
          </div>
        </div>
        <div className="newsletter-form-wrap">
          <form onSubmit={subscribe}>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setMessage('');
              }}
              placeholder="Your email address"
              required
              aria-label="Your email address"
            />
            <button className="btn btn-primary" disabled={busy}>
              {busy ? 'Saving…' : 'Subscribe'}
            </button>
          </form>
          {message && (
            <p className="newsletter-message" role="status">
              {message}
            </p>
          )}
        </div>
      </section>
      <footer className="footer">
        <div className="footer-brand">
          <Link className="brand" href="/">
            <Leaf />
            <span>
              HardWater
              <br />
              Haircare
            </span>
          </Link>
          <p>Gentle routines for whatever your water brings.</p>
        </div>
        <div>
          <h4>Explore</h4>
          <Link href="/shop">Shop all</Link>
          <Link href="/hard-water-guide">Hard-water guide</Link>
          <Link href="/quiz">Find your routine</Link>
        </div>
        <div>
          <h4>Help</h4>
          <Link href="/faq">FAQs</Link>
          <Link href="/track-order">Track an order</Link>
          <span className="footer-placeholder">Contact details will be added before launch</span>
        </div>
        <div>
          <h4>Your account</h4>
          <Link href="/account/orders">My orders</Link>
          <Link href="/login">Log in</Link>
          <Link href="/cart">Shopping bag</Link>
        </div>
        <div className="footer-note">
          <span className="footer-placeholder">Social links will be added before launch</span>
          <p>Demo storefront · Product information and prices are sample content.</p>
        </div>
      </footer>
      <div className="copyright">© 2026 HardWater Haircare. All rights reserved.</div>
    </>
  );
}
