"use client";

import Image from "next/image";
import { useState } from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  videoUrl?: string;
  title: string;
}

export function ProductGallery({ images, videoUrl, title }: ProductGalleryProps) {
  const [active, setActive] = useState(0);

  const media = [
    ...images.map((url) => ({ type: "image" as const, url })),
    ...(videoUrl ? [{ type: "video" as const, url: videoUrl }] : []),
  ];

  const activeMedia = media[active] || { type: "image" as const, url: "/images/placeholder-1.jpg" };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Desktop Vertical Thumbnails */}
      <div className="hidden md:flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin">
        {media.map((item, i) => (
          <button
            key={item.url + i}
            type="button"
            onClick={() => setActive(i)}
            className={cn(
              "relative h-24 w-18 overflow-hidden bg-beige border transition-all duration-300 flex items-center justify-center shrink-0",
              active === i ? "border-burgundy ring-1 ring-burgundy" : "border-charcoal/10 hover:border-charcoal/40"
            )}
          >
            {item.type === "video" ? (
              <div className="relative h-full w-full flex flex-col items-center justify-center bg-burgundy/5">
                <Play size={22} className="text-burgundy fill-burgundy/10" />
                <span className="absolute bottom-1 text-[9px] uppercase tracking-widest font-bold text-burgundy">Video</span>
              </div>
            ) : (
              <Image src={item.url} alt={`${title} thumbnail ${i + 1}`} fill className="object-cover" />
            )}
          </button>
        ))}
      </div>

      {/* Main Viewport */}
      <div className="relative flex-1 aspect-[3/4] bg-beige overflow-hidden group">
        {activeMedia.type === "video" ? (
          <video
            src={activeMedia.url}
            controls
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <Image
            src={activeMedia.url}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-102"
            priority
          />
        )}
      </div>

      {/* Mobile Horizontal Thumbnails */}
      <div className="flex md:hidden gap-3 overflow-x-auto pb-2 px-1 scrollbar-none snap-x">
        {media.map((item, i) => (
          <button
            key={item.url + "-mob-" + i}
            type="button"
            onClick={() => setActive(i)}
            className={cn(
              "relative h-20 w-16 overflow-hidden bg-beige border shrink-0 snap-start transition-all duration-300 flex items-center justify-center",
              active === i ? "border-burgundy ring-1 ring-burgundy" : "border-charcoal/10"
            )}
          >
            {item.type === "video" ? (
              <div className="relative h-full w-full flex flex-col items-center justify-center bg-burgundy/5">
                <Play size={18} className="text-burgundy fill-burgundy/10" />
                <span className="absolute bottom-1 text-[8px] uppercase tracking-wider font-bold text-burgundy">Video</span>
              </div>
            ) : (
              <Image src={item.url} alt={`${title} thumbnail ${i + 1}`} fill className="object-cover" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
