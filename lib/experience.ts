/** The navigation engine's config: the locked feel (lib/config.ts) plus the current route's place data. */
import { experienceFeel } from "./config";
import { routeData } from "./route-data";

export const experienceConfig = { ...experienceFeel, ...routeData };
