"use client";

import { useState } from "react";
import { CreditCard, Banknote, ShieldCheck, CheckCircle2, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "react-hot-toast";

export default function AdminPaymentsPage() {
  const [razorpayKeyId, setRazorpayKeyId] = useState("rzp_test_TNCAqf0ZTyQO8S");
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Payment Gateway settings updated!");
    }, 500);
  };

  return (
    <div className="space-y-6 max-w-4xl pb-16">
      <div className="border-b border-charcoal/10 pb-4">
        <h1 className="font-serif text-2xl text-charcoal">Payment Gateways & Transactions</h1>
        <p className="text-sm text-charcoal/50 mt-1">
          Configure UPI, Cards, Net Banking, and COD checkout settlement gateways.
        </p>
      </div>

      <div className="bg-ivory border border-charcoal/10 p-6 space-y-6 shadow-xs">
        {/* Gateways Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 border border-success/30 bg-success/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard size={20} className="text-success" />
              <div>
                <p className="font-semibold text-charcoal text-sm">Razorpay Checkout</p>
                <p className="text-xs text-charcoal/60">UPI, Cards, NetBanking, EMI enabled</p>
              </div>
            </div>
            <span className="text-xs font-bold text-success uppercase">Active</span>
          </div>

          <div className="p-4 border border-charcoal/10 bg-beige/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Banknote size={20} className="text-charcoal/70" />
              <div>
                <p className="font-semibold text-charcoal text-sm">Cash on Delivery (COD)</p>
                <p className="text-xs text-charcoal/60">Pay upon delivery verification</p>
              </div>
            </div>
            <span className="text-xs font-bold text-success uppercase">Enabled</span>
          </div>
        </div>

        {/* Credentials Form */}
        <div className="space-y-4 pt-2">
          <div>
            <label className="block text-xs uppercase tracking-wider text-charcoal/70 font-semibold mb-2">
              Razorpay Key ID
            </label>
            <input
              type="text"
              value={razorpayKeyId}
              onChange={(e) => setRazorpayKeyId(e.target.value)}
              className="w-full border border-charcoal/20 bg-ivory p-3 text-xs font-mono text-charcoal focus:border-burgundy focus:outline-none"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isLiveMode}
                onChange={(e) => setIsLiveMode(e.target.checked)}
                className="h-4 w-4 accent-burgundy"
              />
              <div>
                <span className="font-semibold text-sm text-charcoal">Production Live Mode</span>
                <p className="text-xs text-charcoal/60">
                  {isLiveMode ? "Processing real customer transactions via Live Key" : "Currently operating in Razorpay Test sandbox mode"}
                </p>
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
              <Save size={14} /> {isSaving ? "Saving..." : "Save Payment Settings"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
