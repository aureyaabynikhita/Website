import { adminDb } from "@/firebase/admin";
import { COLLECTIONS, type ProductDoc } from "@/types/firestore";

/**
 * All reads here use firebase-admin (server-only) — call these from Server
 * Components / Route Handlers, not from "use client" components. Client-side
 * product reads (e.g. live stock on the PDP) go through src/firebase/client.ts
 * directly inside the component that needs them (Phase 6).
 */

function serializeProduct(doc: any): any {
  if (!doc) return doc;
  return {
    ...doc,
    createdAt: doc.createdAt?.toDate ? doc.createdAt.toDate().toISOString() : doc.createdAt,
    updatedAt: doc.updatedAt?.toDate ? doc.updatedAt.toDate().toISOString() : doc.updatedAt,
  };
}

export async function getFeaturedProducts(limit = 8): Promise<ProductDoc[]> {
  try {
    const snap = await adminDb
      .collection(COLLECTIONS.products)
      .where("status", "==", "published")
      .where("isFeatured", "==", true)
      .limit(limit)
      .get();
    return snap.docs.map((d) => serializeProduct(d.data()) as ProductDoc);
  } catch (error) {
    console.error("Error in getFeaturedProducts:", error);
    return [];
  }
}

export async function getNewArrivals(limit = 8): Promise<ProductDoc[]> {
  try {
    const snap = await adminDb
      .collection(COLLECTIONS.products)
      .where("status", "==", "published")
      .where("isNewArrival", "==", true)
      .limit(limit)
      .get();
    return snap.docs
      .map((d) => serializeProduct(d.data()) as ProductDoc)
      .sort((a, b) => {
        const timeA = (a.createdAt as any)?.seconds ?? (a.createdAt as any)?._seconds ?? 0;
        const timeB = (b.createdAt as any)?.seconds ?? (b.createdAt as any)?._seconds ?? 0;
        return timeB - timeA;
      });
  } catch (error) {
    console.error("Error in getNewArrivals:", error);
    return [];
  }
}

export async function getBestSellers(limit = 8): Promise<ProductDoc[]> {
  try {
    const snap = await adminDb
      .collection(COLLECTIONS.products)
      .where("status", "==", "published")
      .where("isBestSeller", "==", true)
      .limit(limit)
      .get();
    return snap.docs.map((d) => serializeProduct(d.data()) as ProductDoc);
  } catch (error) {
    console.error("Error in getBestSellers:", error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<ProductDoc | null> {
  try {
    const snap = await adminDb
      .collection(COLLECTIONS.products)
      .where("slug", "==", slug)
      .where("status", "==", "published")
      .limit(1)
      .get();
    if (snap.empty) return null;
    return serializeProduct(snap.docs[0]!.data()) as ProductDoc;
  } catch (error) {
    console.error("Error in getProductBySlug:", error);
    return null;
  }
}

export async function getProductsByCategory(
  categoryId: string,
  limit = 24
): Promise<ProductDoc[]> {
  try {
    const snap = await adminDb
      .collection(COLLECTIONS.products)
      .where("status", "==", "published")
      .where("categoryId", "==", categoryId)
      .limit(limit)
      .get();
    return snap.docs.map((d) => serializeProduct(d.data()) as ProductDoc);
  } catch (error) {
    console.error("Error in getProductsByCategory:", error);
    return [];
  }
}

export async function getProductsByIds(ids: string[]): Promise<ProductDoc[]> {
  if (ids.length === 0) return [];
  try {
    // Firestore 'in' queries cap at 30 ids — fine for a wishlist, revisit if that changes.
    const snap = await adminDb
      .collection(COLLECTIONS.products)
      .where("id", "in", ids.slice(0, 30))
      .get();
    return snap.docs.map((d) => serializeProduct(d.data()) as ProductDoc);
  } catch (error) {
    console.error("Error in getProductsByIds:", error);
    return [];
  }
}

/**
 * Simple prefix/tag search. Firestore has no full-text search — this is a
 * placeholder until Elasticsearch/Algolia is wired in. Fine for a small catalog,
 * not fine at scale (see README note in this phase).
 */
export interface ColorSibling {
  id: string;
  title: string;
  slug: string;
  color: string;
  image: string;
  basePrice: number;
  isCurrent: boolean;
}

/**
 * Finds sibling color variations belonging to the same style/collection family
 * (e.g. Mooh Black, Mooh Ivory, Mooh Maroon, etc.)
 */
export async function getProductColorSiblings(currentProduct: ProductDoc): Promise<ColorSibling[]> {
  const titleLower = currentProduct.title.toLowerCase();
  const families = ["mooh", "rooh", "naira", "sitara", "zoya", "ada", "afreen", "nazakat"];
  const matchedFamily = families.find((f) => titleLower.includes(f));

  if (!matchedFamily) return [];

  try {
    const snap = await adminDb
      .collection(COLLECTIONS.products)
      .where("status", "==", "published")
      .get();

    const siblings: ColorSibling[] = [];

    snap.docs.forEach((d) => {
      const p = d.data() as ProductDoc;
      if (p.title.toLowerCase().includes(matchedFamily)) {
        // Extract the color name from title (e.g. "MOOH BOTTLE GREEN" -> "Bottle Green")
        const colorName = p.title
          .toLowerCase()
          .replace(matchedFamily, "")
          .replace("jacket", "")
          .trim()
          .split(" ")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ") || "Original";

        siblings.push({
          id: p.id,
          title: p.title,
          slug: p.slug,
          color: colorName,
          image: p.images?.[0] || "/images/placeholder-1.jpg",
          basePrice: p.basePrice,
          isCurrent: p.id === currentProduct.id,
        });
      }
    });

    return siblings.length > 1 ? siblings : [];
  } catch (error) {
    console.error("Error in getProductColorSiblings:", error);
    return [];
  }
}

export async function searchProducts(queryText: string, limit = 20): Promise<ProductDoc[]> {
  const lower = queryText.toLowerCase().trim();
  if (!lower) return [];
  try {
    const snap = await adminDb
      .collection(COLLECTIONS.products)
      .where("status", "==", "published")
      .get();
    
    // Client-side filter across title, description, and tags for flexible search
    const results = snap.docs
      .map((d) => serializeProduct(d.data()) as ProductDoc)
      .filter((p) => 
        p.title.toLowerCase().includes(lower) ||
        p.description?.toLowerCase().includes(lower) ||
        p.tags?.some((t) => t.toLowerCase().includes(lower))
      );

    return results.slice(0, limit);
  } catch (error) {
    console.error("Error in searchProducts:", error);
    return [];
  }
}

