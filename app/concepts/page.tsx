import type { Metadata } from "next";
import { ConceptLab } from "@/components/concepts/ConceptLab";
import { conceptLab } from "@/content/concepts";

export const metadata: Metadata = {
  title: `${conceptLab.title} — Kreatif Atelier`,
  robots: { index: false, follow: false },
};

export default function ConceptsPage() {
  return <ConceptLab />;
}
