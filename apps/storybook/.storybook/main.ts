import { fileURLToPath } from "node:url";

import type { StorybookConfig } from "@storybook/react-vite";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { mergeConfig } from "vite";

// 컴포넌트 소스와 tsconfig는 react 패키지에 있어요.
const reactPackage = fileURLToPath(
  new URL("../../../packages/react", import.meta.url),
);

const config: StorybookConfig = {
  framework: "@storybook/react-vite",
  stories: [
    // 컴포넌트 스토리는 컴포넌트 폴더에 두고 여기서 모아요.
    "../../../packages/react/src/**/*.stories.@(ts|tsx)",
    // 토큰처럼 컴포넌트가 아닌 것의 스토리예요.
    "../src/**/*.stories.@(ts|tsx)",
  ],
  addons: [
    "@storybook/addon-a11y",
    "@storybook/addon-designs",
    "@storybook/addon-docs",
    "@storybook/addon-themes",
    "@storybook/addon-vitest",
    // AI 에이전트가 컴포넌트 문서를 읽고 스토리 테스트를 돌리는 MCP 서버를 /mcp에 열어요.
    "@storybook/addon-mcp",
  ],
  typescript: {
    // 기본 react-docgen은 recipe 타입을 못 따라가서 variant·size가 문서 표에서 빠져요.
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      // 이 앱의 tsconfig에는 컴포넌트가 없어서 react 패키지 것을 읽어요.
      tsconfigPath: `${reactPackage}/tsconfig.json`,
      include: [`${reactPackage}/src/**/*.tsx`],
      // HTML 속성 수백 개는 빼고 컴포넌트가 선언한 props만 남겨요.
      propFilter: (prop) => !prop.parent?.fileName.includes("node_modules"),
    },
  },
  // MCP의 docs 도구가 읽는 컴포넌트 props 목록을 만들어요.
  features: { componentsManifest: true },
  core: { disableTelemetry: true },
  // 컴포넌트를 소스에서 읽어서 .css.ts를 처리할 플러그인이 필요해요.
  viteFinal: (viteConfig) =>
    mergeConfig(viteConfig, { plugins: [vanillaExtractPlugin()] }),
};

export default config;
