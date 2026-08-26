"use client";

import { useState } from "react";
import { Mail, Download, Send, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "react-hot-toast";

interface Subscriber {
  email: string;
  subscribedAt: string;
  source: string;
}

const INITIAL_SUBSCRIBERS: Subscriber[] = [
  { email: "ananya.sharma@gmail.com", subscribedAt: "August 24, 2026", source: "Footer Newsletter" },
  { email: "meera.kapoor@outlook.com", subscribedAt: "August 21, 2026", source: "First Order Modal" },
  { email: "tanya.malhotra@yahoo.co.in", subscribedAt: "August 17, 2026", source: "Footer Newsletter" },
  { email: "pallavi.joshi@gmail.com", subscribedAt: "August 12, 2026", source: "Checkout Opt-in" },
];

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>(INITIAL_SUBSCRIBERS);
  const [subject, setSubject] = useState("");
  const [campaignBody, setCampaignBody] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleExportCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," + ["Email,Subscribed Date,Source", ...subscribers.map((s) => `${s.email},${s.subscribedAt},${s.source}`)].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `aureyaa_subscribers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    toast.success("Subscribers list exported as CSV");
  };

  const handleSendCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !campaignBody.trim()) {
      toast.error("Please provide both subject and campaign message.");
      return;
    }
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSubject("");
      setCampaignBody("");
      toast.success(`VIP Campaign dispatched to ${subscribers.length} subscribers!`);
    }, 800);
  };

  return (
    <div className="space-y-8 max-w-5xl pb-16">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-charcoal/10 pb-4">
        <div>
          <h1 className="font-serif text-2xl text-charcoal">Newsletter & VIP Circle</h1>
          <p className="text-sm text-charcoal/50 mt-1">
            Manage subscriber lists, broadcast new collection announcements, and private sales.
          </p>
        </div>
        <Button type="button" variant="outline" onClick={handleExportCsv} className="text-xs uppercase font-semibold">
          <Download size={14} /> Export CSV List
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Campaign Composer */}
        <form onSubmit={handleSendCampaign} className="bg-ivory border border-charcoal/10 p-6 space-y-4 shadow-xs">
          <div className="border-b border-charcoal/10 pb-3">
            <h2 className="font-serif text-lg text-charcoal">Broadcast VIP Campaign</h2>
            <p className="text-xs text-charcoal/50 mt-0.5">Send editorial styling advice and private collection previews.</p>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-charcoal/70 font-semibold mb-2">
              Email Subject Line
            </label>
            <input
              type="text"
              placeholder="e.g. Unveiling Volume IV: Fluid Silhouettes for the Festive Season"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border border-charcoal/20 bg-ivory p-3 text-sm text-charcoal focus:border-burgundy focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-charcoal/70 font-semibold mb-2">
              Campaign Message
            </label>
            <textarea
              rows={6}
              placeholder="Write your email broadcast message..."
              value={campaignBody}
              onChange={(e) => setCampaignBody(e.target.value)}
              className="w-full border border-charcoal/20 bg-ivory p-3 text-sm text-charcoal focus:border-burgundy focus:outline-none font-sans"
            />
          </div>

          <Button type="submit" disabled={isSending} className="w-full bg-burgundy text-ivory uppercase tracking-wider text-xs font-semibold py-3">
            <Send size={14} /> {isSending ? "Dispatching..." : "Send Campaign Broadcast"}
          </Button>
        </form>

        {/* Subscriber List Table */}
        <div className="bg-ivory border border-charcoal/10 p-6 space-y-4 shadow-xs">
          <div className="flex justify-between items-center border-b border-charcoal/10 pb-3">
            <h2 className="font-serif text-lg text-charcoal">Subscribers ({subscribers.length})</h2>
            <span className="text-xs text-success font-semibold">● Live Sync</span>
          </div>

          <div className="space-y-3 divide-y divide-charcoal/5 max-h-[380px] overflow-y-auto no-scrollbar">
            {subscribers.map((s, idx) => (
              <div key={idx} className="pt-3 first:pt-0 flex justify-between items-center text-xs">
                <div>
                  <p className="font-semibold text-charcoal">{s.email}</p>
                  <p className="text-2xs text-charcoal/50">{s.source}</p>
                </div>
                <span className="text-2xs text-charcoal/40 font-mono">{s.subscribedAt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
