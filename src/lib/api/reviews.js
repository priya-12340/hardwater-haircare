import { reviews } from '../data';
import { isMockMode } from '../../services/apiClient';
import { requireMockMode, runMock } from './mock';

export function mapReview(source) {
  return {
    id: String(source.id),
    rating: Number(source.rating || 0),
    title: source.title || '',
    text: source.text || '',
    date: source.date || '',
    verified: Boolean(source.verified),
    source: source.source || '',
  };
}

export async function getReviews(productId, { sort = 'newest', page = 1 } = {}) {
  await requireMockMode(isMockMode, 'Reviews');

  return runMock(() => {
    const matchingReviews = reviews.filter(
      (review) => !review.productId || String(review.productId) === String(productId),
    );
    let result = matchingReviews.map(mapReview);
    if (sort === 'rating-high') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'rating-low') {
      result.sort((a, b) => a.rating - b.rating);
    } else {
      result.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    const pageSize = 10;
    const safePage = Math.max(1, Number(page) || 1);
    const start = (safePage - 1) * pageSize;
    const average = result.length
      ? result.reduce((sum, review) => sum + review.rating, 0) / result.length
      : 0;
    const summary = {
      average: Number(average.toFixed(1)),
      count: result.length,
      distribution: [5, 4, 3, 2, 1].map((rating) => ({
        rating,
        count: result.filter((review) => review.rating === rating).length,
      })),
    };

    return {
      items: result.slice(start, start + pageSize),
      total: result.length,
      summary,
    };
  });
}
