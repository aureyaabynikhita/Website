import Link from "next/link";
import { FadeIn } from "@/components/ui/FadeIn";
import { ProductCard } from "@/components/product/ProductCard";
import type { ProductDoc } from "@/types/firestore";

interface ProductGridSectionProps {
  eyebrow: string;
  title: string;
  products: ProductDoc[];
  viewAllHref: string;
}

export function ProductGridSection({
  eyebrow,
  title,
  products,
  viewAllHref,
}: ProductGridSectionProps) {
  return (
    <section className="section-spacing section-container">
      <FadeIn className="flex items-end justify-between mb-10 md:mb-14">
        <div>
          <p className="eyebrow mb-3">{eyebrow}</p>
          <h2 className="font-serif text-display-sm md:text-display-md text-charcoal">{title}</h2>
        </div>
        <Link
          href={viewAllHref}
          className="hidden md:block text-xs tracking-[0.12em] uppercase text-charcoal/70 hover:text-burgundy transition-colors"
        >
          View All →
        </Link>
      </FadeIn>

      {products.length === 0 ? (
        <p className="text-charcoal/50 text-sm">
          Nothing here yet — check back soon, or run the seed script to preview this section.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {products.map((product, i) => (
            <FadeIn key={product.id} delay={i * 0.08}>
              <ProductCard product={product} />
            </FadeIn>
          ))}
        </div>
      )}
    </section>
  );
}
