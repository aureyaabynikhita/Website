import Razorpay from "razorpay";
import crypto from "crypto";

function getClient(): Razorpay {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  
  if (!key_id || !key_secret) {
    console.error("CRITICAL: Razorpay environment variables are undefined! Please make sure .env is populated and restart the Next.js server.", {
      RAZORPAY_KEY_ID: key_id || "MISSING",
      RAZORPAY_KEY_SECRET: key_secret ? "PRESENT" : "MISSING"
    });
  }

  return new Razorpay({
    key_id: key_id!,
    key_secret: key_secret!,
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
