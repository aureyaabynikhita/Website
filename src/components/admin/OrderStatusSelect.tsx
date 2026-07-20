"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import type { OrderStatus } from "@/types/firestore";

const STATUSES: OrderStatus[] = [
  "pending_payment",
  "confirmed",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
  "returned",
];

export function OrderStatusSelect({ orderId, status }: { orderId: string; status: OrderStatus }) {
  const router = useRouter();
  const [current, setCurrent] = useState(status);
  const [isPending, startTransition] = useTransition();

  async function handleChange(newStatus: OrderStatus) {
    setCurrent(newStatus);
    const res = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status: newStatus }),
    });
    if (!res.ok) {
      toast.error("Couldn't update order status.");
      setCurrent(status);
      return;
    }
    toast.success("Order status updated");
    startTransition(() => router.refresh());
  }

  return (
    <select
      value={current}
      disabled={isPending}
      onChange={(e) => handleChange(e.target.value as OrderStatus)}
      className="border border-charcoal/20 bg-transparent text-xs px-2 py-1.5 capitalize focus:border-burgundy focus:outline-none"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s.replace(/_/g, " ")}
        </option>
      ))}
    </select>
  );
}
