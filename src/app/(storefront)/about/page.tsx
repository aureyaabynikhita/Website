import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story | AUREYAA",
  description: "Learn about AUREYAA by Nikhita Matania — the vision of quiet luxury, timeless tailoring, and intentional craft.",
};

export default function AboutPage() {
  return (
    <div className="bg-ivory text-charcoal">
      {/* Editorial Header */}
      <section className="section-container pt-20 pb-12 text-center max-w-3xl mx-auto space-y-4">
        <p className="eyebrow">The Atelier</p>
        <h1 className="font-serif text-display-sm md:text-display-md text-charcoal tracking-wide">
          Our Story
        </h1>
        <p className="text-charcoal/60 font-serif italic text-lg md:text-xl">
          &ldquo;Luxury is not about being noticed, it is about being remembered.&rdquo;
        </p>
      </section>

      {/* Main Story Content with Split Layout */}
      <section className="section-container pb-20 grid md:grid-cols-2 gap-12 md:gap-20 items-center">
        <div className="relative aspect-[4/5] bg-beige overflow-hidden">
          <Image
            src="/images/instagram-1.jpg"
            alt="Aureyaa Atelier Tailoring"
            fill
            className="object-cover"
          />
        </div>
        <div className="space-y-6">
          <h2 className="font-serif text-2xl md:text-3xl tracking-wide text-burgundy">
            A Vision of Quiet Luxury
          </h2>
          <p className="text-sm md:text-base text-charcoal/70 leading-relaxed font-sans">
            AUREYAA was founded on a simple but firm philosophy: fashion should be intentional, elegant, and timeless. In a world dominated by rapid trend cycles and disposable garments, we choose to stand apart. 
          </p>
          <p className="text-sm md:text-base text-charcoal/70 leading-relaxed font-sans">
            Each silhouette we design is engineered to flatter, age gracefully, and endure. We carefully select premium fabrics that feel soft against the skin and maintain their shape, ensuring that every purchase is an investment in your wardrobe.
          </p>
          <p className="text-sm md:text-base text-charcoal/70 leading-relaxed font-sans">
            From co-ord sets to drape skirts and custom pre-draped sarees, AUREYAA marries modern convenience with traditional Indian craftsmanship, creating ready-to-wear luxury for the contemporary woman.
          </p>
        </div>
      </section>

      {/* Designer Spotlight Section */}
      <section id="designer" className="bg-beige-light/40 py-20 border-t border-charcoal/5">
        <div className="section-container grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div className="space-y-6 order-2 md:order-1">
            <p className="eyebrow">The Creator</p>
            <h2 className="font-serif text-3xl tracking-wide text-charcoal">
              Nikhita Matania
            </h2>
            <p className="text-sm md:text-base text-charcoal/70 leading-relaxed font-sans">
              As the founder and creative director of AUREYAA, Nikhita Matania brings her unique design aesthetic to life. Her vision focuses on clean lines, neutral tones, and subtle hand-crafted detailing.
            </p>
            <p className="text-sm md:text-base text-charcoal/70 leading-relaxed font-sans">
              &ldquo;I believe that the clothes we wear should make us feel confident and grounded. Every sketch is refined multiple times before it reaches the pattern table. We look at every stitch, hem, and button option to ensure it meets our luxury standard.&rdquo;
            </p>
            <p className="text-sm md:text-base text-charcoal/70 leading-relaxed font-sans">
              Based in Mumbai, Nikhita works closely with local artisans and tailors, preserving heritage design methods while applying a global design perspective.
            </p>
          </div>
          
          <div className="relative aspect-[4/5] bg-beige overflow-hidden order-1 md:order-2">
            <Image
              src="/images/designer-portrait.jpg"
              alt="Nikhita Matania"
              fill
              className="object-cover object-top"
            />
          </div>
        </div>
      </section>

      {/* Sustainability Statement */}
      <section className="section-container py-24 text-center max-w-2xl mx-auto space-y-6">
        <h2 className="font-serif text-2xl md:text-3xl text-burgundy tracking-wide">
          Our Commitment
        </h2>
        <p className="text-sm md:text-base text-charcoal/70 leading-relaxed font-sans">
          Sustainability is woven into our design process. By crafting garments in limited batches, we eliminate fabric waste and maintain premium quality control. We invite you to follow our journey as we continue to shape quiet luxury fashion in India.
        </p>
      </section>
    </div>
  );
}
