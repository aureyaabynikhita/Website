"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { useWishlist } from "@/hooks/useWishlist";
import type { ProductDoc } from "@/types/firestore";

export function ProductCard({ product, priority = false }: { product: ProductDoc; priority?: boolean }) {
  const router = useRouter();
  const { isWishlisted, toggle, requiresLogin } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  const img1 = product.images?.[0] ?? "/images/placeholder-1.jpg";
  const img2 = product.images?.[1];
  const allOutOfStock = product.variants?.every((v) => v.stock === 0);
  const availableSizes = product.variants?.filter((v) => v.stock > 0).map((v) => v.size) ?? [];

  return (
    <Link href={`/product/${product.slug}`} className="group block text-left">
      {/* Visual Image Container with full-head headroom and luxury styling */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F4EDE4] border border-charcoal/5">
        {/* Primary Image */}
        <Image
          src={img1}
          alt={product.title}
          fill
          priority={priority}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`object-cover object-[center_top] transition-all duration-700 ease-out ${
            img2 ? "group-hover:opacity-0 group-hover:scale-105" : "group-hover:scale-105"
          }`}
        />

        {/* Secondary Hover Image (Lookbook Angle) */}
        {img2 && (
          <Image
            src={img2}
            alt={`${product.title} Alternate View`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-[center_top] absolute inset-0 opacity-0 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-105"
          />
        )}

        {/* Top Status Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {allOutOfStock ? (
            <span className="bg-charcoal/90 text-ivory text-[9px] font-sans tracking-[0.15em] uppercase px-2 py-0.5 font-semibold backdrop-blur-xs">
              Sold Out
            </span>
          ) : product.isBestSeller ? (
            <span className="bg-burgundy text-ivory text-[9px] font-sans tracking-[0.15em] uppercase px-2 py-0.5 font-semibold shadow-xs">
              Best Seller
            </span>
          ) : product.isFeatured ? (
            <span className="bg-gold-dark text-charcoal text-[9px] font-sans tracking-[0.15em] uppercase px-2 py-0.5 font-semibold">
              Editorial Pick
            </span>
          ) : null}
        </div>

        {/* Wishlist Heart Button */}
        <button
          type="button"
          aria-label="Add to wishlist"
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (requiresLogin) {
              router.push(`/login?redirect=/product/${product.slug}`);
              return;
            }
            await toggle(product.id);
          }}
          className="absolute top-2.5 right-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-ivory/85 backdrop-blur-md transition-all duration-300 opacity-0 group-hover:opacity-100 hover:bg-ivory hover:scale-110 shadow-xs"
        >
          <Heart
            size={15}
            className={`transition-colors ${
              wishlisted ? "fill-burgundy text-burgundy" : "text-charcoal/80 hover:text-burgundy"
            }`}
          />
        </button>

        {/* Quick Size Pill Strip */}
        {availableSizes.length > 0 && !allOutOfStock && (
          <div className="absolute bottom-0 inset-x-0 bg-ivory/95 backdrop-blur-sm py-2 px-3 flex items-center justify-center gap-1.5 translate-y-full opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 border-t border-charcoal/5">
            <span className="text-[9px] uppercase tracking-widest text-charcoal/50 mr-1 font-semibold">Sizes:</span>
            {availableSizes.map((size) => (
              <span
                key={size}
                className="text-[10px] font-medium tracking-wider text-charcoal bg-beige/40 px-1.5 py-0.5 border border-charcoal/10"
              >
                {size}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Product Title & Pricing */}
      <div className="mt-3.5 space-y-1">
        <h3 className="font-sans text-xs sm:text-sm text-charcoal tracking-wide line-clamp-1 group-hover:text-burgundy transition-colors font-normal">
          {product.title}
        </h3>
        <div className="flex items-center gap-2">
          <p className="font-sans text-xs sm:text-sm font-medium text-charcoal/90 tracking-tight">
            {formatPrice(product.basePrice)}
          </p>
          {product.compareAtPrice && product.compareAtPrice > product.basePrice && (
            <p className="font-sans text-[11px] text-charcoal/40 line-through">
              {formatPrice(product.compareAtPrice)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
