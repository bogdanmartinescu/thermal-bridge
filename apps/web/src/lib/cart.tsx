"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { totalBani } from "./money";

export interface CartLine {
  slug: string;
  name: string;
  unitPriceBani: number;
  qty: number;
  /** Current available stock; used to clamp qty */
  available: number;
}

interface CartState {
  lines: CartLine[];
}

type CartAction =
  | { type: "ADD"; line: Omit<CartLine, "qty"> }
  | { type: "SET_QTY"; slug: string; qty: number }
  | { type: "REMOVE"; slug: string }
  | { type: "CLEAR" }
  | { type: "LOAD"; lines: CartLine[] };

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "LOAD":
      return { lines: action.lines };

    case "ADD": {
      const existing = state.lines.find((l) => l.slug === action.line.slug);
      if (existing) {
        return {
          lines: state.lines.map((l) =>
            l.slug === action.line.slug
              ? {
                  ...l,
                  qty: clamp(l.qty + 1, 1, l.available),
                }
              : l,
          ),
        };
      }
      return {
        lines: [
          ...state.lines,
          { ...action.line, qty: clamp(1, 1, action.line.available) },
        ],
      };
    }

    case "SET_QTY": {
      const line = state.lines.find((l) => l.slug === action.slug);
      if (!line) return state;
      if (action.qty < 1) {
        return { lines: state.lines.filter((l) => l.slug !== action.slug) };
      }
      return {
        lines: state.lines.map((l) =>
          l.slug === action.slug
            ? { ...l, qty: clamp(action.qty, 1, l.available) }
            : l,
        ),
      };
    }

    case "REMOVE":
      return { lines: state.lines.filter((l) => l.slug !== action.slug) };

    case "CLEAR":
      return { lines: [] };
  }
}

const STORAGE_KEY = "thermalbridge-cart";

function loadFromStorage(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as CartLine[];
  } catch {
    return [];
  }
}

interface CartContextValue {
  lines: CartLine[];
  totalBaniValue: number;
  itemCount: number;
  add: (line: Omit<CartLine, "qty">) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { lines: [] });

  // Rehydrate from localStorage on mount (client-only)
  useEffect(() => {
    dispatch({ type: "LOAD", lines: loadFromStorage() });
  }, []);

  // Persist on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines));
    } catch {
      // ignore storage errors
    }
  }, [state.lines]);

  const add = useCallback((line: Omit<CartLine, "qty">) => {
    dispatch({ type: "ADD", line });
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    dispatch({ type: "SET_QTY", slug, qty });
  }, []);

  const remove = useCallback((slug: string) => {
    dispatch({ type: "REMOVE", slug });
  }, []);

  const clear = useCallback(() => {
    dispatch({ type: "CLEAR" });
  }, []);

  const totalBaniValue = state.lines.reduce(
    (sum, l) => sum + totalBani(l.unitPriceBani, l.qty),
    0,
  );

  const itemCount = state.lines.reduce((sum, l) => sum + l.qty, 0);

  return (
    <CartContext.Provider
      value={{
        lines: state.lines,
        totalBaniValue,
        itemCount,
        add,
        setQty,
        remove,
        clear,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
