import { NextResponse } from "next/server";
import { verifyRazorpayWebhookSignature } from "@/services/payments/razorpay";
import { markOrderPaid } from "@/services/orders";
import { adminDb } from "@/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { COLLECTIONS } from "@/types/firestore";

/**
 * Webhook endpoint to register in the Razorpay dashboard:
 *   {NEXT_PUBLIC_SITE_URL}/api/payments/webhook
 * Subscribe to: payment.captured, payment.failed, refund.processed
 *
 * This is the source of truth for payment state — the client-side
 * /api/payments/razorpay/verify route confirms the order quickly for a good
 * UX, but a dropped connection there shouldn't leave an order stuck unpaid;
 * this webhook is what guarantees eventual consistency even if the browser
 * tab closes mid-checkout.
 */
export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  if (!signature || !verifyRazorpayWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody);
  const eventType = event.event as string;

  if (eventType === "payment.captured") {
    const payment = event.payload.payment.entity;
    const orderId = payment.notes?.orderId ?? payment.order_id;
    await markOrderPaid(orderId, "razorpay", payment.id);
  }

  if (eventType === "payment.failed") {
    const payment = event.payload.payment.entity;
    const orderId = payment.notes?.orderId ?? payment.order_id;
    await adminDb
      .collection(COLLECTIONS.orders)
      .doc(orderId)
      .update({ paymentStatus: "failed", updatedAt: FieldValue.serverTimestamp() });
  }

  if (eventType === "refund.processed") {
    const refund = event.payload.refund.entity;
    await adminDb
      .collection(COLLECTIONS.orders)
      .doc(refund.notes?.orderId)
      .update({ paymentStatus: "refunded", updatedAt: FieldValue.serverTimestamp() });
  }

  return NextResponse.json({ ok: true });
}
