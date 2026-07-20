"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Heart, Search, ShoppingBag, User, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "New Arrivals", href: "/category/new-arrivals" },
  { label: "Gowns", href: "/category/gowns" },
  { label: "Sarees", href: "/category/sarees" },
  { label: "Co-ords", href: "/category/co-ords" },
  { label: "Lookbook", href: "/lookbook" },
  { label: "Journal", href: "/journal" },
];

export function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setIsSearchOpen(false);
    setSearchQuery("");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-charcoal/10 bg-ivory/95 backdrop-blur-sm">
      <div className="section-container flex h-20 items-center justify-between">
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
          className="font-serif text-2xl md:text-3xl tracking-[0.15em] text-burgundy absolute left-1/2 -translate-x-1/2"
        >
          AUREYAA
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
          <Link href="/cart" aria-label="Cart" className="hover:text-burgundy transition-colors">
            <ShoppingBag size={19} />
          </Link>
        </div>
      </div>

      {/* Search overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-ivory">
          <div className="section-container flex h-20 items-center gap-4">
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
        <div className="fixed inset-0 z-50 bg-ivory lg:hidden">
          <div className="section-container flex h-20 items-center justify-between">
            <span className="font-serif text-2xl text-burgundy">AUREYAA</span>
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
