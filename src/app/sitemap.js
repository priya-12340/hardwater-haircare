import { products } from '../lib/data';
import { canonicalUrl } from '../lib/seo';

const staticRoutes = ['/', '/shop', '/faq', '/hard-water-guide', '/quiz'];

export default function sitemap() {
  const now = new Date();
  const staticEntries = staticRoutes.map((route) => ({
    url: canonicalUrl(route),
    lastModified: now,
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : 0.7,
  }));

  const productEntries = products.map((product) => ({
    url: canonicalUrl(`/products/${product.slug}`),
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticEntries, ...productEntries];
}
