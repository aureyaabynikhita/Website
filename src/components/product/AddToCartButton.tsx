"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { Button } from "@/components/ui/Button";
import type { ProductDoc, ProductVariant } from "@/types/firestore";
import { Heart, Share2, X, Truck, ShieldCheck, RotateCcw, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function AddToCartButton({ product }: { product: ProductDoc }) {
  const { addItem } = useCart();
  const { isWishlisted, toggle: toggleWishlist, requiresLogin } = useWishlist();
  
  // Find first available variant or default to first
  const initialVariant = product.variants?.find((v) => v.stock > 0) ?? product.variants?.[0];
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(initialVariant);
  const [isAdding, setIsAdding] = useState(false);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);
  const [isCheckingPincode, setIsCheckingPincode] = useState(false);

  const wishlisted = isWishlisted(product.id);
  const isOutOfStock = !selectedVariant || selectedVariant.stock === 0;

  async function handleAdd() {
    if (!selectedVariant || isOutOfStock) return;
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
    toast.success(`${product.title} (${selectedVariant.size}) added to bag!`, {
      style: {
        background: "#2E2E2E",
        color: "#F1DDC8",
        border: "1px solid rgba(199, 163, 107, 0.3)",
      },
    });
  }

  const handleShare = () => {
    if (typeof window !== "undefined") {
      const url = window.location.href;
      if (navigator.share) {
        navigator.share({
          title: product.title,
          url: url,
        }).catch(console.error);
      } else {
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
      }
    }
  };

  const checkDeliveryPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6) {
      toast.error("Please enter a valid 6-digit pincode.");
      return;
    }
    setIsCheckingPincode(true);
    setTimeout(() => {
      setIsCheckingPincode(false);
      setPincodeStatus(`Standard delivery in 3–5 business days to ${pincode} • Free Shipping`);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Size Selector Header */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <p className="text-xs tracking-[0.15em] uppercase font-semibold text-charcoal/80">Select Size</p>
            {selectedVariant && (
              <span className="text-xs text-charcoal/50 font-medium">
                ({selectedVariant.size})
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsSizeChartOpen(true)}
            className="text-xs text-burgundy hover:text-burgundy-light font-semibold uppercase tracking-wider underline underline-offset-4 transition-colors"
          >
            Size Guide
          </button>
        </div>

        {product.variants && product.variants.length > 0 && (
          <div className="flex flex-wrap gap-2.5">
            {product.variants.map((v) => {
              const isSelected = selectedVariant?.id === v.id;
              const isStockOut = v.stock === 0;

              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVariant(v)}
                  className={cn(
                    "relative h-12 min-w-12 px-4 border text-xs tracking-widest font-sans transition-all duration-200 flex items-center justify-center",
                    isSelected && !isStockOut && "border-burgundy bg-burgundy text-ivory font-bold shadow-xs",
                    !isSelected && !isStockOut && "border-charcoal/20 hover:border-charcoal bg-transparent text-charcoal",
                    isStockOut && "border-charcoal/15 bg-charcoal/[0.02] text-charcoal/35 cursor-not-allowed line-through"
                  )}
                >
                  {v.size}
                  {isStockOut && (
                    <span className="absolute -bottom-2 text-[8px] tracking-normal font-sans font-semibold text-error bg-ivory px-1 uppercase no-underline">
                      Sold Out
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Primary Action Buttons */}
      <div className="flex gap-3 pt-2">
        <Button
          className={cn(
            "flex-1 py-4 text-xs uppercase tracking-[0.2em] font-bold shadow-sm transition-all duration-300",
            isOutOfStock
              ? "bg-charcoal/20 text-charcoal/50 hover:bg-charcoal/20 cursor-not-allowed border-0"
              : "bg-burgundy text-ivory hover:bg-burgundy-dark hover:shadow-md"
          )}
          size="lg"
          onClick={handleAdd}
          disabled={isAdding || isOutOfStock}
        >
          {isOutOfStock ? "Out of Stock" : isAdding ? "Adding to Bag..." : "Add to Bag"}
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
              toast.success("Added to Wishlist");
            } else {
              toast.success("Removed from Wishlist");
            }
          }}
          className={cn(
            "h-[50px] w-[50px] flex items-center justify-center border transition-all duration-300 shrink-0",
            wishlisted
              ? "border-burgundy bg-burgundy/10 text-burgundy"
              : "border-charcoal/20 hover:border-charcoal text-charcoal"
          )}
          aria-label="Add to wishlist"
        >
          <Heart size={18} className={wishlisted ? "fill-burgundy text-burgundy" : ""} />
        </button>

        {/* Share Button */}
        <button
          type="button"
          onClick={handleShare}
          className="h-[50px] w-[50px] flex items-center justify-center border border-charcoal/20 hover:border-charcoal text-charcoal transition-all shrink-0"
          aria-label="Share product"
        >
          <Share2 size={18} />
        </button>
      </div>

      {/* Luxury Delivery & Service Highlights (Zara Style) */}
      <div className="border-t border-charcoal/10 pt-5 space-y-4">
        {/* Pincode Estimator */}
        <div>
          <p className="text-[11px] uppercase tracking-widest text-charcoal/70 font-semibold mb-2 flex items-center gap-1.5">
            <Truck size={14} className="text-burgundy" /> Delivery Estimator
          </p>
          <form onSubmit={checkDeliveryPincode} className="flex gap-2">
            <input
              type="text"
              maxLength={6}
              placeholder="Enter Pincode (e.g. 400001)"
              value={pincode}
              onChange={(e) => {
                setPincode(e.target.value.replace(/\D/g, ""));
                setPincodeStatus(null);
              }}
              className="flex-1 border border-charcoal/20 bg-transparent px-3 py-2 text-xs font-mono tracking-wider focus:border-burgundy focus:outline-none"
            />
            <button
              type="submit"
              disabled={isCheckingPincode}
              className="px-4 py-2 bg-charcoal text-ivory text-xs uppercase tracking-wider font-semibold hover:bg-burgundy transition-colors shrink-0"
            >
              {isCheckingPincode ? "Checking..." : "Check"}
            </button>
          </form>
          {pincodeStatus && (
            <p className="text-xs text-success font-medium mt-2 flex items-center gap-1">
              <Check size={13} /> {pincodeStatus}
            </p>
          )}
        </div>

        {/* Trust & Craftsmanship Highlights */}
        <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-charcoal/70">
          <div className="flex items-center gap-2 p-2.5 bg-beige/30 border border-charcoal/5">
            <Sparkles size={16} className="text-gold-dark shrink-0" />
            <span className="leading-tight">Heirloom Handcrafted Quality</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 bg-beige/30 border border-charcoal/5">
            <Truck size={16} className="text-gold-dark shrink-0" />
            <span className="leading-tight font-medium text-burgundy">Complimentary Free Shipping</span>
          </div>
        </div>
      </div>

      {/* Size Chart Modal Overlay */}
      {isSizeChartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-xs animate-fade-in">
          <div className="fixed inset-0" onClick={() => setIsSizeChartOpen(false)} />
          
          <div className="relative bg-ivory max-w-2xl w-full p-6 shadow-2xl z-10 border border-charcoal/10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 border-b border-charcoal/10 pb-3">
              <h3 className="font-serif text-lg tracking-wide text-charcoal">Size & Measurement Guide</h3>
              <button
                type="button"
                onClick={() => setIsSizeChartOpen(false)}
                className="p-1 text-charcoal/50 hover:text-burgundy transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="relative w-full overflow-hidden bg-white border border-charcoal/5 p-2">
              <img
                src="/images/size-chart.jpg"
                alt="Women's Wear Size Chart"
                className="w-full h-auto object-contain"
              />
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-xs text-charcoal/50 tracking-wider">
                All measurements are in inches. For custom bespoke fitting inquiries, please contact our concierge.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
