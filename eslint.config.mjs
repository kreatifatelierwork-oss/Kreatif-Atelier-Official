import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // The 3D stage animates three.js objects inside useFrame, mutating materials, uniforms and meshes every frame:
    // that is the React Three Fiber model. The React Compiler is not enabled in this project, so its purity rules
    // don't apply to these scene components.
    files: ["components/experience/stage/**/*.tsx"],
    rules: { "react-hooks/immutability": "off", "react-hooks/refs": "off", "react-hooks/use-memo": "off" },
  },
  globalIgnores([".next/**", "out/**", ".pnpm-store/**", "next-env.d.ts", "design-sources/**", ".claude/**"]),
]);
