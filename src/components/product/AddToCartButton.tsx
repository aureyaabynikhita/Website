"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { Button } from "@/components/ui/Button";
import type { ProductDoc, ProductVariant } from "@/types/firestore";
import { Heart, Share2, X, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function AddToCartButton({ product }: { product: ProductDoc }) {
  const { addItem } = useCart();
  const { isWishlisted, toggle: toggleWishlist, requiresLogin } = useWishlist();
  
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants?.[0]
  );
  const [isAdding, setIsAdding] = useState(false);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const wishlisted = isWishlisted(product.id);

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

  const handleShare = () => {
    if (typeof window !== "undefined") {
      const url = window.location.href;
      if (navigator.share) {
        navigator.share({
          title: product.title,
          url: url
        }).catch(console.error);
      } else {
        navigator.clipboard.writeText(url);
        setCopiedShare(true);
        toast.success("Link copied to clipboard!");
        setTimeout(() => setCopiedShare(false), 2000);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Size Selector Header with Size Chart Trigger */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <p className="text-xs tracking-[0.12em] uppercase font-semibold text-charcoal/70">Size</p>
          <button
            type="button"
            onClick={() => setIsSizeChartOpen(true)}
            className="text-xs text-burgundy hover:text-burgundy/80 font-bold uppercase tracking-wider underline underline-offset-4 transition-colors"
          >
            Size Chart
          </button>
        </div>

        {product.variants?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {product.variants?.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setSelectedVariant(v)}
                disabled={v.stock === 0}
                className={cn(
                  "h-11 min-w-11 px-3 border text-xs tracking-wider transition-all disabled:opacity-30 disabled:cursor-not-allowed",
                  selectedVariant?.id === v.id
                    ? "border-burgundy bg-burgundy text-ivory font-semibold shadow-sm"
                    : "border-charcoal/20 hover:border-charcoal bg-transparent text-charcoal"
                )}
              >
                {v.size}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Primary Actions: Add to Bag, Wishlist, Share */}
      <div className="flex gap-3">
        <Button
          className="flex-1 py-4 text-xs uppercase tracking-widest font-bold"
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

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={async () => {
            if (requiresLogin) {
              toast.error("Please log in to manage your wishlist.");
              return;
            }
            await toggleWishlist(product.id);
            if (!wishlisted) {
              toast.success("Added to wishlist");
            } else {
              toast.success("Removed from wishlist");
            }
          }}
          className={cn(
            "h-[50px] w-[50px] flex items-center justify-center border transition-all duration-300",
            wishlisted
              ? "border-burgundy bg-burgundy/5 text-burgundy"
              : "border-charcoal/20 hover:border-charcoal text-charcoal"
          )}
          aria-label="Add to wishlist"
        >
          <Heart size={18} className={wishlisted ? "fill-burgundy" : ""} />
        </button>

        {/* Share Button */}
        <button
          type="button"
          onClick={handleShare}
          className="h-[50px] w-[50px] flex items-center justify-center border border-charcoal/20 hover:border-charcoal text-charcoal transition-all"
          aria-label="Share product"
        >
          <Share2 size={18} />
        </button>
      </div>

      {/* Size Chart Modal Overlay */}
      {isSizeChartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-xs animate-fade-in">
          {/* Backdrop click close */}
          <div className="fixed inset-0" onClick={() => setIsSizeChartOpen(false)} />
          
          <div className="relative bg-ivory max-w-3xl w-full p-6 shadow-2xl z-10 border border-charcoal/10 max-h-[90vh] overflow-y-auto animate-zoom-in">
            <div className="flex items-center justify-between mb-4 border-b border-charcoal/10 pb-3">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-charcoal">Size Guide</h3>
              <button
                type="button"
                onClick={() => setIsSizeChartOpen(false)}
                className="p-1 text-charcoal/50 hover:text-burgundy transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="relative w-full overflow-hidden bg-white border border-charcoal/5">
              <img
                src="/images/size-chart.jpg"
                alt="Women's Wear Size Chart"
                className="w-full h-auto object-contain"
              />
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-xs text-charcoal/40 tracking-wider">All measurements are shown in inches. Compare with a similar garment you own for the best fit.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
