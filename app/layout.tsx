import type { Metadata, Viewport } from "next";
import { Experience } from "@/components/experience/Experience";
import { site } from "@/content/site";
import { cormorant, outfit, plexMono, rupee } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title: site.title,
    description: site.description,
    locale: site.locale,
  },
  twitter: { card: "summary_large_image", title: site.title, description: site.description },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F4F5F7" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0F1A" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={`${cormorant.variable} ${outfit.variable} ${plexMono.variable} ${rupee.variable}`}>
      <body>
        {/* One experience for every page: the canvas persists across page changes (never a blank load). Each page
            chooses its journey by its path and adds its own metadata and structured data. */}
        <main id="main">
          <Experience />
        </main>
        {children}
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
