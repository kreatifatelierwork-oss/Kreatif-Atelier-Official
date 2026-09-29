import type { Metadata, Viewport } from "next";
import "lenis/dist/lenis.css";
import { DebugHud } from "@/components/ui/DebugHud";
import { site } from "@/content/site";
import { cormorant, manrope, outfit, rupee } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title: site.title,
    description: site.description,
    locale: site.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#F7F3EC",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable} ${outfit.variable} ${rupee.variable}`}>
      <body>
        <div className="backdrop" aria-hidden="true" />
        {children}
        <div className="grain" aria-hidden="true" />
        <DebugHud />
      </body>
    </html>
  );
}
