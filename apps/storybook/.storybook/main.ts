import type { StorybookConfig } from "@storybook/react-vite";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { mergeConfig } from "vite";

const config: StorybookConfig = {
  framework: "@storybook/react-vite",
  stories: [
    // 컴포넌트 스토리는 컴포넌트 폴더에 두고 여기서 모아요.
    "../../../packages/react/src/**/*.stories.@(ts|tsx)",
    // 토큰처럼 컴포넌트가 아닌 것의 스토리예요.
    "../src/**/*.stories.@(ts|tsx)",
  ],
  addons: ["@storybook/addon-a11y", "@storybook/addon-themes"],
  core: { disableTelemetry: true },
  // 컴포넌트를 소스에서 읽어서 .css.ts를 처리할 플러그인이 필요해요.
  viteFinal: (viteConfig) =>
    mergeConfig(viteConfig, { plugins: [vanillaExtractPlugin()] }),
};

export default config;
