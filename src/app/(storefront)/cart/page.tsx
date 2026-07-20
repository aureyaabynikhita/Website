"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { cartSubtotal } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export default function CartPage() {
  const { items, isLoading, updateQuantity } = useCart();

  if (isLoading) {
    return <div className="section-container section-spacing text-center text-charcoal/50">Loading your bag...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="section-container section-spacing text-center">
        <h1 className="font-serif text-display-sm text-charcoal mb-4">Your Bag is Empty</h1>
        <Link href="/">
          <Button variant="outline">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  const subtotal = cartSubtotal(items);

  return (
    <div className="section-container section-spacing">
      <h1 className="font-serif text-display-sm text-charcoal mb-10">Your Bag</h1>

      <div className="grid md:grid-cols-[1fr_320px] gap-12">
        <div className="space-y-6">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.variantId}`}
              className="flex gap-4 border-b border-charcoal/10 pb-6"
            >
              <div className="relative h-28 w-20 bg-beige shrink-0">
                {item.image && <Image src={item.image} alt={item.title} fill className="object-cover" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <div>
                    <Link href={`/product/${item.slug}`} className="font-serif text-lg hover:text-burgundy">
                      {item.title}
                    </Link>
                    <p className="text-sm text-charcoal/50 mt-1">
                      Size: {item.size} {item.color !== "Default" && `· ${item.color}`}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label="Remove item"
                    onClick={() => updateQuantity(item.productId, item.variantId, 0)}
                    className="text-charcoal/40 hover:text-error"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border border-charcoal/20">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                      className="p-2"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="px-3 text-sm">{item.quantity}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                      className="p-2"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <p className="text-sm">{formatPrice(item.price * item.quantity)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-beige-light p-6 h-fit">
          <h2 className="font-serif text-lg mb-4">Order Summary</h2>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-charcoal/60">Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <p className="text-xs text-charcoal/50 mb-6">Shipping and taxes calculated at checkout.</p>
          <Link href="/checkout">
            <Button className="w-full" size="lg">
              Proceed to Checkout
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
