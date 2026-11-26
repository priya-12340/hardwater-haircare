import { isMockMode } from '../../services/apiClient';
import { createError, getStoredUser, readJSON, requireMockMode, runMock, writeJSON } from './mock';

export function mapAddress(source) {
  return {
    id: source.id,
    name: source.name || '',
    phone: source.phone || '',
    line1: source.line1 || '',
    line2: source.line2 || '',
    landmark: source.landmark || '',
    city: source.city || '',
    state: source.state || '',
    pincode: source.pincode || '',
    isDefault: Boolean(source.isDefault),
  };
}

function addressKey() {
  const user = getStoredUser();
  if (!user?.email) throw createError('Please log in to manage addresses.', 401);
  return `hw-addresses-${user.email}`;
}

export async function getAddresses() {
  await requireMockMode(isMockMode, 'Addresses');
  return runMock(() => readJSON(addressKey(), []).map(mapAddress));
}

export async function saveAddress(address = {}) {
  await requireMockMode(isMockMode, 'Save address');

  return runMock(() => {
    const key = addressKey();
    const existing = readJSON(key, []);
    const isUpdate =
      address.id !== undefined && existing.some((item) => String(item.id) === String(address.id));
    const nextAddress = mapAddress({
      ...address,
      id: isUpdate ? address.id : Date.now(),
      isDefault: address.isDefault ?? existing.length === 0,
    });
    const normalizedAddress = nextAddress.isDefault
      ? { ...nextAddress, isDefault: true }
      : nextAddress;
    const next = isUpdate
      ? existing.map((item) => ({
          ...(String(item.id) === String(address.id) ? normalizedAddress : item),
          isDefault: normalizedAddress.isDefault
            ? String(item.id) === String(address.id)
            : item.isDefault,
        }))
      : [
          ...existing.map((item) => ({
            ...item,
            isDefault: normalizedAddress.isDefault ? false : item.isDefault,
          })),
          normalizedAddress,
        ];

    if (!writeJSON(key, next)) {
      throw createError('Could not save this address in browser storage.', 500);
    }
    return nextAddress;
  });
}

export async function deleteAddress(id) {
  await requireMockMode(isMockMode, 'Delete address');

  return runMock(() => {
    const key = addressKey();
    const remaining = readJSON(key, []).filter((address) => String(address.id) !== String(id));
    if (remaining.length && !remaining.some((address) => address.isDefault)) {
      remaining[0].isDefault = true;
    }
    if (!writeJSON(key, remaining)) {
      throw createError('Could not update the address book.', 500);
    }
    return { id, deleted: true };
  });
}
