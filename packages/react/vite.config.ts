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
    // 테스트·스토리 타입은 배포물에 넣지 않아요.
    // 테스트 파일의 타입 검사는 tsc(tsconfig)가 맡아요.
    dts({
      include: ["src"],
      exclude: ["src/**/*.test.{ts,tsx}", "src/**/*.stories.tsx"],
    }),
    cssLayer(),
  ],
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      cssFileName: "styles",
    },
    rolldownOptions: {
      external,
      // 소스 파일마다 따로 내보내요. 한 파일로 묶으면 Vite가 "use client"를 경고 없이 지워서
      // Next.js 서버 컴포넌트에서 Button 같은 클라이언트 컴포넌트가 깨져요.
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
      },
    },
  },
});
