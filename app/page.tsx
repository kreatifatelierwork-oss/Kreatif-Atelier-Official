import { founders } from "@/content/founders";
import { site } from "@/content/site";
import { holding, verticals } from "@/content/verticals";

/** Structured data: a creative holding company in Hyderabad, its five verticals and its founders. */
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${site.url}/#organization`,
  name: site.name,
  url: site.url,
  email: site.email,
  slogan: holding.motto.join(" | "),
  description: `${site.name} is ${holding.descriptor.toLowerCase()}. ${holding.lines.ecosystem} ${holding.lines.verticals}`,
  address: { "@type": "PostalAddress", addressLocality: site.city, addressRegion: site.region, addressCountry: "IN" },
  areaServed: "IN",
  knowsAbout: [...holding.pillars],
  founder: founders.map((f) => ({ "@type": "Person", name: f.name, jobTitle: f.roleFull })),
  subOrganization: verticals.map((v) => ({
    "@type": "Organization",
    name: v.name,
    slogan: v.tagline.join(" "),
    description: v.value,
    url: `${site.url}/${v.slug}`,
    parentOrganization: { "@id": `${site.url}/#organization` },
  })),
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.name,
  url: site.url,
  publisher: { "@id": `${site.url}/#organization` },
  inLanguage: "en-IN",
};

/** Home: "One Take Across the World" (docs/concepts/WORLD-PLAN.md). The experience itself lives in the layout. */
export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([organizationJsonLd, websiteJsonLd]) }} />
    </>
  );
}
