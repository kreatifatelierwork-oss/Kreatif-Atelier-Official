/** The navigation engine's config: the locked feel (lib/config.ts) plus the current route's place data. */
import { experienceFeel } from "./config";
import { routeData, type RouteData } from "./route-data";

/** Mutable: the active journey swaps the per-place lists in (components/experience/route.ts setJourney). */
export const experienceConfig: typeof experienceFeel & RouteData = { ...experienceFeel, ...routeData };
