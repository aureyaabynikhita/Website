import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/components/shared/AuthProvider";
import { AnalyticsScripts } from "@/components/shared/AnalyticsScripts";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { NavigationProgressBar } from "@/components/shared/NavigationProgressBar";
import { Suspense } from "react";
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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aureyaa.com";

export const viewport: Viewport = {
  themeColor: "#5A1F2F",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AUREYAA — Quiet Luxury Indo-Western Fashion by Nikhita Matania",
    template: "%s | AUREYAA",
  },
  description:
    "AUREYAA by Nikhita Matania is a luxury Indian fashion house crafting timeless silhouettes — designer drape sarees, handcrafted co-ord sets, drape skirts, and occasion wear.",
  keywords: [
    "AUREYAA",
    "Aureyaa by Nikhita",
    "Nikhita Matania",
    "Quiet Luxury Fashion",
    "Indo-Western fashion",
    "Designer drape saree",
    "Luxury co-ord sets",
    "Drape skirts",
    "Indian occasion wear",
    "Contemporary Indian designer",
    "Heirloom handcrafted clothing",
    "Mumbai designer fashion",
  ],
  authors: [{ name: "Nikhita Matania", url: SITE_URL }],
  creator: "Nikhita Matania",
  publisher: "AUREYAA",
  applicationName: "AUREYAA",
  category: "fashion",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/icon.png" },
    ],
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "AUREYAA",
    title: "AUREYAA — Quiet Luxury Indo-Western Fashion by Nikhita Matania",
    description:
      "Discover heirloom occasion wear, pre-stitched drape sarees, and modern co-ord sets crafted for those who wear luxury quietly.",
    images: [
      {
        url: "/images/hero-main.png",
        width: 1200,
        height: 630,
        alt: "AUREYAA by Nikhita Matania — Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AUREYAA — Quiet Luxury Fashion by Nikhita Matania",
    description:
      "Heirloom occasion wear, designer drape sarees, and luxury co-ord sets.",
    images: ["/images/hero-main.png"],
    creator: "@aureyaabynikhita",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Rich Multi-Schema JSON-LD for Google, Bing, ChatGPT, Perplexity & Gemini Search
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "ClothingStore",
      name: "AUREYAA",
      alternateName: "AUREYAA by Nikhita Matania",
      description:
        "Quiet luxury Indo-Western fashion house offering designer drape sarees, co-ord sets, drape skirts, and occasion wear.",
      url: SITE_URL,
      logo: `${SITE_URL}/images/logo.png`,
      image: `${SITE_URL}/images/hero-main.png`,
      email: "aureyaabynikhita@gmail.com",
      telephone: "+91-9137709400",
      priceRange: "₹₹₹",
      currenciesAccepted: "INR",
      paymentAccepted: "Credit Card, Debit Card, UPI, Netbanking, Cash on Delivery",
      founder: {
        "@type": "Person",
        name: "Nikhita Matania",
        jobTitle: "Creative Director & Founder",
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: "Shop No. G-21, Om Heera Panna Mall, Oshiwara",
        addressLocality: "Jogeshwari West, Mumbai",
        addressRegion: "Maharashtra",
        postalCode: "400102",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 19.1418,
        longitude: 72.8335,
      },
      sameAs: [
        "https://instagram.com/aureyaabynikhita",
        "https://wa.me/919137709400",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "AUREYAA",
      url: SITE_URL,
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ];

  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body>
        {structuredData.map((schema, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
        <Suspense fallback={null}>
          <NavigationProgressBar />
        </Suspense>
        <AuthProvider>{children}</AuthProvider>
        <Toaster position="bottom-center" toastOptions={{ style: { fontSize: "14px" } }} />
        <AnalyticsScripts />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
