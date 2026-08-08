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
    <div className="bg-ivory border border-charcoal/10 p-6 md:p-8 space-y-6 shadow-sm">
      <h2 className="font-serif text-xl text-charcoal border-b border-charcoal/10 pb-4 tracking-wide">Order Summary</h2>
      
      <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 divide-y divide-charcoal/5">
        {items.map((item) => (
          <div key={`${item.productId}-${item.variantId}`} className="flex gap-4 pt-4 first:pt-0 items-start">
            <div className="relative h-20 w-14 bg-charcoal/[0.03] border border-charcoal/5 shrink-0 overflow-hidden">
              {item.image ? (
                <img src={item.image} alt={item.title} className="object-cover w-full h-full" />
              ) : (
                <div className="w-full h-full bg-beige-light" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-serif text-sm text-charcoal truncate tracking-wide">{item.title}</p>
              <p className="text-xs text-charcoal/50 mt-1 uppercase tracking-wider font-semibold">
                Size: {item.size} {item.color !== "Default" && `· ${item.color}`}
              </p>
              <p className="text-xs text-charcoal/60 mt-1 font-medium font-sans">
                Qty: {item.quantity}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-sm font-medium text-charcoal font-sans">{formatPrice(item.price * item.quantity)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-charcoal/10 pt-4 space-y-3 text-sm">
        <div className="flex justify-between font-sans">
          <span className="text-charcoal/50">Subtotal</span>
          <span className="text-charcoal font-medium">{formatPrice(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-success font-medium">
            <span>Discount</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-charcoal/50">Shipping</span>
          <span className="text-success font-semibold tracking-wider text-xs uppercase">Free (Complimentary)</span>
        </div>
        <div className="flex justify-between font-sans">
          <span className="text-charcoal/50">Tax</span>
          <span className="text-charcoal font-medium">{formatPrice(tax)}</span>
        </div>
        
        <div className="flex justify-between font-serif text-lg pt-4 border-t border-charcoal/10 text-burgundy">
          <span>Total</span>
          <span className="font-sans font-bold">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}
