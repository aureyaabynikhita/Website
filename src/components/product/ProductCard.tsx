"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { useWishlist } from "@/hooks/useWishlist";
import type { ProductDoc } from "@/types/firestore";

export function ProductCard({ product }: { product: ProductDoc }) {
  const router = useRouter();
  const { isWishlisted, toggle, requiresLogin } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-beige">
        <Image
          src={product.images[0] ?? "/images/placeholder-1.jpg"}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <button
          type="button"
          aria-label="Add to wishlist"
          onClick={async (e) => {
            e.preventDefault();
            if (requiresLogin) {
              router.push(`/login?redirect=/product/${product.slug}`);
              return;
            }
            await toggle(product.id);
          }}
          className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-ivory/90 backdrop-blur-sm transition-opacity opacity-0 group-hover:opacity-100"
        >
          <Heart size={16} className={wishlisted ? "fill-burgundy text-burgundy" : "text-charcoal"} />
        </button>
      </div>
      <div className="mt-4 space-y-1">
        <h3 className="text-sm font-sans text-charcoal">{product.title}</h3>
        <p className="text-sm text-charcoal/60">{formatPrice(product.basePrice)}</p>
      </div>
    </Link>
  );
}
