import { products } from '../data';
import { isMockMode } from '../../services/apiClient';
import { createError, requireMockMode, runMock } from './mock';

export function mapProduct(source) {
  const images = source.images || (source.image ? [source.image] : []);

  return {
    id: String(source.id),
    slug: source.slug,
    name: source.name,
    category: source.category,
    sizeMl: Number(source.sizeMl || 0),
    price: Number(source.price || 0),
    mrp: Number(source.mrp || 0),
    stock: Number(source.stock || 0),
    rating: Number(source.rating || 0),
    reviewCount: Number(source.reviewCount || 0),
    images,
    image: images[0] || '',
    shortDescription: source.shortDescription || '',
    description: source.description || '',
    keyPoints: source.keyPoints || [],
    ingredients: source.ingredients || [],
    usage: source.usage || { frequency: '', amount: '', steps: [] },
  };
}

export async function getProducts({
  category = 'all',
  sort = 'featured',
  page = 1,
  pageSize = 12,
  q = '',
} = {}) {
  await requireMockMode(isMockMode, 'Products');

  return runMock(() => {
    const search = String(q).trim().toLowerCase();
    let result = products
      .map(mapProduct)
      .filter((product) => category === 'all' || product.category === category)
      .filter((product) => {
        const searchable = `${product.name} ${product.shortDescription}`.toLowerCase();
        return !search || searchable.includes(search);
      });

    if (sort === 'low') result.sort((a, b) => a.price - b.price);
    if (sort === 'high') result.sort((a, b) => b.price - a.price);
    if (sort === 'rating') result.sort((a, b) => b.rating - a.rating);

    const safePageSize = Math.max(1, Number(pageSize) || 12);
    const total = result.length;
    const pageCount = Math.max(1, Math.ceil(total / safePageSize));
    const safePage = Math.min(pageCount, Math.max(1, Number(page) || 1));
    const start = (safePage - 1) * safePageSize;

    return {
      items: result.slice(start, start + safePageSize),
      total,
      page: safePage,
      pageSize: safePageSize,
    };
  });
}

export async function getProduct(slug) {
  await requireMockMode(isMockMode, 'Product detail');

  return runMock(() => {
    const product = products.find((item) => item.slug === slug);
    if (!product) throw createError('Product not found.', 404);
    return mapProduct(product);
  });
}
