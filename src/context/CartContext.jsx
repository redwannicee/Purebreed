"use client";

import { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "purebreed_cart_v1";

function reducer(state, action) {
  switch (action.type) {
    case "HYDRATE":
      return action.payload || state;
    case "ADD": {
      const { product, qty } = action.payload;
      const existing = state.items.find((i) => i.productId === product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === product.id ? { ...i, qty: i.qty + qty } : i
          ),
        };
      }
      return {
        items: [
          ...state.items,
          {
            productId: product.id,
            name_en: product.name_en,
            name_bn: product.name_bn,
            price: product.discountPrice || product.price,
            imageUrl: product.imageUrl,
            unit: product.unit,
            qty,
          },
        ],
      };
    }
    case "REMOVE":
      return { items: state.items.filter((i) => i.productId !== action.payload) };
    case "SET_QTY":
      return {
        items: state.items.map((i) =>
          i.productId === action.payload.productId
            ? { ...i, qty: Math.max(1, action.payload.qty) }
            : i
        ),
      };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });

  // Cart lives in localStorage, not Firestore — guests never need writes
  // just to browse and build a basket, which keeps write counts near zero
  // until checkout actually happens.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "HYDRATE", payload: JSON.parse(raw) });
    } catch (e) {
      // ignore corrupted cart storage
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      // ignore write failures (e.g. private browsing quota)
    }
  }, [state]);

  const value = useMemo(() => {
    const subtotal = state.items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const count = state.items.reduce((sum, i) => sum + i.qty, 0);
    return {
      items: state.items,
      subtotal,
      count,
      addItem: (product, qty = 1) => dispatch({ type: "ADD", payload: { product, qty } }),
      removeItem: (productId) => dispatch({ type: "REMOVE", payload: productId }),
      setQty: (productId, qty) => dispatch({ type: "SET_QTY", payload: { productId, qty } }),
      clear: () => dispatch({ type: "CLEAR" }),
    };
  }, [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
