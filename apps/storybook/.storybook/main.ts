import type { StorybookConfig } from "@storybook/react-vite";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { mergeConfig } from "vite";

const config: StorybookConfig = {
  framework: "@storybook/react-vite",
  stories: [
    // 컴포넌트 스토리는 컴포넌트 폴더 안에 두고 여기서 모은다.
    "../../../packages/react/src/**/*.stories.@(ts|tsx)",
    // 토큰처럼 컴포넌트가 아닌 것을 보여 주는 스토리
    "../src/**/*.stories.@(ts|tsx)",
  ],
  addons: ["@storybook/addon-a11y", "@storybook/addon-themes"],
  core: { disableTelemetry: true },
  // 컴포넌트를 빌드 결과가 아니라 소스에서 읽으므로 .css.ts를 처리할 플러그인이 필요하다.
  viteFinal: (viteConfig) =>
    mergeConfig(viteConfig, { plugins: [vanillaExtractPlugin()] }),
};

export default config;
