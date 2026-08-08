import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const POSTS_DATA: Record<
  string,
  { title: string; date: string; readTime: string; image: string; content: string[] }
> = {
  "art-of-draping": {
    title: "The Art of the Modern Drape",
    date: "August 5, 2026",
    readTime: "4 min read",
    image: "/images/journal-1.jpg",
    content: [
      "Draping is more than a technique; it is a dialogue between fabric and form. At AUREYAA, we view draping as an architectural process where the fabric behaves as a living structure.",
      "Traditional Indian garments like sarees have celebrated the beauty of the fluid drape for centuries. Our collection reimagines this heritage by introducing pre-draped skirts, structured cowls, and asymmetric hemlines that offer the same grace without the complexity of traditional draping.",
      "Whether it is the elegant gather of our crepe skirts or the precise fall of our satin co-ord sets, each piece is hand-adjusted at our atelier to ensure it conforms perfectly to the body's natural movement.",
    ],
  },
  "fabric-guide": {
    title: "A Guide to Our Signature Fabrics",
    date: "July 28, 2026",
    readTime: "5 min read",
    image: "/images/journal-2.jpg",
    content: [
      "The soul of a garment lies in its touch. We spend months sourcing fabrics that not only look luxury but also feel exceptionally soft and breathe naturally.",
      "From heavy-weight premium crepes that carry the perfect drape weight, to light-catching fluid satins, every material is rigorously tested for longevity, piling, and colour fastness.",
      "Our choice of fabrics reflects our commitment to slow fashion. By selecting high-quality blends and pure weaves, we ensure that your AUREYAA pieces remain staples of quiet elegance in your wardrobe for years to come.",
    ],
  },
  "styling-festive-season": {
    title: "Styling for the Festive Season",
    date: "July 15, 2026",
    readTime: "3 min read",
    image: "/images/journal-3.jpg",
    content: [
      "Festive dressing should feel effortless, not encumbered. This season, we are focusing on clean, fluid silhouettes that transition seamlessly from daytime ceremonies to evening celebrations.",
      "Our pre-draped skirts paired with modern structured tops offer a contemporary alternative to heavy lehengas. Complete the look with minimal gold jewelry and elegant heels to let the clean tailoring of the garment stand out.",
      "Quiet luxury is about restraint. Choosing one statement colorway, like our signature Cherry Red or Emerald Green, allows the silhouette and rich fabric texture to speak for itself.",
    ],
  },
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS_DATA[slug];
  if (!post) return {};
  return {
    title: `${post.title} | AUREYAA Journal`,
    description: post.content[0],
  };
}

export default async function JournalPostPage({ params }: Props) {
  const { slug } = await params;
  const post = POSTS_DATA[slug];

  if (!post) {
    notFound();
  }

  return (
    <article className="bg-ivory min-h-screen text-charcoal py-16 md:py-24">
      <div className="section-container max-w-3xl">
        {/* Back Link */}
        <Link
          href="/journal"
          className="inline-flex items-center text-xs tracking-wider uppercase text-charcoal/60 hover:text-burgundy mb-8 transition-colors"
        >
          ← Back to Journal
        </Link>

        {/* Header */}
        <header className="space-y-4 mb-10">
          <div className="flex items-center gap-4 text-xs tracking-wider uppercase text-gold-dark">
            <span>{post.date}</span>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>
          <h1 className="font-serif text-display-sm md:text-display-md text-charcoal leading-tight">
            {post.title}
          </h1>
        </header>

        {/* Featured Image */}
        <div className="relative aspect-[16/9] w-full bg-beige overflow-hidden mb-12">
          <Image src={post.image} alt={post.title} fill className="object-cover" />
        </div>

        {/* Content Body */}
        <div className="space-y-6 text-sm md:text-base leading-relaxed text-charcoal/80 font-sans">
          {post.content.map((p, index) => (
            <p key={index}>{p}</p>
          ))}
        </div>
      </div>
    </article>
  );
}
