import localFont from "next/font/local";

/** Free geometric sans standing in for Cera in the `?type=sans` headline test (SIL OFL). */
export const outfit = localFont({
  src: "../../node_modules/@fontsource-variable/outfit/files/outfit-latin-wght-normal.woff2",
  weight: "100 900",
  variable: "--font-outfit",
  display: "swap",
  fallback: ["Manrope", "system-ui", "sans-serif"],
});

/** WOFF files for three.js text (troika can't read WOFF2). */
export const threeFonts = {
  serif: "/fonts/cormorant-garamond-500.woff",
  serifItalic: "/fonts/cormorant-garamond-400-italic.woff",
  sans: "/fonts/outfit-700.woff",
} as const;
