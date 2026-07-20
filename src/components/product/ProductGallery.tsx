"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const gallery = images.length > 0 ? images : ["/images/placeholder-1.jpg"];

  return (
    <div className="flex gap-3">
      <div className="hidden md:flex flex-col gap-3">
        {gallery.map((img, i) => (
          <button
            key={img + i}
            type="button"
            onClick={() => setActive(i)}
            className={cn(
              "relative h-20 w-16 overflow-hidden bg-beige border",
              active === i ? "border-burgundy" : "border-transparent"
            )}
          >
            <Image src={img} alt={`${title} thumbnail ${i + 1}`} fill className="object-cover" />
          </button>
        ))}
      </div>
      <div className="relative flex-1 aspect-[3/4] bg-beige">
        <Image
          src={gallery[active] ?? gallery[0]!}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
