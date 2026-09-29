import { LongTake } from "@/components/longtake/LongTake";
import { holding, verticals } from "@/content/verticals";
import { site } from "@/content/site";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  email: site.email,
  description: `${holding.lines.ecosystem} ${holding.lines.verticals}`,
  subOrganization: verticals.map((v) => ({ "@type": "Organization", name: v.name, description: v.value })),
  address: { "@type": "PostalAddress", addressLocality: site.city, addressRegion: site.region, addressCountry: "IN" },
};

/** Home: The Long Take. */
export default function Home() {
  return (
    <>
      <main id="main">
        <LongTake />
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
    </>
  );
}
