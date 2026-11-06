import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [react(), dts({ include: ["src"] })],
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: "index",
    },
    rolldownOptions: {
      // 사용하는 앱의 React를 쓰도록 번들에 넣지 않는다 (react/jsx-runtime 포함).
      external: [/^react($|\/)/, /^react-dom($|\/)/],
    },
  },
});
