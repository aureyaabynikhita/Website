"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function CouponForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form)),
    });
    setIsSubmitting(false);
    if (!res.ok) {
      toast.error("Couldn't create coupon.");
      return;
    }
    toast.success("Coupon created");
    (e.target as HTMLFormElement).reset();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 bg-ivory border border-charcoal/10 p-6">
      <Input name="code" label="Code" placeholder="AUREYAA20" required />
      <div>
        <label className="mb-2 block text-xs tracking-[0.15em] uppercase text-charcoal/70">Type</label>
        <select
          name="type"
          className="w-full border-b border-charcoal/20 bg-transparent py-3 focus:border-burgundy focus:outline-none"
        >
          <option value="percentage">Percentage</option>
          <option value="flat">Flat</option>
        </select>
      </div>
      <Input name="value" type="number" label="Value" placeholder="20" required />
      <Input name="usageLimit" type="number" label="Usage Limit" placeholder="100" />
      <Input name="minOrderValue" type="number" label="Min Order Value (optional)" />
      <Input name="maxDiscount" type="number" label="Max Discount (optional)" />
      <Input name="validFrom" type="date" label="Valid From" required />
      <Input name="validTill" type="date" label="Valid Till" required />
      <div className="col-span-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Coupon"}
        </Button>
      </div>
    </form>
  );
}
