import type { Metadata } from "next";
import { Redirect } from "./Redirect";

export const metadata: Metadata = {
  title: "Kreatif Atelier",
  robots: { index: false, follow: true },
  alternates: { canonical: "/" },
};

/** The old preview address: forwards to the home page, keeping any place link (#aurelius, #founders …). */
export default function ExperienceRedirect() {
  return (
    <main id="main">
      <noscript>
        <meta httpEquiv="refresh" content="0; url=/" />
      </noscript>
      <Redirect />
    </main>
  );
}
