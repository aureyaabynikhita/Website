import { NextResponse } from "next/server";
import { verifyRazorpaySignature } from "@/services/payments/razorpay";
import { markOrderPaid } from "@/services/orders";

export async function POST(request: Request) {
  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    await request.json();

  const isValid = verifyRazorpaySignature(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  );
  if (!isValid) {
    return NextResponse.json({ error: "Signature verification failed" }, { status: 400 });
  }

  await markOrderPaid(orderId, "razorpay", razorpay_payment_id);
  return NextResponse.json({ ok: true });
}
