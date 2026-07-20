"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/Button";

export function CreateShipmentButton({ orderId, hasAwb }: { orderId: string; hasAwb: boolean }) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  async function handleClick() {
    setIsCreating(true);
    const res = await fetch("/api/admin/shipping/create-shipment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    });
    const data = await res.json();
    setIsCreating(false);

    if (!res.ok) {
      toast.error(data.error ?? "Couldn't create shipment. Check Shiprocket credentials in .env.local.");
      return;
    }
    toast.success(data.awbCode ? `Shipment created — AWB ${data.awbCode}` : "Shipment created");
    router.refresh();
  }

  if (hasAwb) return <span className="text-xs text-success">Shipment created</span>;

  return (
    <Button size="sm" variant="outline" onClick={handleClick} disabled={isCreating}>
      {isCreating ? "Creating..." : "Push to Shiprocket"}
    </Button>
  );
}
