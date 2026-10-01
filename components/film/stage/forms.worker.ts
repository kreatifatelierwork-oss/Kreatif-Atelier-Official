/** Builds the Idea's point-cloud forms off the main thread (see prewarmForms). */
import { buildForms } from "./forms";

self.onmessage = (e: MessageEvent<number>) => {
  const count = e.data;
  const { forms, rand } = buildForms(count);
  (self as unknown as Worker).postMessage({ count, forms, rand }, [...forms.map((f) => f.buffer), rand.buffer]);
};
