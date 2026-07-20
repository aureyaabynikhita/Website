"use client";

import Script from "next/script";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

declare global {
  interface Window {
    Cashfree: (options: { mode: "sandbox" | "production" }) => {
      checkout: (options: Record<string, unknown>) => void;
    };
  }
}

export function CashfreeCheckoutButton({ paymentSessionId }: { paymentSessionId: string }) {
  const [isProcessing, setIsProcessing] = useState(false);

  function openCheckout() {
    setIsProcessing(true);
    const cashfree = window.Cashfree({
      mode: process.env.NEXT_PUBLIC_CASHFREE_ENV === "PROD" ? "production" : "sandbox",
    });
    cashfree.checkout({
      paymentSessionId,
      redirectTarget: "_self", // Cashfree handles the redirect back to return_url set at order creation
    });
  }

  return (
    <>
      <Script src="https://sdk.cashfree.com/js/v3/cashfree.js" strategy="lazyOnload" />
      <Button className="w-full" size="lg" onClick={openCheckout} disabled={isProcessing}>
        {isProcessing ? "Redirecting..." : "Pay with Cashfree"}
      </Button>
    </>
  );
}
