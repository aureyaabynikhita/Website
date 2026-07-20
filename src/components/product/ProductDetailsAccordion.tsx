"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductDoc } from "@/types/firestore";

export function ProductDetailsAccordion({ product }: { product: ProductDoc }) {
  const [openSection, setOpenSection] = useState<string | null>("fabric");

  const sections = [
    { id: "fabric", label: "Fabric & Details", content: product.fabricDetails },
    { id: "care", label: "Wash Care", content: product.washCare },
    ...(product.stylingTips
      ? [{ id: "styling", label: "Styling Tips", content: product.stylingTips }]
      : []),
    {
      id: "delivery",
      label: "Delivery & Returns",
      content:
        "Standard delivery in 5–7 business days across India. Easy 7-day returns on unworn pieces with tags intact.",
    },
  ];

  return (
    <div className="border-t border-charcoal/10">
      {sections.map((section) => {
        const isOpen = openSection === section.id;
        return (
          <div key={section.id} className="border-b border-charcoal/10">
            <button
              type="button"
              onClick={() => setOpenSection(isOpen ? null : section.id)}
              className="w-full flex items-center justify-between py-4 text-sm tracking-[0.05em]"
            >
              {section.label}
              <ChevronDown
                size={16}
                className={cn("transition-transform", isOpen && "rotate-180")}
              />
            </button>
            {isOpen && (
              <p className="pb-4 text-sm text-charcoal/70 leading-relaxed">{section.content}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
