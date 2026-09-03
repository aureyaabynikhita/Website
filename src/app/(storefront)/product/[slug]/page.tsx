import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getProductsByCategory, getProductColorSiblings } from "@/services/products";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ColorSwatches } from "@/components/product/ColorSwatches";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { ProductDetailsAccordion } from "@/components/product/ProductDetailsAccordion";
import { ProductGridSection } from "@/components/storefront/ProductGridSection";
import { formatPrice, cn } from "@/lib/utils";
import { Star, ChevronRight } from "lucide-react";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  return {
    title: `${product.title} | AUREYAA`,
    description: product.seo?.metaDescription || product.description,
    openGraph: {
      title: product.seo?.metaTitle || product.title,
      description: product.seo?.metaDescription || product.description,
      images: product.images?.[0] ? [product.images[0]] : [],
    },
  };
}

function ProductSpecsCard({
  categoryId,
  color,
  fabric,
  wash,
}: {
  categoryId: string;
  color: string;
  fabric: string;
  wash: string;
}) {
  const isSaree = categoryId.includes("saree");
  const isSkirt = categoryId.includes("skirt");
  const isCoord = categoryId.includes("coords");

  const specs = [
    { label: "Construction", value: "Ready to Wear Designer Finish" },
    { label: "Silhouette", value: isSaree ? "Pre-Stitched Drape Saree" : isSkirt ? "Indo-Western Drape Skirt Set" : isCoord ? "Tailored Co-Ord Set" : "Luxury Contemporary" },
    { label: "Fabric Details", value: fabric || "Premium Blended Silk & Georgette" },
    { label: "Wash Care", value: wash || "Professional Dry Clean Only" },
    { label: "Color Tone", value: color || "Original" },
    { label: "Origin", value: "Handcrafted in India" },
  ];

  return (
    <div className="bg-beige/30 border border-charcoal/10 p-5 mb-8">
      <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-burgundy mb-4">
        Garment Specifications
      </h3>
      <div className="grid grid-cols-2 gap-y-3.5 gap-x-6">
        {specs.map((s, idx) => (
          <div key={idx} className="space-y-0.5">
            <p className="text-[9px] uppercase tracking-wider text-charcoal/50 font-semibold">{s.label}</p>
            <p className="text-xs text-charcoal font-sans font-medium leading-snug">{s.value}</p>
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
    const lines = p.split("\n");
    const isList =
      lines.every((line) => {
        const trimmed = line.trim();
        return trimmed === "" || trimmed.startsWith("- ") || trimmed.startsWith("• ") || trimmed.startsWith("* ");
      }) && lines.some((line) => line.trim() !== "");

    if (isList) {
      return (
        <ul key={index} className="list-disc pl-5 mb-5 space-y-1.5">
          {lines
            .filter((l) => l.trim() !== "")
            .map((line, i) => {
              const cleanLine = line.trim().replace(/^[-•*]\s*/, "");
              return (
                <li key={i} className="text-xs sm:text-sm text-charcoal/70 leading-relaxed font-sans">
                  {cleanLine}
                </li>
              );
            })}
        </ul>
      );
    }

    const parts = p.split(/(\*\*.*?\*\*)/g);
    return (
      <div key={index} className="mb-4 text-charcoal/70 leading-relaxed text-xs sm:text-sm">
        {parts.map((part, i) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong
                key={i}
                className="font-semibold text-burgundy font-sans tracking-[0.15em] block mt-4 mb-1 text-[11px] uppercase"
              >
                {part.slice(2, -2)}
              </strong>
            );
          }
          return (
            <span key={i} className="font-sans text-xs sm:text-sm text-charcoal/75">
              {part}
            </span>
          );
        })}
      </div>
    );
  });
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [colorSiblings, related] = await Promise.all([
    getProductColorSiblings(product),
    getProductsByCategory(product.categoryId, 5).then((list) => list.filter((p) => p.id !== product.id)),
  ]);

  const categoryName =
    product.categoryId === "cat-coords"
      ? "Co-Ord Sets"
      : product.categoryId === "cat-sarees"
      ? "Drape Sarees"
      : product.categoryId === "cat-drape-skirts"
      ? "Drape Skirts"
      : product.categoryId === "cat-indo-western"
      ? "Indo-Western"
      : product.categoryId.replace("cat-", "");

  const categorySlug = product.categoryId.replace("cat-", "");

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

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-charcoal/50 font-sans">
        <Link href="/" className="hover:text-burgundy transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link href={`/category/${categorySlug}`} className="hover:text-burgundy transition-colors">
          {categoryName}
        </Link>
        <ChevronRight size={12} />
        <span className="text-charcoal truncate font-medium max-w-[200px] sm:max-w-none">{product.title}</span>
      </nav>

      {/* Main Grid Layout */}
      <div className="grid md:grid-cols-2 gap-10 md:gap-14 lg:gap-20 items-start">
        {/* Sticky Gallery for Desktop */}
        <div className="md:sticky md:top-28">
          <ProductGallery images={product.images} videoUrl={product.videoUrl} title={product.title} />
        </div>

        {/* Product Details Panel */}
        <div className="space-y-6">
          <div>
            <p className="eyebrow mb-2">{categoryName}</p>
            <h1 className="font-serif text-3xl md:text-4xl text-charcoal tracking-wide mb-3">{product.title}</h1>

            <div className="flex items-center justify-between gap-4 border-b border-charcoal/10 pb-4">
              <div className="flex items-baseline gap-3">
                <p className="text-2xl text-charcoal font-serif font-medium">
                  {formatPrice(product.basePrice)}
                </p>
                {product.compareAtPrice && product.compareAtPrice > product.basePrice && (
                  <span className="text-sm text-charcoal/40 line-through font-sans">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
                <span className="text-[10px] text-charcoal/50 font-sans tracking-wide uppercase">
                  (Incl. of all taxes)
                </span>
              </div>

              {product.ratingCount > 0 && (
                <div className="flex items-center gap-1 bg-beige/50 px-2.5 py-1 border border-charcoal/10">
                  <div className="flex items-center text-gold-dark">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={cn(
                          "fill-current",
                          i < Math.round(product.ratingAverage) ? "text-gold-dark" : "text-charcoal/20 fill-none"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-charcoal/70 font-semibold font-mono ml-1">
                    {product.ratingAverage.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Color Variations Section */}
          {colorSiblings.length > 1 && (
            <div className="border-b border-charcoal/10 pb-5">
              <ColorSwatches siblings={colorSiblings} />
            </div>
          )}

          {/* Add to Cart Actions & Pincode Check */}
          <AddToCartButton product={product} />

          {/* Description */}
          <div className="border-t border-charcoal/10 pt-6">
            <h2 className="text-xs uppercase tracking-[0.15em] font-bold text-charcoal/80 mb-3">
              About This Design
            </h2>
            {renderFormattedDescription(product.description)}
          </div>

          {/* Specifications Card */}
          <ProductSpecsCard
            categoryId={product.categoryId}
            color={product.variants?.[0]?.color || "Original"}
            fabric={product.fabricDetails}
            wash={product.washCare}
          />

          {/* Accordion for Care, Shipping & Returns */}
          <ProductDetailsAccordion product={product} />
        </div>
      </div>

      {/* Related Products / Complete the Look */}
      {related.length > 0 && (
        <div className="mt-24 pt-16 border-t border-charcoal/10">
          <ProductGridSection
            eyebrow="Curated For You"
            title="Complete the Look"
            products={related}
            viewAllHref={`/category/${categorySlug}`}
          />
        </div>
      )}
    </div>
  );
}
