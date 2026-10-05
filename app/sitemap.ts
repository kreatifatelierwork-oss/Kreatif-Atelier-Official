import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { verticals } from "@/content/verticals";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${site.url}/`, changeFrequency: "monthly", priority: 1 },
    ...verticals.map((v) => ({ url: `${site.url}/${v.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
