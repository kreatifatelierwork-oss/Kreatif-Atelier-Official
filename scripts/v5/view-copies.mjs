import sharp from "sharp"; import fs from "fs"; import path from "path";
const out = process.argv[2]; fs.mkdirSync(out,{recursive:true});
for (const d of ["home","pages","graphics","plates"]) for (const f of fs.readdirSync(`design-refs/${d}`).filter(f=>f.endsWith(".png"))) {
  await sharp(`design-refs/${d}/${f}`).resize({width:1400,height:1400,fit:"inside"}).flatten({background:"#808080"}).jpeg({quality:82}).toFile(path.join(out,f.replace(".png",".jpg")));
}
console.log(fs.readdirSync(out).length);
