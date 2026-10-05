import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/content/site";
import { verticals } from "@/content/verticals";

export const dynamic = "force-static";
export const dynamicParams = false;
export const generateStaticParams = () => verticals.map((v) => ({ company: v.slug }));
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Kreatif Atelier";

const font = (pkg: string, name: string) => readFile(path.join(process.cwd(), "node_modules/@fontsource", pkg, "files", name));
const star = "M12 0c.9 7.2 4.8 11.1 12 12-7.2.9-11.1 4.8-12 12-.9-7.2-4.8-11.1-12-12C7.2 11.1 11.1 7.2 12 0z";
/** Each card on its land's colour (C5); gold is the one accent. */
const ground: Record<string, string> = {
  aurelius: "#14175A", "golden-guardian-productions": "#2A0717", valora: "#3A1A10", asraya: "#0B2A1D", "rudra-yugen": "#04202B",
};

/** The company page's sharing card: its name and tagline in type, the ✦, on its land's colour. Never a logo. */
export default async function Image({ params }: { params: Promise<{ company: string }> }) {
  const slug = (await params).company;
  const vert = verticals.find((x) => x.slug === slug) ?? verticals[0];
  const [outfit, voice, mono] = await Promise.all([
    font("outfit", "outfit-latin-500-normal.woff"),
    font("cormorant-garamond", "cormorant-garamond-latin-400-italic.woff"),
    font("ibm-plex-mono", "ibm-plex-mono-latin-500-normal.woff"),
  ]);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "72px 80px", background: ground[vert.slug], color: "#F7E9CB" }}>
        <svg width="40" height="40" viewBox="0 0 24 24" style={{ marginBottom: 40 }}><path d={star} fill="#C9A45C" /></svg>
        <div style={{ fontFamily: "Mono", fontSize: 22, letterSpacing: 3, color: "#C9A45C", textTransform: "uppercase" }}>{site.name}</div>
        <div style={{ fontFamily: "Outfit", fontSize: vert.name.length > 16 ? 84 : 124, letterSpacing: -3, lineHeight: 1, marginTop: 18 }}>{vert.name}</div>
        <div style={{ display: "flex", fontFamily: "Voice", fontStyle: "italic", fontSize: 44, marginTop: 24 }}>{`${vert.tagline.join(". ")}.`}</div>
      </div>
    ),
    { ...size, fonts: [{ name: "Outfit", data: outfit, weight: 500, style: "normal" }, { name: "Voice", data: voice, weight: 400, style: "italic" }, { name: "Mono", data: mono, weight: 500, style: "normal" }] },
  );
}
