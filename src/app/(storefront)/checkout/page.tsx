"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { cartSubtotal } from "@/store/cartStore";
import { AddressForm, type CheckoutAddress } from "@/components/checkout/AddressForm";
import { CouponInput } from "@/components/checkout/CouponInput";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { RazorpayCheckoutButton } from "@/components/checkout/RazorpayCheckoutButton";
import { CashfreeCheckoutButton } from "@/components/checkout/CashfreeCheckoutButton";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type PaymentMethod = "razorpay" | "cashfree" | "cod";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, isLoading: cartLoading } = useCart();
  const { profile, firebaseUid } = useAuth();

  const [step, setStep] = useState<"address" | "payment">("address");
  const [address, setAddress] = useState<CheckoutAddress | null>(null);
  const [shipping, setShipping] = useState<{ fee: number; days: number } | null>(null);
  const [guestEmail, setGuestEmail] = useState("");
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [giftWrap, setGiftWrap] = useState(false);
  const [giftNote, setGiftNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("razorpay");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [razorpayData, setRazorpayData] = useState<{
    orderId: string;
    gatewayOrderId: string;
    amount: number;
    keyId: string;
  } | null>(null);
  const [cashfreeSessionId, setCashfreeSessionId] = useState<string | null>(null);

  const subtotal = cartSubtotal(items);
  const tax = Math.round((subtotal - discount) * 0.05);

  if (cartLoading) {
    return <div className="section-container section-spacing text-center text-charcoal/50">Loading...</div>;
  }
  if (items.length === 0) {
    return (
      <div className="section-container section-spacing text-center">
        <h1 className="font-serif text-display-sm text-charcoal mb-4">Your bag is empty</h1>
        <Button variant="outline" onClick={() => router.push("/")}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  async function placeOrder() {
    if (!address) return;
    if (!firebaseUid && !guestEmail) {
      toast.error("Enter an email to continue as guest, or sign in.");
      return;
    }

    setIsPlacingOrder(true);
    const res = await fetch("/api/checkout/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        guestEmail: firebaseUid ? undefined : guestEmail,
        items,
        shippingAddress: { ...address, country: "India" },
        couponCode: couponCode ?? undefined,
        giftNote: giftWrap ? giftNote : undefined,
        isGiftWrapped: giftWrap,
        paymentMethod,
      }),
    });
    const data = await res.json();
    setIsPlacingOrder(false);

    if (!res.ok) {
      toast.error(data.error?.formErrors?.[0] ?? data.error ?? "Couldn't place order.");
      return;
    }

    if (!data.requiresPayment) {
      router.push(`/checkout/confirmation/${data.orderId}`);
      return;
    }

    if (data.gateway === "razorpay") {
      setRazorpayData({
        orderId: data.orderId,
        gatewayOrderId: data.gatewayOrderId,
        amount: data.amount,
        keyId: data.keyId,
      });
    }
    if (data.gateway === "cashfree") {
      setCashfreeSessionId(data.paymentSessionId);
    }
  }

  return (
    <div className="section-container section-spacing">
      <h1 className="font-serif text-display-sm text-charcoal mb-10">Checkout</h1>

      <div className="grid md:grid-cols-[1fr_380px] gap-12">
        <div className="space-y-8">
          {step === "address" && (
            <>
              {!firebaseUid && (
                <Input
                  label="Email (for order updates)"
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                />
              )}
              <div>
                <h2 className="text-xs tracking-[0.15em] uppercase text-charcoal/60 mb-4">
                  Shipping Address
                </h2>
                <AddressForm
                  subtotal={subtotal}
                  onValidAddress={(addr, ship) => {
                    setAddress(addr);
                    setShipping(ship);
                    setStep("payment");
                  }}
                />
              </div>
            </>
          )}

          {step === "payment" && address && (
            <div className="space-y-8">
              <button
                type="button"
                onClick={() => setStep("address")}
                className="text-xs text-charcoal/50 hover:text-burgundy"
              >
                ← Edit address
              </button>

              <div>
                <h2 className="text-xs tracking-[0.15em] uppercase text-charcoal/60 mb-4">Coupon</h2>
                <CouponInput
                  subtotal={subtotal}
                  onApplied={(code, disc) => {
                    setCouponCode(code);
                    setDiscount(disc);
                  }}
                  onRemoved={() => {
                    setCouponCode(null);
                    setDiscount(0);
                  }}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm mb-3">
                  <input
                    type="checkbox"
                    checked={giftWrap}
                    onChange={(e) => setGiftWrap(e.target.checked)}
                  />
                  Gift wrap this order
                </label>
                {giftWrap && (
                  <textarea
                    rows={3}
                    placeholder="Add a gift note (optional)"
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                    className="w-full border border-charcoal/20 bg-transparent p-3 text-sm focus:border-burgundy focus:outline-none"
                  />
                )}
              </div>

              <div>
                <h2 className="text-xs tracking-[0.15em] uppercase text-charcoal/60 mb-4">
                  Payment Method
                </h2>
                <div className="space-y-2">
                  {(
                    [
                      { id: "razorpay", label: "Razorpay (Cards, UPI, Netbanking, Wallets)" },
                      { id: "cashfree", label: "Cashfree" },
                      { id: "cod", label: "Cash on Delivery", disabled: shipping ? !shipping : false },
                    ] as const
                  ).map((opt) => (
                    <label key={opt.id} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === opt.id}
                        onChange={() => setPaymentMethod(opt.id as PaymentMethod)}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              {!razorpayData && !cashfreeSessionId && (
                <Button
                  className="w-full"
                  size="lg"
                  onClick={placeOrder}
                  disabled={isPlacingOrder}
                >
                  {isPlacingOrder ? "Placing Order..." : "Place Order"}
                </Button>
              )}

              {razorpayData && (
                <RazorpayCheckoutButton
                  orderId={razorpayData.orderId}
                  gatewayOrderId={razorpayData.gatewayOrderId}
                  amount={razorpayData.amount}
                  keyId={razorpayData.keyId}
                  customerName={profile?.displayName ?? "AUREYAA Customer"}
                  customerEmail={profile?.email ?? guestEmail}
                  customerPhone={address.phone}
                />
              )}
              {cashfreeSessionId && <CashfreeCheckoutButton paymentSessionId={cashfreeSessionId} />}
            </div>
          )}
        </div>

        <OrderSummary
          items={items}
          subtotal={subtotal}
          discount={discount}
          shippingFee={shipping?.fee ?? null}
          tax={tax}
        />
      </div>
    </div>
  );
}
