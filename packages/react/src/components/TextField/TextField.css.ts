import { textStyles, vars } from "@d5ng/tokens";
import { createVar, globalStyle, style } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

import {
  control,
  disabledSelector,
  inputBox,
  insetSpace,
  valueText,
} from "../_internal/inputBox.css";

// 크기마다 달라서 size variant가 채워요.
const iconSize = createVar();

export const input = style([
  control,
  {
    flex: 1,
    minWidth: 0,
    padding: 0,
  },
]);

export const box = recipe({
  base: [
    inputBox,
    {
      display: "flex",
      alignItems: "center",
      gap: vars.spacing[8],
    },
  ],

  variants: {
    size: {
      small: {
        ...textStyles.bodySmall,
        vars: { [iconSize]: vars.textField.iconSize.sm },
        minHeight: vars.textField.minHeight.sm,
        paddingInline: insetSpace(vars.spacing[16]),
      },
      // medium·large 값 글자는 Spec 한 줄(16/22 Regular)이라 같이 바뀌어요.
      medium: {
        ...valueText,
        vars: { [iconSize]: vars.textField.iconSize.md },
        minHeight: vars.textField.minHeight.md,
        // 높이는 min-height라 세로 여백은 빼지 않아요.
        paddingInline: insetSpace(vars.spacing[16]),
      },
      large: {
        ...valueText,
        vars: { [iconSize]: vars.textField.iconSize.lg },
        minHeight: vars.textField.minHeight.lg,
        paddingInline: insetSpace(vars.spacing[20]),
      },
    },
  },

  defaultVariants: {
    size: "medium",
  },
});

export type BoxVariants = NonNullable<RecipeVariants<typeof box>>;

// 색은 상자 글자색(currentColor)을 따라가서 disabled면 함께 흐려져요.
export const icon = style({
  display: "inline-flex",
  flexShrink: 0,
  width: iconSize,
  height: iconSize,
});

// 아이콘 라이브러리마다 기본 크기가 달라서 자리에 맞춰 늘이거나 줄여요.
globalStyle(`${icon} > svg`, { width: "100%", height: "100%" });

export const affix = style({
  flexShrink: 0,
  whiteSpace: "nowrap",
  color: vars.color.fg.neutralMuted,
  selectors: {
    [`${disabledSelector} > &`]: { color: vars.color.fg.disabled },
  },
});
