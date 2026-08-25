import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ColorSibling } from "@/services/products";

interface ColorSwatchesProps {
  siblings: ColorSibling[];
}

export function ColorSwatches({ siblings }: ColorSwatchesProps) {
  if (!siblings || siblings.length <= 1) return null;

  const current = siblings.find((s) => s.isCurrent) || siblings[0];
  if (!current) return null;

  return (
    <div className="space-y-3 py-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-xs uppercase tracking-[0.15em] font-semibold text-charcoal/80">
            Available Colors:
          </span>
          <span className="text-xs text-burgundy font-serif font-semibold">
            {current.color}
          </span>
        </div>
        <span className="text-[11px] text-charcoal/45 font-sans tracking-wide">
          ({siblings.length} Shades)
        </span>
      </div>

      <div className="flex flex-wrap gap-2.5 items-center">
        {siblings.map((sibling) => (
          <Link
            key={sibling.id}
            href={`/product/${sibling.slug}`}
            className={cn(
              "group relative flex items-center gap-2 px-2.5 py-1.5 border transition-all duration-200",
              sibling.isCurrent
                ? "border-burgundy bg-burgundy/[0.04] ring-1 ring-burgundy shadow-xs"
                : "border-charcoal/15 hover:border-charcoal/50 bg-white/70"
            )}
          >
            {/* Small circular image thumbnail */}
            <div className="relative h-6 w-6 rounded-full overflow-hidden border border-charcoal/10 shrink-0">
              <Image
                src={sibling.image}
                alt={sibling.title}
                fill
                sizes="24px"
                className="object-cover object-top"
              />
            </div>
            <span
              className={cn(
                "text-xs font-sans tracking-wide",
                sibling.isCurrent ? "text-burgundy font-semibold" : "text-charcoal/80 group-hover:text-charcoal"
              )}
            >
              {sibling.color}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
