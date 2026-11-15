import { vars } from "@d5ng/tokens";
import { createVar } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

// inset이 채우고 orientation이 선 양 끝의 margin으로 읽어요. 조합마다 규칙을 따로 두지 않아요.
const insetSize = createVar();

// Figma에도 Divider 두께 변수가 없어요.
const thickness = "1px";

export const divider = recipe({
  base: {
    flexShrink: 0,
    // 부모가 flex여도 가로선은 너비를, 세로선은 높이를 부모에 맞춰요.
    alignSelf: "stretch",
    // 고대비 모드(forced-colors)는 배경색을 지우고 테두리는 남겨서, 선을 테두리로 그려요.
    borderWidth: 0,
    borderStyle: "solid",
  },

  variants: {
    // base의 borderWidth보다 뒤에 정의돼서 이겨요.
    orientation: {
      horizontal: {
        borderBlockEndWidth: thickness,
        marginInline: insetSize,
      },
      vertical: {
        // grid 칸 안에서도 늘어나지 않고 1px로 남아요.
        inlineSize: 0,
        borderInlineEndWidth: thickness,
        marginBlock: insetSize,
      },
    },
    tone: {
      subtle: { borderColor: vars.color.stroke.neutralSubtle },
      muted: { borderColor: vars.color.stroke.neutralMuted },
    },
    inset: {
      none: { vars: { [insetSize]: vars.spacing[0] } },
      "16": { vars: { [insetSize]: vars.spacing[16] } },
      "24": { vars: { [insetSize]: vars.spacing[24] } },
    },
  },

  defaultVariants: {
    orientation: "horizontal",
    tone: "subtle",
    inset: "none",
  },
});

export type DividerVariants = NonNullable<RecipeVariants<typeof divider>>;
