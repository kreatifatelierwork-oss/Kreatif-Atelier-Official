import localFont from "next/font/local";

// Self-hosted (no build-time or runtime requests to Google). Variable weight axes.
export const cormorant = localFont({
  src: [
    {
      path: "../node_modules/@fontsource-variable/cormorant-garamond/files/cormorant-garamond-latin-wght-normal.woff2",
      weight: "300 700",
      style: "normal",
    },
    {
      path: "../node_modules/@fontsource-variable/cormorant-garamond/files/cormorant-garamond-latin-wght-italic.woff2",
      weight: "300 700",
      style: "italic",
    },
  ],
  variable: "--font-cormorant",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

export const manrope = localFont({
  src: "../node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2",
  weight: "200 800",
  variable: "--font-manrope",
  display: "swap",
  fallback: ["system-ui", "Helvetica Neue", "Arial", "sans-serif"],
});

// The latin subset has no ₹ — this 1 KB face (Cormorant latin-ext, subset to U+20B9) fills it in for prices.
export const rupee = localFont({
  src: "./fonts/cormorant-rupee.woff2",
  weight: "300 700",
  variable: "--font-rupee",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+20B9" }],
});
