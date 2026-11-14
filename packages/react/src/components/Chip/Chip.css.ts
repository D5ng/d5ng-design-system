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
const fgPressed = createVar();
const border = createVar();
// 선택 테두리의 두 번째 1px이에요. 안쪽 그림자로 그려요.
const emphasis = createVar();

// variant가 채우는 선택 색과 비활성 테두리예요.
const selectedBg = createVar();
const selectedBgHover = createVar();
const selectedBgPressed = createVar();
const selectedFg = createVar();
const selectedFgPressed = createVar();
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
    [fgPressed]: vars.color.fg.neutral,
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
        [fgPressed]: selectedFgPressed,
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
    // 비활성이어도 선택 테두리 두께는 그대로 보여요.
    [`&${disabledSelector}${selectedSelector}`]: {
      vars: { [emphasis]: disabledBorder },
    },
  },
});

const pressed = `${rootBase}:active:not(${disabledSelector})`;
const hovered = `${rootBase}:hover:not(:active, ${disabledSelector})`;

// 두 outline은 미선택 테두리 색만 달라요.
const outlineColors = (unselectedBorder: string) => ({
  vars: {
    [bg]: vars.color.bg.layerDefault,
    [border]: unselectedBorder,
    [selectedBg]: vars.color.bg.brandWeak,
    [selectedBgHover]: vars.color.bg.brandWeakHover,
    [selectedBgPressed]: vars.color.bg.brandWeakPressed,
    [selectedFg]: vars.color.fg.brand,
    [selectedFgPressed]: vars.color.fg.brandPressed,
    [selectedBorder]: vars.color.stroke.brandSolid,
    [disabledBorder]: vars.color.fg.disabled,
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
          [selectedBg]: vars.color.bg.brandSolid,
          [selectedBgHover]: vars.color.bg.brandSolidHover,
          [selectedBgPressed]: vars.color.bg.brandSolidPressed,
          [selectedFg]: vars.color.fg.onBrandSolid,
          [selectedFgPressed]: vars.color.fg.onBrandSolid,
          [selectedBorder]: "transparent",
          [disabledBorder]: "transparent",
        },
      },
      outlineStrong: outlineColors(vars.color.stroke.neutralStrong),
      outlineWeak: outlineColors(vars.color.stroke.neutralMuted),
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
      color: fgPressed,
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

// 선택 전에도 자리는 남겨서 눌러도 너비가 그대로예요(Figma Selection indicator slot).
export const indicator = style([
  icon,
  {
    visibility: "hidden",
    selectors: {
      [`${rootBase}${selectedSelector} &`]: { visibility: "visible" },
    },
  },
]);

export const label = style({
  minWidth: 0,
  fontFamily: vars.font.family.base,
  fontSize,
  lineHeight,
  fontWeight: vars.font.weight.medium,
  wordBreak: "keep-all",
  overflowWrap: "break-word",
});
