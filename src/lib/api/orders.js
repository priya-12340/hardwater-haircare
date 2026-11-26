import { isMockMode } from '../../services/apiClient';
import { createError, getStoredUser, readJSON, requireMockMode, runMock, writeJSON } from './mock';

export function mapOrder(source) {
  return {
    ...source,
    id: String(source.id || source.number || ''),
    number: String(source.number || source.id || ''),
    items: Array.isArray(source.items) ? source.items : [],
    totals: source.totals || { subtotal: 0, discount: 0, shipping: 0, total: 0 },
    address: source.address || {},
    status: source.status || 'placed',
  };
}

function allOrders() {
  const stored = readJSON('hw-orders', []);
  const all = Array.isArray(stored) ? stored : [];
  const last = readJSON('hw-last-order', null);
  return last && !all.some((order) => order.number === last.number) ? [last, ...all] : all;
}

export async function createOrder(data = {}) {
  await requireMockMode(isMockMode, 'Create order');

  return runMock(() => {
    if (!Array.isArray(data.items) || !data.items.length) {
      throw createError('Your bag is empty.', 422, { items: 'Add an item before checkout.' });
    }
    const order = mapOrder({
      ...data,
      number: data.number || `HW-${Date.now().toString().slice(-7)}`,
      date: data.date || new Date().toISOString(),
      status: data.status || 'placed',
      paymentMethod: data.paymentMethod || 'cod_demo',
    });
    const previous = allOrders();
    if (
      !writeJSON('hw-orders', [order, ...previous.filter((item) => item.number !== order.number)])
    ) {
      throw createError('Could not save this demo order in browser storage.', 500);
    }
    if (!writeJSON('hw-last-order', order)) {
      throw createError('Could not save the latest demo order.', 500);
    }
    return order;
  });
}

export async function getOrders({ page = 1 } = {}) {
  await requireMockMode(isMockMode, 'Order history');

  return runMock(() => {
    const user = getStoredUser();
    if (!user?.email) throw createError('Please log in to view your orders.', 401);
    const items = allOrders()
      .filter((order) => (order.address?.email || '').toLowerCase() === user.email.toLowerCase())
      .map(mapOrder);
    const pageSize = 10;
    const safePage = Math.max(1, Number(page) || 1);
    const start = (safePage - 1) * pageSize;
    return {
      items: items.slice(start, start + pageSize),
      total: items.length,
      page: safePage,
      pageSize,
    };
  });
}

export async function getOrder(id) {
  await requireMockMode(isMockMode, 'Order detail');

  return runMock(() => {
    const order = allOrders().find((item) => item.number === id || String(item.id) === String(id));
    if (!order) throw createError('Order not found.', 404);
    return mapOrder(order);
  });
}

export async function trackOrder(number, contact) {
  await requireMockMode(isMockMode, 'Order tracking');

  return runMock(() => {
    const normalizedNumber = String(number || '')
      .trim()
      .toUpperCase();
    const normalizedContact = String(contact || '')
      .trim()
      .toLowerCase();
    const order = allOrders().find(
      (item) => String(item.number || '').toUpperCase() === normalizedNumber,
    );
    const matchesContact =
      order &&
      [order.address?.email, order.address?.phone].some(
        (value) => String(value || '').toLowerCase() === normalizedContact,
      );
    if (!matchesContact) {
      throw createError('We could not find an order matching those details.', 404);
    }
    return mapOrder(order);
  });
}

export async function cancelOrder(number) {
  await requireMockMode(isMockMode, 'Cancel order');

  return runMock(() => {
    const order = allOrders().find((item) => item.number === number);
    if (!order) throw createError('Order not found.', 404);
    if (!['placed', 'processing'].includes(order.status || 'placed')) {
      throw createError('This order can no longer be cancelled.', 409);
    }
    const updated = mapOrder({
      ...order,
      status: 'cancelled',
      cancelledAt: new Date().toISOString(),
    });
    const next = allOrders().map((item) => (item.number === number ? updated : item));
    if (!writeJSON('hw-orders', next)) {
      throw createError('Could not update this order in browser storage.', 500);
    }
    const last = readJSON('hw-last-order', null);
    if (last?.number === number && !writeJSON('hw-last-order', updated)) {
      throw createError('Could not update the latest demo order.', 500);
    }
    return updated;
  });
}
