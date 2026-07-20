import Link from "next/link";
import { Instagram, Facebook, Youtube } from "lucide-react";

const FOOTER_COLUMNS = [
  {
    title: "About",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Designer — Nikhita Matania", href: "/about#designer" },
      { label: "Sustainability", href: "/sustainability" },
      { label: "Journal", href: "/journal" },
    ],
  },
  {
    title: "Customer Care",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Track Your Order", href: "/account/orders" },
      { label: "Size Guide", href: "/size-guide" },
      { label: "FAQs", href: "/faqs" },
    ],
  },
  {
    title: "Policies",
    links: [
      { label: "Shipping Policy", href: "/policies/shipping" },
      { label: "Returns & Refunds", href: "/policies/returns" },
      { label: "Privacy Policy", href: "/policies/privacy" },
      { label: "Terms of Service", href: "/policies/terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-burgundy text-beige">
      <div className="section-container py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <p className="font-serif text-2xl tracking-[0.15em] text-ivory">AUREYAA</p>
            <p className="mt-2 text-xs text-beige/70 tracking-[0.1em] uppercase">
              by Nikhita Matania
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" aria-label="Instagram" className="hover:text-gold transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" aria-label="Facebook" className="hover:text-gold transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" aria-label="YouTube" className="hover:text-gold transition-colors">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs tracking-[0.15em] uppercase text-gold mb-4">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-beige/80 hover:text-ivory transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-6 border-t border-beige/15 flex flex-col md:flex-row justify-between gap-3 text-xs text-beige/60">
          <p>© {new Date().getFullYear()} Aureyaa. All rights reserved.</p>
          <p>Crafted with quiet luxury in mind.</p>
        </div>
      </div>
    </footer>
  );
}
