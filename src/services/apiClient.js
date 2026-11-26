/**
 * Small API transport layer for the frontend.
 * Keep endpoint paths and request/response shapes out of this file; they must
 * come from the backend documentation supplied by the backend team.
 */
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/+$/, '');

export const isMockMode = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';

export async function apiRequest(path, options = {}) {
  if (options.notImplementedMessage) {
    const error = new Error(options.notImplementedMessage);
    error.status = 501;
    throw error;
  }

  if (!API_BASE_URL) {
    throw new Error('API base URL is not configured. Add NEXT_PUBLIC_API_BASE_URL to .env.local.');
  }

  if (typeof path !== 'string' || !path.startsWith('/') || path.startsWith('//')) {
    throw new Error('API path must be a relative path beginning with one slash.');
  }

  const headers = new Headers(options.headers || {});
  headers.set('Accept', 'application/json');

  const hasBody = options.body !== undefined && options.body !== null;
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  if (hasBody && !isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      payload && typeof payload === 'object' && payload.message
        ? payload.message
        : `Request failed with status ${response.status}.`;
    const error = new Error(message);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}
