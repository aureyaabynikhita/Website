"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getWishlist, toggleWishlistItem } from "@/services/wishlist";

export function useWishlist() {
  const { firebaseUid } = useAuth();
  const [productIds, setProductIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!firebaseUid) {
      setProductIds([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    getWishlist(firebaseUid).then((ids) => {
      setProductIds(ids);
      setIsLoading(false);
    });
  }, [firebaseUid]);

  const toggle = useCallback(
    async (productId: string) => {
      if (!firebaseUid) {
        // Wishlist requires an account — caller should redirect to /login.
        return null;
      }
      const updated = await toggleWishlistItem(firebaseUid, productId);
      setProductIds(updated);
      return updated;
    },
    [firebaseUid]
  );

  return {
    productIds,
    isLoading,
    isWishlisted: (productId: string) => productIds.includes(productId),
    toggle,
    requiresLogin: !firebaseUid,
  };
}
