import { Star } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { mockReviews } from "@/lib/mock-data";

export function CustomerReviews() {
  return (
    <section className="section-spacing bg-beige-light">
      <div className="section-container">
        <FadeIn className="text-center mb-12">
          <p className="eyebrow mb-3">In Their Words</p>
          <h2 className="font-serif text-display-sm md:text-display-md text-charcoal">
            Loved by Our Customers
          </h2>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-8">
          {mockReviews.map((review, i) => (
            <FadeIn
              key={review.id}
              delay={i * 0.1}
              className="bg-ivory p-8 border border-charcoal/10"
            >
              <div className="flex gap-1 mb-4 text-gold">
                {Array.from({ length: review.rating }).map((_, idx) => (
                  <Star key={idx} size={14} className="fill-gold" />
                ))}
              </div>
              <p className="text-charcoal/80 leading-relaxed mb-5">&ldquo;{review.body}&rdquo;</p>
              <p className="text-xs tracking-[0.1em] uppercase text-charcoal/50">
                {review.name}
              </p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
