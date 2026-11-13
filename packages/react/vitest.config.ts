import { playwright } from "@vitest/browser-playwright";
import { defineConfig, mergeConfig } from "vitest/config";

import viteConfig from "./vite.config";

// 빌드와 같은 플러그인으로 컴포넌트를 실제 브라우저(Chromium)에서 테스트해요.
// jsdom은 CSS를 계산하지 않아서 포커스 링이나 레이어 같은 동작을 확인할 수 없어요.
export default mergeConfig(
  viteConfig,
  defineConfig({
    // recipe 런타임을 미리 최적화해요. 안 그러면 첫 실행 중에 Vite가 페이지를 다시 불러와 테스트가 실패할 수 있어요.
    optimizeDeps: { include: ["@vanilla-extract/recipes/createRuntimeFn"] },
    test: {
      setupFiles: ["./vitest.setup.ts"],
      browser: {
        enabled: true,
        provider: playwright(),
        headless: true,
        instances: [{ browser: "chromium" }],
      },
    },
  }),
);
