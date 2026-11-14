import { vars } from "@d5ng/tokens";
import { createVar, style } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

import { focusRing } from "../_internal/focusRing.css";
import {
  selectionControlDisabled,
  selectionRow,
  selectionRowDisabled,
  selectionRowHovered,
  selectionRowPressed,
} from "../_internal/selectionRow.css";

// 상태 선택자는 한 곳에서만 정해요. Radix가 버튼에 붙이는 속성을 봐요.
const checkedSelector = '[data-state="checked"]';
const indeterminateSelector = '[data-state="indeterminate"]';
// 줄과 같은 비활성 선택자예요. CheckboxGroup의 비활성 fieldset이 막은 버튼도 잡아요.
const disabledSelector = selectionControlDisabled;

// size가 줄에서 채우고 상자·라벨이 읽어요.
const markSize = createVar();
const labelFontSize = createVar();
const labelLineHeight = createVar();
// size와 variant가 함께 정해서 compoundVariants가 채워요.
const iconSize = createVar();

// 상자가 지금 쓰는 색이에요. 선택·비활성 규칙은 control에서 이 변수만 바꾸고 surface가 읽어요.
const bg = createVar();
const bgHover = createVar();
const bgPressed = createVar();
const border = createVar();
const fg = createVar();

// variant·tone이 채우는 선택 색과 비활성 색이에요.
const checkedBg = createVar();
const checkedBgHover = createVar();
const checkedBgPressed = createVar();
const checkedFg = createVar();
const disabledBg = createVar();
const disabledBorder = createVar();

// 미선택일 때 체크를 보일지예요. Ghost만 흐린 체크를 보여요.
const uncheckedIconDisplay = createVar();

// ---- 줄

// variant·tone 값도 줄에서 채워요. 상자·아이콘이 물려받아서 보이는 props를 recipe 하나가 받아요.
export const root = recipe({
  base: [
    selectionRow,
    {
      gridTemplateColumns: "auto minmax(0, 1fr)",
      columnGap: vars.spacing[8],
      // 눌리는 곳이 라벨 글자 끝까지예요. 긴 라벨은 부모 너비 안에서 줄바꿈돼요.
      width: "fit-content",
      minHeight: vars.checkbox.minTargetHeight,
    },
  ],

  variants: {
    size: {
      medium: {
        vars: {
          [markSize]: vars.checkbox.markSizeMedium,
          [labelFontSize]: vars.font.size.t4,
          [labelLineHeight]: vars.font.lineHeight.t4,
        },
      },
      large: {
        vars: {
          [markSize]: vars.checkbox.markSizeLarge,
          [labelFontSize]: vars.font.size.t5,
          [labelLineHeight]: vars.font.lineHeight.t5,
        },
      },
    },
    variant: {
      square: {
        vars: {
          [border]: vars.color.stroke.neutralStrong,
          [disabledBg]: vars.color.bg.disabled,
          [disabledBorder]: vars.color.stroke.neutralWeak,
          [uncheckedIconDisplay]: "none",
        },
      },
      // 테두리 없이 체크만 보여요. 선택해도 배경은 미선택과 같아요.
      ghost: {
        vars: {
          [border]: "transparent",
          [disabledBg]: "transparent",
          [disabledBorder]: "transparent",
          [uncheckedIconDisplay]: "block",
          [checkedBg]: "transparent",
          [checkedBgHover]: vars.color.bg.neutralWeak,
          [checkedBgPressed]: vars.color.bg.neutralWeakPressed,
        },
      },
    },
    tone: {
      neutral: {},
      brand: {},
    },
  },

  compoundVariants: [
    // Figma가 아이콘 크기를 변수로 묶지 않아서 숫자로 써요.
    {
      variants: { size: "medium", variant: "square" },
      style: { vars: { [iconSize]: "12px" } },
    },
    {
      variants: { size: "medium", variant: "ghost" },
      style: { vars: { [iconSize]: "14px" } },
    },
    {
      variants: { size: "large", variant: "square" },
      style: { vars: { [iconSize]: "14px" } },
    },
    {
      variants: { size: "large", variant: "ghost" },
      style: { vars: { [iconSize]: "18px" } },
    },
    {
      variants: { variant: "square", tone: "neutral" },
      style: {
        vars: {
          [checkedBg]: vars.color.bg.neutralSolid,
          [checkedBgHover]: vars.color.bg.neutralSolidHover,
          [checkedBgPressed]: vars.color.bg.neutralSolidPressed,
          [checkedFg]: vars.color.fg.onNeutralSolid,
        },
      },
    },
    {
      variants: { variant: "square", tone: "brand" },
      style: {
        vars: {
          [checkedBg]: vars.color.bg.brandSolid,
          [checkedBgHover]: vars.color.bg.brandSolidHover,
          [checkedBgPressed]: vars.color.bg.brandSolidPressed,
          [checkedFg]: vars.color.fg.onBrandSolid,
        },
      },
    },
    {
      variants: { variant: "ghost", tone: "neutral" },
      style: { vars: { [checkedFg]: vars.color.fg.neutral } },
    },
    {
      variants: { variant: "ghost", tone: "brand" },
      style: { vars: { [checkedFg]: vars.color.fg.brand } },
    },
  ],

  defaultVariants: {
    size: "medium",
    variant: "square",
    tone: "neutral",
  },
});

export type RootVariants = NonNullable<RecipeVariants<typeof root>>;

// ---- 상자

// Radix는 숨은 input을 버튼 바로 뒤에 absolute로 두고 translateX(-100%)로 버튼 위에 겹쳐요.
// 버튼과 input이 한 줄에 나란히 있어야 겹쳐서, 칸은 줄 높이를 없애고 버튼은 inline으로 둬요.
export const markSlot = style({
  position: "relative",
  display: "block",
  lineHeight: 0,
});

export const control = style({
  display: "inline-flex",
  verticalAlign: "top",
  boxSizing: "border-box",
  width: markSize,
  height: markSize,
  margin: 0,
  padding: 0,
  border: "none",
  // 포커스 링이 상자 모서리를 따라 둥글어져요. 띄움 2px을 더해 바깥 모서리가 Figma 링처럼 8px이에요.
  borderRadius: vars.radius.sm,
  background: "none",
  cursor: "inherit",
  vars: {
    [bg]: "transparent",
    [bgHover]: vars.color.bg.neutralWeak,
    [bgPressed]: vars.color.bg.neutralWeakPressed,
    [fg]: vars.color.fg.placeholder,
  },
  selectors: {
    "&:focus-visible": focusRing,
    // 비활성은 아래 규칙만 받게 빼요. 규칙 순서에 기대지 않아요.
    [`&:is(${checkedSelector}, ${indeterminateSelector}):not(${disabledSelector})`]:
      {
        vars: {
          [bg]: checkedBg,
          [bgHover]: checkedBgHover,
          [bgPressed]: checkedBgPressed,
          [border]: "transparent",
          [fg]: checkedFg,
        },
      },
    [`&${disabledSelector}`]: {
      vars: {
        [bg]: disabledBg,
        [bgHover]: disabledBg,
        [bgPressed]: disabledBg,
        [border]: disabledBorder,
        [fg]: vars.color.fg.disabled,
      },
    },
  },
});

// 눌리면 이것만 줄어요. 포커스 링은 control에 있어서 제자리에 남아요(Motion Foundation).
export const surface = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxSizing: "border-box",
  width: "100%",
  height: "100%",
  // Figma에도 Checkbox 테두리 두께 변수가 없어요.
  // 색이 없는 테두리도 1px을 차지해서 아이콘이 상태마다 같은 자리에 있어요.
  border: `1px solid ${border}`,
  borderRadius: vars.radius.sm,
  background: bg,
  color: fg,
  // 누를 때는 spring-rapid, 뗄 때는 spring-quick으로 Button과 같게 움직여요.
  transitionProperty: "background-color, transform",
  transitionDuration: vars.duration.springQuick,
  transitionTimingFunction: vars.easing.standard,

  selectors: {
    [`${selectionRowPressed} &`]: {
      background: bgPressed,
      transitionDuration: vars.duration.springRapid,
    },
    [`${selectionRowPressed} ${control}:not(${disabledSelector}) &`]: {
      transform: `scale(calc(1 - ${vars.press.maxReduction}))`,
    },
  },

  "@media": {
    "(hover: hover)": {
      selectors: {
        [`${selectionRowHovered} &`]: {
          background: bgHover,
        },
      },
    },
    "(prefers-reduced-motion: reduce)": {
      selectors: {
        [`${selectionRowPressed} ${control}:not(${disabledSelector}) &`]: {
          transform: "none",
        },
      },
    },
  },

  // 곡선이 var()라 배열 대체값은 동작하지 않아요. linear()를 모르면 standard 곡선을 그대로 써요.
  "@supports": {
    "(transition-timing-function: linear(0, 1))": {
      transitionTimingFunction: vars.easing.springQuick,
      selectors: {
        [`${selectionRowPressed} &`]: {
          transitionTimingFunction: vars.easing.springRapid,
        },
      },
    },
  },
});

const icon = style({
  flexShrink: 0,
  width: iconSize,
  height: iconSize,
});

// 두 아이콘을 다 그리고 버튼의 data-state로 하나만 보여요.
export const checkIcon = style([
  icon,
  {
    display: uncheckedIconDisplay,
    selectors: {
      [`${control}${checkedSelector} &`]: { display: "block" },
      [`${control}${indeterminateSelector} &`]: { display: "none" },
    },
  },
]);

export const minusIcon = style([
  icon,
  {
    display: "none",
    selectors: {
      [`${control}${indeterminateSelector} &`]: { display: "block" },
    },
  },
]);

// ---- 라벨

export const labelText = recipe({
  base: {
    // 첫 줄 가운데를 상자 가운데에 맞춰요(Figma Label wrap 위 여백 0.5·1px).
    paddingTop: `calc((${markSize} - ${labelLineHeight}) / 2)`,
    fontFamily: vars.font.family.base,
    fontSize: labelFontSize,
    lineHeight: labelLineHeight,
    // textStyles 묶음은 굵기까지 정해서 labelWeight와 겹쳐요. 한글 줄바꿈 규칙만 따로 맞춰요.
    wordBreak: "keep-all",
    overflowWrap: "break-word",
    color: vars.color.fg.neutral,
    selectors: {
      [`${selectionRowDisabled} &`]: { color: vars.color.fg.disabled },
    },
  },

  variants: {
    weight: {
      regular: { fontWeight: vars.font.weight.regular },
      semibold: { fontWeight: vars.font.weight.semibold },
    },
  },

  defaultVariants: {
    weight: "regular",
  },
});

export type LabelTextVariants = NonNullable<RecipeVariants<typeof labelText>>;
