import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/ui/FadeIn";
import type { CategoryDoc } from "@/types/firestore";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

export function ShopByCategory({ categories }: { categories: CategoryDoc[] }) {
  const gridColsClass =
    categories.length === 3
      ? "grid-cols-1 sm:grid-cols-3"
      : categories.length === 4
      ? "grid-cols-2 md:grid-cols-4"
      : "grid-cols-2 md:grid-cols-3 lg:grid-cols-5";

  return (
    <section className="section-spacing bg-beige/30 border-y border-charcoal/5">
      <div className="section-container">
        <FadeIn className="text-center mb-10 md:mb-14">
          <p className="eyebrow mb-2">Curated Edits</p>
          <h2 className="font-serif text-display-sm md:text-display-md text-charcoal">
            Shop by Category
          </h2>
          <p className="text-xs md:text-sm text-charcoal/60 max-w-md mx-auto mt-2">
            Each silhouette is handcrafted with heirloom techniques and modern design sensibilities.
          </p>
        </FadeIn>

        {categories.length === 0 ? (
          <p className="text-center text-charcoal/50 text-sm">No categories found.</p>
        ) : (
          <div className={cn("grid gap-5 md:gap-8", gridColsClass)}>
            {categories.map((cat, i) => (
              <FadeIn key={cat.id} delay={i * 0.1}>
                <Link href={`/category/${cat.slug}`} className="group block text-center interactive-tap">
                  <div className="relative aspect-[3/4] overflow-hidden bg-beige/50 border border-charcoal/10">
                    <Image
                      src={cat.image ?? "/images/placeholder-1.jpg"}
                      alt={cat.name}
                      fill
                      quality={92}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    {/* Editorial Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                    
                    {/* Bottom Label and Arrow */}
                    <div className="absolute bottom-6 inset-x-4 text-center text-ivory space-y-1">
                      <h3 className="font-serif text-xl md:text-2xl tracking-wide">
                        {cat.name}
                      </h3>
                      <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.2em] text-ivory/80 group-hover:text-gold-light group-hover:underline underline-offset-4 transition-all">
                        Explore Edit <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
