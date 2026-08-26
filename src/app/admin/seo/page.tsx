"use client";

import { useState } from "react";
import { Search, Globe, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "react-hot-toast";

export default function AdminSeoPage() {
  const [metaTitle, setMetaTitle] = useState("AUREYAA — Quiet Luxury Indo-Western Fashion by Nikhita Matania");
  const [metaDesc, setMetaDesc] = useState(
    "Discover handcrafted Indo-Western drape sarees, fluid co-ord sets, and statement jackets. Quiet luxury, timeless silhouettes, and heirloom craftsmanship."
  );
  const [keywords, setKeywords] = useState(
    "Indo-Western, drape saree, co-ord sets, designer saree, luxury fashion, Nikhita Matania, Aureyaa, festive wear, wedding couture"
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Global SEO metadata saved!");
    }, 500);
  };

  return (
    <div className="space-y-6 max-w-4xl pb-16">
      <div className="border-b border-charcoal/10 pb-4">
        <h1 className="font-serif text-2xl text-charcoal">SEO & Search Engine Optimization</h1>
        <p className="text-sm text-charcoal/50 mt-1">
          Manage Google search rankings, OpenGraph social sharing snippets, and schema metadata.
        </p>
      </div>

      <div className="bg-ivory border border-charcoal/10 p-6 space-y-6 shadow-xs">
        {/* Google SERP Preview Card */}
        <div>
          <span className="text-[11px] uppercase tracking-wider text-charcoal/50 font-semibold block mb-2">
            Google Search Snippet Preview
          </span>
          <div className="p-4 bg-white border border-charcoal/15 rounded-sm space-y-1">
            <p className="text-xs text-[#202124] font-sans">https://aureyaa.com</p>
            <h3 className="text-lg text-[#1a0dab] font-sans font-medium hover:underline cursor-pointer">
              {metaTitle}
            </h3>
            <p className="text-xs text-[#4d5156] font-sans leading-relaxed">
              {metaDesc}
            </p>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4 pt-2">
          <div>
            <label className="block text-xs uppercase tracking-wider text-charcoal/70 font-semibold mb-2">
              Default Homepage Meta Title ({metaTitle.length}/60 chars)
            </label>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              className="w-full border border-charcoal/20 bg-ivory p-3 text-sm text-charcoal focus:border-burgundy focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-charcoal/70 font-semibold mb-2">
              Meta Description ({metaDesc.length}/160 chars)
            </label>
            <textarea
              rows={3}
              value={metaDesc}
              onChange={(e) => setMetaDesc(e.target.value)}
              className="w-full border border-charcoal/20 bg-ivory p-3 text-sm text-charcoal focus:border-burgundy focus:outline-none font-sans"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-charcoal/70 font-semibold mb-2">
              Target Meta Keywords (Comma Separated)
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="w-full border border-charcoal/20 bg-ivory p-3 text-sm text-charcoal focus:border-burgundy focus:outline-none"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="bg-burgundy text-ivory uppercase tracking-wider text-xs font-semibold px-6 py-2.5"
            >
              <Save size={14} /> {isSaving ? "Saving..." : "Save SEO Settings"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
