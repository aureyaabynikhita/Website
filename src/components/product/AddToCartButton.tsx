"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/Button";
import type { ProductDoc, ProductVariant } from "@/types/firestore";

export function AddToCartButton({ product }: { product: ProductDoc }) {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants[0]
  );
  const [isAdding, setIsAdding] = useState(false);

  async function handleAdd() {
    if (!selectedVariant) return;
    setIsAdding(true);
    await addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      title: product.title,
      slug: product.slug,
      size: selectedVariant.size,
      color: selectedVariant.color,
      quantity: 1,
      price: selectedVariant.price,
      image: product.images[0] ?? "",
    });
    setIsAdding(false);
    toast.success("Added to bag");
  }

  return (
    <div className="space-y-6">
      {product.variants.length > 1 && (
        <div>
          <p className="text-xs tracking-[0.12em] uppercase text-charcoal/60 mb-3">Size</p>
          <div className="flex gap-2">
            {product.variants.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setSelectedVariant(v)}
                disabled={v.stock === 0}
                className={`h-11 w-11 border text-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                  selectedVariant?.id === v.id
                    ? "border-burgundy bg-burgundy text-ivory"
                    : "border-charcoal/20 hover:border-charcoal"
                }`}
              >
                {v.size}
              </button>
            ))}
          </div>
        </div>
      )}

      <Button
        className="w-full"
        size="lg"
        onClick={handleAdd}
        disabled={isAdding || !selectedVariant || selectedVariant.stock === 0}
      >
        {!selectedVariant || selectedVariant.stock === 0
          ? "Out of Stock"
          : isAdding
            ? "Adding..."
            : "Add to Bag"}
      </Button>
    </div>
  );
}
