/** Search and sharing text for the company pages. PROPOSED (2026-10-05), built from the chart's words. */
import { site } from "./site";
import type { Vertical } from "./verticals";

export const pageTitle = (v: Vertical) => `${v.name}: ${v.tagline.join(". ")}. | ${site.name}`;
export const pageDescription = (v: Vertical) =>
  `${v.name}: ${v.tagline.join(". ")}. ${v.value} ${v.name} is part of ${site.name}, a creative holding company in Hyderabad. What we do: ${v.whatWeDo.join(", ")}.`;
