import { playwright } from "@vitest/browser-playwright";
import { defineConfig, mergeConfig } from "vitest/config";

import viteConfig from "./vite.config";

// 빌드와 같은 플러그인으로 컴포넌트를 실제 브라우저(Chromium)에서 테스트해요.
// jsdom은 CSS를 계산하지 않아서 포커스 링이나 레이어 같은 동작을 확인할 수 없어요.
export default mergeConfig(
  viteConfig,
  defineConfig({
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
