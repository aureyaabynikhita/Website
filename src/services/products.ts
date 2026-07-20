import { adminDb } from "@/firebase/admin";
import { COLLECTIONS, type ProductDoc } from "@/types/firestore";

/**
 * All reads here use firebase-admin (server-only) — call these from Server
 * Components / Route Handlers, not from "use client" components. Client-side
 * product reads (e.g. live stock on the PDP) go through src/firebase/client.ts
 * directly inside the component that needs them (Phase 6).
 */

export async function getFeaturedProducts(limit = 8): Promise<ProductDoc[]> {
  try {
    const snap = await adminDb
      .collection(COLLECTIONS.products)
      .where("status", "==", "published")
      .where("isFeatured", "==", true)
      .limit(limit)
      .get();
    return snap.docs.map((d) => d.data() as ProductDoc);
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
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get();
    return snap.docs.map((d) => d.data() as ProductDoc);
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
    return snap.docs.map((d) => d.data() as ProductDoc);
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
    return snap.docs[0]!.data() as ProductDoc;
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
    return snap.docs.map((d) => d.data() as ProductDoc);
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
    return snap.docs.map((d) => d.data() as ProductDoc);
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
export async function searchProducts(queryText: string, limit = 20): Promise<ProductDoc[]> {
  const lower = queryText.toLowerCase();
  try {
    const snap = await adminDb
      .collection(COLLECTIONS.products)
      .where("status", "==", "published")
      .where("tags", "array-contains", lower)
      .limit(limit)
      .get();
    return snap.docs.map((d) => d.data() as ProductDoc);
  } catch (error) {
    console.error("Error in searchProducts:", error);
    return [];
  }
}
