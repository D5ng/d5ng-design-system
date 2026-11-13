import { textStyles, vars } from "@d5ng/tokens";
import { createVar, globalStyle, style } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

import { focusRing } from "../_internal/focusRing.css";

// 상태 선택자는 한 곳에서만 정해요. TextField가 상자에 붙이는 data 속성을 봐요.
const invalidSelector = "[data-invalid]";
const disabledSelector = "[data-disabled]";
const readOnlySelector = "[data-readonly]";

// 크기마다 달라서 size variant가 채워요.
const iconSize = createVar();

// 2px 테두리는 1px border에 안쪽 그림자 1px을 더해 그려요.
// border를 2px로 바꾸면 글자가 1px 밀려요. 1px을 border로 남겨야 forced-colors에서도 상자가 보여요.
const emphasisBorder = (color: string) => ({
  borderColor: color,
  boxShadow: `inset 0 0 0 ${vars.textField.borderWidth} ${color}`,
});

// Figma 테두리는 안쪽(INSIDE)이라 여백에 안 잡히지만 CSS border는 잡혀서 그만큼 빼요.
const paddingInline = (space: string) =>
  `calc(${space} - ${vars.textField.borderWidth})`;

// medium·large 값 글자예요. Spec 한 줄(16/22 Regular)이라 같이 바뀌어요.
// textStyles에 16/22 묶음이 없어서 글자 토큰을 직접 써요(Field 라벨과 같아요).
const valueText = {
  fontFamily: vars.font.family.base,
  fontSize: vars.font.size.t5,
  lineHeight: vars.font.lineHeight.t5,
  fontWeight: vars.font.weight.regular,
};

// 상자가 높이·여백·테두리를 그리고, 입력은 글자만 그려요.
export const input = style({
  flex: 1,
  minWidth: 0,
  margin: 0,
  padding: 0,
  border: 0,
  // 포커스 링은 상자가 그려요.
  outline: "none",
  background: "transparent",
  font: "inherit",
  color: "inherit",
  selectors: {
    "&::placeholder": {
      color: vars.color.fg.placeholder,
      // Firefox는 placeholder를 반투명하게 그려서 토큰 색이 흐려져요.
      opacity: 1,
    },
    "&:disabled::placeholder": { color: vars.color.fg.disabled },
    "&:disabled": { cursor: "not-allowed" },
  },
});

// 이기는 순서는 disabled > invalid > focus > hover > 기본이에요.
// :has()는 안쪽 선택자의 우선순위를 가져와서, 규칙 순서 대신 :not()으로 겹치지 않게 해요.
const focused = `:has(${input}:focus-visible)`;

export const box = recipe({
  base: {
    display: "flex",
    alignItems: "center",
    gap: vars.spacing[8],
    boxSizing: "border-box",
    border: `${vars.textField.borderWidth} solid ${vars.color.stroke.neutralStrong}`,
    borderRadius: vars.radius.lg,
    background: vars.color.bg.layerDefault,
    color: vars.color.fg.neutral,
    cursor: "text",

    selectors: {
      [`&${readOnlySelector}:not(${disabledSelector})`]: {
        background: vars.color.bg.neutralWeak,
      },
      // readOnly는 편집할 수 없어서 테두리는 그대로 두고 링만 그려요.
      [`&:not(${invalidSelector}, ${readOnlySelector})${focused}`]:
        emphasisBorder(vars.color.stroke.brandSolid),
      [`&${invalidSelector}:not(${disabledSelector})`]: emphasisBorder(
        vars.color.stroke.critical,
      ),
      [`&${focused}`]: focusRing,
      [`&${invalidSelector}${focused}`]: {
        outlineColor: vars.color.stroke.critical,
      },
      [`&${disabledSelector}`]: {
        borderColor: vars.color.stroke.neutralWeak,
        background: vars.color.bg.disabled,
        color: vars.color.fg.disabled,
        cursor: "not-allowed",
      },
    },

    "@media": {
      "(hover: hover)": {
        selectors: {
          [`&:hover:not(${invalidSelector}, ${disabledSelector}, ${readOnlySelector}, ${focused})`]:
            { borderColor: vars.color.stroke.neutralContrast },
        },
      },
    },
  },

  variants: {
    size: {
      small: {
        ...textStyles.bodySmall,
        vars: { [iconSize]: vars.textField.iconSize.sm },
        minHeight: vars.textField.minHeight.sm,
        paddingInline: paddingInline(vars.spacing[16]),
      },
      medium: {
        ...valueText,
        vars: { [iconSize]: vars.textField.iconSize.md },
        minHeight: vars.textField.minHeight.md,
        paddingInline: paddingInline(vars.spacing[16]),
      },
      large: {
        ...valueText,
        vars: { [iconSize]: vars.textField.iconSize.lg },
        minHeight: vars.textField.minHeight.lg,
        paddingInline: paddingInline(vars.spacing[20]),
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
