import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

import pkg from "./package.json" with { type: "json" };

type Dependencies = Partial<
  Record<"dependencies" | "peerDependencies", Record<string, string>>
>;
const { dependencies, peerDependencies }: Dependencies = pkg;

// 쓰는 쪽이 설치하는 패키지는 번들에 넣지 않는다 (react/jsx-runtime 같은 하위 경로 포함).
const external = Object.keys({ ...dependencies, ...peerDependencies }).map(
  (name) => new RegExp(`^${name}($|/)`),
);

export default defineConfig({
  plugins: [react(), vanillaExtractPlugin(), dts({ include: ["src"] })],
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: "index",
      cssFileName: "styles",
    },
    rolldownOptions: { external },
  },
});
