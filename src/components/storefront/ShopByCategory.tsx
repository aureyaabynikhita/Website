import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/ui/FadeIn";
import type { CategoryDoc } from "@/types/firestore";

export function ShopByCategory({ categories }: { categories: CategoryDoc[] }) {
  return (
    <section className="section-spacing bg-beige-light">
      <div className="section-container">
        <FadeIn className="text-center mb-12">
          <p className="eyebrow mb-3">Explore</p>
          <h2 className="font-serif text-display-sm md:text-display-md text-charcoal">
            Shop by Category
          </h2>
        </FadeIn>

        {categories.length === 0 ? (
          <p className="text-center text-charcoal/50 text-sm">
            No categories yet — run the seed script to preview this section.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <FadeIn key={cat.id} delay={i * 0.08}>
                <Link href={`/category/${cat.slug}`} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden bg-beige">
                    <Image
                      src={cat.image ?? "/images/placeholder-1.jpg"}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-charcoal/10 group-hover:bg-charcoal/20 transition-colors" />
                    <span className="absolute bottom-5 left-1/2 -translate-x-1/2 font-serif text-lg text-ivory tracking-wide">
                      {cat.name}
                    </span>
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
