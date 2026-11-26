import { canonicalUrl } from '../lib/seo';

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/cart', '/checkout', '/account/', '/login', '/signup', '/order-confirmation/'],
    },
    sitemap: canonicalUrl('/sitemap.xml'),
  };
}
