'use client';

import { Suspense, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ProductCard from '../../components/ProductCard';
import SectionTitle from '../../components/SectionTitle';
import { getProducts } from '../../lib/api';

const PAGE_SIZE = 12;
const CATEGORIES = [
  ['all', 'All'],
  ['shampoo', 'Shampoo'],
  ['rinse', 'Rinse'],
  ['bundle', 'Bundles'],
];

function ShopContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const paramsKey = searchParams.toString();
  const category = searchParams.get('category') || 'all';
  const sort = searchParams.get('sort') || 'featured';
  const query = searchParams.get('q') || '';
  const page = Math.max(1, Number.parseInt(searchParams.get('page') || '1', 10) || 1);

  const [searchInput, setSearchInput] = useState(query);
  const [result, setResult] = useState({
    items: [],
    total: 0,
    page: 1,
    pageSize: PAGE_SIZE,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    getProducts({ category, sort, page, pageSize: PAGE_SIZE, q: query })
      .then((response) => {
        if (active) setResult(response);
      })
      .catch(() => {
        if (active) setError('We could not load products. Please try again.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [category, sort, page, query, paramsKey]);

  function updateUrl(changes) {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(changes).forEach(([key, value]) => {
      if (value === '' || value === null || value === 'all' || value === 'featured') {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  }

  function submitSearch(event) {
    event.preventDefault();
    updateUrl({ q: searchInput.trim(), page: 1 });
  }

  function clearFilters() {
    setSearchInput('');
    router.push(pathname, { scroll: false });
  }

  const totalPages = Math.max(1, Math.ceil(result.total / PAGE_SIZE));

  return (
    <div className="page-shell">
      <SectionTitle
        eyebrow="The collection"
        title="Haircare, made more thoughtful"
        copy="Explore simple essentials for hard-water wash days."
      />

      <div className="shop-tools">
        <form className="shop-search" onSubmit={submitSearch} role="search">
          <input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search the collection…"
            aria-label="Search products"
          />
          <button className="btn btn-primary" type="submit">
            Search
          </button>
        </form>

        <div className="filters" aria-label="Filter by category">
          {CATEGORIES.map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={category === value ? 'filter active' : 'filter'}
              aria-pressed={category === value}
              onClick={() => updateUrl({ category: value, page: 1 })}
            >
              {label}
            </button>
          ))}
        </div>

        <select
          value={sort}
          onChange={(event) => updateUrl({ sort: event.target.value, page: 1 })}
          aria-label="Sort products"
        >
          <option value="featured">Featured</option>
          <option value="low">Price: low to high</option>
          <option value="high">Price: high to low</option>
          <option value="rating">Top rated</option>
        </select>
      </div>

      {loading && (
        <p className="muted" role="status" aria-live="polite">
          Loading products…
        </p>
      )}

      {!loading && error && (
        <div className="empty-state" role="alert">
          <h2>Products could not be loaded</h2>
          <p>{error}</p>
          <button className="btn btn-primary" type="button" onClick={() => updateUrl({ page })}>
            Try again
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <p className="result-count">
            {result.total} thoughtful essentials
            {query ? ` matching “${query}”` : ''}
          </p>

          {result.items.length ? (
            <>
              <div className="product-grid">
                {result.items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {totalPages > 1 && (
                <nav className="shop-pagination" aria-label="Product pages">
                  <button
                    className="btn btn-outline"
                    type="button"
                    disabled={page <= 1}
                    onClick={() => updateUrl({ page: page - 1 })}
                  >
                    Previous
                  </button>
                  <span aria-live="polite">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    className="btn btn-outline"
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => updateUrl({ page: page + 1 })}
                  >
                    Next
                  </button>
                </nav>
              )}
            </>
          ) : (
            <div className="empty-state">
              <h2>Nothing found just yet</h2>
              <p>Try another search or clear your filters.</p>
              <button className="btn btn-primary" onClick={clearFilters} type="button">
                Clear filters
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function Shop() {
  return (
    <Suspense
      fallback={
        <div className="page-shell">
          <p className="muted" role="status">
            Loading shop…
          </p>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
