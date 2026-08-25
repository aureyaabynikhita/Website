import Link from "next/link";
import { FadeIn } from "@/components/ui/FadeIn";
import { ProductCard } from "@/components/product/ProductCard";
import type { ProductDoc } from "@/types/firestore";
import { ArrowRight } from "lucide-react";

interface ProductGridSectionProps {
  eyebrow: string;
  title: string;
  products: ProductDoc[];
  viewAllHref: string;
  priorityFirstRows?: boolean;
}

export function ProductGridSection({
  eyebrow,
  title,
  products,
  viewAllHref,
  priorityFirstRows = false,
}: ProductGridSectionProps) {
  return (
    <section className="section-spacing section-container">
      <FadeIn className="flex items-end justify-between mb-8 md:mb-12 border-b border-charcoal/10 pb-4">
        <div>
          <p className="eyebrow mb-2">{eyebrow}</p>
          <h2 className="font-serif text-display-sm md:text-display-md text-charcoal">{title}</h2>
        </div>
        <Link
          href={viewAllHref}
          className="inline-flex items-center gap-1.5 text-xs tracking-[0.15em] uppercase font-semibold text-charcoal/70 hover:text-burgundy transition-colors group"
        >
          <span>View All</span>
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </FadeIn>

      {products.length === 0 ? (
        <p className="text-charcoal/50 text-sm">
          Nothing here yet — check back soon.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {products.map((product, i) => (
            <FadeIn key={product.id} delay={i * 0.05}>
              <ProductCard product={product} priority={priorityFirstRows && i < 4} />
            </FadeIn>
          ))}
        </div>
      )}
    </section>
  );
}
