import { formatPrice } from "@/lib/utils";
import type { CartItem } from "@/types/firestore";

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number | null;
  tax: number;
}

export function OrderSummary({ items, subtotal, discount, shippingFee, tax }: OrderSummaryProps) {
  const total = subtotal - discount + (shippingFee ?? 0) + tax;

  return (
    <div className="bg-beige-light p-6 space-y-4">
      <h2 className="font-serif text-lg">Order Summary</h2>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {items.map((item) => (
          <div key={`${item.productId}-${item.variantId}`} className="flex justify-between text-sm">
            <span className="text-charcoal/70">
              {item.title} × {item.quantity}{" "}
              <span className="text-charcoal/40">({item.size})</span>
            </span>
            <span>{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-charcoal/10 pt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-charcoal/60">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-success">
            <span>Discount</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-charcoal/60">Shipping</span>
          <span>{shippingFee === null ? "—" : shippingFee === 0 ? "Free" : formatPrice(shippingFee)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-charcoal/60">Tax</span>
          <span>{formatPrice(tax)}</span>
        </div>
        <div className="flex justify-between font-serif text-lg pt-2 border-t border-charcoal/10">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}
