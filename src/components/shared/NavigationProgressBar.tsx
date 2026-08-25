"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function NavigationProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // When pathname or search params change, complete the progress bar
  useEffect(() => {
    if (isLoading) {
      setProgress(100);
      const timer = setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    let progressTimer: NodeJS.Timeout;

    if (isLoading) {
      // Step-wise realistic luxury progress animation
      setProgress((prev) => (prev === 0 ? 18 : prev));

      progressTimer = setInterval(() => {
        setProgress((prev) => {
          if (prev < 40) return prev + 12;
          if (prev < 70) return prev + 6;
          if (prev < 88) return prev + 2;
          return prev;
        });
      }, 150);
    }

    return () => {
      if (progressTimer) clearInterval(progressTimer);
    };
  }, [isLoading]);

  useEffect(() => {
    // Intercept clicks on links across the entire website
    function handleAnchorClick(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      const targetAttr = target.getAttribute("target");

      // Ignore external links, hash anchors, mailto, tel, downloads, or new-tab clicks
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        targetAttr === "_blank" ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      // Check if it's an internal link
      try {
        const url = new URL(href, window.location.origin);
        if (url.origin === window.location.origin) {
          // If it's navigating to the exact same full URL, don't trigger
          const currentUrl = window.location.pathname + window.location.search;
          const destinationUrl = url.pathname + url.search;
          if (currentUrl === destinationUrl) {
            return;
          }

          startTransition(() => {
            setIsLoading(true);
            setProgress(25);
          });
        }
      } catch {
        // Ignore invalid URLs
      }
    }

    // Custom events for programmatic navigation
    function handleCustomStart() {
      setIsLoading(true);
      setProgress(25);
    }

    function handleCustomEnd() {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 300);
    }

    document.addEventListener("click", handleAnchorClick, { capture: true });
    window.addEventListener("aureyaa:navigation-start", handleCustomStart);
    window.addEventListener("aureyaa:navigation-end", handleCustomEnd);

    return () => {
      document.removeEventListener("click", handleAnchorClick, { capture: true });
      window.removeEventListener("aureyaa:navigation-start", handleCustomStart);
      window.removeEventListener("aureyaa:navigation-end", handleCustomEnd);
    };
  }, []);

  if (!isLoading && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 right-0 z-[999999]"
    >
      {/* Golden Top Glow Line */}
      <div
        className="h-[3px] bg-gradient-to-r from-burgundy via-gold to-gold-light transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          boxShadow: "0 0 14px rgba(199, 163, 107, 0.9), 0 0 6px rgba(90, 31, 47, 0.6)",
        }}
      />

      {/* Floating Luxury Brand Loading Indicator (Top-Right) */}
      <div
        className={`fixed top-4 right-4 flex items-center gap-2.5 bg-ivory/95 backdrop-blur-md px-3.5 py-1.5 border border-gold/30 shadow-lg transition-all duration-300 ${
          isLoading ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-burgundy opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-dark"></span>
        </span>
        <span className="text-[10px] uppercase font-serif tracking-[0.2em] text-burgundy font-semibold">
          Loading Atelier...
        </span>
      </div>
    </div>
  );
}
