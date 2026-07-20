import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/ui/FadeIn";

const JOURNAL_POSTS = [
  {
    id: "j1",
    slug: "art-of-draping",
    title: "The Art of the Modern Drape",
    image: "/images/journal-1.jpg",
  },
  {
    id: "j2",
    slug: "fabric-guide",
    title: "A Guide to Our Signature Fabrics",
    image: "/images/journal-2.jpg",
  },
  {
    id: "j3",
    slug: "styling-festive-season",
    title: "Styling for the Festive Season",
    image: "/images/journal-3.jpg",
  },
];

export function FashionJournal() {
  return (
    <section className="section-spacing bg-beige-light">
      <div className="section-container">
        <FadeIn className="mb-12">
          <p className="eyebrow mb-3">The Journal</p>
          <h2 className="font-serif text-display-sm md:text-display-md text-charcoal">
            Notes on Style
          </h2>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-8">
          {JOURNAL_POSTS.map((post, i) => (
            <FadeIn key={post.id} delay={i * 0.08}>
              <Link href={`/journal/${post.slug}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden bg-beige mb-4">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-serif text-lg text-charcoal group-hover:text-burgundy transition-colors">
                  {post.title}
                </h3>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
