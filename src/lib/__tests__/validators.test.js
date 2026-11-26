import { describe, expect, it } from 'vitest';
import { isValidEmail, validateAddress, validatePassword, validateSignup } from '../validators';

describe('isValidEmail', () => {
  it('accepts a valid email address', () => {
    expect(isValidEmail('shopper@example.com')).toBe(true);
  });

  it('rejects malformed email addresses', () => {
    expect(isValidEmail('shopper.example.com')).toBe(false);
    expect(isValidEmail('shopper@')).toBe(false);
  });
});

describe('validatePassword', () => {
  it('requires eight characters, a letter, and a number', () => {
    expect(validatePassword('haircare1').valid).toBe(true);
    expect(validatePassword('short1').valid).toBe(false);
    expect(validatePassword('onlyletters').valid).toBe(false);
  });
});

describe('validateSignup', () => {
  it('accepts valid signup details', () => {
    expect(
      validateSignup({
        name: 'Priya Sharma',
        email: 'priya@example.com',
        password: 'haircare1',
        confirm: 'haircare1',
      }),
    ).toEqual({ valid: true, errors: {} });
  });

  it('returns field errors for invalid signup details', () => {
    const result = validateSignup({
      name: 'P',
      email: 'not-an-email',
      password: 'weak',
      confirm: 'different',
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toHaveProperty('name');
    expect(result.errors).toHaveProperty('email');
    expect(result.errors).toHaveProperty('password');
    expect(result.errors).toHaveProperty('confirm');
  });
});

describe('validateAddress', () => {
  it('accepts a complete Indian delivery address', () => {
    expect(
      validateAddress({
        name: 'Priya Sharma',
        phone: '9876543210',
        line1: '12 Main Road',
        city: 'Sonipat',
        state: 'Haryana',
        pincode: '131001',
      }),
    ).toEqual({ valid: true, errors: {} });
  });

  it('rejects missing fields and invalid phone or PIN code', () => {
    const result = validateAddress({
      name: '',
      phone: '12345',
      line1: '',
      city: 'Sonipat',
      state: 'Haryana',
      pincode: '123',
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toHaveProperty('name');
    expect(result.errors).toHaveProperty('phone');
    expect(result.errors).toHaveProperty('line1');
    expect(result.errors).toHaveProperty('pincode');
  });
});
