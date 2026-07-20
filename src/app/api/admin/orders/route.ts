import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/session";
import { updateOrderStatus } from "@/services/admin/orders";
import type { OrderStatus } from "@/types/firestore";

const VALID_STATUSES: OrderStatus[] = [
  "pending_payment",
  "confirmed",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
  "returned",
];

export async function PATCH(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { orderId, status } = await request.json();
  if (!orderId || !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  await updateOrderStatus(orderId, status);
  return NextResponse.json({ ok: true });
}
