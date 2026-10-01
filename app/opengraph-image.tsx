import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { holding } from "@/content/verticals";
import { site } from "@/content/site";

export const dynamic = "force-static";
export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const font = (pkg: string, name: string) => readFile(path.join(process.cwd(), "node_modules/@fontsource", pkg, "files", name));

const star = "M12 0c.9 7.2 4.8 11.1 12 12-7.2.9-11.1 4.8-12 12-.9-7.2-4.8-11.1-12-12C7.2 11.1 11.1 7.2 12 0z";

/** The sharing card: the name in type, the ✦ and the chart's lines on the Luminous canvas. Never a logo or mark. */
export default async function OpengraphImage() {
  const [outfit, voice, mono] = await Promise.all([
    font("outfit", "outfit-latin-500-normal.woff"),
    font("cormorant-garamond", "cormorant-garamond-latin-400-italic.woff"),
    font("ibm-plex-mono", "ibm-plex-mono-latin-500-normal.woff"),
  ]);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "72px 80px", background: "#F4F5F7", color: "#0B0F1A" }}>
        <svg width="40" height="40" viewBox="0 0 24 24" style={{ marginBottom: 40 }}>
          <path d={star} fill="#C9A45C" />
        </svg>
        <div style={{ fontFamily: "Mono", fontSize: 22, letterSpacing: 3, color: "#5A5E6A", textTransform: "uppercase" }}>{holding.motto.join(" | ")}</div>
        <div style={{ fontFamily: "Outfit", fontSize: 124, letterSpacing: -4, lineHeight: 1, marginTop: 18 }}>{site.name}</div>
        <div style={{ fontFamily: "Voice", fontStyle: "italic", fontSize: 44, marginTop: 24, color: "#2A2E38" }}>{holding.lines.ecosystem}</div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Outfit", data: outfit, weight: 500, style: "normal" },
        { name: "Voice", data: voice, weight: 400, style: "italic" },
        { name: "Mono", data: mono, weight: 500, style: "normal" },
      ],
    },
  );
}
