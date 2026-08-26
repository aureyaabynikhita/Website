"use client";

import { useState } from "react";
import { Truck, MapPin, ShieldCheck, Save, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "react-hot-toast";

export default function AdminShippingPage() {
  const [warehousePincode, setWarehousePincode] = useState("400102");
  const [freeShippingAll, setFreeShippingAll] = useState(true);
  const [codEnabled, setCodEnabled] = useState(true);
  const [estimatedDays, setEstimatedDays] = useState("4-6");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Shipping rules updated across website!");
    }, 500);
  };

  return (
    <div className="space-y-6 max-w-4xl pb-16">
      <div className="border-b border-charcoal/10 pb-4">
        <h1 className="font-serif text-2xl text-charcoal">Shipping & Logistics Configuration</h1>
        <p className="text-sm text-charcoal/50 mt-1">
          Manage fulfillment rules, active shipping carriers, and Pan-India delivery rates.
        </p>
      </div>

      <div className="bg-ivory border border-charcoal/10 p-6 space-y-6 shadow-xs">
        {/* Carrier Status */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 border border-success/30 bg-success/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Truck size={20} className="text-success" />
              <div>
                <p className="font-semibold text-charcoal text-sm">Shiprocket Integration</p>
                <p className="text-xs text-charcoal/60">Automated AWB & courier dispatch active</p>
              </div>
            </div>
            <span className="text-xs font-bold text-success uppercase">Active</span>
          </div>

          <div className="p-4 border border-charcoal/10 bg-beige/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Truck size={20} className="text-charcoal/60" />
              <div>
                <p className="font-semibold text-charcoal text-sm">Delhivery Direct API</p>
                <p className="text-xs text-charcoal/60">Secondary carrier fallback configured</p>
              </div>
            </div>
            <span className="text-xs font-bold text-charcoal/60 uppercase">Standby</span>
          </div>
        </div>

        {/* Settings Form */}
        <div className="space-y-5 pt-2">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-charcoal/70 font-semibold mb-2">
                Primary Dispatch Warehouse Pincode
              </label>
              <input
                type="text"
                value={warehousePincode}
                onChange={(e) => setWarehousePincode(e.target.value)}
                className="w-full border border-charcoal/20 bg-ivory p-3 text-sm font-mono text-charcoal focus:border-burgundy focus:outline-none"
              />
              <p className="text-2xs text-charcoal/50 mt-1">Oshiwara, Jogeshwari West, Mumbai</p>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-charcoal/70 font-semibold mb-2">
                Standard Pan-India Delivery ETA
              </label>
              <input
                type="text"
                value={estimatedDays}
                onChange={(e) => setEstimatedDays(e.target.value)}
                className="w-full border border-charcoal/20 bg-ivory p-3 text-sm text-charcoal focus:border-burgundy focus:outline-none"
              />
              <p className="text-2xs text-charcoal/50 mt-1">Displayed on product pincode estimator</p>
            </div>
          </div>

          <div className="pt-3 space-y-3 border-t border-charcoal/10">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={freeShippingAll}
                onChange={(e) => setFreeShippingAll(e.target.checked)}
                className="h-4 w-4 accent-burgundy"
              />
              <div>
                <span className="font-semibold text-sm text-charcoal">Complimentary Free Shipping on All Orders</span>
                <p className="text-xs text-charcoal/60">Always charge ₹0 shipping fee at checkout regardless of cart amount.</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={codEnabled}
                onChange={(e) => setCodEnabled(e.target.checked)}
                className="h-4 w-4 accent-burgundy"
              />
              <div>
                <span className="font-semibold text-sm text-charcoal">Cash on Delivery (COD) Option</span>
                <p className="text-xs text-charcoal/60">Enable COD payment selection on deliverable pincodes.</p>
              </div>
            </label>
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="bg-burgundy text-ivory uppercase tracking-wider text-xs font-semibold px-6 py-2.5"
            >
              <Save size={14} /> {isSaving ? "Saving..." : "Save Shipping Settings"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
