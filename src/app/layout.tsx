import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/components/shared/AuthProvider";
import { AnalyticsScripts } from "@/components/shared/AnalyticsScripts";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "AUREYAA by Nikhita Matania",
    template: "%s | AUREYAA",
  },
  description:
    "AUREYAA — quiet luxury fashion by Nikhita Matania. Editorial. Minimal. Timeless.",
  openGraph: {
    siteName: "AUREYAA",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AUREYAA",
    alternateName: "AUREYAA by Nikhita Matania",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    email: "aureyaabynikhita@gmail.com",
    telephone: "+91-9137709400",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Shop No. G-21, Om Heera Panna Mall, Oshiwara",
      addressLocality: "Jogeshwari West",
      addressRegion: "Maharashtra",
      postalCode: "400102",
      addressCountry: "IN",
    },
    sameAs: [
      "https://instagram.com/aureyaabynikhita",
      "https://wa.me/919137709400",
    ],
  };

  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        {/* eslint-disable-next-line react/no-danger */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <AuthProvider>{children}</AuthProvider>
        <Toaster position="bottom-center" toastOptions={{ style: { fontSize: "14px" } }} />
        <AnalyticsScripts />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
