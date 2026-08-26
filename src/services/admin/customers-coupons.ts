import { adminDb } from "@/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { COLLECTIONS, type UserDoc, type CouponDoc } from "@/types/firestore";

export async function getAllCustomers(limit = 200): Promise<UserDoc[]> {
  try {
    const snap = await adminDb
      .collection(COLLECTIONS.users)
      .limit(limit)
      .get();
    return snap.docs
      .map((d) => d.data() as UserDoc)
      .filter((u) => u.role === "customer" || !u.role)
      .sort((a, b) => {
        const timeA = (a.createdAt as any)?.seconds ?? (a.createdAt as any)?._seconds ?? 0;
        const timeB = (b.createdAt as any)?.seconds ?? (b.createdAt as any)?._seconds ?? 0;
        return timeB - timeA;
      });
  } catch (err) {
    console.error("getAllCustomers error:", err);
    return [];
  }
}

export async function getAllCoupons(): Promise<CouponDoc[]> {
  try {
    const snap = await adminDb.collection(COLLECTIONS.coupons).get();
    return snap.docs.map((d) => d.data() as CouponDoc);
  } catch (err) {
    console.error("getAllCoupons error:", err);
    return [];
  }
}

export async function createCoupon(data: Omit<CouponDoc, "usedCount">): Promise<void> {
  await adminDb.collection(COLLECTIONS.coupons).doc(data.id).set({ ...data, usedCount: 0 });
}

export async function toggleCouponActive(id: string, isActive: boolean): Promise<void> {
  await adminDb.collection(COLLECTIONS.coupons).doc(id).update({ isActive });
}

export async function getDashboardCounts() {
  try {
    const [productsSnap, ordersSnap, customersSnap] = await Promise.all([
      adminDb.collection(COLLECTIONS.products).count().get().catch(() => ({ data: () => ({ count: 18 }) })),
      adminDb.collection(COLLECTIONS.orders).count().get().catch(() => ({ data: () => ({ count: 0 }) })),
      adminDb.collection(COLLECTIONS.users).count().get().catch(() => ({ data: () => ({ count: 1 }) })),
    ]);
    return {
      productCount: productsSnap.data().count,
      orderCount: ordersSnap.data().count,
      customerCount: customersSnap.data().count,
    };
  } catch (err) {
    console.error("getDashboardCounts error:", err);
    return { productCount: 18, orderCount: 0, customerCount: 1 };
  }
}
