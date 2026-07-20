"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import type { ProductDoc } from "@/types/firestore";

const SIZES = ["S", "M", "L", "XL"];
const PRICE_BANDS = [
  { label: "Under ₹15,000", max: 15000 },
  { label: "₹15,000 – ₹25,000", min: 15000, max: 25000 },
  { label: "₹25,000 – ₹35,000", min: 25000, max: 35000 },
  { label: "Above ₹35,000", min: 35000 },
];

export function CategoryFilterableGrid({ products }: { products: ProductDoc[] }) {
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedPriceBand, setSelectedPriceBand] = useState<number | null>(null);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const sizeMatch =
        selectedSizes.length === 0 || p.variants?.some((v) => selectedSizes.includes(v.size));
      const band = selectedPriceBand !== null ? PRICE_BANDS[selectedPriceBand] : null;
      const priceMatch =
        !band || (p.basePrice >= (band.min ?? 0) && p.basePrice <= (band.max ?? Infinity));
      return sizeMatch && priceMatch;
    });
  }, [products, selectedSizes, selectedPriceBand]);

  function toggleSize(size: string) {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  }

  return (
    <div className="grid md:grid-cols-[220px_1fr] gap-10">
      <aside className="space-y-8">
        <div>
          <h3 className="text-xs tracking-[0.15em] uppercase text-charcoal/60 mb-3">Size</h3>
          <div className="flex flex-wrap gap-2">
            {SIZES.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={`h-9 w-9 border text-xs transition-colors ${
                  selectedSizes.includes(size)
                    ? "border-burgundy bg-burgundy text-ivory"
                    : "border-charcoal/20 hover:border-charcoal"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs tracking-[0.15em] uppercase text-charcoal/60 mb-3">Price</h3>
          <div className="space-y-2">
            {PRICE_BANDS.map((band, i) => (
              <label key={band.label} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="priceBand"
                  checked={selectedPriceBand === i}
                  onChange={() => setSelectedPriceBand(selectedPriceBand === i ? null : i)}
                />
                {band.label}
              </label>
            ))}
          </div>
        </div>

        {(selectedSizes.length > 0 || selectedPriceBand !== null) && (
          <button
            type="button"
            onClick={() => {
              setSelectedSizes([]);
              setSelectedPriceBand(null);
            }}
            className="text-xs text-burgundy hover:underline"
          >
            Clear filters
          </button>
        )}
      </aside>

      <div>
        <p className="text-sm text-charcoal/50 mb-6">{filtered.length} products</p>
        {filtered.length === 0 ? (
          <p className="text-charcoal/50 text-sm">No products match these filters.</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
