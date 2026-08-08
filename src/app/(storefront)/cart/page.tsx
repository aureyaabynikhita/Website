"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { cartSubtotal } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export default function CartPage() {
  const { items, isLoading, updateQuantity } = useCart();

  if (isLoading) {
    return (
      <div className="section-container section-spacing text-center py-20">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-32 bg-charcoal/5 mx-auto rounded" />
          <div className="h-20 w-full max-w-lg bg-charcoal/5 mx-auto rounded" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="section-container section-spacing text-center py-24 max-w-md mx-auto space-y-6">
        <div className="h-16 w-16 bg-charcoal/[0.02] border border-charcoal/10 rounded-full flex items-center justify-center mx-auto text-charcoal/40">
          <ShoppingBag size={24} />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-2xl md:text-3xl text-charcoal">Your Bag is Empty</h1>
          <p className="text-sm text-charcoal/50">Explore our exclusive collections and find pieces designed to last a lifetime.</p>
        </div>
        <Link href="/" className="block">
          <Button variant="outline" className="w-full uppercase tracking-widest text-xs font-bold py-4">
            Shop New Arrivals
          </Button>
        </Link>
      </div>
    );
  }

  const subtotal = cartSubtotal(items);

  return (
    <div className="section-container section-spacing">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-serif text-display-xs md:text-display-sm text-charcoal mb-10 tracking-wide border-b border-charcoal/10 pb-4">
          Your Bag
        </h1>

        <div className="grid lg:grid-cols-[1fr_360px] gap-12 items-start">
          {/* Cart Items List */}
          <div className="space-y-6">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.variantId}`}
                className="flex gap-6 border border-charcoal/5 bg-charcoal/[0.01] p-5 relative transition-all hover:bg-charcoal/[0.02]"
              >
                {/* Product Image */}
                <Link href={`/product/${item.slug}`} className="relative h-32 w-24 bg-charcoal/[0.03] shrink-0 border border-charcoal/10 overflow-hidden">
                  {item.image ? (
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-beige-light" />
                  )}
                </Link>
                
                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <Link href={`/product/${item.slug}`} className="font-serif text-lg text-charcoal hover:text-burgundy transition-colors leading-tight">
                          {item.title}
                        </Link>
                        <p className="text-xs text-charcoal/50 mt-1 uppercase tracking-wider font-semibold">
                          Size: {item.size} {item.color !== "Default" && `· ${item.color}`}
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-label="Remove item"
                        onClick={() => updateQuantity(item.productId, item.variantId, 0)}
                        className="text-charcoal/30 hover:text-burgundy transition-colors p-1"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-charcoal/20 bg-ivory">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                        className="p-2 px-3 text-charcoal/60 hover:text-burgundy hover:bg-charcoal/5 transition-colors"
                      >
                        <Minus size={10} />
                      </button>
                      <span className="px-2 text-xs font-semibold font-sans w-6 text-center text-charcoal">{item.quantity}</span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                        className="p-2 px-3 text-charcoal/60 hover:text-burgundy hover:bg-charcoal/5 transition-colors"
                      >
                        <Plus size={10} />
                      </button>
                    </div>
                    
                    {/* Price */}
                    <p className="text-sm font-semibold font-sans text-charcoal">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary Panel */}
          <div className="bg-ivory border border-charcoal/10 p-6 md:p-8 space-y-6 shadow-sm sticky top-32">
            <h2 className="font-serif text-xl border-b border-charcoal/10 pb-3 tracking-wide text-charcoal">Order Summary</h2>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between font-sans">
                <span className="text-charcoal/50">Subtotal</span>
                <span className="text-charcoal font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal/50">Shipping</span>
                <span className="text-success font-semibold tracking-wider text-xs uppercase">Free (Complimentary)</span>
              </div>
            </div>

            <div className="border-t border-charcoal/10 pt-4 space-y-4">
              <p className="text-xs text-charcoal/50 leading-relaxed">
                Taxes & delivery details will be processed at checkout.
              </p>
              
              <Link href="/checkout" className="block">
                <Button className="w-full py-4 text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2" size="lg">
                  Proceed to Checkout
                  <ArrowRight size={14} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
