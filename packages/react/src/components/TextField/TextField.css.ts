import { textStyles, vars } from "@d5ng/tokens";
import { createVar, globalStyle, style } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

import { focusRing } from "../_internal/focusRing.css";
import {
  control,
  disabledSelector,
  inputBox,
  insetSpace,
  valueText,
} from "../_internal/inputBox.css";

// 크기마다 달라서 size variant가 채워요.
const iconSize = createVar();
const clearSlotWidth = createVar();

export const input = style([
  control,
  {
    flex: 1,
    minWidth: 0,
    padding: 0,
    selectors: {
      // type="search"면 브라우저가 값 오른쪽에 ×를 그려요. Figma에 없고 지우기 버튼과 겹쳐요.
      "&::-webkit-search-cancel-button": {
        WebkitAppearance: "none",
        appearance: "none",
      },
    },
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
        vars: {
          [iconSize]: vars.textField.iconSize.sm,
          [clearSlotWidth]: vars.textField.clearSlotWidth.sm,
        },
        minHeight: vars.textField.minHeight.sm,
        paddingInline: insetSpace(vars.spacing[16]),
      },
      // medium·large 값 글자는 Spec 한 줄(16/22 Regular)이라 같이 바뀌어요.
      medium: {
        ...valueText,
        vars: {
          [iconSize]: vars.textField.iconSize.md,
          [clearSlotWidth]: vars.textField.clearSlotWidth.md,
        },
        minHeight: vars.textField.minHeight.md,
        // 높이는 min-height라 세로 여백은 빼지 않아요.
        paddingInline: insetSpace(vars.spacing[16]),
      },
      large: {
        ...valueText,
        vars: {
          [iconSize]: vars.textField.iconSize.lg,
          [clearSlotWidth]: vars.textField.clearSlotWidth.lg,
        },
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

// 누르는 자리(44px)가 자리 너비보다 넓어서 오른쪽 여백으로 넘쳐요.
// 넘친 만큼 빼면 아이콘 끝이 내용 끝에 닿아서, 테두리에서 아이콘까지가 앞 아이콘과 같아요.
export const clearButton = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  boxSizing: "border-box",
  width: vars.button.minHeight.sm,
  height: vars.button.minHeight.sm,
  marginInlineEnd: `calc(${clearSlotWidth} - ${vars.button.minHeight.sm})`,
  // small 상자는 테두리 안쪽이 42px라 44px 버튼이 상자를 밀어요. 테두리만큼 위아래로 겹쳐요.
  marginBlock: `calc(-1 * ${vars.textField.borderWidth})`,
  padding: 0,
  border: 0,
  borderRadius: vars.radius.lg,
  background: "transparent",
  color: vars.color.fg.neutral,
  cursor: "pointer",
  selectors: {
    "&:focus-visible": focusRing,
  },
});

export const clearIcon = style({
  width: iconSize,
  height: iconSize,
});
