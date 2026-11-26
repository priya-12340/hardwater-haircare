'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Search, UserRound, ShoppingBag, Menu, X, Leaf } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function Header() {
  const { cart } = useStore();
  const [open, setOpen] = useState(false);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const closeMenu = () => setOpen(false);

  return (
    <>
      <div className="announcement">
        <span>✧ &nbsp; Thoughtful haircare for hard-water days</span>
        <span>
          <Link href="/track-order">Track order</Link>
          <i aria-hidden="true" /> <Link href="/account/orders">My account</Link>
        </span>
      </div>
      <header className="site-header">
        <Link className="brand" href="/" onClick={closeMenu} aria-label="HardWater Haircare home">
          <span className="brand-mark">
            <Leaf size={32} aria-hidden="true" />
          </span>
          <span>
            HardWater
            <br />
            Haircare
          </span>
        </Link>
        <nav
          id="primary-navigation"
          className={open ? 'nav open' : 'nav'}
          aria-label="Main navigation"
        >
          <Link href="/shop" onClick={closeMenu}>
            Shop
          </Link>
          <Link href="/hard-water-guide" onClick={closeMenu}>
            The guide
          </Link>
          <Link href="/faq" onClick={closeMenu}>
            FAQ
          </Link>
          <Link href="/quiz" onClick={closeMenu}>
            Find your routine
          </Link>
        </nav>
        <form className="search" action="/shop" role="search">
          <Search size={17} aria-hidden="true" />
          <input name="q" placeholder="Search products…" aria-label="Search products" />
        </form>
        <div className="header-actions">
          <Link aria-label="My account" href="/account/orders">
            <UserRound aria-hidden="true" />
          </Link>
          <Link aria-label={`Shopping bag, ${count} items`} className="bag-link" href="/cart">
            <ShoppingBag aria-hidden="true" />
            <b aria-hidden="true">{count}</b>
          </Link>
          <button
            className="menu-toggle"
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="primary-navigation"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </header>
    </>
  );
}
