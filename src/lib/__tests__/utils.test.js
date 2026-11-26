import { describe, expect, it } from 'vitest';
import { calculateTotals } from '../utils';

describe('calculateTotals', () => {
  it('returns zero totals for an empty cart', () => {
    expect(calculateTotals([])).toEqual({
      subtotal: 0,
      discount: 0,
      shipping: 0,
      total: 0,
    });
  });

  it('calculates subtotal and shipping below the free-shipping threshold', () => {
    expect(calculateTotals([{ unitPrice: 500, quantity: 1 }])).toEqual({
      subtotal: 500,
      discount: 0,
      shipping: 79,
      total: 579,
    });
  });

  it('waives shipping when the subtotal reaches 999', () => {
    expect(calculateTotals([{ unitPrice: 999, quantity: 1 }])).toEqual({
      subtotal: 999,
      discount: 0,
      shipping: 0,
      total: 999,
    });
  });

  it('applies the WELCOME10 discount before calculating shipping', () => {
    expect(calculateTotals([{ unitPrice: 1000, quantity: 1 }], ' welcome10 ')).toEqual({
      subtotal: 1000,
      discount: 100,
      shipping: 79,
      total: 979,
    });
  });

  it('supports multiple cart lines and quantities', () => {
    expect(
      calculateTotals([
        { unitPrice: 200, quantity: 2 },
        { unitPrice: 300, quantity: 1 },
      ]),
    ).toEqual({
      subtotal: 700,
      discount: 0,
      shipping: 79,
      total: 779,
    });
  });
});
