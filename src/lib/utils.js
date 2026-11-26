export const money = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export const per100 = (price, size) =>
  size ? Math.round((Number(price) / Number(size)) * 100) : null;

export const discount = (mrp, price) => (mrp > price ? Math.floor(((mrp - price) / mrp) * 100) : 0);

export const calculateTotals = (items, code = '') => {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const discountAmount = code.trim().toUpperCase() === 'WELCOME10' ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal - discountAmount >= 999 || subtotal === 0 ? 0 : 79;

  return {
    subtotal,
    discount: discountAmount,
    shipping,
    total: subtotal - discountAmount + shipping,
  };
};
