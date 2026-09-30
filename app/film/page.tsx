import type { Metadata } from "next";
import { Film } from "@/components/film/Film";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: `${site.name} — The Making of a Legacy (preview)`,
  robots: { index: false, follow: false },
};

/** Stage 5 checkpoint: the film's opening and cursor behaviour. Promoted to the home page after approval. */
export default function FilmPage() {
  return (
    <main id="main">
      <Film />
    </main>
  );
}
