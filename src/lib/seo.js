const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const siteUrl = configuredSiteUrl.replace(/\/$/, '');

export function canonicalUrl(path = '/') {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${siteUrl}${normalizedPath}`;
}
