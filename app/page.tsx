import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Ecosystem } from "@/components/sections/Ecosystem";
import { Engagement } from "@/components/sections/Engagement";
import { Footer } from "@/components/sections/Footer";
import { Founders } from "@/components/sections/Founders";
import { Hero } from "@/components/sections/Hero";
import { Industries } from "@/components/sections/Industries";
import { Process } from "@/components/sections/Process";
import { Services } from "@/components/sections/Services";
import { WhyUs } from "@/components/sections/WhyUs";
import { BackToTop } from "@/components/ui/BackToTop";
import { SITE_ROOT_ID } from "@/components/ui/Dialog";
import { Nav } from "@/components/ui/Nav";
import { site } from "@/content/site";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  email: site.email,
  description: site.description,
  address: {
    "@type": "PostalAddress",
    addressLocality: site.city,
    addressRegion: site.region,
    addressCountry: "IN",
  },
};

export default function Home() {
  return (
    <div id={SITE_ROOT_ID} className="relative z-10">
      <Nav />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <About />
        <Services />
        <Engagement />
        <Founders />
        <Ecosystem />
        <WhyUs />
        <Process />
        <Industries />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
    </div>
  );
}
