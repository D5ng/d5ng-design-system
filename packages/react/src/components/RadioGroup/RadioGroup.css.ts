import { vars } from "@d5ng/tokens";
import { createVar, style } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

import { focusRing } from "../_internal/focusRing.css";
import {
  selectionRow,
  selectionRowDisabled,
  selectionRowHovered,
  selectionRowPressed,
} from "../_internal/selectionRow.css";

// 상태 선택자는 한 곳에서만 정해요. Radix가 항목 버튼에 붙이는 속성을 봐요.
const checkedSelector = '[data-state="checked"]';
const disabledSelector = "[data-disabled]";

// size가 그룹에서 채우고 항목의 마크·점·라벨이 물려받아요.
// context 대신 CSS 변수로 내려서 두 부품 모두 서버 컴포넌트로 남아요.
const markSize = createVar();
const dotSize = createVar();
const disabledDotSize = createVar();
const labelFontSize = createVar();
const labelLineHeight = createVar();

// tone이 그룹에서 채우는 선택 색이에요.
const checkedBg = createVar();
const checkedBgHover = createVar();
const checkedBgPressed = createVar();
const checkedFg = createVar();

// 마크가 지금 쓰는 색이에요. 선택·비활성 규칙은 control에서 이 변수만 바꾸고 surface·dot이 읽어요.
const bg = createVar();
const bgHover = createVar();
const bgPressed = createVar();
const border = createVar();
const fg = createVar();

// ---- RadioGroup

export const group = recipe({
  base: {
    display: "flex",
    flexDirection: "column",
    gap: vars.spacing[4],
  },

  variants: {
    size: {
      medium: {
        vars: {
          [markSize]: vars.radio.markSizeMedium,
          [dotSize]: vars.radio.dotSizeMedium,
          [disabledDotSize]: vars.radio.dotSizeDisabledMedium,
          [labelFontSize]: vars.font.size.t4,
          [labelLineHeight]: vars.font.lineHeight.t4,
        },
      },
      large: {
        vars: {
          [markSize]: vars.radio.markSizeLarge,
          [dotSize]: vars.radio.dotSizeLarge,
          [disabledDotSize]: vars.radio.dotSizeDisabledLarge,
          [labelFontSize]: vars.font.size.t5,
          [labelLineHeight]: vars.font.lineHeight.t5,
        },
      },
    },
    tone: {
      neutral: {
        vars: {
          [checkedBg]: vars.color.bg.neutralSolid,
          [checkedBgHover]: vars.color.bg.neutralSolidHover,
          [checkedBgPressed]: vars.color.bg.neutralSolidPressed,
          [checkedFg]: vars.color.fg.onNeutralSolid,
        },
      },
      brand: {
        vars: {
          [checkedBg]: vars.color.bg.brandSolid,
          [checkedBgHover]: vars.color.bg.brandSolidHover,
          [checkedBgPressed]: vars.color.bg.brandSolidPressed,
          [checkedFg]: vars.color.fg.onBrandSolid,
        },
      },
    },
  },

  defaultVariants: {
    size: "medium",
    tone: "neutral",
  },
});

export type GroupVariants = NonNullable<RecipeVariants<typeof group>>;

// ---- RadioGroupItem

export const item = style([
  selectionRow,
  {
    gridTemplateColumns: "auto minmax(0, 1fr)",
    columnGap: vars.spacing[8],
    // 눌리는 곳이 라벨 글자 끝까지예요. 긴 라벨은 부모 너비 안에서 줄바꿈돼요.
    width: "fit-content",
    minHeight: vars.radio.minTargetHeight,
  },
]);

// Radix는 숨은 input을 버튼 바로 뒤에 absolute로 두고 translateX(-100%)로 버튼 위에 겹쳐요.
// 버튼과 input이 한 줄에 나란히 있어야 겹쳐서, 칸은 줄 높이를 없애고 버튼은 inline으로 둬요.
export const markSlot = style({
  position: "relative",
  display: "block",
  lineHeight: 0,
});

// 바탕 색은 버튼 자신의 data-state·data-disabled만 봐요. 행의 hover·눌림은 아래 surface가 따로 봐요.
export const control = style({
  display: "inline-flex",
  verticalAlign: "top",
  boxSizing: "border-box",
  width: markSize,
  height: markSize,
  margin: 0,
  padding: 0,
  border: "none",
  // 포커스 링이 마크를 따라 원으로 그려져요.
  borderRadius: vars.radius.full,
  background: "none",
  cursor: "inherit",
  vars: {
    [bg]: "transparent",
    [bgHover]: vars.color.bg.neutralWeak,
    [bgPressed]: vars.color.bg.neutralWeakPressed,
    [border]: vars.color.stroke.neutralStrong,
  },
  selectors: {
    "&:focus-visible": focusRing,
    // 세 규칙이 서로 겹치지 않게 나눠요. 규칙 순서에 기대지 않아요.
    [`&${checkedSelector}:not(${disabledSelector})`]: {
      vars: {
        [bg]: checkedBg,
        [bgHover]: checkedBgHover,
        [bgPressed]: checkedBgPressed,
        [border]: "transparent",
        [fg]: checkedFg,
      },
    },
    [`&:not(${checkedSelector})${disabledSelector}`]: {
      vars: {
        [bg]: vars.color.bg.disabled,
        [bgHover]: vars.color.bg.disabled,
        [bgPressed]: vars.color.bg.disabled,
        [border]: vars.color.stroke.neutralWeak,
      },
    },
    // Figma는 비활성 선택을 채우지 않고 테두리와 점만 흐리게 그려요.
    [`&${checkedSelector}${disabledSelector}`]: {
      vars: {
        [bg]: "transparent",
        [bgHover]: "transparent",
        [bgPressed]: "transparent",
        [border]: vars.color.fg.disabled,
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
  // Figma에도 Radio 테두리 두께 변수가 없어요.
  // 색이 없는 테두리도 1px을 차지해서 점이 상태마다 같은 자리에 있어요.
  border: `1px solid ${border}`,
  borderRadius: vars.radius.full,
  background: bg,
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

// 선택했을 때만 보여요. surface 안에 있어서 눌림 축소를 같이 받아요.
export const dot = style({
  display: "none",
  flexShrink: 0,
  width: dotSize,
  height: dotSize,
  borderRadius: vars.radius.full,
  background: fg,
  selectors: {
    [`${control}${checkedSelector} &`]: { display: "block" },
    // Figma는 비활성 점을 조금 키워서 흐린 색에서도 보이게 해요.
    [`${control}${disabledSelector} &`]: {
      width: disabledDotSize,
      height: disabledDotSize,
    },
  },
});

export const labelText = recipe({
  base: {
    // 첫 줄 가운데를 마크 가운데에 맞춰요(Figma Label wrap 위 여백 0.5·1px).
    paddingTop: `calc((${markSize} - ${labelLineHeight}) / 2)`,
    fontFamily: vars.font.family.base,
    fontSize: labelFontSize,
    lineHeight: labelLineHeight,
    // textStyles 묶음은 굵기까지 정해서 labelWeight와 겹쳐요. 한글 줄바꿈 규칙만 따로 맞춰요.
    wordBreak: "keep-all",
    overflowWrap: "break-word",
    color: vars.color.fg.neutral,
    selectors: {
      // 항목 disabled든 그룹 disabled든 Radix가 버튼에 data-disabled를 붙여요.
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
