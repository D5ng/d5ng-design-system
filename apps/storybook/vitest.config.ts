import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

// 스토리 하나하나를 실제 브라우저에서 렌더링하고 접근성 검사까지 하는 테스트로 돌려요.
// Storybook 설정(.storybook)을 그대로 읽어서 vanilla-extract 플러그인과 테마도 같이 적용돼요.
export default defineConfig({
  plugins: [storybookTest({ configDir: ".storybook" })],
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      headless: true,
      instances: [{ browser: "chromium" }],
    },
  },
});
