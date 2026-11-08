import { readFileSync } from "node:fs";

import { defineConfig, type Plugin } from "vite";
import dts from "vite-plugin-dts";

// tokens.css를 `@layer d5ng`에 담아 dist에 내보내요.
// @d5ng/react의 styles.css와 같은 레이어라서, 쓰는 쪽 CSS가 토큰 값을 덮어쓸 수 있어요.
function tokensCss(): Plugin {
  return {
    name: "d5ng:tokens-css",
    generateBundle() {
      const css = readFileSync("src/generated/tokens.css", "utf8");
      this.emitFile({
        type: "asset",
        fileName: "tokens.css",
        source: `@layer d5ng {\n${css}}\n`,
      });
    },
  };
}

export default defineConfig({
  plugins: [dts({ include: ["src"] }), tokensCss()],
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: "index",
    },
  },
});
