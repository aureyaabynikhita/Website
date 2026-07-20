import type { Config } from "tailwindcss";

// AUREYAA Design Tokens
// Quiet luxury / editorial. Every color, spacing, and type choice here
// is intentional — do not add ad-hoc hex values in components.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        burgundy: {
          DEFAULT: "#5A1F2F",
          light: "#7A3247",
          dark: "#3E1420",
        },
        beige: {
          DEFAULT: "#EDE4DA",
          light: "#F5EFE8",
        },
        ivory: "#FAF8F5",
        gold: {
          DEFAULT: "#C7A36B",
          light: "#D9BE8F",
          dark: "#A8854F",
        },
        charcoal: "#2E2E2E",
        success: "#5C7A5C",
        error: "#8C4A4A",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Helvetica Neue", "sans-serif"],
      },
      fontSize: {
        // Editorial type scale — generous line-height, tight tracking on display
        "display-xl": ["4.5rem", { lineHeight: "1.05", letterSpacing: "-0.01em" }],
        "display-lg": ["3.5rem", { lineHeight: "1.1", letterSpacing: "-0.01em" }],
        "display-md": ["2.5rem", { lineHeight: "1.15" }],
        "display-sm": ["1.75rem", { lineHeight: "1.25" }],
      },
      spacing: {
        // Luxury whitespace scale (multiples of 4px, extended for large sections)
        18: "4.5rem",
        22: "5.5rem",
        30: "7.5rem",
        38: "9.5rem",
      },
      borderRadius: {
        none: "0px",
        sm: "2px",
        DEFAULT: "2px",
        md: "4px",
        lg: "6px",
        full: "9999px",
      },
      maxWidth: {
        container: "1440px",
      },
      transitionDuration: {
        400: "400ms",
      },
    },
  },
  plugins: [],
};

export default config;
