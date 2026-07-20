import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/services/categories";
import { getProductsByCategory, getNewArrivals, getBestSellers } from "@/services/products";
import { CategoryFilterableGrid } from "@/components/storefront/CategoryFilterableGrid";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const VIRTUAL_SLUGS = ["new-arrivals", "best-sellers"] as const;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if ((VIRTUAL_SLUGS as readonly string[]).includes(slug)) {
    return { title: slug === "new-arrivals" ? "New Arrivals" : "Best Sellers" };
  }
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: category.seo.metaTitle || category.name,
    description: category.seo.metaDescription,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;

  // "New Arrivals" and "Best Sellers" are flags on products, not real category
  // documents — handle them as virtual collections before hitting Firestore categories.
  if (slug === "new-arrivals" || slug === "best-sellers") {
    const products = slug === "new-arrivals" ? await getNewArrivals(50) : await getBestSellers(50);
    return (
      <div className="section-container section-spacing">
        <div className="mb-10">
          <p className="eyebrow mb-2">Shop</p>
          <h1 className="font-serif text-display-sm md:text-display-md text-charcoal">
            {slug === "new-arrivals" ? "New Arrivals" : "Best Sellers"}
          </h1>
        </div>
        <CategoryFilterableGrid products={products} />
      </div>
    );
  }

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const products = await getProductsByCategory(category.id);

  return (
    <div className="section-container section-spacing">
      <div className="mb-10">
        <p className="eyebrow mb-2">Shop</p>
        <h1 className="font-serif text-display-sm md:text-display-md text-charcoal">
          {category.name}
        </h1>
      </div>
      <CategoryFilterableGrid products={products} />
    </div>
  );
}
