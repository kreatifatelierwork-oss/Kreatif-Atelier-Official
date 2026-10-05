import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageDescription, pageTitle } from "@/content/pages";
import { site } from "@/content/site";
import { verticals } from "@/content/verticals";

export const dynamicParams = false;
export const generateStaticParams = () => verticals.map((v) => ({ company: v.slug }));

type Props = { params: Promise<{ company: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { company } = await params;
  const v = verticals.find((x) => x.slug === company);
  if (!v) return {};
  const title = pageTitle(v), description = pageDescription(v);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/${v.slug}` },
    openGraph: { type: "website", url: `/${v.slug}`, siteName: site.name, title, description, locale: site.locale },
    twitter: { card: "summary_large_image", title, description },
  };
}

/** A company page: its journey runs in the shared experience (the layout); this adds its structured data. */
export default async function CompanyPage({ params }: Props) {
  const { company } = await params;
  const v = verticals.find((x) => x.slug === company);
  if (!v) notFound();
  const ld = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: v.name,
    url: `${site.url}/${v.slug}`,
    slogan: v.tagline.join(" "),
    description: v.value,
    knowsAbout: [...v.whatWeDo],
    parentOrganization: { "@type": "Organization", name: site.name, url: site.url },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />;
}
