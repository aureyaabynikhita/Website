import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getProductsByCategory } from "@/services/products";
import { ProductGallery } from "@/components/product/ProductGallery";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { ProductDetailsAccordion } from "@/components/product/ProductDetailsAccordion";
import { ProductGridSection } from "@/components/storefront/ProductGridSection";
import { formatPrice, cn } from "@/lib/utils";
import { Star } from "lucide-react";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  return {
    title: product.seo.metaTitle || product.title,
    description: product.seo.metaDescription || product.description,
    openGraph: {
      title: product.seo.metaTitle || product.title,
      description: product.seo.metaDescription || product.description,
      images: product.images[0] ? [product.images[0]] : [],
    },
  };
}

function ProductSpecsCard({ categoryId, color, fabric, wash }: { categoryId: string; color: string; fabric: string; wash: string }) {
  const isSaree = categoryId.includes("saree");
  const isSkirt = categoryId.includes("skirt");
  const isCoord = categoryId.includes("coords");

  const specs = [
    { label: "Stitch", value: "Ready to Wear" },
    { label: "Weave Pattern", value: "Regular Designer Weave" },
    { label: "Fabric Details", value: fabric || "Premium Blended Fabric" },
    { label: "Wash Care", value: wash || "Dry Clean Only" },
    { label: "Styling Neck", value: isSaree ? "Chic Drape Saree Cut" : isCoord ? "Elegant Collar / Round" : "Modern Indo-Western" },
    { label: "Color Way", value: color || "Original Premium" },
  ];

  return (
    <div className="bg-charcoal/[0.02] border border-charcoal/5 p-5 rounded-md mb-8">
      <h3 className="text-xs uppercase tracking-widest font-bold text-burgundy mb-4">Product Specifications</h3>
      <div className="grid grid-cols-2 gap-y-4 gap-x-6">
        {specs.map((s, idx) => (
          <div key={idx} className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider text-charcoal/50 font-semibold">{s.label}</p>
            <p className="text-sm text-charcoal font-sans font-medium leading-tight">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function renderFormattedDescription(text: string) {
  if (!text) return null;
  const paragraphs = text.split("\n\n");
  return paragraphs.map((p, index) => {
    // Check if paragraph consists of bullet points
    const lines = p.split("\n");
    const isList = lines.every(line => {
      const trimmed = line.trim();
      return trimmed === "" || trimmed.startsWith("- ") || trimmed.startsWith("• ") || trimmed.startsWith("* ");
    }) && lines.some(line => line.trim() !== "");
    
    if (isList) {
      return (
        <ul key={index} className="list-disc pl-5 mb-6 space-y-2">
          {lines.filter(l => l.trim() !== "").map((line, i) => {
            const cleanLine = line.trim().replace(/^[-•*]\s*/, "");
            return (
              <li key={i} className="text-sm text-charcoal/70 leading-relaxed font-sans">
                {cleanLine}
              </li>
            );
          })}
        </ul>
      );
    }

    const parts = p.split(/(\*\*.*?\*\*)/g);
    return (
      <div key={index} className="mb-4 text-charcoal/70 leading-relaxed text-sm md:text-base">
        {parts.map((part, i) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong key={i} className="font-semibold text-burgundy font-sans tracking-widest block mt-4 mb-2 text-xs uppercase">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return <span key={i} className="font-sans text-sm text-charcoal/70">{part}</span>;
        })}
      </div>
    );
  });
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = (await getProductsByCategory(product.categoryId, 5)).filter(
    (p) => p.id !== product.id
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.basePrice,
      availability: product.variants?.some((v) => v.stock > 0)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
    aggregateRating: product.ratingCount
      ? {
          "@type": "AggregateRating",
          ratingValue: product.ratingAverage,
          reviewCount: product.ratingCount,
        }
      : undefined,
  };

  return (
    <div className="section-container section-spacing">
      {/* eslint-disable-next-line react/no-danger */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="grid md:grid-cols-2 gap-10 md:gap-16">
        <ProductGallery images={product.images} videoUrl={product.videoUrl} title={product.title} />

        <div>
          <p className="eyebrow mb-2">{product.categoryId.replace("cat-", "").replace("-", " ")}</p>
          <h1 className="font-serif text-3xl md:text-4xl text-charcoal mb-3">{product.title}</h1>
          
          <div className="flex items-center justify-between mb-4">
            <p className="text-xl text-charcoal/80 font-medium">
              {formatPrice(product.basePrice)}
              {product.compareAtPrice && (
                <span className="ml-3 text-sm text-charcoal/40 line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </p>

            {product.ratingCount > 0 && (
              <div className="flex items-center gap-1.5 bg-beige-light/30 px-3 py-1 rounded-full">
                <div className="flex items-center text-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      className={cn(
                        "fill-current",
                        i < Math.round(product.ratingAverage) ? "text-gold" : "text-charcoal/10 fill-none"
                      )}
                    />
                  ))}
                </div>
                <span className="text-xs text-charcoal/50 font-medium">
                  {product.ratingAverage.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          <div className="border-t border-charcoal/10 pt-6 mb-6">
            {renderFormattedDescription(product.description)}
          </div>

          <ProductSpecsCard
            categoryId={product.categoryId}
            color={product.variants?.[0]?.color || "Default"}
            fabric={product.fabricDetails}
            wash={product.washCare}
          />

          <AddToCartButton product={product} />

          <ProductDetailsAccordion product={product} />
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-20 -mx-6 md:-mx-10 lg:-mx-16">
          <ProductGridSection
            eyebrow="Complete the Look"
            title="You May Also Like"
            products={related}
            viewAllHref={`/category/${product.categoryId.replace("cat-", "")}`}
          />
        </div>
      )}
    </div>
  );
}
