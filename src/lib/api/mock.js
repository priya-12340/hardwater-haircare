import { apiRequest } from '../../services/apiClient';

const FAILURE_KEY = 'hw-mock-api-fail';

export async function delay() {
  const milliseconds = 300 + Math.floor(Math.random() * 501);
  await new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export function setMockApiFailure(enabled = true) {
  if (typeof localStorage === 'undefined') return false;

  try {
    if (enabled) {
      localStorage.setItem(FAILURE_KEY, 'true');
    } else {
      localStorage.removeItem(FAILURE_KEY);
    }
    return true;
  } catch {
    return false;
  }
}

export async function runMock(handler) {
  await delay();

  const forcedByEnvironment = process.env.NEXT_PUBLIC_MOCK_API_FORCE_ERROR === 'true';
  let forcedByStorage = false;

  try {
    forcedByStorage =
      typeof localStorage !== 'undefined' && localStorage.getItem(FAILURE_KEY) === 'true';
  } catch {
    forcedByStorage = false;
  }

  if (forcedByEnvironment || forcedByStorage) {
    throw createError('Mock API failure was enabled for testing.', 500);
  }

  return handler();
}

export function createError(message, status = 400, fields = {}) {
  const error = new Error(message);
  error.status = status;
  error.fields = fields;
  return error;
}

export function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function getStoredUser() {
  const user = readJSON('hw-user', null);
  return user && typeof user.email === 'string' ? user : null;
}

export async function requireMockMode(isMockMode, resource) {
  if (isMockMode) return;

  // TODO: Replace this sentinel call with the real documented path and payload.
  // No endpoint is sent over the network until the backend API contract is supplied.
  await apiRequest(null, {
    notImplementedMessage: `${resource} API is not implemented yet. Add the documented endpoint first.`,
  });
}
