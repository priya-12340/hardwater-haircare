import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="empty-state page-shell">
      <span className="eyebrow">A little detour</span>
      <h1>We couldn't find that page.</h1>
      <p>Let's get you back to something helpful.</p>
      <div className="hero-buttons">
        <Link className="btn btn-primary" href="/">
          Home
        </Link>
        <Link className="btn btn-outline" href="/shop">
          Shop
        </Link>
      </div>
    </div>
  );
}
