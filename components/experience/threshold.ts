/**
 * Crossing a portal into another page's world. Links into another journey call `cross(href)`; the experience plays
 * the threshold (the camera pushes on, the next world's haze rises) and then changes page. The canvas stays mounted.
 */
let handler: ((href: string) => void) | null = null;
export const setThreshold = (h: typeof handler) => { handler = h; };
/** Returns true when the crossing was taken over (the caller then prevents the plain navigation). */
export const cross = (href: string) => {
  if (!handler) return false;
  handler(href);
  return true;
};
