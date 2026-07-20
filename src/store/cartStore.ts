import { create } from "zustand";
import type { CartItem } from "@/types/firestore";

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  setItems: (items: CartItem[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  isLoading: true,
  setItems: (items) => set({ items, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
}));

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function cartItemCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
