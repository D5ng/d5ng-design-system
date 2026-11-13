import "@d5ng/tokens/tokens.css";
import "./preview.css";

import { withThemeByDataAttribute } from "@storybook/addon-themes";
import type { Preview } from "@storybook/react-vite";

const preview: Preview = {
  // 접근성 위반이 있으면 스토리 테스트가 실패해요. Foundation 기준은 WCAG 2.2 AA예요.
  parameters: {
    a11y: { test: "error" },
    // Chromatic이 스토리마다 두 테마를 모두 찍어요. 다크에서만 깨지는 변경도 잡아요.
    chromatic: {
      modes: { light: { theme: "light" }, dark: { theme: "dark" } },
    },
  },
  decorators: [
    // 다크 토큰은 [data-theme="dark"]에 걸려 있어요. Radix 포털도 받도록 html에 붙여요.
    withThemeByDataAttribute({
      themes: { light: "light", dark: "dark" },
      defaultTheme: "light",
      attributeName: "data-theme",
      parentSelector: "html",
    }),
  ],
};

export default preview;
