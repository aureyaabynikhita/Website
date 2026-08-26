import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/session";
import { adminDb } from "@/firebase/admin";
import { COLLECTIONS, type ReturnDoc, type OrderDoc } from "@/types/firestore";
import { createShiprocketOrder } from "@/services/shipping/shiprocket";
import { FieldValue } from "firebase-admin/firestore";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const snap = await adminDb.collection(COLLECTIONS.returns).get();
    const returns = snap.docs.map((d) => d.data() as ReturnDoc);

    // Fetch matching orders in parallel to add customer details
    const returnsWithDetails = await Promise.all(
      returns.map(async (ret) => {
        const orderSnap = await adminDb.collection(COLLECTIONS.orders).doc(ret.orderId).get();
        const order = orderSnap.exists ? (orderSnap.data() as OrderDoc) : null;
        
        return {
          ...ret,
          customerName: order?.shippingAddress?.label || "Aureyaa Customer",
          customerPhone: order?.shippingAddress?.phone || "",
          productName: order?.items?.[0]?.title || "Garment Pieces",
          productSize: order?.items?.[0]?.size || "FS",
          amount: order?.total || 0,
          orderNumber: order?.orderNumber || "AUR-UNKWN",
          createdAtString: ret.createdAt?.toDate ? ret.createdAt.toDate().toLocaleDateString() : "Recent",
        };
      })
    );

    // Sort in memory to avoid composite index requirements
    returnsWithDetails.sort((a, b) => b.id.localeCompare(a.id));

    return NextResponse.json({ ok: true, returns: returnsWithDetails });
  } catch (err: any) {
    console.error("Error fetching returns:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch returns" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { returnId, status } = await request.json();
    if (!returnId || !status) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const returnRef = adminDb.collection(COLLECTIONS.returns).doc(returnId);
    const returnSnap = await returnRef.get();
    if (!returnSnap.exists) {
      return NextResponse.json({ error: "Return request not found" }, { status: 404 });
    }

    const retDoc = returnSnap.data() as ReturnDoc;
    const orderRef = adminDb.collection(COLLECTIONS.orders).doc(retDoc.orderId);
    const orderSnap = await orderRef.get();
    const order = orderSnap.exists ? (orderSnap.data() as OrderDoc) : null;

    const batch = adminDb.batch();
    batch.update(returnRef, { status });
    batch.update(orderRef, {
      status: status === "approved" ? "returned" : status === "rejected" ? "delivered" : "return_requested",
      updatedAt: FieldValue.serverTimestamp(),
    });

    await batch.commit();

    let shiprocketResponse = null;

    // Trigger Shiprocket Reverse pickup if approved
    if (status === "approved" && order) {
      try {
        const orderDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
        shiprocketResponse = await createShiprocketOrder({
          orderId: `REV-${order.orderNumber}-${Date.now().toString().slice(-4)}`,
          orderDate: orderDate || "2026-08-26",
          customerName: order.shippingAddress.label || "Customer",
          customerEmail: order.guestEmail || admin.profile.email || "customer@aureyaa.in",
          customerPhone: order.shippingAddress.phone || "",
          addressLine1: order.shippingAddress.line1 || "",
          addressLine2: order.shippingAddress.line2 || "",
          city: order.shippingAddress.city || "",
          state: order.shippingAddress.state || "",
          pincode: order.shippingAddress.pincode || "",
          items: order.items.map((item) => ({
            name: `REVERSE: ${item.title}`,
            sku: `${item.productId}-${item.size}`,
            units: item.quantity,
            sellingPrice: item.price,
          })),
          subtotal: order.subtotal,
          paymentMethod: "Prepaid", // Reverse orders are always prepaid shipping
        });
      } catch (err: any) {
        console.warn("Shiprocket reverse order call logged (non-blocking fallback):", err.message);
      }
    }

    return NextResponse.json({ ok: true, shiprocketResponse });
  } catch (err: any) {
    console.error("Error updating return request:", err);
    return NextResponse.json({ error: err.message || "Failed to update return" }, { status: 500 });
  }
}
