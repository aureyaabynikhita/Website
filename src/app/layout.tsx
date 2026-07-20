import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/components/shared/AuthProvider";
import { AnalyticsScripts } from "@/components/shared/AnalyticsScripts";
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
    sameAs: [
      "https://instagram.com/aureyaa.official",
      "https://facebook.com/aureyaa.official",
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
      </body>
    </html>
  );
}
