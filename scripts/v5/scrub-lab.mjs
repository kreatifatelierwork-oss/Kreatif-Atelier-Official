// Compare scrub methods (all-intra MP4, short-GOP MP4, JPEG sequence) in the research Chrome. Serve a folder holding
// scrub-lab.html as lab.html, intra.mp4, gop8.mp4 and seq/fNNNN.jpg on port 4175, then run this.
import { chromium } from "playwright-core";
const b = await chromium.connectOverCDP("http://127.0.0.1:9555"); const ctx = b.contexts()[0];
for (const kind of (process.argv[2] ?? "intra,gop8,seq,intra,gop8,seq").split(",")) {
  const p = await ctx.newPage(); await p.goto("http://localhost:4175/lab.html");
  const r = await p.evaluate((k) => window.run(k), kind); console.log(kind.padEnd(6), JSON.stringify(r)); await p.close();
}
process.exit(0);
