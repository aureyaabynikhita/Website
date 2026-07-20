import Image from "next/image";
import { Instagram } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";

const INSTAGRAM_TILES = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  image: `/images/instagram-${i + 1}.jpg`,
}));

export function InstagramFeed() {
  return (
    <section className="section-spacing section-container">
      <FadeIn className="text-center mb-10">
        <p className="eyebrow mb-3">Follow the Journey</p>
        <h2 className="font-serif text-display-sm md:text-display-md text-charcoal flex items-center justify-center gap-3">
          <Instagram size={26} className="text-burgundy" /> @aureyaa.official
        </h2>
      </FadeIn>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
        {INSTAGRAM_TILES.map((tile, i) => (
          <FadeIn key={tile.id} delay={i * 0.05} className="relative aspect-square">
            <Image
              src={tile.image}
              alt="AUREYAA on Instagram"
              fill
              sizes="(max-width: 768px) 33vw, 16vw"
              className="object-cover"
            />
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
