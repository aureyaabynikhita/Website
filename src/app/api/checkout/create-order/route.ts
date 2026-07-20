import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { checkoutSchema } from "@/lib/validations/checkout";
import { createOrder, confirmCodOrder } from "@/services/orders";
import { createRazorpayOrder } from "@/services/payments/razorpay";
import { createCashfreeOrder } from "@/services/payments/cashfree";

export async function POST(request: Request) {
  const session = await getServerSession();
  const body = await request.json();
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  if (!session && !data.guestEmail) {
    return NextResponse.json({ error: "Guest checkout requires an email" }, { status: 400 });
  }

  try {
    const order = await createOrder({
      userId: session?.uid ?? null,
      guestEmail: session ? undefined : data.guestEmail,
      items: data.items,
      shippingAddress: data.shippingAddress as any,
      couponCode: data.couponCode,
      giftNote: data.giftNote,
      isGiftWrapped: data.isGiftWrapped,
      paymentMethod: data.paymentMethod,
    });

    // COD needs no payment gateway step — confirm immediately.
    if (data.paymentMethod === "cod" || data.paymentMethod === "partial_cod") {
      await confirmCodOrder(order.orderId);
      return NextResponse.json({ ok: true, orderId: order.orderId, requiresPayment: false });
    }

    if (data.paymentMethod === "razorpay") {
      const rzpOrder = await createRazorpayOrder(order.total, order.orderId);
      return NextResponse.json({
        ok: true,
        orderId: order.orderId,
        requiresPayment: true,
        gateway: "razorpay",
        gatewayOrderId: rzpOrder.id,
        amount: order.total,
        keyId: process.env.RAZORPAY_KEY_ID,
      });
    }

    if (data.paymentMethod === "cashfree") {
      const cfOrder = await createCashfreeOrder({
        orderId: order.orderId,
        amount: order.total,
        customerId: session?.uid ?? `guest-${Date.now()}`,
        customerPhone: data.shippingAddress.phone,
        customerEmail: data.guestEmail ?? session?.profile?.email ?? "",
        returnUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/confirmation/${order.orderId}`,
      });
      return NextResponse.json({
        ok: true,
        orderId: order.orderId,
        requiresPayment: true,
        gateway: "cashfree",
        paymentSessionId: cfOrder.payment_session_id,
      });
    }

    return NextResponse.json({ error: "Unsupported payment method" }, { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
