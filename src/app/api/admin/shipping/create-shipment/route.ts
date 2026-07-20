import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/session";
import { getOrderById } from "@/services/admin/orders";
import { createShiprocketOrder, generateAwb } from "@/services/shipping/shiprocket";
import { adminDb } from "@/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { COLLECTIONS } from "@/types/firestore";

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { orderId } = await request.json();
  const order = await getOrderById(orderId);
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  try {
    const shiprocketOrder = await createShiprocketOrder({
      orderId: order.orderNumber,
      orderDate: new Date().toISOString().slice(0, 10),
      customerName: order.shippingAddress.label || "Customer",
      customerEmail: order.guestEmail ?? "",
      customerPhone: order.shippingAddress.phone,
      addressLine1: order.shippingAddress.line1,
      addressLine2: order.shippingAddress.line2,
      city: order.shippingAddress.city,
      state: order.shippingAddress.state,
      pincode: order.shippingAddress.pincode,
      items: order.items.map((i) => ({
        name: i.title,
        sku: `${i.productId}-${i.variantId}`,
        units: i.quantity,
        sellingPrice: i.price,
      })),
      subtotal: order.subtotal,
      paymentMethod: order.paymentMethod === "cod" ? "COD" : "Prepaid",
    });

    const shipmentId = shiprocketOrder?.shipment_id;
    let awbCode: string | undefined;
    if (shipmentId) {
      const awbResult = await generateAwb(shipmentId);
      awbCode = awbResult?.response?.data?.awb_code;
    }

    await adminDb
      .collection(COLLECTIONS.orders)
      .doc(orderId)
      .update({
        courierPartner: "shiprocket",
        awbNumber: awbCode ?? null,
        status: "processing",
        updatedAt: FieldValue.serverTimestamp(),
      });

    return NextResponse.json({ ok: true, awbCode });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Shiprocket integration failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
