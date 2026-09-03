import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { JOURNAL_ARTICLES } from "@/data/journal-data";

export const metadata: Metadata = {
  title: "The Journal — AUREYAA",
  description: "Read about the design philosophy, heritage, and styling tips behind AUREYAA.",
};

export default function JournalPage() {
  return (
    <div className="section-container section-spacing">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <p className="eyebrow mb-3">Perspectives</p>
        <h1 className="font-serif text-display-md text-charcoal mb-4">The Journal</h1>
        <p className="text-charcoal/60 leading-relaxed font-light">
          Deep-dives into heritage craftsmanship, our design philosophy, and curated guides for the modern gentlewoman.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {JOURNAL_ARTICLES.map((article) => (
          <Link key={article.id} href={`/journal/${article.slug}`} className="group block">
            <article className="cursor-pointer">
              <div className="relative aspect-[4/3] bg-beige overflow-hidden mb-6">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-xs tracking-wider uppercase text-charcoal/50">
                  <span>{article.category}</span>
                  <span>•</span>
                  <span>{article.date}</span>
                </div>
                <h2 className="font-serif text-xl text-charcoal group-hover:text-burgundy transition-colors">
                  {article.title}
                </h2>
                <p className="text-charcoal/60 text-sm leading-relaxed font-light line-clamp-3">
                  {article.excerpt}
                </p>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
