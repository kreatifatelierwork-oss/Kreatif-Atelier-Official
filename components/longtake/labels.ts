import { longTake } from "@/content/concepts";
import { verticals } from "@/content/verticals";
import { CONTACT, ECOSYSTEM } from "./journey";

export const reelName = (k: number) =>
  k === 0 ? longTake.reelCore : k === ECOSYSTEM ? longTake.reelFinale : k === CONTACT ? longTake.reelContact : verticals[k - 1].name;

export const pad = (n: number) => String(n).padStart(2, "0");
