'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Check, ShoppingBag, Star } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { discount, money, per100 } from '../lib/utils';

export default function ProductCard({ product }) {
  const { add } = useStore();
  const [added, setAdded] = useState(false);

  function addToBag() {
    add(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <article className="product-card">
      <Link
        href={`/products/${product.slug}`}
        className="product-image"
        aria-label={`View ${product.name}`}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          style={{ objectFit: 'cover', mixBlendMode: 'multiply' }}
        />
        {product.stock <= 5 && (
          <span className="stock-tag">{product.stock > 0 ? 'Low stock' : 'Out of stock'}</span>
        )}
      </Link>
      <div className="product-info">
        <Link href={`/products/${product.slug}`}>
          <h3>{product.name}</h3>
        </Link>
        <p>{product.shortDescription}</p>
        <div className="rating">
          <Star size={14} fill="currentColor" aria-hidden="true" /> {product.rating}
          <span>({product.reviewCount} sample reviews)</span>
        </div>
        <div className="price-line">
          <strong>{money(product.price)}</strong>
          {product.mrp > product.price && <del>{money(product.mrp)}</del>}
          <small>{discount(product.mrp, product.price)}% off</small>
        </div>
        <small className="per100">{money(per100(product.price, product.sizeMl))} / 100 ml</small>
        <button
          className="btn btn-outline add-btn"
          type="button"
          disabled={!product.stock}
          onClick={addToBag}
          aria-live="polite"
        >
          {added ? (
            <Check size={15} aria-hidden="true" />
          ) : (
            <ShoppingBag size={15} aria-hidden="true" />
          )}
          {added ? 'Added to bag' : product.stock ? 'Add to bag' : 'Out of stock'}
        </button>
      </div>
    </article>
  );
}
