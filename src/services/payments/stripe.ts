import Stripe from "stripe";

let stripeClient: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2024-09-30.acacia" as any,
    });
  }
  return stripeClient;
}

export async function createStripePaymentIntent(amountInRupees: number, orderId: string) {
  const stripe = getStripe();
  return stripe.paymentIntents.create({
    amount: Math.round(amountInRupees * 100),
    currency: "inr",
    metadata: { orderId },
  });
}

export function constructStripeWebhookEvent(rawBody: string | Buffer, signature: string) {
  const stripe = getStripe();
  return stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET!);
}
