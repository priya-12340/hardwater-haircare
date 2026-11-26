'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Minus, Plus, Star } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { getProduct, getReviews } from '../../../lib/api';
import { money, per100 } from '../../../lib/utils';

export default function ProductPage() {
  const { slug } = useParams();
  const { add } = useStore();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState('details');
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    getProduct(slug)
      .then(async (item) => {
        const reviewResult = await getReviews(item.id, { page: 1 });
        if (active) {
          setProduct(item);
          setReviews(reviewResult.items);
        }
      })
      .catch((requestError) => {
        if (active) {
          setError(
            requestError.status === 404
              ? 'We could not find that product.'
              : 'We could not load this product. Please try again.',
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="page-shell">
        <p className="muted" role="status">
          Loading product…
        </p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page-shell empty-state">
        <h1>{error || 'Product unavailable'}</h1>
        <Link className="btn btn-primary" href="/shop">
          Back to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="breadcrumbs">
        <Link href="/">Home</Link> / <Link href="/shop">Shop</Link> / {product.name}
      </div>
      <div className="product-detail">
        <div className="detail-image">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: 'cover', mixBlendMode: 'multiply' }}
          />
        </div>
        <div className="detail-copy">
          <span className="eyebrow">The everyday edit</span>
          <h1>{product.name}</h1>
          <p>{product.shortDescription}</p>
          <div className="rating">
            <Star size={15} fill="currentColor" /> {product.rating}
            <span>· {product.reviewCount} sample reviews</span>
          </div>
          <h2 className="detail-price">
            {money(product.price)} <del>{money(product.mrp)}</del>
          </h2>
          <small>
            Inclusive of taxes · {money(per100(product.price, product.sizeMl))}
            {}per 100 ml
          </small>
          <p className="muted">{product.description}</p>
          <div className="quantity-row">
            <span>Quantity</span>
            <div className="quantity">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Decrease quantity"
              >
                <Minus size={15} />
              </button>
              <b>{quantity}</b>
              <button
                onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                aria-label="Increase quantity"
              >
                <Plus size={15} />
              </button>
            </div>
          </div>
          <button
            className="btn btn-primary full"
            disabled={!product.stock}
            onClick={() => {
              add(product, quantity);
              setAdded(true);
            }}
          >
            {added ? 'Added to bag ✓' : product.stock ? 'Add to bag' : 'Out of stock'}
            {' · '}
            {money(product.price * quantity)}
          </button>
          <div className="detail-points">
            {product.keyPoints.map((point) => (
              <span key={point}>✓ &nbsp;{point}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="detail-tabs" role="tablist" aria-label="Product information">
        {[
          ['details', 'Details'],
          ['ingredients', 'Ingredients'],
          ['usage', 'How to use'],
          ['reviews', 'Reviews'],
        ].map(([value, label]) => (
          <button
            key={value}
            id={`tab-${value}`}
            type="button"
            role="tab"
            aria-selected={tab === value}
            aria-controls="product-tab-panel"
            className={tab === value ? 'tab active' : 'tab'}
            onClick={() => setTab(value)}
          >
            {label}
          </button>
        ))}
      </div>
      <div
        className="tab-content"
        id="product-tab-panel"
        role="tabpanel"
        aria-label={`${tab} information`}
      >
        {tab === 'details' && <p>{product.description}</p>}
        {tab === 'ingredients' &&
          product.ingredients.map(([name, detail]) => (
            <p key={name}>
              <b>{name}</b> — {detail}
            </p>
          ))}
        {tab === 'usage' && (
          <>
            <p>
              <b>Frequency:</b> {product.usage.frequency}
            </p>
            <p>
              <b>Amount:</b> {product.usage.amount}
            </p>
            <ol>
              {product.usage.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </>
        )}
        {tab === 'reviews' && (
          <>
            <p className="muted">
              Sample review content for layout testing only. Replace with approved review data
              before launch.
            </p>
            {reviews.length ? (
              reviews.map((review) => (
                <div className="review-row" key={review.id}>
                  <b>{'★'.repeat(review.rating)}</b>
                  <h4>{review.title}</h4>
                  <p>{review.text}</p>
                  <small>
                    {review.date} · {review.source}
                  </small>
                </div>
              ))
            ) : (
              <p className="muted">No reviews are available yet.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
