/**
 * Shared pieces for the v5 world: the route curve (the same one the locked camera rig flies), hold poses, cover sizes,
 * plate URLs (phone versions on phones) and small generated textures (mist, rays) so nothing extra is downloaded.
 */
import * as THREE from "three";
import { experienceConfig as X } from "@/lib/experience";
import { LAST } from "../route";

/** The camera's path: identical to CameraRig's curve, so things placed "along the route" are where the camera goes. */
export const routeCurve = new THREE.CatmullRomCurve3(X.camera.map((c) => new THREE.Vector3(...c.pos)), false, "centripetal");
const smooth = (t: number) => t * t * (3 - 2 * t);
/** The camera position at route position s (same parameterisation as the rig, without pointer parallax). */
export function pointAt(s: number, out = new THREE.Vector3()) {
  const c = Math.max(0, Math.min(LAST, s));
  const i = Math.min(LAST - 1, Math.floor(c));
  return routeCurve.getPoint((i + smooth(c - i)) / LAST, out);
}

export const hold = (i: number) => {
  const c = X.camera[i];
  const pos = new THREE.Vector3(...c.pos);
  const look = new THREE.Vector3(...c.look);
  const m = new THREE.Matrix4().lookAt(pos, look, new THREE.Vector3(0, 1, 0));
  const quat = new THREE.Quaternion().setFromRotationMatrix(m);
  return { pos, look, quat, dir: look.clone().sub(pos).normalize() };
};

/** Height of the view at distance d for a vertical fov (degrees). */
export const viewHeight = (d: number, fov: number) => 2 * d * Math.tan(THREE.MathUtils.degToRad(fov) / 2);

export const plate = (name: string, mobile: boolean) => `/v5/plates/${name}${mobile ? "-m" : ""}.webp`;

let mistTex: THREE.Texture | null = null;
/** A soft, uneven puff of mist (generated once). */
export function mistTexture() {
  if (mistTex) return mistTex;
  const n = 256, c = document.createElement("canvas");
  c.width = c.height = n;
  const g = c.getContext("2d")!;
  for (let k = 0; k < 28; k++) {
    const x = n * (0.25 + Math.random() * 0.5), y = n * (0.3 + Math.random() * 0.4), r = n * (0.12 + Math.random() * 0.22);
    const grd = g.createRadialGradient(x, y, 0, x, y, r);
    grd.addColorStop(0, "rgba(255,255,255,0.22)");
    grd.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, n, n);
  }
  mistTex = new THREE.CanvasTexture(c);
  mistTex.colorSpace = THREE.SRGBColorSpace;
  return mistTex;
}

let rayTex: THREE.Texture | null = null;
/** A shaft of light: bright along the centre line, fading to the sides and toward the far end. */
export function rayTexture() {
  if (rayTex) return rayTex;
  const w = 64, h = 256, c = document.createElement("canvas");
  c.width = w; c.height = h;
  const g = c.getContext("2d")!;
  const img = g.createImageData(w, h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const u = Math.abs(x / (w - 1) - 0.5) * 2, v = y / (h - 1);
    const a = Math.pow(1 - u, 2.2) * Math.pow(1 - v, 1.4) * Math.min(1, v * 8);
    const i = (y * w + x) * 4;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = 255;
    img.data[i + 3] = Math.round(a * 255);
  }
  g.putImageData(img, 0, 0);
  rayTex = new THREE.CanvasTexture(c);
  return rayTex;
}

/** Deterministic pseudo-random numbers (the same world every visit). */
export function rng(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

let crownTex: THREE.Texture | null = null;
/**
 * A rainforest tree crown seen from the side and a little above (generated once): a dome built from hundreds of
 * small leaf clusters, lit from the upper right, darker and bluer in the hollows, with a cut-out silhouette.
 */
export function crownTexture() {
  if (crownTex) return crownTex;
  const W = 256, H = 192, c = document.createElement("canvas");
  c.width = W; c.height = H;
  const g = c.getContext("2d")!;
  const r = rng(1234);
  // Clusters: placed inside a dome, drawn back to front (lower and outer first, so the top catches the light).
  const pts: [number, number, number][] = [];
  for (let k = 0; k < 900; k++) {
    const a = r() * Math.PI, rad = Math.sqrt(r());
    const x = W / 2 + Math.cos(a) * rad * W * 0.47 * (r() < 0.5 ? -1 : 1);
    const y = H * 0.92 - Math.sin(a) * rad * H * 0.82 + (r() - 0.5) * 10;
    pts.push([x, y, r()]);
  }
  pts.sort((p, q) => q[1] - p[1]);
  for (const [x, y, t] of pts) {
    const lit = Math.max(0, Math.min(1, 1 - y / H + (x - W * 0.35) / W * 0.6 + (t - 0.5) * 0.35));
    const l = 10 + lit * 34, h = 82 + t * 26, s = 38 + lit * 22;
    const rr = 4 + t * 7;
    for (let q = 0; q < 5; q++) {
      g.fillStyle = `hsl(${h}, ${s}%, ${l + q * 2}%)`;
      g.beginPath();
      g.ellipse(x + (r() - 0.5) * rr * 1.6, y + (r() - 0.5) * rr, rr * (0.5 + r() * 0.5), rr * (0.3 + r() * 0.35), r() * 3.14, 0, Math.PI * 2);
      g.fill();
    }
  }
  crownTex = new THREE.CanvasTexture(c);
  crownTex.colorSpace = THREE.SRGBColorSpace;
  return crownTex;
}

/**
 * A forest of crowns as cut-out cards: one instanced draw. Each card stands upright and turns to face `toward`
 * (the side the camera sees it from); colour varies per tree.
 */
export function crownForest(spots: { x: number; y: number; z: number; s: number }[], toward: THREE.Vector3, tint = "#ffffff") {
  const geo = new THREE.PlaneGeometry(1, 0.75);
  geo.translate(0, 0.32, 0);
  const mat = new THREE.MeshLambertMaterial({ map: crownTexture(), transparent: true, alphaTest: 0.5, side: THREE.DoubleSide, color: tint });
  const inst = new THREE.InstancedMesh(geo, mat, spots.length);
  const o = new THREE.Object3D(), c = new THREE.Color(), r = rng(spots.length);
  spots.forEach((p, k) => {
    o.position.set(p.x, p.y, p.z);
    o.rotation.set(0, Math.atan2(toward.x - p.x, toward.z - p.z) + (r() - 0.5) * 0.4, 0);
    o.scale.set(p.s * (0.9 + r() * 0.3), p.s, p.s);
    o.updateMatrix();
    inst.setMatrixAt(k, o.matrix);
    inst.setColorAt(k, c.setHSL(0.2 + r() * 0.1, 0.25 + r() * 0.3, 0.45 + r() * 0.35));
  });
  return inst;
}

/** Shows its children only while the camera is near place `place` (in-world words never leak into other frames). */
export const nearPlace = (s: number, place: number, range = 1.05) => Math.abs(s - place) < range;
