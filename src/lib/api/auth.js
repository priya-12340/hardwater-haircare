import { isMockMode } from '../../services/apiClient';
import { createError, getStoredUser, requireMockMode, runMock, writeJSON } from './mock';

export function mapUser(source) {
  return {
    name: String(source.name || '').trim(),
    email: String(source.email || '')
      .trim()
      .toLowerCase(),
  };
}

export async function signup(data = {}) {
  await requireMockMode(isMockMode, 'Signup');

  return runMock(() => {
    const user = mapUser(data);
    if (user.name.length < 2 || !user.email) {
      throw createError('Please enter your name and email address.', 422, {
        name: 'Enter at least 2 characters.',
        email: 'Enter a valid email address.',
      });
    }
    if (String(data.password || '').length < 8) {
      throw createError('Password must contain at least 8 characters.', 422, {
        password: 'Use at least 8 characters.',
      });
    }
    if (!writeJSON('hw-user', user)) {
      throw createError('Could not save the demo account in browser storage.', 500);
    }
    return user;
  });
}

export async function login(data = {}) {
  await requireMockMode(isMockMode, 'Login');

  return runMock(() => {
    const user = mapUser({
      name: data.name || 'Guest Shopper',
      email: data.email,
    });
    if (!user.email || String(data.password || '').length < 8) {
      throw createError('Enter a valid email and password.', 422, {
        email: 'Enter a valid email address.',
        password: 'Use at least 8 characters.',
      });
    }
    if (!writeJSON('hw-user', user)) {
      throw createError('Could not save the demo login in browser storage.', 500);
    }
    return user;
  });
}

export async function logout() {
  await requireMockMode(isMockMode, 'Logout');

  return runMock(() => {
    try {
      localStorage.removeItem('hw-user');
      return true;
    } catch {
      throw createError('Could not clear the demo login from browser storage.', 500);
    }
  });
}

export async function getMe() {
  await requireMockMode(isMockMode, 'Current user');
  return runMock(() => getStoredUser());
}
