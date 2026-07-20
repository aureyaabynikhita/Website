import Razorpay from "razorpay";
import crypto from "crypto";

function getClient(): Razorpay {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
}

export async function createRazorpayOrder(amountInRupees: number, receiptId: string) {
  const client = getClient();
  return client.orders.create({
    amount: Math.round(amountInRupees * 100), // paise
    currency: "INR",
    receipt: receiptId,
  });
}

/** Verifies the signature Razorpay's checkout.js returns after a successful payment. */
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return expected === signature;
}

/** Verifies the signature on incoming Razorpay webhook payloads (different secret from checkout verification). */
export function verifyRazorpayWebhookSignature(rawBody: string, signature: string): boolean {
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest("hex");
  return expected === signature;
}
