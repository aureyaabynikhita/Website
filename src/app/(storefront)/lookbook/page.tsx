import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lookbook — AUREYAA",
  description: "Explore the seasonal lookbooks and timeless silhouettes of AUREYAA.",
};

const LOOKS = [
  {
    id: 1,
    title: "Volume I: Fluid Silhouettes",
    description: "An exploration of silk drapes and fluid, unrestricted shapes designed for modern elegance.",
    image: "/images/lookbook-1.png",
  },
  {
    id: 2,
    title: "Volume II: Contemporary Heritage",
    description: "Honoring traditional weaves through minimal structures and modern Indo-Western cuts.",
    image: "/images/lookbook-2.png",
  },
  {
    id: 3,
    title: "Volume III: Minimalist Drape",
    description: "Quiet luxury defined. Delicate craftsmanship met with classic premium fabrications.",
    image: "/images/lookbook-3.png",
  },
];

export default function LookbookPage() {
  return (
    <div className="section-container section-spacing">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <p className="eyebrow mb-3">Editorial</p>
        <h1 className="font-serif text-display-md text-charcoal mb-4">The Lookbook</h1>
        <p className="text-charcoal/60 leading-relaxed font-light">
          A visual record of our design philosophy. Exploring the intersection of traditional Indian artistry and contemporary quiet luxury.
        </p>
      </div>

      <div className="space-y-24">
        {LOOKS.map((look, i) => (
          <div
            key={look.id}
            className={`grid md:grid-cols-2 gap-12 items-center ${
              i % 2 === 1 ? "md:flex-row-reverse" : ""
            }`}
          >
            <div className={`relative aspect-[3/4] w-full bg-beige overflow-hidden ${
              i % 2 === 1 ? "md:order-last" : ""
            }`}>
              <Image
                src={look.image}
                alt={look.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-[1.2s] ease-out hover:scale-105"
              />
            </div>
            <div className="space-y-6 max-w-md mx-auto">
              <span className="text-xs tracking-[0.2em] uppercase text-gold-dark font-sans">
                Collection 0{look.id}
              </span>
              <h2 className="font-serif text-3xl text-charcoal">{look.title}</h2>
              <p className="text-charcoal/70 leading-relaxed font-light">{look.description}</p>
              <div className="pt-4">
                <span className="text-xs tracking-wider uppercase border-b border-charcoal/30 pb-1 text-charcoal hover:border-burgundy hover:text-burgundy transition-colors cursor-pointer">
                  View Collection
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
