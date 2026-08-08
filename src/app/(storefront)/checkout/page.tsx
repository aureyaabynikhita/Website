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
import { cn } from "@/lib/utils";

type PaymentMethod = "razorpay" | "cod";

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
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [userEnteredOtp, setUserEnteredOtp] = useState("");
  const [otpError, setOtpError] = useState("");

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

  async function executeOrderCreation() {
    setIsPlacingOrder(true);
    try {
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
    } catch (err) {
      setIsPlacingOrder(false);
      toast.error("Checkout failed");
    }
  }

  async function placeOrder() {
    if (!address) return;
    if (!firebaseUid && !guestEmail) {
      toast.error("Enter an email to continue as guest, or sign in.");
      return;
    }

    if (paymentMethod === "cod") {
      // Generate a random 4-digit code
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(otp);
      setUserEnteredOtp("");
      setOtpError("");
      
      // Simulate SMS transmission via a prominent toast alert
      toast.success(`[SMS Gateway] Order Verification OTP is: ${otp}`, { duration: 9000 });
      setIsOtpModalOpen(true);
    } else {
      await executeOrderCreation();
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
                      { id: "razorpay", label: "Razorpay (Cards, UPI, Netbanking, Wallets)", disabled: false },
                      { id: "cod", label: "Cash on Delivery", disabled: !firebaseUid || (shipping ? !shipping : false) },
                    ] as const
                  ).map((opt) => (
                    <label key={opt.id} className={cn("flex items-center gap-2 text-sm cursor-pointer", opt.disabled && "opacity-50 cursor-not-allowed")}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        disabled={opt.disabled}
                        checked={paymentMethod === opt.id}
                        onChange={() => setPaymentMethod(opt.id as PaymentMethod)}
                      />
                      <span>{opt.label}</span>
                      {opt.id === "cod" && !firebaseUid && (
                        <span className="text-[10px] bg-burgundy/10 text-burgundy px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                          Login Required
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {!razorpayData && (
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
      {/* OTP Verification Modal */}
      {isOtpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-xs">
          <div className="fixed inset-0" onClick={() => setIsOtpModalOpen(false)} />
          
          <div className="relative bg-ivory max-w-md w-full p-8 shadow-2xl z-10 border border-charcoal/10 text-center space-y-6">
            <div className="space-y-2">
              <h3 className="font-serif text-2xl text-charcoal">Verify Your Order</h3>
              <p className="text-xs text-charcoal/60 leading-relaxed">
                To confirm your Cash on Delivery request, please enter the 4-digit code sent to <strong className="text-charcoal font-sans">{address?.phone}</strong>.
              </p>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                maxLength={4}
                placeholder="Enter 4-Digit OTP"
                value={userEnteredOtp}
                onChange={(e) => {
                  setUserEnteredOtp(e.target.value.replace(/\D/g, ""));
                  setOtpError("");
                }}
                className="w-full text-center border border-charcoal/20 bg-transparent px-4 py-3 text-lg font-mono focus:border-burgundy focus:outline-none tracking-widest"
              />
              {otpError && <p className="text-xs text-error font-medium">{otpError}</p>}
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setIsOtpModalOpen(false)}
                className="flex-1 py-3 text-center border border-charcoal/20 text-xs font-bold uppercase tracking-wider hover:border-charcoal transition-all text-charcoal"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (userEnteredOtp === generatedOtp) {
                    setIsOtpModalOpen(false);
                    await executeOrderCreation();
                  } else {
                    setOtpError("Invalid verification code. Please enter the correct OTP.");
                  }
                }}
                className="flex-1 py-3 text-center bg-burgundy text-ivory text-xs font-bold uppercase tracking-wider hover:bg-burgundy/90 transition-all shadow-sm"
              >
                Verify & Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
