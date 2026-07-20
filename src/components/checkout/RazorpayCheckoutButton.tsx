"use client";

import Script from "next/script";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/Button";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

interface RazorpayCheckoutButtonProps {
  orderId: string;
  gatewayOrderId: string;
  amount: number;
  keyId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export function RazorpayCheckoutButton({
  orderId,
  gatewayOrderId,
  amount,
  keyId,
  customerName,
  customerEmail,
  customerPhone,
}: RazorpayCheckoutButtonProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  function openCheckout() {
    setIsProcessing(true);
    const rzp = new window.Razorpay({
      key: keyId,
      amount: Math.round(amount * 100),
      currency: "INR",
      name: "AUREYAA",
      description: "Order payment",
      order_id: gatewayOrderId,
      prefill: { name: customerName, email: customerEmail, contact: customerPhone },
      theme: { color: "#5A1F2F" },
      handler: async (response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) => {
        const verifyRes = await fetch("/api/payments/razorpay/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, ...response }),
        });
        if (verifyRes.ok) {
          router.push(`/checkout/confirmation/${orderId}`);
        } else {
          toast.error("Payment verification failed. Contact support if the amount was deducted.");
        }
        setIsProcessing(false);
      },
      modal: {
        ondismiss: () => setIsProcessing(false),
      },
    });
    rzp.open();
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <Button className="w-full" size="lg" onClick={openCheckout} disabled={isProcessing}>
        {isProcessing ? "Processing..." : "Pay with Razorpay"}
      </Button>
    </>
  );
}
