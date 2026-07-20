/**
 * AUREYAA brand tokens — single source of truth.
 * Mirrors tailwind.config.ts so non-Tailwind contexts (transactional emails,
 * generated PDFs/invoices, canvas/image generation) stay on-brand.
 */
export const BRAND = {
  name: "AUREYAA",
  tagline: "by Nikhita Matania",
  colors: {
    burgundy: "#5A1F2F",
    burgundyLight: "#7A3247",
    burgundyDark: "#3E1420",
    beige: "#EDE4DA",
    ivory: "#FAF8F5",
    gold: "#C7A36B",
    goldDark: "#A8854F",
    charcoal: "#2E2E2E",
    success: "#5C7A5C",
    error: "#8C4A4A",
  },
  fonts: {
    serif: "'Cormorant Garamond', Georgia, serif", // headings — editorial serif
    sans: "'Inter', 'Helvetica Neue', sans-serif", // body — clean modern sans
  },
} as const;

export type BrandColors = typeof BRAND.colors;
