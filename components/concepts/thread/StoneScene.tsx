"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type Props = {
  /** The visitor's inlay so far (white strokes on black), drawn by the page. */
  trail: THREE.CanvasTexture;
  /** Raking light position in 0–1 screen space (y up), and how strongly it follows. */
  lightRef: React.RefObject<{ x: number; y: number }>;
  /** 0 → 1 fade up of the stone while loading. */
  revealRef: React.RefObject<number>;
};

const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy * 2.0, 0.0, 1.0); }
`;

/**
 * Black stone (think Bidri ware's blackened alloy) with a procedural relief, lit by a raking light
 * that follows the pointer. Wherever the visitor has drawn, the stone is grooved and filled with gold.
 */
const fragmentShader = /* glsl */ `
uniform vec2 uRes;
uniform vec2 uLight;
uniform float uReveal;
uniform sampler2D uTrail;
varying vec2 vUv;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
  return v;
}
float stoneHeight(vec2 px) { return fbm(px * 0.0035) * 0.55 + fbm(px * 0.018) * 0.3 + fbm(px * 0.09) * 0.12; }
float inlay(vec2 uv) { return texture2D(uTrail, uv).r; }
float surface(vec2 px, vec2 uv) { return stoneHeight(px) - inlay(uv) * 0.45; }

void main() {
  vec2 px = vUv * uRes;
  float h = surface(px, vUv);
  vec2 texel = 1.5 / uRes;
  float hx = surface(px + vec2(1.5, 0.0), vUv + vec2(texel.x, 0.0)) - h;
  float hy = surface(px + vec2(0.0, 1.5), vUv + vec2(0.0, texel.y)) - h;
  vec3 n = normalize(vec3(-hx * 7.0, -hy * 7.0, 1.0));

  vec3 lightPos = vec3(uLight * uRes, 240.0);
  vec3 toLight = lightPos - vec3(px, 0.0);
  vec3 L = normalize(toLight);
  float dist = length(toLight.xy);
  float atten = 1.0 / (1.0 + dist * dist * 0.0000045);
  float diff = max(dot(n, L), 0.0);
  vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));

  float stoneH = stoneHeight(px);
  vec3 stone = mix(vec3(0.022, 0.025, 0.032), vec3(0.07, 0.074, 0.085), stoneH);
  float speck = step(0.992, hash(floor(px * 0.6))) * 0.5;
  vec3 col = stone * (0.18 + diff * 1.7 * atten) + speck * diff * atten * vec3(0.8, 0.75, 0.62) * 0.25;

  float g = smoothstep(0.12, 0.55, inlay(vUv));
  vec3 gold = vec3(0.93, 0.70, 0.36);
  float spec = pow(max(dot(n, H), 0.0), 48.0);
  vec3 goldLit = gold * (0.28 + diff * atten * 1.25) + spec * atten * vec3(1.0, 0.88, 0.66) * 2.2;
  col = mix(col, goldLit, g);

  gl_FragColor = vec4(col * uReveal, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

export function StoneScene({ trail, lightRef, revealRef }: Props) {
  const size = useThree((s) => s.size);
  const meshRef = useRef<THREE.Mesh>(null);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uRes: { value: new THREE.Vector2(1, 1) },
          uLight: { value: new THREE.Vector2(0.3, 0.6) },
          uReveal: { value: 0 },
          uTrail: { value: trail },
        },
        depthTest: false,
      }),
    [trail],
  );

  useFrame((_, dt) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const u = (mesh.material as THREE.ShaderMaterial).uniforms;
    (u.uRes.value as THREE.Vector2).set(size.width, size.height);
    const target = lightRef.current ?? { x: 0.3, y: 0.6 };
    const light = u.uLight.value as THREE.Vector2;
    light.x += (target.x - light.x) * Math.min(1, dt * 4);
    light.y += (target.y - light.y) * Math.min(1, dt * 4);
    u.uReveal.value = revealRef.current ?? 1;
    (u.uTrail.value as THREE.Texture).needsUpdate = true;
  });

  return (
    <mesh ref={meshRef} frustumCulled={false} material={material}>
      <planeGeometry args={[1, 1]} />
    </mesh>
  );
}
