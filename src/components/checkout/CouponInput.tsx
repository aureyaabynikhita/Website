"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";

interface CouponInputProps {
  subtotal: number;
  onApplied: (code: string, discount: number) => void;
  onRemoved: () => void;
}

export function CouponInput({ subtotal, onApplied, onRemoved }: CouponInputProps) {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<
    { state: "idle" } | { state: "checking" } | { state: "applied"; discount: number } | { state: "error"; message: string }
  >({ state: "idle" });

  async function applyCoupon() {
    if (!code.trim()) return;
    setStatus({ state: "checking" });
    const res = await fetch("/api/checkout/validate-coupon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, subtotal }),
    });
    const data = await res.json();
    if (data.valid) {
      setStatus({ state: "applied", discount: data.discount });
      onApplied(code.toUpperCase(), data.discount);
    } else {
      setStatus({ state: "error", message: data.reason ?? "Invalid coupon" });
    }
  }

  function remove() {
    setStatus({ state: "idle" });
    setCode("");
    onRemoved();
  }

  if (status.state === "applied") {
    return (
      <div className="flex items-center justify-between text-sm bg-success/10 text-success px-4 py-3">
        <span>Coupon "{code.toUpperCase()}" applied — ₹{status.discount} off</span>
        <button type="button" onClick={remove} className="underline">
          Remove
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-2">
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Coupon code"
          className="flex-1"
        />
        <button
          type="button"
          onClick={applyCoupon}
          disabled={status.state === "checking"}
          className="px-4 border border-charcoal/20 text-xs uppercase tracking-wide hover:border-charcoal"
        >
          {status.state === "checking" ? "Checking..." : "Apply"}
        </button>
      </div>
      {status.state === "error" && <p className="mt-1 text-xs text-error">{status.message}</p>}
    </div>
  );
}
