"use client";

import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { Scene, type SceneProps } from "./Scene";

/** The one <Canvas> (lazy-loaded by LongTake). */
export default function Stage(props: SceneProps & { visible: boolean }) {
  const { visible, mobile, ...rest } = props;
  return (
    <Canvas
      dpr={mobile ? [1, 1.5] : [1, 2]}
      camera={{ fov: mobile ? 52 : 35, position: [0, 0.4, 3.4], near: 0.1, far: 240 }}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.NoToneMapping;
      }}
      aria-hidden="true"
      className="!absolute inset-0"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 1.2s ease" }}
    >
      <Scene {...rest} mobile={mobile} />
    </Canvas>
  );
}
