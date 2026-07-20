import Link from "next/link";
import { getAllOrdersForAdmin } from "@/services/admin/orders";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await getAllOrdersForAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl text-charcoal">Orders</h1>
        <p className="text-sm text-charcoal/50 mt-1">{orders.length} total</p>
      </div>

      <div className="bg-ivory border border-charcoal/10 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-charcoal/10 text-left text-xs uppercase tracking-wide text-charcoal/50">
              <th className="p-4">Order #</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Items</th>
              <th className="p-4">Total</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-charcoal/5">
                <td className="p-4 font-medium">
                  <Link href={`/admin/orders/${o.id}`} className="hover:text-burgundy hover:underline">
                    {o.orderNumber}
                  </Link>
                </td>
                <td className="p-4 text-charcoal/60">{o.guestEmail ?? o.userId ?? "—"}</td>
                <td className="p-4">{o.items.length}</td>
                <td className="p-4">{formatPrice(o.total)}</td>
                <td className="p-4 capitalize">{o.paymentStatus}</td>
                <td className="p-4">
                  <OrderStatusSelect orderId={o.id} status={o.status} />
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-charcoal/40">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
