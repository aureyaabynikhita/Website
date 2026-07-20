import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { getOrderById } from "@/services/orders";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await getOrderById(orderId);
  if (!order) notFound();

  const isPaid = order.paymentStatus === "paid" || order.paymentMethod === "cod";

  return (
    <div className="section-container section-spacing max-w-2xl mx-auto text-center">
      {isPaid ? (
        <>
          <CheckCircle2 className="mx-auto text-success mb-4" size={48} />
          <h1 className="font-serif text-display-sm text-charcoal mb-2">Order Confirmed</h1>
          <p className="text-charcoal/60 mb-8">
            Thank you — your order <strong>{order.orderNumber}</strong> has been placed.
            {order.paymentMethod === "cod" && " You'll pay on delivery."}
          </p>
        </>
      ) : (
        <>
          <h1 className="font-serif text-display-sm text-charcoal mb-2">Payment Pending</h1>
          <p className="text-charcoal/60 mb-8">
            We're still confirming payment for order <strong>{order.orderNumber}</strong>. This
            page will update once it's verified — refresh in a moment.
          </p>
        </>
      )}

      <div className="bg-beige-light p-6 text-left mb-8">
        <h2 className="font-serif text-lg mb-4">Order Summary</h2>
        {order.items.map((item) => (
          <div key={`${item.productId}-${item.variantId}`} className="flex justify-between text-sm mb-2">
            <span>
              {item.title} × {item.quantity} ({item.size})
            </span>
            <span>{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
        <div className="border-t border-charcoal/10 mt-4 pt-4 flex justify-between font-serif text-lg">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>
        <p className="text-xs text-charcoal/50 mt-4">
          Shipping to: {order.shippingAddress.line1}, {order.shippingAddress.city},{" "}
          {order.shippingAddress.state} {order.shippingAddress.pincode}
        </p>
      </div>

      <Link href="/">
        <Button variant="outline">Continue Shopping</Button>
      </Link>
    </div>
  );
}
