import { adminDb } from "@/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { COLLECTIONS, type ProductDoc } from "@/types/firestore";

export async function getAllProductsForAdmin(): Promise<ProductDoc[]> {
  const snap = await adminDb.collection(COLLECTIONS.products).orderBy("updatedAt", "desc").get();
  return snap.docs.map((d) => d.data() as ProductDoc);
}

export async function getProductByIdForAdmin(id: string): Promise<ProductDoc | null> {
  const snap = await adminDb.collection(COLLECTIONS.products).doc(id).get();
  return snap.exists ? (snap.data() as ProductDoc) : null;
}

export async function createProduct(
  data: Omit<ProductDoc, "createdAt" | "updatedAt">
): Promise<void> {
  await adminDb
    .collection(COLLECTIONS.products)
    .doc(data.id)
    .set({ ...data, createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() });
}

export async function updateProduct(
  id: string,
  data: Partial<Omit<ProductDoc, "id" | "createdAt">>
): Promise<void> {
  await adminDb
    .collection(COLLECTIONS.products)
    .doc(id)
    .update({ ...data, updatedAt: FieldValue.serverTimestamp() });
}

export async function deleteProduct(id: string): Promise<void> {
  await adminDb.collection(COLLECTIONS.products).doc(id).delete();
}

export async function getLowStockProducts(threshold = 5): Promise<ProductDoc[]> {
  const snap = await adminDb.collection(COLLECTIONS.products).get();
  return snap.docs
    .map((d) => d.data() as ProductDoc)
    .filter((p) => p.variants.some((v) => v.stock <= threshold));
}
