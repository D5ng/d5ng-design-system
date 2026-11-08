import "@d5ng/tokens/tokens.css";
import "./preview.css";

import { withThemeByDataAttribute } from "@storybook/addon-themes";
import type { Preview } from "@storybook/react-vite";

const preview: Preview = {
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
