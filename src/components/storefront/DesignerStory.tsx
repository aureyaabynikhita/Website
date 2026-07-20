import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/ui/FadeIn";
import { Button } from "@/components/ui/Button";

export function DesignerStory() {
  return (
    <section className="section-spacing section-container">
      <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <FadeIn className="relative aspect-[4/5] order-2 md:order-1">
          <Image
            src="/images/designer-portrait.jpg"
            alt="Nikhita Matania — Founder & Designer, AUREYAA"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </FadeIn>

        <FadeIn delay={0.1} className="order-1 md:order-2">
          <p className="eyebrow mb-4">The Designer</p>
          <h2 className="font-serif text-display-sm md:text-display-md text-charcoal mb-6 leading-snug">
            Every piece begins
            <br />
            with a story worth keeping.
          </h2>
          <p className="text-charcoal/70 leading-relaxed mb-4">
            Nikhita Matania founded AUREYAA on a simple belief — that luxury isn&apos;t
            about being loud, it&apos;s about being felt. Each silhouette is designed to
            outlast trend cycles, built from fabrics chosen for how they age, not just
            how they photograph.
          </p>
          <p className="text-charcoal/70 leading-relaxed mb-8">
            From the first sketch to the final stitch, every AUREYAA piece carries
            an intention: to be worn for years, not seasons.
          </p>
          <Link href="/about">
            <Button variant="outline">Read Our Story</Button>
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
