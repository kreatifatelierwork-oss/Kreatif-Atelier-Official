"use client";

import { Bloom, EffectComposer, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { config } from "@/lib/config";

type Props = { level: "full" | "light" };

/**
 * Bloom → vignette → AgX tone mapping. (Film grain is the site-wide CSS overlay, so it costs nothing here.)
 * "light" (mobile) halves the bloom resolution and uses 2× MSAA (cheap on tile-based mobile GPUs;
 * thin ribbon edges stair-step badly without it).
 */
export function PostFX({ level }: Props) {
  const { bloom, vignette } = config.three.postfx;
  const full = level === "full";

  return (
    <EffectComposer multisampling={full ? 4 : 2}>
      <Bloom
        mipmapBlur
        intensity={bloom.intensity}
        luminanceThreshold={bloom.threshold}
        luminanceSmoothing={bloom.smoothing}
        radius={bloom.radius}
        resolutionScale={full ? 1 : 0.5}
      />
      <Vignette offset={vignette.offset} darkness={vignette.darkness} />
      <ToneMapping mode={ToneMappingMode.AGX} />
    </EffectComposer>
  );
}
