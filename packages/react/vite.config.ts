import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import dts from "vite-plugin-dts";

import pkg from "./package.json" with { type: "json" };

type Dependencies = Partial<
  Record<"dependencies" | "peerDependencies", Record<string, string>>
>;
const { dependencies, peerDependencies }: Dependencies = pkg;

// 쓰는 쪽이 설치하는 패키지는 번들에 넣지 않아요 (react/jsx-runtime 같은 하위 경로 포함).
const external = Object.keys({ ...dependencies, ...peerDependencies }).map(
  (name) => new RegExp(`^${name}($|/)`),
);

// vanilla-extract가 만든 컴포넌트 CSS를 `@layer d5ng`에 담아요.
// 레이어 밖의 스타일이 항상 이겨서, 쓰는 쪽 CSS가 우리 스타일을 덮어쓸 수 있어요.
// 토큰은 @d5ng/tokens의 tokens.css에서 이미 같은 레이어에 담겨 와요.
function cssLayer(): Plugin {
  return {
    name: "d5ng:css-layer",
    enforce: "pre",
    transform(code, id) {
      if (/\.css\.ts\.vanilla\.css(\?|$)/.test(id)) {
        return `@layer d5ng{${code}}`;
      }
      return undefined;
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    vanillaExtractPlugin(),
    dts({ include: ["src"] }),
    cssLayer(),
  ],
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
