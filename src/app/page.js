'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, Droplet, Heart, Leaf, ShieldCheck } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import SectionTitle from '../components/SectionTitle';
import { getProducts } from '../lib/api';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    getProducts({ page: 1, pageSize: 3 })
      .then((result) => {
        if (active) setFeatured(result.items);
      })
      .catch(() => {
        if (active) setError('We could not load the collection. Please refresh.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <Leaf size={15} /> A softer kind of haircare
          </span>
          <h1>
            Hard water?
            <br />
            <em>Let&apos;s make wash day gentler.</em>
          </h1>
          <p>
            Thoughtful formulas to help lift mineral buildup, without making your routine feel
            complicated.
          </p>
          <div className="hero-buttons">
            <Link className="btn btn-primary" href="/shop">
              Shop our range <ArrowRight size={17} />
            </Link>
            <Link className="text-link" href="/hard-water-guide">
              Understand hard water
            </Link>
          </div>
          <div className="hero-proof">
            <span>
              <Droplet /> Mineral-conscious care
            </span>
            <span>
              <Leaf /> Thoughtful ingredients
            </span>
          </div>
        </div>
        <div className="hero-photo">
          <Image
            src="/images/hero-woman.png"
            alt="Woman enjoying a calm haircare moment"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: 'cover', objectPosition: 'center 25%', mixBlendMode: 'multiply' }}
          />
        </div>
        <div className="hero-flower">✳</div>
      </section>

      <section className="benefit-strip">
        <div>
          <Droplet />
          <span>
            <b>Mineral-conscious</b>
            <small>Made for hard-water routines</small>
          </span>
        </div>
        <div>
          <Leaf />
          <span>
            <b>Thoughtful formulas</b>
            <small>Clear ingredient information</small>
          </span>
        </div>
        <div>
          <Heart />
          <span>
            <b>Care that feels simple</b>
            <small>Easy steps, honest guidance</small>
          </span>
        </div>
        <div>
          <ShieldCheck />
          <span>
            <b>Honest by design</b>
            <small>No miracle promises</small>
          </span>
        </div>
      </section>

      <section className="section-wrap">
        <SectionTitle
          eyebrow="A considered routine"
          title="A little care goes a long way"
          copy="Start with the essentials, then make the routine your own."
        />
        {loading && (
          <p className="muted" role="status">
            Loading products…
          </p>
        )}
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        {!loading && !error && featured.length === 0 && (
          <p className="muted">Products will appear here soon.</p>
        )}
        {featured.length > 0 && (
          <div className="product-grid">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        <div className="center-action">
          <Link className="btn btn-outline" href="/shop">
            Explore all products <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="editorial">
        <div className="editorial-image">
          <Image
            src="/images/guide-hair.png"
            alt="Haircare tools and botanical details"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="editorial-copy">
          <span className="eyebrow">A little water wisdom</span>
          <h2>
            Get to know your water.
            <br />
            <em>Get to know your hair.</em>
          </h2>
          <p>
            Hard water contains dissolved minerals such as calcium and magnesium. Over time, mineral
            residue can leave hair feeling coated or harder to manage. Learn what to look for and
            how to build a considered routine.
          </p>
          <Link className="btn btn-primary" href="/hard-water-guide">
            Read the hard-water guide <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="quiz-band">
        <div>
          <span className="eyebrow">Not sure where to begin?</span>
          <h2>Find a routine that feels right.</h2>
          <p>Answer a few simple questions about your water and wash-day experience.</p>
        </div>
        <Link className="btn btn-light" href="/quiz">
          Take the quick quiz <ArrowRight size={16} />
        </Link>
      </section>

      <section className="quote-section">
        <SectionTitle
          eyebrow="Kind words, thoughtfully shared"
          title="A routine should feel good"
        />
        <blockquote>
          “Small, considered steps can make wash day feel a little more yours.”
        </blockquote>
        <p className="muted">
          Customer stories will appear here once verified reviews are available.
        </p>
      </section>
    </>
  );
}
