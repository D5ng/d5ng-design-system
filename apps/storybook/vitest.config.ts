import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

// 스토리 하나하나를 실제 브라우저에서 렌더링하고 접근성 검사까지 하는 테스트로 돌려요.
// Storybook 설정(.storybook)을 그대로 읽어서 vanilla-extract 플러그인과 테마도 같이 적용돼요.
export default defineConfig({
  plugins: [storybookTest({ configDir: ".storybook" })],
  // recipe 런타임을 미리 최적화해요. 안 그러면 첫 실행 중에 Vite가 페이지를 다시 불러와 스토리 테스트가 한꺼번에 실패해요.
  // 이 앱은 react 패키지 소스를 직접 읽어서 그 패키지를 거쳐 찾아요.
  optimizeDeps: {
    include: ["@d5ng/react > @vanilla-extract/recipes/createRuntimeFn"],
  },
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      headless: true,
      instances: [{ browser: "chromium" }],
    },
  },
});
