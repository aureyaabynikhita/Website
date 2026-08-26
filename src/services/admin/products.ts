import { adminDb } from "@/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { COLLECTIONS, type ProductDoc } from "@/types/firestore";

function serializeAdminProduct(doc: any): any {
  if (!doc) return doc;
  return {
    ...doc,
    createdAt: doc.createdAt?.toDate ? doc.createdAt.toDate().toISOString() : typeof doc.createdAt === "object" ? null : doc.createdAt,
    updatedAt: doc.updatedAt?.toDate ? doc.updatedAt.toDate().toISOString() : typeof doc.updatedAt === "object" ? null : doc.updatedAt,
  };
}

export async function getAllProductsForAdmin(): Promise<ProductDoc[]> {
  try {
    const snap = await adminDb.collection(COLLECTIONS.products).get();
    return snap.docs
      .map((d) => serializeAdminProduct(d.data()) as ProductDoc)
      .sort((a, b) => {
        const timeA = (a.updatedAt as any) || (a.createdAt as any) || "";
        const timeB = (b.updatedAt as any) || (b.createdAt as any) || "";
        return String(timeB).localeCompare(String(timeA));
      });
  } catch (err) {
    console.error("getAllProductsForAdmin error:", err);
    return [];
  }
}

export async function getProductByIdForAdmin(id: string): Promise<ProductDoc | null> {
  try {
    const snap = await adminDb.collection(COLLECTIONS.products).doc(id).get();
    if (snap.exists) {
      return serializeAdminProduct(snap.data()) as ProductDoc;
    }

    // Fallback: search by id or slug field
    const querySnap = await adminDb
      .collection(COLLECTIONS.products)
      .where("slug", "==", id)
      .limit(1)
      .get();
    if (!querySnap.empty && querySnap.docs[0]) {
      return serializeAdminProduct(querySnap.docs[0].data()) as ProductDoc;
    }

    return null;
  } catch (err) {
    console.error("getProductByIdForAdmin error:", err);
    return null;
  }
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
  try {
    const snap = await adminDb.collection(COLLECTIONS.products).get();
    return snap.docs
      .map((d) => serializeAdminProduct(d.data()) as ProductDoc)
      .filter((p) => Array.isArray(p.variants) && p.variants.some((v) => Number(v.stock) <= threshold));
  } catch (err) {
    console.error("getLowStockProducts error:", err);
    return [];
  }
}
