import { adminDb } from "@/firebase/admin";
import { COLLECTIONS, type CategoryDoc } from "@/types/firestore";

export async function getAllCategories(): Promise<CategoryDoc[]> {
  try {
    const snap = await adminDb.collection(COLLECTIONS.categories).orderBy("order", "asc").get();
    return snap.docs.map((d) => d.data() as CategoryDoc);
  } catch (error) {
    console.error("Error in getAllCategories:", error);
    return [];
  }
}

export async function getCategoryBySlug(slug: string): Promise<CategoryDoc | null> {
  try {
    const snap = await adminDb
      .collection(COLLECTIONS.categories)
      .where("slug", "==", slug)
      .limit(1)
      .get();
    if (snap.empty) return null;
    return snap.docs[0]!.data() as CategoryDoc;
  } catch (error) {
    console.error("Error in getCategoryBySlug:", error);
    return null;
  }
}
