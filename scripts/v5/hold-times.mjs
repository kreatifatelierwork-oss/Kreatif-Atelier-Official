import { createJiti } from "/Users/aritraghoshal/Developer/Kreatif Atelier/node_modules/.pnpm/jiti@2.7.0/node_modules/jiti/lib/jiti.mjs";
const root = "/Users/aritraghoshal/Developer/Kreatif Atelier/";
const jiti = createJiti(import.meta.url, { alias: { "@": root } });
const { route } = await jiti.import(root + "components/experience/route.ts");
const words = (x) => (typeof x === "string" ? x.split(/\s+/).filter(Boolean).length : 0);
const out = route.map((p) => {
  let n = 0;
  const walk = (o) => { if (typeof o === "string") n += words(o); else if (Array.isArray(o)) o.forEach(walk); else if (o && typeof o === "object") for (const [k, v] of Object.entries(o)) if (!["k", "tag", "face", "align", "at", "ring", "side", "room", "href"].includes(k)) walk(v); };
  walk(p.items);
  // Read twice at ~3.3 words/s, plus 2 s to take in the frame; at least 6 s.
  return Math.max(6, Math.round(2 + (2 * n) / 3.3));
});
console.log(JSON.stringify(out), out.reduce((a, b) => a + b, 0) + 6 * (out.length - 1));
