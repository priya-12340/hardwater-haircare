'use client';

import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { calculateTotals } from '../lib/utils';
import { getMe, login as loginUser, logout as logoutUser, signup as signupUser } from '../lib/api';

const StoreContext = createContext(null);

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function normalizeCart(value) {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item) => item && typeof item.id === 'string' && Number(item.unitPrice) >= 0)
    .map((item) => {
      const stockValue = Number(item.stock);
      const stock = Number.isFinite(stockValue) ? Math.max(0, stockValue) : 10;
      const quantity = Math.max(1, Math.min(stock || 1, Math.floor(Number(item.quantity) || 1)));
      return { ...item, unitPrice: Number(item.unitPrice), quantity };
    });
}

export function StoreProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [code, setCode] = useState('');
  const [appliedCode, setAppliedCode] = useState('');
  const authActionStarted = useRef(false);

  useEffect(() => {
    setCart(normalizeCart(readJSON('hw-cart', [])));
    getMe()
      .then((savedUser) => {
        if (!authActionStarted.current) setUser(savedUser);
      })
      .catch(() => {
        if (!authActionStarted.current) setUser(null);
      })
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (ready) writeJSON('hw-cart', cart);
  }, [cart, ready]);

  const add = (product, quantity = 1) => {
    if (!product?.id || Number(product.stock) <= 0) return;
    const stockValue = Number(product.stock);
    const stock = Number.isFinite(stockValue) ? Math.max(0, stockValue) : 10;
    const requested = Math.max(1, Math.floor(Number(quantity) || 1));

    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: Math.min(stock, item.quantity + requested) }
            : item,
        );
      }
      return [
        ...current,
        {
          ...product,
          unitPrice: Number(product.price) || 0,
          quantity: Math.min(stock, requested),
        },
      ];
    });
  };

  const update = (id, quantity) =>
    setCart((current) =>
      current.map((item) => {
        if (item.id !== id) return item;
        const rawStock = Number(item.stock);
        const stock = Number.isFinite(rawStock) ? Math.max(1, rawStock) : 10;
        const nextQuantity = Math.floor(Number(quantity) || 1);
        return {
          ...item,
          quantity: Math.max(1, Math.min(stock, nextQuantity)),
        };
      }),
    );

  const remove = (id) => setCart((current) => current.filter((item) => item.id !== id));

  const login = async (name, email, password = 'demopass1') => {
    authActionStarted.current = true;
    const nextUser = await loginUser({ name, email, password });
    setUser(nextUser);
    return nextUser;
  };

  const signup = async (data) => {
    authActionStarted.current = true;
    const nextUser = await signupUser(data);
    setUser(nextUser);
    return nextUser;
  };

  const logout = async () => {
    authActionStarted.current = true;
    await logoutUser();
    setUser(null);
  };

  const applyCode = (value) => {
    setAppliedCode(
      String(value || '')
        .trim()
        .toUpperCase() === 'WELCOME10'
        ? 'WELCOME10'
        : '',
    );
  };

  const clearCart = () => {
    setCart([]);
    setCode('');
    setAppliedCode('');
  };

  const totals = useMemo(() => calculateTotals(cart, appliedCode), [cart, appliedCode]);

  const value = {
    cart,
    add,
    update,
    remove,
    user,
    login,
    signup,
    logout,
    code,
    setCode,
    applyCode,
    totals,
    clearCart,
    ready,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => useContext(StoreContext);
