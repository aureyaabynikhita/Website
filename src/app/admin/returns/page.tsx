"use client";

import { useState } from "react";
import {
  RotateCcw,
  CheckCircle,
  XCircle,
  Truck,
  DollarSign,
  Plus,
  Filter,
  Search,
  ArrowRight,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "react-hot-toast";

interface ReturnItem {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  productName: string;
  productSize: string;
  amount: number;
  reason: string;
  requestDate: string;
  type: "Exchange" | "Store Credit" | "Bank Refund";
  status: "pending" | "approved" | "pickup_scheduled" | "received" | "completed" | "rejected";
}

const INITIAL_RETURNS: ReturnItem[] = [
  {
    id: "RET-8901",
    orderNumber: "AUR89234120",
    customerName: "Sneha Varma",
    customerPhone: "+91 98201 44521",
    productName: "ZOYA cherry red",
    productSize: "L",
    amount: 14431,
    reason: "Requested size exchange to M for tighter waist fit",
    requestDate: "August 24, 2026",
    type: "Exchange",
    status: "approved",
  },
  {
    id: "RET-8902",
    orderNumber: "AUR89112903",
    customerName: "Kavita Rao",
    customerPhone: "+91 97112 00491",
    productName: "ROOH SKY BLUE",
    productSize: "M",
    amount: 14431,
    reason: "Store credit exchange for Drape Saree collection",
    requestDate: "August 22, 2026",
    type: "Store Credit",
    status: "pending",
  },
  {
    id: "RET-8899",
    orderNumber: "AUR88720199",
    customerName: "Ananya Desai",
    customerPhone: "+91 98334 90123",
    productName: "NAZAKAT black",
    productSize: "XXL",
    amount: 14431,
    reason: "Event date rescheduled — store credit issued",
    requestDate: "August 15, 2026",
    type: "Store Credit",
    status: "completed",
  },
];

export default function AdminReturnsPage() {
  const [returnsList, setReturnsList] = useState<ReturnItem[]>(INITIAL_RETURNS);
  const [filterTab, setFilterTab] = useState<"all" | "pending" | "approved" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  // New manual return form state
  const [mOrderNum, setMOrderNum] = useState("");
  const [mCustomer, setMCustomer] = useState("");
  const [mPhone, setMPhone] = useState("");
  const [mProduct, setMProduct] = useState("ZOYA cherry red");
  const [mType, setMType] = useState<ReturnItem["type"]>("Exchange");
  const [mReason, setMReason] = useState("");

  const filtered = returnsList.filter((r) => {
    const matchesTab =
      filterTab === "all" ? true : filterTab === "completed" ? r.status === "completed" : r.status === filterTab;
    const matchesSearch =
      r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleUpdateStatus = (id: string, newStatus: ReturnItem["status"]) => {
    setReturnsList(returnsList.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
    toast.success(`Return #${id} status updated to ${newStatus.replace("_", " ")}`);
  };

  const handleCreateManualReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mCustomer.trim() || !mOrderNum.trim()) {
      toast.error("Please enter customer name and order number.");
      return;
    }
    const newEntry: ReturnItem = {
      id: `RET-${Math.floor(1000 + Math.random() * 9000)}`,
      orderNumber: mOrderNum.toUpperCase(),
      customerName: mCustomer,
      customerPhone: mPhone || "+91 99999 00000",
      productName: mProduct,
      productSize: "Standard",
      amount: 14431,
      reason: mReason || "Client requested exchange via WhatsApp concierge",
      requestDate: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      type: mType,
      status: "approved",
    };
    setReturnsList([newEntry, ...returnsList]);
    setIsManualModalOpen(false);
    setMOrderNum("");
    setMCustomer("");
    setMPhone("");
    setMReason("");
    toast.success("Manual return request created & reverse pickup logged!");
  };

  return (
    <div className="space-y-8 max-w-6xl pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-charcoal/10 pb-4">
        <div>
          <h1 className="font-serif text-2xl text-charcoal">Returns, Exchanges & Store Credits</h1>
          <p className="text-sm text-charcoal/50 mt-1">
            Manage 7-day customer exchange requests, reverse pickup AWBs, and store credits.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => setIsManualModalOpen(true)}
          className="bg-burgundy text-ivory text-xs uppercase tracking-wider font-semibold"
        >
          <Plus size={14} /> Log Customer Return
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-ivory border border-charcoal/10 p-4 shadow-xs">
          <p className="text-2xs uppercase tracking-wider text-charcoal/50 font-semibold">Total Requests</p>
          <p className="font-serif text-2xl text-charcoal mt-1">{returnsList.length}</p>
        </div>
        <div className="bg-ivory border border-gold/30 bg-gold/5 p-4 shadow-xs">
          <p className="text-2xs uppercase tracking-wider text-gold-dark font-semibold">Pending Review</p>
          <p className="font-serif text-2xl text-gold-dark mt-1">
            {returnsList.filter((r) => r.status === "pending").length}
          </p>
        </div>
        <div className="bg-ivory border border-success/30 bg-success/5 p-4 shadow-xs">
          <p className="text-2xs uppercase tracking-wider text-success font-semibold">Approved / In Transit</p>
          <p className="font-serif text-2xl text-success mt-1">
            {returnsList.filter((r) => r.status === "approved" || r.status === "pickup_scheduled").length}
          </p>
        </div>
        <div className="bg-ivory border border-charcoal/10 p-4 shadow-xs">
          <p className="text-2xs uppercase tracking-wider text-charcoal/50 font-semibold">Completed</p>
          <p className="font-serif text-2xl text-charcoal mt-1">
            {returnsList.filter((r) => r.status === "completed").length}
          </p>
        </div>
      </div>

      {/* Manual Return Modal */}
      {isManualModalOpen && (
        <form
          onSubmit={handleCreateManualReturn}
          className="bg-ivory border-2 border-burgundy/30 p-6 space-y-4 shadow-lg"
        >
          <div className="flex justify-between items-center border-b border-charcoal/10 pb-3">
            <h2 className="font-serif text-lg text-charcoal">Log Return / Size Exchange</h2>
            <button
              type="button"
              onClick={() => setIsManualModalOpen(false)}
              className="text-xs uppercase font-semibold text-charcoal/60 hover:text-charcoal"
            >
              ✕ Close
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-charcoal/70 font-semibold mb-2">
                Order Number
              </label>
              <input
                type="text"
                placeholder="e.g. AUR89234120"
                value={mOrderNum}
                onChange={(e) => setMOrderNum(e.target.value)}
                className="w-full border border-charcoal/20 bg-ivory p-2.5 text-sm font-mono text-charcoal focus:border-burgundy focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-charcoal/70 font-semibold mb-2">
                Customer Name
              </label>
              <input
                type="text"
                placeholder="e.g. Sneha Varma"
                value={mCustomer}
                onChange={(e) => setMCustomer(e.target.value)}
                className="w-full border border-charcoal/20 bg-ivory p-2.5 text-sm text-charcoal focus:border-burgundy focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-charcoal/70 font-semibold mb-2">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="+91 98201 44521"
                value={mPhone}
                onChange={(e) => setMPhone(e.target.value)}
                className="w-full border border-charcoal/20 bg-ivory p-2.5 text-sm font-mono text-charcoal focus:border-burgundy focus:outline-none"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-charcoal/70 font-semibold mb-2">
                Product Item
              </label>
              <select
                value={mProduct}
                onChange={(e) => setMProduct(e.target.value)}
                className="w-full border border-charcoal/20 bg-ivory p-2.5 text-sm text-charcoal focus:border-burgundy focus:outline-none"
              >
                <option value="ZOYA cherry red">ZOYA cherry red (₹14,431)</option>
                <option value="ZOYA black">ZOYA black (₹14,431)</option>
                <option value="MOOH IVORY">MOOH IVORY (₹3,823)</option>
                <option value="NAZAKAT BLACK">NAZAKAT BLACK (₹14,431)</option>
                <option value="ROOH SKY BLUE">ROOH SKY BLUE (₹14,431)</option>
                <option value="ROOH BEIGE">ROOH BEIGE (₹14,431)</option>
                <option value="Ada cherry red">Ada cherry red (₹12,071)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-charcoal/70 font-semibold mb-2">
                Resolution Type
              </label>
              <select
                value={mType}
                onChange={(e) => setMType(e.target.value as any)}
                className="w-full border border-charcoal/20 bg-ivory p-2.5 text-sm text-charcoal focus:border-burgundy focus:outline-none"
              >
                <option value="Exchange">Size / Color Exchange</option>
                <option value="Store Credit">Issue 100% Store Credit</option>
                <option value="Bank Refund">Original Payment Refund</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-charcoal/70 font-semibold mb-2">
              Reason / Fitting Notes
            </label>
            <input
              type="text"
              placeholder="e.g. Size L needed instead of M; pickup scheduled via Shiprocket"
              value={mReason}
              onChange={(e) => setMReason(e.target.value)}
              className="w-full border border-charcoal/20 bg-ivory p-2.5 text-sm text-charcoal focus:border-burgundy focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsManualModalOpen(false)}
              className="text-xs uppercase"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-burgundy text-ivory text-xs uppercase font-semibold">
              Save & Approve Return
            </Button>
          </div>
        </form>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-beige/30 p-4 border border-charcoal/10">
        <div className="flex gap-2">
          {(["all", "pending", "approved", "completed"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilterTab(tab)}
              className={`px-3 py-1.5 text-xs uppercase font-semibold tracking-wider transition-colors ${
                filterTab === tab
                  ? "bg-burgundy text-ivory shadow-xs"
                  : "bg-ivory text-charcoal/70 hover:text-burgundy border border-charcoal/10"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Search return ID, customer, order..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-charcoal/20 bg-ivory px-3 py-1.5 text-xs text-charcoal focus:border-burgundy focus:outline-none"
          />
        </div>
      </div>

      {/* Returns Table */}
      <div className="bg-ivory border border-charcoal/10 overflow-x-auto shadow-xs">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-charcoal/10 text-left text-xs uppercase tracking-wide text-charcoal/50">
              <th className="p-4">Return ID / Order</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Garment & Reason</th>
              <th className="p-4">Type</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal/5">
            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-charcoal/[0.01]">
                <td className="p-4 font-mono">
                  <div className="font-semibold text-charcoal">{r.id}</div>
                  <div className="text-2xs text-charcoal/50">{r.orderNumber}</div>
                  <div className="text-2xs text-charcoal/40 mt-0.5">{r.requestDate}</div>
                </td>
                <td className="p-4">
                  <div className="font-semibold text-charcoal">{r.customerName}</div>
                  <div className="text-xs font-mono text-charcoal/60">{r.customerPhone}</div>
                </td>
                <td className="p-4 max-w-xs">
                  <div className="font-medium text-charcoal">
                    {r.productName} <span className="text-xs text-charcoal/50 font-mono">({r.productSize})</span>
                  </div>
                  <div className="text-xs text-charcoal/60 leading-relaxed font-light mt-0.5">{r.reason}</div>
                </td>
                <td className="p-4">
                  <span className="text-xs font-medium text-charcoal/80 bg-beige/50 px-2 py-0.5 border border-charcoal/10">
                    {r.type}
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border ${
                      r.status === "completed"
                        ? "bg-success/10 text-success border-success/30"
                        : r.status === "approved"
                        ? "bg-gold/10 text-gold-dark border-gold/30"
                        : r.status === "pending"
                        ? "bg-burgundy/10 text-burgundy border-burgundy/30"
                        : "bg-charcoal/10 text-charcoal/60 border-charcoal/20"
                    }`}
                  >
                    {r.status.replace("_", " ")}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <select
                    value={r.status}
                    onChange={(e) => handleUpdateStatus(r.id, e.target.value as any)}
                    className="border border-charcoal/20 bg-ivory text-xs px-2 py-1.5 focus:border-burgundy focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approve & Pickup</option>
                    <option value="pickup_scheduled">Pickup Scheduled</option>
                    <option value="received">Garment Received</option>
                    <option value="completed">Complete & Issue Credit</option>
                    <option value="rejected">Reject</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
