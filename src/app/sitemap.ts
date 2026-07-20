import type { MetadataRoute } from "next";
import { adminDb } from "@/firebase/admin";
import { COLLECTIONS, type ProductDoc, type CategoryDoc } from "@/types/firestore";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticUrls = ["", "/about", "/contact", "/faqs", "/size-guide"].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.5,
  }));

  try {
    const [productsSnap, categoriesSnap] = await Promise.all([
      adminDb.collection(COLLECTIONS.products).where("status", "==", "published").get(),
      adminDb.collection(COLLECTIONS.categories).get(),
    ]);

    const productUrls = productsSnap.docs.map((d) => {
      const p = d.data() as ProductDoc;
      return {
        url: `${SITE_URL}/product/${p.slug}`,
        lastModified: p.updatedAt?.toDate?.() ?? new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      };
    });

    const categoryUrls = categoriesSnap.docs.map((d) => {
      const c = d.data() as CategoryDoc;
      return {
        url: `${SITE_URL}/category/${c.slug}`,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      };
    });

    return [...staticUrls, ...categoryUrls, ...productUrls];
  } catch (error) {
    console.error("Failed to generate dynamic sitemap, returning static URLs:", error);
    return staticUrls;
  }
}
