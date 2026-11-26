import { isMockMode } from '../../services/apiClient';
import { requireMockMode, runMock } from './mock';

export function mapDiscount(source) {
  return {
    code: source.code,
    type: source.type,
    value: Number(source.value || 0),
    amount: Number(source.amount || 0),
    status: source.status,
  };
}

export async function validateDiscount(code, cart = []) {
  await requireMockMode(isMockMode, 'Discount validation');

  return runMock(() => {
    const normalized = String(code || '')
      .trim()
      .toUpperCase();
    const subtotal = cart.reduce((sum, item) => {
      const price = Number(item.unitPrice ?? item.price) || 0;
      return sum + price * (Number(item.quantity) || 1);
    }, 0);

    if (normalized === 'WELCOME10') {
      const discount = mapDiscount({
        code: normalized,
        type: 'percentage',
        value: 10,
        amount: Math.round(subtotal * 0.1),
        status: 'valid',
      });
      return { valid: true, discount, message: 'WELCOME10 applied — 10% off.' };
    }

    if (normalized === 'OLD20') {
      return {
        valid: false,
        discount: null,
        message: 'This discount code has expired.',
      };
    }

    return {
      valid: false,
      discount: null,
      message: 'We could not find that code. Check it and try again.',
    };
  });
}
