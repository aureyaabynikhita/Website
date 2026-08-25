import Image from "next/image";
import Link from "next/link";
import { Instagram } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";

const INSTAGRAM_TILES = [
  {
    id: 1,
    image: "/images/products/prod-mooh-ivory/prod-mooh-ivory-01.png",
    caption: "Mooh Ivory — Embroidered heirloom perfection",
  },
  {
    id: 2,
    image: "/images/products/prod-zoya-cherry-red/prod-zoya-cherry-red-01.png",
    caption: "Zoya Cherry Red — Dramatic drape silhouette",
  },
  {
    id: 3,
    image: "/images/products/prod-sitara-royal-blue/prod-sitara-royal-blue-01.png",
    caption: "Sitara Royal Blue — Modern Indo-Western elegance",
  },
  {
    id: 4,
    image: "/images/products/prod-afreen-ivory-purple/prod-afreen-ivory-purple-01.png",
    caption: "Afreen Ivory Purple — Handcrafted luxury edit",
  },
  {
    id: 5,
    image: "/images/products/prod-naira-off-white/prod-naira-off-white-01.png",
    caption: "Naira Off White — Quiet luxury co-ord",
  },
  {
    id: 6,
    image: "/images/products/prod-nazakat-black/prod-nazakat-black-01.png",
    caption: "Nazakat Black — Timeless drape saree",
  },
];

export function InstagramFeed() {
  return (
    <section className="section-spacing section-container">
      <FadeIn className="text-center mb-8 md:mb-12">
        <p className="eyebrow mb-2">Follow the Journey</p>
        <Link
          href="https://instagram.com/aureyaabynikhita"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-serif text-2xl md:text-3xl text-charcoal hover:text-burgundy transition-colors group"
        >
          <Instagram size={24} className="text-burgundy group-hover:scale-110 transition-transform" />
          <span>@aureyaabynikhita</span>
        </Link>
      </FadeIn>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        {INSTAGRAM_TILES.map((tile, i) => (
          <FadeIn key={tile.id} delay={i * 0.05}>
            <Link
              href="https://instagram.com/aureyaabynikhita"
              target="_blank"
              rel="noopener noreferrer"
              className="group block relative aspect-[4/5] overflow-hidden bg-beige/40 border border-charcoal/10"
            >
              <Image
                src={tile.image}
                alt={tile.caption}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover object-[center_top] transition-transform duration-700 ease-out group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3 text-center">
                <Instagram size={22} className="text-ivory" />
              </div>
            </Link>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
