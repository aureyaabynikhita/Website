import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getProductsByCategory } from "@/services/products";
import { ProductGallery } from "@/components/product/ProductGallery";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { ProductDetailsAccordion } from "@/components/product/ProductDetailsAccordion";
import { ProductGridSection } from "@/components/storefront/ProductGridSection";
import { formatPrice } from "@/lib/utils";

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
        <ProductGallery images={product.images} title={product.title} />

        <div>
          <p className="eyebrow mb-2">{product.categoryId.replace("cat-", "")}</p>
          <h1 className="font-serif text-3xl md:text-4xl text-charcoal mb-3">{product.title}</h1>
          <p className="text-xl text-charcoal/80 mb-1">
            {formatPrice(product.basePrice)}
            {product.compareAtPrice && (
              <span className="ml-3 text-sm text-charcoal/40 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </p>
          {product.ratingCount > 0 && (
            <p className="text-sm text-charcoal/50 mb-6">
              ★ {product.ratingAverage.toFixed(1)} ({product.ratingCount} reviews)
            </p>
          )}

          <p className="text-charcoal/70 leading-relaxed mb-8">{product.description}</p>

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
