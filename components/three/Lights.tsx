"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { config } from "@/lib/config";

type Props = { envResolution: number; boost: number };

/**
 * Moody studio: one warm key, one cool rim, and an environment made of light panels
 * (rendered once into a cube map — no HDR file, nothing fetched from a CDN).
 * Polished metal is almost all reflection, so the panel layout *is* the look.
 */
export function Lights({ envResolution, boost }: Props) {
  const { key, rim } = config.three.lights;
  const { studio } = config.three;

  return (
    <>
      <directionalLight color={key.color} intensity={key.intensity * boost} position={[...key.position]} />
      <directionalLight color={rim.color} intensity={rim.intensity} position={[...rim.position]} />

      <Environment frames={1} resolution={envResolution} environmentIntensity={studio.intensity}>
        <color attach="background" args={["#05070c"]} />
        {studio.panels.map((panel, i) => (
          <Lightformer
            key={i}
            form={panel.form}
            color={panel.color}
            intensity={panel.intensity * boost}
            position={[...panel.position]}
            rotation={[...panel.rotation]}
            scale={[...panel.scale] as [number, number]}
          />
        ))}
      </Environment>
    </>
  );
}
