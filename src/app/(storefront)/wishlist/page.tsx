"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useWishlist } from "@/hooks/useWishlist";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";
import type { ProductDoc } from "@/types/firestore";

export default function WishlistPage() {
  const { productIds, isLoading, requiresLogin } = useWishlist();
  const [products, setProducts] = useState<ProductDoc[]>([]);
  const [isFetchingProducts, setIsFetchingProducts] = useState(false);

  useEffect(() => {
    if (productIds.length === 0) {
      setProducts([]);
      return;
    }
    setIsFetchingProducts(true);
    fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productIds }),
    })
      .then((res) => res.json())
      .then((data) => setProducts(data.products ?? []))
      .finally(() => setIsFetchingProducts(false));
  }, [productIds]);

  if (requiresLogin) {
    return (
      <div className="section-container section-spacing text-center">
        <h1 className="font-serif text-display-sm text-charcoal mb-4">Your Wishlist</h1>
        <p className="text-charcoal/60 mb-6">Sign in to save and view your favorite pieces.</p>
        <Link href="/login?redirect=/wishlist">
          <Button variant="outline">Sign In</Button>
        </Link>
      </div>
    );
  }

  if (isLoading || isFetchingProducts) {
    return (
      <div className="section-container section-spacing text-center text-charcoal/50">
        Loading your wishlist...
      </div>
    );
  }

  return (
    <div className="section-container section-spacing">
      <h1 className="font-serif text-display-sm text-charcoal mb-10">Your Wishlist</h1>
      {products.length === 0 ? (
        <p className="text-charcoal/50 text-sm">
          Nothing saved yet — tap the heart on any product to add it here.
        </p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
