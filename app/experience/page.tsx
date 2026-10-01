import type { Metadata } from "next";
import { Experience } from "@/components/experience/Experience";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: `${site.name}: The Making of a Legacy (preview)`,
  robots: { index: false, follow: false },
};

/** v3 "Shot on Location" (docs/concepts/THE-MAKING-OF-v3.md): the first vertical slice, built here before it replaces the home page. */
export default function ExperiencePage() {
  return (
    <main id="main">
      <Experience />
    </main>
  );
}
