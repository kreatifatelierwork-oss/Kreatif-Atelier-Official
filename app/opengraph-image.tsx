import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { hero, site } from "@/content/site";

export const dynamic = "force-static";
export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fontFile = (name: string) =>
  readFile(path.join(process.cwd(), "node_modules/@fontsource/cormorant-garamond/files", name));

const star = "M12 0c.9 7.2 4.8 11.1 12 12-7.2.9-11.1 4.8-12 12-.9-7.2-4.8-11.1-12-12C7.2 11.1 11.1 7.2 12 0z";

/** Typography + ✦ only — never a logo or mark. */
export default async function OpengraphImage() {
  const [medium, italic] = await Promise.all([
    fontFile("cormorant-garamond-latin-500-normal.woff"),
    fontFile("cormorant-garamond-latin-400-italic.woff"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at 50% 40%, #1d2b4a 0%, #0B0F1A 70%)",
          color: "#F3EBDD",
          fontFamily: "Cormorant",
        }}
      >
        <svg width="44" height="44" viewBox="0 0 24 24">
          <path d={star} fill="#C9A45C" />
        </svg>
        <div style={{ marginTop: 34, fontSize: 92, letterSpacing: 12, color: "#E8C98A", fontWeight: 500 }}>
          {site.wordmark}
        </div>
        <div style={{ marginTop: 18, fontSize: 40, fontStyle: "italic", color: "#F3EBDD" }}>
          {hero.positioning.join(" ")}
        </div>
        <div style={{ marginTop: 34, fontSize: 26, letterSpacing: 10, color: "#C9A45C", fontWeight: 500, fontStyle: "normal" }}>
          {hero.brandLine.join("  ·  ").toUpperCase()}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Cormorant", data: medium, weight: 500, style: "normal" },
        { name: "Cormorant", data: italic, weight: 400, style: "italic" },
      ],
    },
  );
}
