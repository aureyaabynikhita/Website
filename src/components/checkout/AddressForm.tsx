"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { checkoutAddressSchema } from "@/lib/validations/checkout";
import type { z } from "zod";
import { Input } from "@/components/ui/Input";

export type CheckoutAddress = z.infer<typeof checkoutAddressSchema>;

interface AddressFormProps {
  onValidAddress: (address: CheckoutAddress, shipping: { fee: number; days: number }) => void;
  subtotal: number;
}

export function AddressForm({ onValidAddress, subtotal }: AddressFormProps) {
  const [pincodeStatus, setPincodeStatus] = useState<
    { checked: false } | { checked: true; serviceable: boolean; fee: number; days: number }
  >({ checked: false });
  const [isCheckingPincode, setIsCheckingPincode] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutAddress>({ resolver: zodResolver(checkoutAddressSchema) });

  const pincode = watch("pincode");

  async function checkPincode() {
    if (!/^\d{6}$/.test(pincode ?? "")) return;
    setIsCheckingPincode(true);
    const res = await fetch("/api/shipping/pincode-check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pincode, subtotal }),
    });
    const data = await res.json();
    setIsCheckingPincode(false);
    setPincodeStatus({
      checked: true,
      serviceable: data.isServiceable,
      fee: data.shippingFee ?? 0,
      days: data.estimatedDays ?? 6,
    });
  }

  function onSubmit(data: CheckoutAddress) {
    if (!pincodeStatus.checked || !pincodeStatus.serviceable) return;
    onValidAddress(data, { fee: pincodeStatus.fee, days: pincodeStatus.days });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Full Name / Label" placeholder="Home" {...register("label")} />
      <Input label="Address Line 1" error={errors.line1?.message} {...register("line1")} />
      <Input label="Address Line 2 (optional)" {...register("line2")} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="City" error={errors.city?.message} {...register("city")} />
        <Input label="State" error={errors.state?.message} {...register("state")} />
      </div>
      <div className="grid grid-cols-2 gap-4 items-end">
        <Input label="Pincode" error={errors.pincode?.message} {...register("pincode")} />
        <button
          type="button"
          onClick={checkPincode}
          disabled={isCheckingPincode}
          className="text-xs uppercase tracking-wide text-burgundy hover:underline pb-3"
        >
          {isCheckingPincode ? "Checking..." : "Check Delivery"}
        </button>
      </div>

      {pincodeStatus.checked && (
        <p className={`text-xs ${pincodeStatus.serviceable ? "text-success" : "text-error"}`}>
          {pincodeStatus.serviceable
            ? `Deliverable — estimated ${pincodeStatus.days} days${pincodeStatus.fee === 0 ? ", free shipping" : `, ₹${pincodeStatus.fee} shipping`}`
            : "Sorry, we don't currently deliver to this pincode."}
        </p>
      )}

      <Input label="Phone" error={errors.phone?.message} {...register("phone")} />

      <button
        type="submit"
        disabled={!pincodeStatus.checked || !pincodeStatus.serviceable}
        className="w-full bg-burgundy text-ivory py-3 text-sm uppercase tracking-wide disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Continue to Payment
      </button>
    </form>
  );
}
