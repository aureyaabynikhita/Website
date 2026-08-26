"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Heart, Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { useCart } from "@/hooks/useCart";

const NAV_LINKS = [
  { label: "New Arrivals", href: "/category/new-arrivals" },
  { label: "Sarees", href: "/category/sarees" },
  { label: "Co-ords", href: "/category/co-ords" },
  { label: "Drape Skirts", href: "/category/drape-skirts" },
  { label: "Lookbook", href: "/lookbook" },
  { label: "Journal", href: "/journal" },
];

export function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { items } = useCart();
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setIsSearchOpen(false);
    setSearchQuery("");
  }

  return (
    <header className="sticky top-0 z-50 bg-white backdrop-blur-sm shadow-sm transition-all duration-300">
      {/* Top Luxury Free Shipping Announcement Bar */}
      <div className="bg-burgundy text-ivory py-2 px-4 text-center border-b border-gold/20">
        <div className="section-container flex items-center justify-center gap-2.5 text-[10px] md:text-[11px] uppercase tracking-[0.22em] font-sans font-medium">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-gold" />
          <span>Complimentary Pan-India Free Shipping on All Orders</span>
          <span className="hidden sm:inline text-gold/60">•</span>
          <span className="hidden sm:inline text-ivory/85">Cash on Delivery Available</span>
        </div>
      </div>

      <div className="section-container flex h-20 md:h-24 items-center justify-between">
        <button
          type="button"
          className="lg:hidden"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.slice(0, 3).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-xs tracking-[0.12em] uppercase text-charcoal/80 hover:text-burgundy transition-colors after:absolute after:-bottom-1 after:left-0 after:h-[1px] after:w-full after:origin-left after:scale-x-0 after:bg-burgundy after:transition-transform after:duration-300 hover:after:scale-x-100"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center h-20 z-20"
        >
          <Image
            src="/images/logo.png"
            alt="AUREYAA Logo"
            width={200}
            height={80}
            priority
            className="h-18 md:h-22 w-auto object-contain"
          />
        </Link>

        <div className="flex items-center gap-5">
          <nav className="hidden lg:flex items-center gap-8 mr-2">
            {NAV_LINKS.slice(3).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-xs tracking-[0.12em] uppercase text-charcoal/80 hover:text-burgundy transition-colors after:absolute after:-bottom-1 after:left-0 after:h-[1px] after:w-full after:origin-left after:scale-x-0 after:bg-burgundy after:transition-transform after:duration-300 hover:after:scale-x-100"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            aria-label="Search"
            onClick={() => setIsSearchOpen(true)}
            className="hover:text-burgundy transition-colors"
          >
            <Search size={19} />
          </button>
          <Link href="/account" aria-label="Account" className="hover:text-burgundy transition-colors">
            <User size={19} />
          </Link>
          <Link href="/wishlist" aria-label="Wishlist" className="hover:text-burgundy transition-colors">
            <Heart size={19} />
          </Link>
          <Link href="/cart" aria-label="Cart" className="hover:text-burgundy transition-colors relative p-1 flex items-center justify-center">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-burgundy text-[9px] font-bold text-ivory">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Search overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-ivory">
          <div className="section-container flex h-26 items-center gap-4">
            <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-3">
              <Search size={20} className="text-charcoal/40" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for gowns, sarees, co-ords..."
                className="flex-1 bg-transparent text-lg font-serif focus:outline-none"
              />
            </form>
            <button type="button" onClick={() => setIsSearchOpen(false)} aria-label="Close search">
              <X size={22} />
            </button>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[999] w-screen h-screen bg-white lg:hidden" style={{ backgroundColor: 'white', opacity: 1 }}>
          <div className="section-container flex h-26 items-center justify-between border-b border-charcoal/10">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center h-16">
              <Image
                src="/images/logo.png"
                alt="AUREYAA Logo"
                width={120}
                height={48}
                className="h-12 w-auto object-contain"
              />
            </Link>
            <button type="button" onClick={() => setIsMenuOpen(false)} aria-label="Close menu">
              <X size={22} />
            </button>
          </div>
          <nav className="section-container flex flex-col gap-6 mt-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-lg font-serif text-charcoal"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
