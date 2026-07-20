"use client";

import { useCallback, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCartStore } from "@/store/cartStore";
import type { CartItem } from "@/types/firestore";
import {
  addToCart as addToCartService,
  updateCartItemQuantity as updateQtyService,
  getGuestCart,
  getUserCart,
  mergeGuestCartIntoUserCart,
} from "@/services/cart";

export function useCart() {
  const { firebaseUid, isLoading: authLoading } = useAuth();
  const { items, setItems, setLoading, isLoading } = useCartStore();
  const hasMergedForUid = useRef<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    async function load() {
      setLoading(true);
      if (firebaseUid) {
        // Merge any guest-session cart into the account cart exactly once per login.
        if (hasMergedForUid.current !== firebaseUid) {
          hasMergedForUid.current = firebaseUid;
          const merged = await mergeGuestCartIntoUserCart(firebaseUid);
          setItems(merged);
        } else {
          setItems(await getUserCart(firebaseUid));
        }
      } else {
        setItems(getGuestCart());
      }
    }
    load();
  }, [firebaseUid, authLoading, setItems, setLoading]);

  const addItem = useCallback(
    async (item: CartItem) => {
      const updated = await addToCartService(item, firebaseUid);
      setItems(updated);
    },
    [firebaseUid, setItems]
  );

  const updateQuantity = useCallback(
    async (productId: string, variantId: string, quantity: number) => {
      const updated = await updateQtyService(productId, variantId, quantity, firebaseUid);
      setItems(updated);
    },
    [firebaseUid, setItems]
  );

  return { items, isLoading, addItem, updateQuantity };
}
