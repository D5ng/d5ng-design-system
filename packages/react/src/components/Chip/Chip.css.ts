import { vars } from "@d5ng/tokens";
import { createVar, globalStyle, style } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

import { focusRing } from "../_internal/focusRing.css";

// 상태 선택자는 한 곳에서만 정해요. ChipButton과 Radix Toggle이 버튼에 붙이는 속성을 봐요.
const disabledSelector = "[data-disabled]";
// ChipToggle의 pressed prop은 여기서 선택(selected)이에요. 이 파일의 pressed는 누르는 중(:active)이에요.
const selectedSelector = '[data-state="on"]';

// Figma에도 Chip 테두리 두께 변수가 없어요.
const borderWidth = "1px";

// size가 버튼에서 채우고 겉면·아이콘·글자가 읽어요.
const minHeight = createVar();
const paddingInline = createVar();
const paddingBlock = createVar();
const gap = createVar();
const iconSize = createVar();
const fontSize = createVar();
const lineHeight = createVar();

// 겉면이 지금 쓰는 색이에요. 선택·비활성 규칙은 버튼에서 이 변수만 바꾸고 겉면이 읽어요.
const bg = createVar();
const bgHover = createVar();
const bgPressed = createVar();
const fg = createVar();
const border = createVar();
// 선택 테두리의 두 번째 1px이에요. 안쪽 그림자로 그려요.
const emphasis = createVar();

// variant가 채우는 선택 색과 비활성 테두리예요.
const selectedBg = createVar();
const selectedBgHover = createVar();
const selectedBgPressed = createVar();
const selectedFg = createVar();
const selectedBorder = createVar();
const disabledBorder = createVar();

// ---- 버튼

// 겉면보다 크게 잡아서 small(32px)도 44×44px 이상 눌려요. 포커스 링도 이 영역을 둘러요.
const rootBase = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  boxSizing: "border-box",
  minWidth: vars.chip.minTargetHeight,
  minHeight: vars.chip.minTargetHeight,
  // 부모보다 넓어지지 않고 긴 글자는 줄바꿈돼요.
  maxWidth: "100%",
  margin: 0,
  padding: 0,
  border: "none",
  borderRadius: vars.radius.full,
  background: "none",
  cursor: "pointer",
  userSelect: "none",
  WebkitTapHighlightColor: "transparent",
  // 미선택이면 variant와 상관없이 같은 hover·pressed 배경과 글자색이에요.
  vars: {
    [bgHover]: vars.color.bg.neutralWeakHover,
    [bgPressed]: vars.color.bg.neutralWeakPressed,
    [fg]: vars.color.fg.neutral,
    [emphasis]: "transparent",
  },

  selectors: {
    "&:focus-visible": focusRing,
    // 비활성은 아래 규칙만 받게 빼요. 규칙 순서에 기대지 않아요.
    [`&${selectedSelector}:not(${disabledSelector})`]: {
      vars: {
        [bg]: selectedBg,
        [bgHover]: selectedBgHover,
        [bgPressed]: selectedBgPressed,
        [fg]: selectedFg,
        [border]: selectedBorder,
        [emphasis]: selectedBorder,
      },
    },
    [`&${disabledSelector}`]: {
      cursor: "not-allowed",
      vars: {
        [bg]: vars.color.bg.disabled,
        [fg]: vars.color.fg.disabled,
        [border]: disabledBorder,
      },
    },
    // 비활성 배경은 variant마다 같아서 선택은 2px 테두리로만 남아요. solid도 이때는 테두리를 그려요.
    [`&${disabledSelector}${selectedSelector}`]: {
      vars: {
        [border]: vars.color.fg.disabled,
        [emphasis]: vars.color.fg.disabled,
      },
    },
  },
});

const pressed = `${rootBase}:active:not(${disabledSelector})`;
const hovered = `${rootBase}:hover:not(:active, ${disabledSelector})`;

// 선택은 Checkbox·RadioGroup 기본(neutral)처럼 무채색이에요. 칩은 여러 개가 함께 켜져서 브랜드 색을 쓰지 않아요.
// solid·outlineStrong은 배경이 반전돼요. 미선택 배경과 명도 대비가 13:1을 넘어서 색만으로 구분하는 게 아니에요.
const invertedSelection = {
  [selectedBg]: vars.color.bg.neutralSolid,
  [selectedBgHover]: vars.color.bg.neutralSolidHover,
  [selectedBgPressed]: vars.color.bg.neutralSolidPressed,
  [selectedFg]: vars.color.fg.onNeutralSolid,
};

// outlineWeak는 선택해도 배경이 옅어서 2px 테두리가 선택을 알려요.
const weakSelection = {
  [selectedBg]: vars.color.bg.neutralWeak,
  [selectedBgHover]: vars.color.bg.neutralWeakHover,
  [selectedBgPressed]: vars.color.bg.neutralWeakPressed,
  [selectedFg]: vars.color.fg.neutral,
};

// 두 outline은 미선택 테두리 색과 선택 배경만 달라요.
const outlineColors = (
  unselectedBorder: string,
  selection: Record<string, string>,
) => ({
  vars: {
    [bg]: vars.color.bg.layerDefault,
    [border]: unselectedBorder,
    ...selection,
    [selectedBorder]: vars.color.stroke.neutralContrast,
    [disabledBorder]: vars.color.stroke.neutralWeak,
  },
});

export const root = recipe({
  base: rootBase,

  variants: {
    variant: {
      // 테두리 없이 배경으로 구분해요. 색 없는 테두리도 1px을 차지해서 variant마다 크기가 같아요.
      solid: {
        vars: {
          [bg]: vars.color.bg.neutralWeak,
          [border]: "transparent",
          ...invertedSelection,
          [selectedBorder]: "transparent",
          [disabledBorder]: "transparent",
        },
      },
      outlineStrong: outlineColors(
        vars.color.stroke.neutralStrong,
        invertedSelection,
      ),
      outlineWeak: outlineColors(vars.color.stroke.neutralMuted, weakSelection),
    },
    // textStyles.labelDefault는 14/19뿐이라 large(16/22)를 담지 못해서 글자 토큰을 size마다 채워요.
    size: {
      small: {
        vars: {
          [minHeight]: vars.chip.minHeight.sm,
          [paddingInline]: vars.spacing[12],
          [paddingBlock]: vars.spacing[6],
          [gap]: vars.spacing[4],
          [iconSize]: vars.chip.iconSize.sm,
          [fontSize]: vars.font.size.t4,
          [lineHeight]: vars.font.lineHeight.t4,
        },
      },
      medium: {
        vars: {
          [minHeight]: vars.chip.minHeight.md,
          [paddingInline]: vars.spacing[12],
          [paddingBlock]: vars.spacing[8],
          [gap]: vars.spacing[4],
          [iconSize]: vars.chip.iconSize.md,
          [fontSize]: vars.font.size.t4,
          [lineHeight]: vars.font.lineHeight.t4,
        },
      },
      large: {
        vars: {
          [minHeight]: vars.chip.minHeight.lg,
          [paddingInline]: vars.spacing[16],
          [paddingBlock]: vars.spacing[8],
          [gap]: vars.spacing[6],
          [iconSize]: vars.chip.iconSize.lg,
          [fontSize]: vars.font.size.t5,
          [lineHeight]: vars.font.lineHeight.t5,
        },
      },
    },
  },

  defaultVariants: {
    variant: "outlineWeak",
    size: "medium",
  },
});

export type RootVariants = NonNullable<RecipeVariants<typeof root>>;

// ---- 겉면

// 눌리면 이것만 줄어요. 포커스 링은 버튼에 있어서 제자리에 남아요(Motion Foundation).
export const surface = style({
  display: "inline-flex",
  alignItems: "center",
  gap,
  boxSizing: "border-box",
  maxWidth: "100%",
  minHeight,
  // Figma 테두리는 안쪽(INSIDE)이라 여백에 안 잡히지만 CSS border는 잡혀서 그만큼 빼요.
  padding: `calc(${paddingBlock} - ${borderWidth}) calc(${paddingInline} - ${borderWidth})`,
  // 2px 선택 테두리는 1px border에 안쪽 그림자 1px을 더해 그려요. 두께가 그대로라 선택해도 너비가 같아요.
  // 1px을 border로 남겨야 forced-colors에서도 칩 모양이 보여요.
  border: `${borderWidth} solid ${border}`,
  borderRadius: vars.radius.full,
  boxShadow: `inset 0 0 0 ${borderWidth} ${emphasis}`,
  background: bg,
  color: fg,
  // 누를 때는 spring-rapid, 뗄 때는 spring-quick으로 Button과 같게 움직여요.
  transitionProperty: "background-color, transform",
  transitionDuration: vars.duration.springQuick,
  transitionTimingFunction: vars.easing.standard,

  selectors: {
    [`${pressed} &`]: {
      background: bgPressed,
      transform: `scale(calc(1 - ${vars.press.maxReduction}))`,
      transitionDuration: vars.duration.springRapid,
    },
  },

  "@media": {
    "(hover: hover)": {
      selectors: {
        [`${hovered} &`]: { background: bgHover },
      },
    },
    "(prefers-reduced-motion: reduce)": {
      selectors: {
        [`${pressed} &`]: { transform: "none" },
      },
    },
    // 고대비 모드는 배경과 그림자를 지워서 선택이 사라져요. 선택만 시스템 강조 색으로 직접 그려요.
    "(forced-colors: active)": {
      selectors: {
        [`${rootBase}${selectedSelector} &`]: {
          forcedColorAdjust: "none",
          background: "Highlight",
          color: "HighlightText",
          borderColor: "Highlight",
          boxShadow: "none",
        },
        [`${rootBase}${selectedSelector}${disabledSelector} &`]: {
          background: "Canvas",
          color: "GrayText",
          borderColor: "GrayText",
          boxShadow: `inset 0 0 0 ${borderWidth} GrayText`,
        },
      },
    },
  },

  // 곡선이 var()라 배열 대체값은 동작하지 않아요. linear()를 모르면 standard 곡선을 그대로 써요.
  "@supports": {
    "(transition-timing-function: linear(0, 1))": {
      transitionTimingFunction: vars.easing.springQuick,
      selectors: {
        [`${pressed} &`]: {
          transitionTimingFunction: vars.easing.springRapid,
        },
      },
    },
  },
});

export const icon = style({
  display: "inline-flex",
  flexShrink: 0,
  width: iconSize,
  height: iconSize,
});

// 아이콘 라이브러리마다 기본 크기가 달라서 자리에 맞춰 늘이거나 줄여요.
globalStyle(`${icon} > svg`, { width: "100%", height: "100%" });

export const label = style({
  minWidth: 0,
  fontFamily: vars.font.family.base,
  fontSize,
  lineHeight,
  fontWeight: vars.font.weight.medium,
  wordBreak: "keep-all",
  overflowWrap: "break-word",
});
