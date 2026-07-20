import { notFound } from "next/navigation";
import { getOrderById } from "@/services/admin/orders";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { CreateShipmentButton } from "@/components/admin/CreateShipmentButton";
import { formatPrice } from "@/lib/utils";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-charcoal">Order {order.orderNumber}</h1>
        <OrderStatusSelect orderId={order.id} status={order.status} />
      </div>

      <div className="bg-ivory border border-charcoal/10 p-6 space-y-3">
        {order.items.map((item) => (
          <div key={`${item.productId}-${item.variantId}`} className="flex justify-between text-sm">
            <span>
              {item.title} × {item.quantity} ({item.size})
            </span>
            <span>{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
        <div className="border-t border-charcoal/10 pt-3 flex justify-between font-medium">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>

      <div className="bg-ivory border border-charcoal/10 p-6">
        <h2 className="text-xs uppercase tracking-wide text-charcoal/50 mb-3">Shipping Address</h2>
        <p className="text-sm text-charcoal/80">
          {order.shippingAddress.line1}, {order.shippingAddress.line2}
          <br />
          {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
          <br />
          Phone: {order.shippingAddress.phone}
        </p>
      </div>

      <div className="bg-ivory border border-charcoal/10 p-6 flex items-center justify-between">
        <div>
          <h2 className="text-xs uppercase tracking-wide text-charcoal/50 mb-1">Shipment</h2>
          <p className="text-sm text-charcoal/70">
            {order.awbNumber ? `AWB: ${order.awbNumber} (${order.courierPartner})` : "Not yet shipped"}
          </p>
        </div>
        {order.paymentStatus === "paid" || order.paymentMethod === "cod" ? (
          <CreateShipmentButton orderId={order.id} hasAwb={Boolean(order.awbNumber)} />
        ) : (
          <span className="text-xs text-charcoal/40">Waiting for payment confirmation</span>
        )}
      </div>
    </div>
  );
}
