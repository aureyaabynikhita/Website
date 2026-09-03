import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/ui/FadeIn";
import { ArrowRight } from "lucide-react";

const JOURNAL_POSTS = [
  {
    id: "j1",
    slug: "philosophy-of-quiet-luxury",
    title: "The Philosophy of Quiet Luxury in Contemporary Indo-Western Wear",
    category: "Design Philosophy",
    readTime: "4 min read",
    image: "/images/products/prod-rooh-beige/prod-rooh-beige-01.png",
  },
  {
    id: "j2",
    slug: "caring-for-silks-zari",
    title: "How to Care for Your Heirloom Silks, Georgette & Handcrafted Zari",
    category: "Craftsmanship",
    readTime: "3 min read",
    image: "/images/products/prod-ada-cherry-red/prod-ada-cherry-red-02.png",
  },
  {
    id: "j3",
    slug: "building-timeless-wardrobe",
    title: "Minimalism in Occasion Wear: Building an Heirloom Ethnic Capsule",
    category: "Styling Edit",
    readTime: "5 min read",
    image: "/images/products/prod-naira-black/prod-naira-black-01.png",
  },
];

export function FashionJournal() {
  return (
    <section className="section-spacing bg-beige/30 border-t border-charcoal/5">
      <div className="section-container">
        <FadeIn className="flex items-end justify-between mb-8 md:mb-12 border-b border-charcoal/10 pb-4">
          <div>
            <p className="eyebrow mb-2">The Journal</p>
            <h2 className="font-serif text-display-sm md:text-display-md text-charcoal">
              Notes on Style & Craft
            </h2>
          </div>
          <Link
            href="/journal"
            className="inline-flex items-center gap-1.5 text-xs tracking-[0.15em] uppercase font-semibold text-charcoal/70 hover:text-burgundy transition-colors group"
          >
            <span>View All Stories</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {JOURNAL_POSTS.map((post, i) => (
            <FadeIn key={post.id} delay={i * 0.08}>
              <Link href={`/journal/${post.slug}`} className="group block text-left">
                {/* Magazine Portrait Aspect Ratio 4:5 */}
                <div className="relative aspect-[4/5] overflow-hidden bg-beige/50 border border-charcoal/10 mb-4">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-[center_top] transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-ivory/90 backdrop-blur-xs text-charcoal text-[9px] uppercase tracking-[0.15em] font-semibold px-2.5 py-1">
                    {post.category}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="text-[11px] uppercase tracking-wider text-charcoal/50 font-mono">
                    {post.readTime}
                  </div>
                  <h3 className="font-serif text-lg md:text-xl text-charcoal group-hover:text-burgundy transition-colors leading-snug">
                    {post.title}
                  </h3>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
