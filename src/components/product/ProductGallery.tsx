"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { Play, ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  videoUrl?: string;
  title: string;
}

export function ProductGallery({ images, videoUrl, title }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const imgContainerRef = useRef<HTMLDivElement>(null);

  const media = [
    ...images.map((url) => ({ type: "image" as const, url })),
    ...(videoUrl ? [{ type: "video" as const, url: videoUrl }] : []),
  ];

  const activeMedia = media[active] || { type: "image" as const, url: "/images/placeholder-1.jpg" };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgContainerRef.current) return;
    const { left, top, width, height } = imgContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  const handleNext = () => setActive((prev) => (prev + 1) % media.length);
  const handlePrev = () => setActive((prev) => (prev - 1 + media.length) % media.length);

  return (
    <>
      <div className="flex flex-col-reverse md:flex-row gap-4 lg:gap-6 items-start">
        {/* Desktop Vertical Thumbnails */}
        <div className="hidden md:flex flex-col gap-3 max-h-[640px] overflow-y-auto no-scrollbar">
          {media.map((item, i) => (
            <button
              key={item.url + i}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative h-24 w-18 overflow-hidden bg-beige/40 border transition-all duration-300 flex items-center justify-center shrink-0 group",
                active === i ? "border-burgundy ring-1 ring-burgundy shadow-xs" : "border-charcoal/15 hover:border-charcoal/40 opacity-70 hover:opacity-100"
              )}
            >
              {item.type === "video" ? (
                <div className="relative h-full w-full flex flex-col items-center justify-center bg-burgundy/5">
                  <Play size={20} className="text-burgundy fill-burgundy/20" />
                  <span className="absolute bottom-1 text-[8px] uppercase tracking-widest font-bold text-burgundy">Video</span>
                </div>
              ) : (
                <Image
                  src={item.url}
                  alt={`${title} view ${i + 1}`}
                  fill
                  quality={80}
                  className="object-cover object-top"
                />
              )}
            </button>
          ))}
        </div>

        {/* Main Viewport Container */}
        <div className="relative flex-1 w-full aspect-[3/4] bg-beige/30 overflow-hidden group">
          {/* Main Visual Image / Video */}
          <div
            ref={imgContainerRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={() => activeMedia.type === "image" && setIsZoomOpen(true)}
            className="relative w-full h-full cursor-zoom-in"
          >
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
              <>
                <Image
                  src={activeMedia.url}
                  alt={title}
                  fill
                  priority
                  quality={95}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={cn(
                    "object-cover object-top transition-transform duration-300 ease-out",
                    isHovering ? "scale-125" : "scale-100"
                  )}
                  style={
                    isHovering
                      ? {
                          transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                        }
                      : undefined
                  }
                />
              </>
            )}
          </div>

          {/* Image Navigation Arrows */}
          {media.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center bg-ivory/80 backdrop-blur-md rounded-full text-charcoal opacity-0 group-hover:opacity-100 transition-opacity hover:bg-ivory hover:scale-110 shadow-sm"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next image"
                className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center bg-ivory/80 backdrop-blur-md rounded-full text-charcoal opacity-0 group-hover:opacity-100 transition-opacity hover:bg-ivory hover:scale-110 shadow-sm"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Badges / Counter */}
          <div className="absolute bottom-3 right-3 bg-charcoal/75 text-ivory text-[10px] tracking-widest font-mono px-2.5 py-1 backdrop-blur-md rounded-none">
            {active + 1} / {media.length}
          </div>

          <button
            type="button"
            onClick={() => setIsZoomOpen(true)}
            aria-label="View Fullscreen"
            className="absolute top-3 right-3 h-8 w-8 flex items-center justify-center bg-ivory/80 backdrop-blur-md text-charcoal opacity-0 group-hover:opacity-100 transition-opacity hover:bg-ivory hover:scale-110"
          >
            <Maximize2 size={15} />
          </button>
        </div>

        {/* Mobile Horizontal Thumbnails */}
        <div className="flex md:hidden gap-2.5 overflow-x-auto pb-1 w-full no-scrollbar snap-x">
          {media.map((item, i) => (
            <button
              key={item.url + "-mob-" + i}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative h-20 w-16 overflow-hidden bg-beige/40 border shrink-0 snap-start transition-all duration-300 flex items-center justify-center",
                active === i ? "border-burgundy ring-1 ring-burgundy shadow-xs" : "border-charcoal/15 opacity-70"
              )}
            >
              {item.type === "video" ? (
                <div className="relative h-full w-full flex flex-col items-center justify-center bg-burgundy/5">
                  <Play size={16} className="text-burgundy fill-burgundy/10" />
                  <span className="absolute bottom-0.5 text-[7px] uppercase tracking-wider font-bold text-burgundy">Video</span>
                </div>
              ) : (
                <Image
                  src={item.url}
                  alt={`${title} thumbnail ${i + 1}`}
                  fill
                  quality={75}
                  className="object-cover object-top"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Fullscreen High-Resolution Lightbox Modal */}
      {isZoomOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal/95 backdrop-blur-md flex items-center justify-center p-4">
          <button
            type="button"
            onClick={() => setIsZoomOpen(false)}
            aria-label="Close Lightbox"
            className="absolute top-6 right-6 text-ivory/80 hover:text-ivory p-2 z-50 transition-colors"
          >
            <X size={28} />
          </button>

          {media.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous"
                className="absolute left-6 top-1/2 -translate-y-1/2 h-12 w-12 flex items-center justify-center bg-ivory/10 hover:bg-ivory/20 rounded-full text-ivory transition-all z-50"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next"
                className="absolute right-6 top-1/2 -translate-y-1/2 h-12 w-12 flex items-center justify-center bg-ivory/10 hover:bg-ivory/20 rounded-full text-ivory transition-all z-50"
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}

          <div className="relative max-w-4xl w-full h-[85vh] flex items-center justify-center">
            {activeMedia.type === "video" ? (
              <video
                src={activeMedia.url}
                controls
                autoPlay
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <Image
                src={activeMedia.url}
                alt={title}
                fill
                quality={100}
                className="object-contain"
                sizes="100vw"
              />
            )}
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-ivory/70 text-xs font-mono tracking-widest">
            {active + 1} of {media.length}
          </div>
        </div>
      )}
    </>
  );
}
