"use client";

import { useState } from "react";
import { MessageCircle, Mail, Phone, Clock, CheckCircle2 } from "lucide-react";
import { toast } from "react-hot-toast";

interface Inquiry {
  id: string;
  name: string;
  contact: string;
  channel: "WhatsApp" | "Email" | "Contact Form";
  subject: string;
  message: string;
  date: string;
  resolved: boolean;
}

const INITIAL_INQUIRIES: Inquiry[] = [
  {
    id: "inq-1",
    name: "Dr. Aarti Sen",
    contact: "+91 98201 45980",
    channel: "WhatsApp",
    subject: "Custom blouse sizing for Zoya cherry red",
    message: "Can we request an extra margin for chest sizing on size L?",
    date: "August 25, 2026",
    resolved: false,
  },
  {
    id: "inq-2",
    name: "Sunaina Bajaj",
    contact: "sunaina.b@gmail.com",
    channel: "Email",
    subject: "International delivery to Dubai",
    message: "Do you ship to UAE via DHL express? Need the outfit by next Friday.",
    date: "August 24, 2026",
    resolved: true,
  },
];

export default function AdminSupportPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>(INITIAL_INQUIRIES);

  const toggleResolved = (id: string) => {
    setInquiries(
      inquiries.map((inq) => (inq.id === id ? { ...inq, resolved: !inq.resolved } : inq))
    );
    toast.success("Inquiry status updated");
  };

  return (
    <div className="space-y-6 max-w-5xl pb-16">
      <div className="flex justify-between items-center border-b border-charcoal/10 pb-4">
        <div>
          <h1 className="font-serif text-2xl text-charcoal">Customer Support & Inquiries</h1>
          <p className="text-sm text-charcoal/50 mt-1">
            Track incoming VIP bespoke requests, WhatsApp inquiries, and styling questions.
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {inquiries.map((inq) => (
          <div
            key={inq.id}
            className={`p-5 bg-ivory border transition-all ${
              inq.resolved ? "border-charcoal/10 opacity-70" : "border-burgundy/30 shadow-xs"
            }`}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-charcoal">{inq.name}</span>
                <span className="text-xs bg-beige text-charcoal/70 px-2 py-0.5 font-mono border border-charcoal/10">
                  {inq.channel}
                </span>
                <span className="text-xs text-charcoal/50 font-mono">{inq.contact}</span>
              </div>
              <div className="text-2xs text-charcoal/40 font-mono">{inq.date}</div>
            </div>

            <div className="space-y-1 mb-4">
              <p className="font-medium text-sm text-charcoal">{inq.subject}</p>
              <p className="text-xs text-charcoal/70 leading-relaxed font-light">{inq.message}</p>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-charcoal/5">
              <a
                href={inq.channel === "WhatsApp" ? `https://wa.me/${inq.contact.replace(/[^0-9]/g, "")}` : `mailto:${inq.contact}`}
                target="_blank"
                className="text-xs uppercase font-semibold text-burgundy hover:underline tracking-wider"
              >
                Reply via {inq.channel} →
              </a>
              <button
                type="button"
                onClick={() => toggleResolved(inq.id)}
                className={`text-xs font-semibold uppercase px-3 py-1 border transition-colors ${
                  inq.resolved
                    ? "bg-success/10 text-success border-success/30"
                    : "bg-charcoal/5 text-charcoal hover:bg-charcoal/10 border-charcoal/20"
                }`}
              >
                {inq.resolved ? "✓ Resolved" : "Mark Resolved"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
