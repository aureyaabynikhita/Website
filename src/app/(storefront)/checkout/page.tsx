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
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { ShieldCheck, Lock, Truck, Gift, CheckCircle2 } from "lucide-react";

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
    return (
      <div className="section-container section-spacing text-center py-24">
        <div className="animate-pulse space-y-3 max-w-sm mx-auto">
          <div className="h-6 w-32 bg-charcoal/10 mx-auto rounded" />
          <div className="h-4 w-48 bg-charcoal/5 mx-auto rounded" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="section-container section-spacing text-center py-24 max-w-md mx-auto space-y-6">
        <h1 className="font-serif text-3xl text-charcoal">Your Bag is Empty</h1>
        <p className="text-sm text-charcoal/60">Explore our exclusive collections and find pieces designed to last a lifetime.</p>
        <Button variant="outline" onClick={() => router.push("/")} className="w-full uppercase tracking-widest text-xs font-bold py-4">
          Discover The Collection
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
      toast.error("Checkout failed. Please try again.");
    }
  }

  async function placeOrder() {
    if (!address) return;
    if (!firebaseUid && !guestEmail) {
      toast.error("Please enter your email to continue.");
      return;
    }

    if (paymentMethod === "cod") {
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(otp);
      setUserEnteredOtp("");
      setOtpError("");
      toast.success(`[Verification SMS] Your COD confirmation code is: ${otp}`, { duration: 9000 });
      setIsOtpModalOpen(true);
    } else {
      await executeOrderCreation();
    }
  }

  return (
    <div className="section-container section-spacing">
      {/* Zara-Style Progress Steps */}
      <div className="max-w-4xl mx-auto mb-10 pb-6 border-b border-charcoal/10">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.15em] font-semibold text-charcoal/40">
          <div className={cn("flex items-center gap-2", step === "address" ? "text-burgundy font-bold" : "text-charcoal")}>
            <span className={cn("h-6 w-6 rounded-full flex items-center justify-center text-[10px]", step === "address" ? "bg-burgundy text-ivory" : "bg-charcoal/10 text-charcoal")}>
              01
            </span>
            <span>Shipping Details</span>
          </div>

          <div className="h-[1px] flex-1 mx-4 bg-charcoal/10" />

          <div className={cn("flex items-center gap-2", step === "payment" ? "text-burgundy font-bold" : "text-charcoal/40")}>
            <span className={cn("h-6 w-6 rounded-full flex items-center justify-center text-[10px]", step === "payment" ? "bg-burgundy text-ivory" : "bg-charcoal/10 text-charcoal")}>
              02
            </span>
            <span>Payment & Review</span>
          </div>

          <div className="h-[1px] flex-1 mx-4 bg-charcoal/10" />

          <div className="flex items-center gap-2 text-charcoal/30">
            <span className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] bg-charcoal/5">
              03
            </span>
            <span>Confirmation</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-10 lg:gap-14 max-w-6xl mx-auto items-start">
        {/* Main Form Area */}
        <div className="space-y-8">
          {step === "address" && (
            <div className="bg-ivory border border-charcoal/10 p-6 md:p-8 space-y-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-charcoal/10 pb-4">
                <h2 className="font-serif text-2xl text-charcoal">Delivery Address</h2>
                <div className="flex items-center gap-1.5 text-xs text-charcoal/60 font-medium">
                  <Lock size={13} className="text-gold-dark" />
                  <span>256-Bit SSL Encrypted</span>
                </div>
              </div>

              {!firebaseUid && (
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider font-semibold text-charcoal/70">
                    Contact Email (for invoice & tracking updates)
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full border border-charcoal/20 bg-transparent px-4 py-3 text-sm focus:border-burgundy focus:outline-none"
                  />
                </div>
              )}

              <AddressForm
                subtotal={subtotal}
                onValidAddress={(addr, ship) => {
                  setAddress(addr);
                  setShipping(ship);
                  setStep("payment");
                }}
              />
            </div>
          )}

          {step === "payment" && address && (
            <div className="space-y-6">
              {/* Delivery Address Summary Card */}
              <div className="bg-beige/40 border border-charcoal/10 p-5 flex items-start justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-charcoal/50 font-bold mb-1">Delivering To</p>
                  <p className="font-serif text-base text-charcoal font-medium">{address.label}</p>
                  <p className="text-xs text-charcoal/70 mt-0.5">
                    {address.line1}, {address.city}, {address.state} — {address.pincode}
                  </p>
                  <p className="text-xs text-charcoal/60 mt-0.5">Phone: {address.phone}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep("address")}
                  className="text-xs text-burgundy hover:text-burgundy-light font-semibold uppercase tracking-wider underline underline-offset-4"
                >
                  Change
                </button>
              </div>

              {/* Coupon Code Section */}
              <div className="bg-ivory border border-charcoal/10 p-6 shadow-xs">
                <h3 className="text-xs uppercase tracking-widest font-semibold text-charcoal/80 mb-3">
                  Have a Promotional Code?
                </h3>
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

              {/* Luxury Gift Options */}
              <div className="bg-ivory border border-charcoal/10 p-6 space-y-3 shadow-xs">
                <label className="flex items-center gap-3 cursor-pointer text-sm font-medium text-charcoal">
                  <input
                    type="checkbox"
                    checked={giftWrap}
                    onChange={(e) => setGiftWrap(e.target.checked)}
                    className="accent-burgundy h-4 w-4"
                  />
                  <span className="flex items-center gap-1.5">
                    <Gift size={16} className="text-gold-dark" /> Complimentary Heirloom Gift Packaging
                  </span>
                </label>
                {giftWrap && (
                  <textarea
                    rows={3}
                    placeholder="Add a personalized handwritten message for the recipient..."
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                    className="w-full border border-charcoal/20 bg-transparent p-3 text-sm focus:border-burgundy focus:outline-none"
                  />
                )}
              </div>

              {/* Payment Method Selection */}
              <div className="bg-ivory border border-charcoal/10 p-6 md:p-8 space-y-6 shadow-xs">
                <h3 className="font-serif text-xl text-charcoal border-b border-charcoal/10 pb-4">
                  Select Payment Method
                </h3>

                <div className="space-y-3">
                  {/* Razorpay Online */}
                  <label
                    className={cn(
                      "flex items-start gap-4 p-4 border cursor-pointer transition-all duration-200",
                      paymentMethod === "razorpay"
                        ? "border-burgundy bg-burgundy/[0.03] ring-1 ring-burgundy"
                        : "border-charcoal/15 hover:border-charcoal/40"
                    )}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "razorpay"}
                      onChange={() => setPaymentMethod("razorpay")}
                      className="accent-burgundy mt-1"
                    />
                    <div className="flex-1">
                      <p className="font-serif text-sm font-medium text-charcoal">Online Payment (Recommended)</p>
                      <p className="text-xs text-charcoal/60 mt-0.5">
                        Instant confirmation via UPI, Cards, Netbanking, Google Pay, Apple Pay
                      </p>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label
                    className={cn(
                      "flex items-start gap-4 p-4 border transition-all duration-200",
                      !firebaseUid
                        ? "border-charcoal/10 opacity-50 cursor-not-allowed bg-charcoal/[0.02]"
                        : paymentMethod === "cod"
                        ? "border-burgundy bg-burgundy/[0.03] ring-1 ring-burgundy cursor-pointer"
                        : "border-charcoal/15 hover:border-charcoal/40 cursor-pointer"
                    )}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      disabled={!firebaseUid}
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="accent-burgundy mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-serif text-sm font-medium text-charcoal">Cash on Delivery (COD)</p>
                        {!firebaseUid && (
                          <span className="text-[9px] bg-charcoal/10 text-charcoal px-2 py-0.5 uppercase tracking-wider font-bold">
                            Login Required
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-charcoal/60 mt-0.5">
                        Pay upon physical delivery. Verified via phone OTP.
                      </p>
                    </div>
                  </label>
                </div>

                {!razorpayData && (
                  <Button
                    className="w-full py-4 text-xs uppercase tracking-[0.2em] font-bold bg-burgundy text-ivory hover:bg-burgundy-dark shadow-md"
                    size="lg"
                    onClick={placeOrder}
                    disabled={isPlacingOrder}
                  >
                    {isPlacingOrder ? "Processing Order..." : paymentMethod === "cod" ? "Verify & Place COD Order" : "Proceed to Secure Payment"}
                  </Button>
                )}

                {razorpayData && (
                  <div className="pt-2">
                    <RazorpayCheckoutButton
                      orderId={razorpayData.orderId}
                      gatewayOrderId={razorpayData.gatewayOrderId}
                      amount={razorpayData.amount}
                      keyId={razorpayData.keyId}
                      customerName={profile?.displayName ?? "AUREYAA Customer"}
                      customerEmail={profile?.email ?? guestEmail}
                      customerPhone={address.phone}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Order Summary */}
        <div className="sticky top-28">
          <OrderSummary
            items={items}
            subtotal={subtotal}
            discount={discount}
            shippingFee={shipping?.fee ?? null}
            tax={tax}
          />

          <div className="mt-4 p-4 bg-beige/30 border border-charcoal/10 space-y-2.5 text-xs text-charcoal/70">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-gold-dark shrink-0" />
              <span>100% Authentic Heirloom Quality Guaranteed</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck size={16} className="text-gold-dark shrink-0" />
              <span>Complimentary insured shipping on all orders</span>
            </div>
          </div>
        </div>
      </div>

      {/* COD OTP Modal */}
      {isOtpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/70 backdrop-blur-xs animate-fade-in">
          <div className="fixed inset-0" onClick={() => setIsOtpModalOpen(false)} />
          
          <div className="relative bg-ivory max-w-md w-full p-8 shadow-2xl z-10 border border-charcoal/10 text-center space-y-6">
            <div className="space-y-2">
              <h3 className="font-serif text-2xl text-charcoal">Confirm Cash on Delivery</h3>
              <p className="text-xs text-charcoal/60 leading-relaxed">
                Enter the 4-digit code sent to <strong className="text-charcoal font-sans">{address?.phone}</strong> to confirm your order.
              </p>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                maxLength={4}
                placeholder="• • • •"
                value={userEnteredOtp}
                onChange={(e) => {
                  setUserEnteredOtp(e.target.value.replace(/\D/g, ""));
                  setOtpError("");
                }}
                className="w-full text-center border border-charcoal/20 bg-transparent px-4 py-3.5 text-2xl font-mono focus:border-burgundy focus:outline-none tracking-[0.5em]"
              />
              {otpError && <p className="text-xs text-error font-medium">{otpError}</p>}
            </div>

            <div className="flex gap-3">
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
                    setOtpError("Invalid verification code. Please enter the correct code.");
                  }
                }}
                className="flex-1 py-3 text-center bg-burgundy text-ivory text-xs font-bold uppercase tracking-wider hover:bg-burgundy-dark transition-all shadow-sm"
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
