import { adminDb } from "@/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { COLLECTIONS, type OrderDoc, type OrderStatus } from "@/types/firestore";

export async function getAllOrdersForAdmin(limit = 100): Promise<OrderDoc[]> {
  const snap = await adminDb
    .collection(COLLECTIONS.orders)
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();
  return snap.docs.map((d) => d.data() as OrderDoc);
}

export async function getOrderById(id: string): Promise<OrderDoc | null> {
  const snap = await adminDb.collection(COLLECTIONS.orders).doc(id).get();
  return snap.exists ? (snap.data() as OrderDoc) : null;
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  await adminDb
    .collection(COLLECTIONS.orders)
    .doc(id)
    .update({ status, updatedAt: FieldValue.serverTimestamp() });
}

export async function getRevenueStats(): Promise<{
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  last7Days: { date: string; revenue: number }[];
}> {
  const snap = await adminDb
    .collection(COLLECTIONS.orders)
    .where("paymentStatus", "==", "paid")
    .get();
  const orders = snap.docs.map((d) => d.data() as OrderDoc);

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders ? Math.round(totalRevenue / totalOrders) : 0;

  const byDay = new Map<string, number>();
  for (const o of orders) {
    const date = o.createdAt?.toDate?.().toISOString().slice(0, 10) ?? "unknown";
    byDay.set(date, (byDay.get(date) ?? 0) + o.total);
  }
  const last7Days = Array.from(byDay.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-7)
    .map(([date, revenue]) => ({ date, revenue }));

  return { totalRevenue, totalOrders, avgOrderValue, last7Days };
}
