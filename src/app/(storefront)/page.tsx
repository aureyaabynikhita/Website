import type { Metadata } from "next";
import { Hero } from "@/components/storefront/Hero";
import { ProductGridSection } from "@/components/storefront/ProductGridSection";
import { ShopByCategory } from "@/components/storefront/ShopByCategory";
import { DesignerStory } from "@/components/storefront/DesignerStory";
import { CustomerReviews } from "@/components/storefront/CustomerReviews";
import { InstagramFeed } from "@/components/storefront/InstagramFeed";
import { FashionJournal } from "@/components/storefront/FashionJournal";
import { Newsletter } from "@/components/storefront/Newsletter";
import { getNewArrivals, getBestSellers } from "@/services/products";
import { getAllCategories } from "@/services/categories";

export const metadata: Metadata = {
  title: "AUREYAA — Quiet Luxury Fashion by Nikhita Matania",
  description:
    "Discover AUREYAA's edit of timeless silhouettes — gowns, sarees, co-ords and more, crafted for those who wear luxury quietly.",
};

// Rendered fresh on every request for now (product/category data changes via
// admin panel). Revisit with ISR (`export const revalidate = 60`) once
// traffic makes that worth the staleness trade-off.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  let newArrivals: any[] = [];
  let bestSellers: any[] = [];
  let categories: any[] = [];

  try {
    const { adminDb } = await import("@/firebase/admin");
    const { COLLECTIONS } = await import("@/types/firestore");

    const [newArrivalsRes, bestSellersRes, categoriesRes, productsSnap] = await Promise.all([
      getNewArrivals(),
      getBestSellers(),
      getAllCategories(),
      adminDb.collection(COLLECTIONS.products).where("status", "==", "published").get(),
    ]);

    newArrivals = newArrivalsRes;
    bestSellers = bestSellersRes;

    // Filter categories to only those containing at least 1 published product
    const activeCategoryIds = new Set(productsSnap.docs.map((doc) => doc.data().categoryId));
    categories = categoriesRes.filter((cat) => activeCategoryIds.has(cat.id));
  } catch (error) {
    console.error("Failed to fetch home page data from Firebase:", error);
  }

  return (
    <>
      <Hero />
      <ProductGridSection
        eyebrow="Just In"
        title="New Arrivals"
        products={newArrivals}
        viewAllHref="/category/new-arrivals"
      />
      <ShopByCategory categories={categories} />
      <ProductGridSection
        eyebrow="Most Loved"
        title="Best Sellers"
        products={bestSellers}
        viewAllHref="/category/best-sellers"
      />
      <DesignerStory />
      <CustomerReviews />
      <InstagramFeed />
      <FashionJournal />
      <Newsletter />
    </>
  );
}
