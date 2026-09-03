import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { JOURNAL_POSTS_DATA } from "@/data/journal-data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = JOURNAL_POSTS_DATA[slug];
  if (!post) return {};
  return {
    title: `${post.title} | AUREYAA Journal`,
    description: post.content[0],
  };
}

export default async function JournalPostPage({ params }: Props) {
  const { slug } = await params;
  const post = JOURNAL_POSTS_DATA[slug];

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
