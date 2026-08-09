import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const POSTS_DATA: Record<
  string,
  { title: string; date: string; readTime: string; image: string; content: string[] }
> = {
  "philosophy-of-quiet-luxury": {
    title: "The Philosophy of Quiet Luxury in Indo-Western Style",
    date: "July 18, 2026",
    readTime: "4 min read",
    image: "/images/products/prod-rooh-beige/bb9b9409-5484-4863-8a39-ffde0b674390.jpg",
    content: [
      "Indo-Western styling represents the harmonious junction between traditional roots and global layouts. At AUREYAA, we see it as a canvas to define a new language of minimalist luxury.",
      "Traditional Indian garments like sarees have celebrated the beauty of the fluid drape for centuries. Our collections, like the Rooh and Naira sets, reiminate this heritage by introducing pre-draped cowls, structured jackets, and asymmetric hemlines that offer the same grace with contemporary comfort.",
      "Whether it is the elegant hand-embroidery on our silk blouses or the precise fall of our premium crepes, each piece stands out for its quiet elegance and tailored precision, avoiding loud motifs in favor of sophisticated texture.",
    ],
  },
  "caring-for-silks-zari": {
    title: "How to Care for Your Heirloom Silks and Zari",
    date: "June 25, 2026",
    readTime: "5 min read",
    image: "/images/products/prod-ada-cherry-red/63937eb0-57f7-4d07-a0b5-a9339c0d0228.jpg",
    content: [
      "The beauty of silk and zari embroidery lies not just in their immediate luster, but in their longevity. Proper care ensures these hand-tailored garments remain staples of elegance for generations.",
      "Always store your luxury silks in breathable muslin or cotton bags, rather than plastic folders which trap humidity and can lead to fabric decay. Refrain from spraying perfume directly onto silk, as chemicals can stain the weave.",
      "For pieces with intricate hand-embroidery, like our Ada series, we strongly recommend professional dry cleaning only. Store them flat or folded with acid-free tissue paper between folds to protect the delicate metallic threads.",
    ],
  },
  "building-timeless-wardrobe": {
    title: "Minimalism: Building a Timeless Ethnic Wardrobe",
    date: "May 14, 2026",
    readTime: "3 min read",
    image: "/images/products/prod-naira-black/32f22b79-583c-4863-9d0a-ab930c12845c.jpg",
    content: [
      "Building a versatile wardrobe starts with restraint. Rather than chasing fleeting seasonal trends, invest in foundation pieces that offer high wearability and transition fluidly across occasions.",
      "Eschew heavy, single-wear silhouettes for modular co-ord sets. Minimalist designs in solid colors, like our Naira Off-White and Naira Black, can be styled individually or paired with statement layers to create completely fresh looks.",
      "Quiet luxury is defined by the quality of the raw material and the precision of the fit. A single well-fitted drape skirt or silk tunic carries far more elegance than an array of standard garments.",
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
