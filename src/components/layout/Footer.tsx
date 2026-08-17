import Image from "next/image";
import Link from "next/link";
import { Instagram, MessageCircle } from "lucide-react";

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
      <div className="section-container py-8 md:py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div className="flex items-center h-16 mb-2">
              <Link href="/">
                <Image
                  src="/images/logo.png"
                  alt="AUREYAA Logo"
                  width={200}
                  height={80}
                  className="h-14 w-auto object-contain invert mix-blend-screen"
                />
              </Link>
            </div>
            <div className="text-xs text-beige/70 leading-relaxed space-y-1">
              <p className="font-semibold text-gold tracking-wider uppercase text-[10px]">Visit Us</p>
              <p>Shop No. G-21, Om Heera Panna Mall,</p>
              <p>Oshiwara, Jogeshwari West,</p>
              <p>Mumbai – 400102</p>
            </div>
            <div className="text-xs text-beige/70 leading-relaxed space-y-1">
              <p className="font-semibold text-gold tracking-wider uppercase text-[10px]">Contact Us</p>
              <a href="mailto:aureyaabynikhita@gmail.com" className="hover:text-ivory transition-colors block">aureyaabynikhita@gmail.com</a>
              <a href="tel:+919137709400" className="hover:text-ivory transition-colors block">+91 91377 09400</a>
            </div>
            <div className="flex gap-4 pt-2">
              <a href="https://instagram.com/aureyaabynikhita" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-gold transition-colors">
                <Instagram size={18} />
              </a>
              <a href="https://wa.me/919137709400" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="hover:text-gold transition-colors">
                <MessageCircle size={18} />
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

        <div className="mt-8 pt-4 border-t border-beige/15 flex flex-col md:flex-row justify-between gap-3 text-xs text-beige/60">
          <p>© {new Date().getFullYear()} Aureyaa. All rights reserved.</p>
          <p>Crafted with quiet luxury in mind.</p>
        </div>
      </div>
    </footer>
  );
}
