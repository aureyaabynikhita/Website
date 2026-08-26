"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import type { ProductDoc } from "@/types/firestore";
import { SlidersHorizontal, X, ArrowUpDown, Check, Star } from "lucide-react";

interface CategoryFilterableGridProps {
  products: ProductDoc[];
}

export function CategoryFilterableGrid({ products }: CategoryFilterableGridProps) {
  // Filter States
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("featured");

  // Mobile Drawer State
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Dynamic filter lists from products
  const availableColors = useMemo(() => {
    const colors = new Set<string>();
    products.forEach((p) => {
      p.variants?.forEach((v) => {
        if (v.color) colors.add(v.color);
      });
    });
    return Array.from(colors).sort();
  }, [products]);

  const availableSizes = useMemo(() => {
    const sizes = new Set<string>();
    products.forEach((p) => {
      p.variants?.forEach((v) => {
        if (v.size) sizes.add(v.size.toUpperCase());
      });
    });
    // Sort logically S, M, L, XL, XXL
    const sizeOrder = ["S", "M", "L", "XL", "XXL", "XXXL"];
    return Array.from(sizes).sort((a, b) => sizeOrder.indexOf(a) - sizeOrder.indexOf(b));
  }, [products]);

  // Categories mapping inside the products list
  const categoryNames: Record<string, string> = {
    "cat-coords": "Co-ords",
    "cat-sarees": "Sarees",
    "cat-drape-skirts": "Drape Skirts",
    "cat-gowns": "Gowns",
    "cat-jackets": "Jackets",
  };

  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach((p) => {
      if (p.categoryId) cats.add(p.categoryId);
    });
    return Array.from(cats).map(id => ({ id, name: categoryNames[id] || id }));
  }, [products]);

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      // 1. Size Filter
      const sizeMatch =
        selectedSizes.length === 0 ||
        p.variants?.some((v) => selectedSizes.includes(v.size.toUpperCase()));

      // 2. Color Filter
      const colorMatch =
        selectedColors.length === 0 ||
        p.variants?.some((v) => selectedColors.includes(v.color));

      // 3. Category Filter
      const categoryMatch =
        selectedCategories.length === 0 || selectedCategories.includes(p.categoryId);

      // 4. Custom Price Range
      const min = minPrice ? parseFloat(minPrice) : 0;
      const max = maxPrice ? parseFloat(maxPrice) : Infinity;
      const priceMatch = p.basePrice >= min && p.basePrice <= max;

      // 5. Stock Filter
      const hasStock = p.variants?.some((v) => v.stock > 0);
      const stockMatch = !inStockOnly || hasStock;

      return sizeMatch && colorMatch && categoryMatch && priceMatch && stockMatch;
    });

    // Sorting Logic
    if (sortBy === "price-low-to-high") {
      result.sort((a, b) => a.basePrice - b.basePrice);
    } else if (sortBy === "price-high-to-low") {
      result.sort((a, b) => b.basePrice - a.basePrice);
    } else if (sortBy === "rating") {
      result.sort((a, b) => (b.ratingAverage || 0) - (a.ratingAverage || 0));
    } else if (sortBy === "newest") {
      result.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt as any).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt as any).getTime() : 0;
        return dateB - dateA;
      });
    }

    return result;
  }, [products, selectedSizes, selectedColors, selectedCategories, minPrice, maxPrice, inStockOnly, sortBy]);

  // Helper triggers
  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const toggleCategory = (catId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
  };

  const clearAllFilters = () => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedCategories([]);
    setMinPrice("");
    setMaxPrice("");
    setInStockOnly(false);
  };

  const activeFiltersCount =
    selectedSizes.length +
    selectedColors.length +
    selectedCategories.length +
    (minPrice || maxPrice ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  // Desktop/Mobile reusable filters view
  const FiltersContent = () => (
    <div className="space-y-8">
      {/* Categories Filter */}
      {availableCategories.length > 1 && (
        <div>
          <h3 className="text-xs tracking-[0.15em] uppercase font-semibold text-charcoal/80 mb-4">Category</h3>
          <div className="space-y-2">
            {availableCategories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-2 text-sm text-charcoal/80 cursor-pointer hover:text-burgundy transition-colors">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.id)}
                  onChange={() => toggleCategory(cat.id)}
                  className="rounded border-charcoal/30 text-burgundy focus:ring-burgundy accent-burgundy"
                />
                {cat.name}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Sizes Filter */}
      {availableSizes.length > 0 && (
        <div>
          <h3 className="text-xs tracking-[0.15em] uppercase font-semibold text-charcoal/80 mb-4">Size</h3>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={`h-10 px-3 border text-xs tracking-wider font-medium transition-all ${
                  selectedSizes.includes(size)
                    ? "border-burgundy bg-burgundy text-ivory font-semibold shadow-sm"
                    : "border-charcoal/20 hover:border-charcoal bg-transparent text-charcoal"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Colors Filter */}
      {availableColors.length > 0 && (
        <div>
          <h3 className="text-xs tracking-[0.15em] uppercase font-semibold text-charcoal/80 mb-4">Color</h3>
          <div className="space-y-2">
            {availableColors.map((color) => (
              <label key={color} className="flex items-center gap-2 text-sm text-charcoal/80 cursor-pointer hover:text-burgundy transition-colors">
                <input
                  type="checkbox"
                  checked={selectedColors.includes(color)}
                  onChange={() => toggleColor(color)}
                  className="rounded border-charcoal/30 text-burgundy focus:ring-burgundy accent-burgundy"
                />
                {color}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price Range Filter */}
      <div>
        <h3 className="text-xs tracking-[0.15em] uppercase font-semibold text-charcoal/80 mb-4">Price (₹)</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full border border-charcoal/20 bg-transparent px-3 py-2 text-sm focus:border-burgundy focus:outline-none"
          />
          <span className="text-charcoal/40 text-xs">to</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full border border-charcoal/20 bg-transparent px-3 py-2 text-sm focus:border-burgundy focus:outline-none"
          />
        </div>
      </div>

      {/* Availability Filter */}
      <div>
        <label className="flex items-center gap-2 text-sm text-charcoal/80 cursor-pointer hover:text-burgundy transition-colors">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={() => setInStockOnly(!inStockOnly)}
            className="rounded border-charcoal/30 text-burgundy focus:ring-burgundy accent-burgundy"
          />
          In stock only
        </label>
      </div>

      {/* Clear Filters Button */}
      {activeFiltersCount > 0 && (
        <button
          type="button"
          onClick={clearAllFilters}
          className="w-full flex items-center justify-center gap-2 border border-burgundy/30 text-burgundy py-2 text-xs font-semibold uppercase tracking-wider hover:bg-burgundy hover:text-ivory transition-all"
        >
          <X size={14} /> Clear all filters ({activeFiltersCount})
        </button>
      )}
    </div>
  );

  return (
    <div>
      {/* Desktop Filter Bar Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-charcoal/10 pb-6 mb-8 gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsFilterDrawerOpen(true)}
            className="md:hidden flex items-center gap-2 border border-charcoal/20 px-4 py-2.5 text-sm font-semibold tracking-wider uppercase hover:border-charcoal transition-all"
          >
            <SlidersHorizontal size={16} /> Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </button>
          <p className="text-sm text-charcoal/50 font-medium">Showing {filteredProducts.length} of {products.length} products</p>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          <label htmlFor="sort-by" className="text-xs uppercase tracking-wider text-charcoal/60 font-semibold hidden md:inline">Sort By:</label>
          <div className="relative flex items-center border border-charcoal/20 px-3 py-2 bg-transparent">
            <ArrowUpDown size={14} className="text-charcoal/50 mr-2" />
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-sm focus:outline-none pr-6 cursor-pointer text-charcoal/80 font-medium appearance-none"
              style={{ backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`, backgroundPosition: 'right center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em' }}
            >
              <option value="featured">Featured</option>
              <option value="price-low-to-high">Price: Low to High</option>
              <option value="price-high-to-low">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="newest">New Arrivals</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid md:grid-cols-[240px_1fr] gap-8 lg:gap-12 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block sticky top-28 overflow-y-auto max-h-[80vh] pr-4 no-scrollbar">
          <FiltersContent />
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-charcoal/10 bg-ivory/20 rounded-sm">
              <SlidersHorizontal size={36} className="mx-auto text-charcoal/30 mb-4" />
              <p className="text-charcoal/70 font-medium text-lg mb-2">No matching products</p>
              <p className="text-charcoal/40 text-sm mb-6">Try adjusting your filter options or price range.</p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="px-6 py-2.5 bg-burgundy text-ivory text-xs font-semibold uppercase tracking-wider hover:bg-burgundy/90 transition-all"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-4 md:gap-x-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer Overlay */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-charcoal/50 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsFilterDrawerOpen(false)}
          />

          {/* Drawer Body */}
          <div className="relative w-full max-w-sm bg-ivory h-full flex flex-col z-10 shadow-2xl animate-slide-in-right">
            <div className="flex items-center justify-between px-6 py-5 border-b border-charcoal/10 bg-ivory">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-charcoal">Filters</h2>
              <button
                type="button"
                onClick={() => setIsFilterDrawerOpen(false)}
                className="p-1 hover:text-burgundy transition-colors"
                aria-label="Close filters"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Filters Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 pb-32">
              <FiltersContent />
            </div>

            {/* Sticky Actions inside drawer */}
            <div className="absolute bottom-0 left-0 right-0 bg-ivory border-t border-charcoal/10 px-6 py-4 flex gap-4">
              <button
                type="button"
                onClick={() => {
                  clearAllFilters();
                  setIsFilterDrawerOpen(false);
                }}
                className="flex-1 py-3 text-center border border-charcoal/20 text-xs font-bold uppercase tracking-wider hover:border-charcoal transition-all text-charcoal"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setIsFilterDrawerOpen(false)}
                className="flex-1 py-3 text-center bg-burgundy text-ivory text-xs font-bold uppercase tracking-wider hover:bg-burgundy/90 transition-all shadow-sm"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
