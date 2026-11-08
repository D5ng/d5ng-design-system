import "@d5ng/tokens/tokens.css";
import "./preview.css";

import { withThemeByDataAttribute } from "@storybook/addon-themes";
import type { Preview } from "@storybook/react-vite";

const preview: Preview = {
  decorators: [
    // 토큰의 다크 값은 [data-theme="dark"]에 걸려 있다.
    // Radix 포털 콘텐츠도 같은 값을 받도록 html에 붙인다.
    withThemeByDataAttribute({
      themes: { light: "light", dark: "dark" },
      defaultTheme: "light",
      attributeName: "data-theme",
      parentSelector: "html",
    }),
  ],
};

export default preview;
