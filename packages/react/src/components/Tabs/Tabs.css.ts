import { vars } from "@d5ng/tokens";
import { createVar, style } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

import { focusRing, focusRingInset } from "../_internal/focusRing.css";

// 상태 선택자는 한 곳에서만 정해요. Radix가 탭 버튼에 붙이는 속성을 봐요.
const activeSelector = '[data-state="active"]';
// Radix는 자기 disabled일 때만 data-disabled를 붙여서, 비활성 fieldset이 막은 버튼은 :disabled로 봐요.
const disabledSelector = ":is([data-disabled], :disabled)";

// size·layout은 목록에서 채우고 탭이 물려받아요.
// context 대신 CSS 변수로 내려서 TabsTrigger가 서버 컴포넌트로 남아요.
const triggerMinHeight = createVar();
const labelFontSize = createVar();
const labelLineHeight = createVar();
const triggerFlex = createVar();
const labelWhiteSpace = createVar();

// 선택선 색이에요. 선택선과 하이드레이션 전 밑줄이 같이 읽어요.
const indicatorColor = createVar();

// Figma에도 Tab 높이 변수가 없어요. 터치에서는 Foundation의 44px 조작 영역까지 늘려요.
const touchMinHeight = "44px";
// Figma에도 선택선 두께 변수가 없어요.
const indicatorHeight = "2px";

// ---- TabsList

export const list = recipe({
  base: {
    // 선택선이 목록 안에서 탭을 따라 움직이고, 스크롤하면 함께 움직여요.
    position: "relative",
    display: "flex",
    overflowX: "auto",
    overflowY: "hidden",
    // 선택이 바뀌어 고른 탭까지 스크롤할 때 미끄러지게 옮겨요.
    scrollBehavior: "smooth",
    background: vars.color.bg.layerDefault,
    // Figma Base divider처럼 탭 아래 층에 깔려요. 안쪽 그림자라 스크롤해도 보이는 폭 전체에 남아요.
    // Figma에도 구분선 두께 변수가 없어요.
    boxShadow: `inset 0 -1px 0 ${vars.color.stroke.neutralMuted}`,
    vars: {
      [indicatorColor]: vars.color.fg.neutral,
    },
    selectors: {
      // Figma는 선택한 탭이 비활성이면 선택선도 흐리게 그려요.
      [`&:has(> ${activeSelector}${disabledSelector})`]: {
        vars: { [indicatorColor]: vars.color.fg.disabled },
      },
    },
    "@media": {
      // 마우스만 있으면 스크롤바가 가로로 넘길 수 있다는 유일한 표시라 터치에서만 숨겨요.
      "(pointer: coarse)": { scrollbarWidth: "none" },
      "(prefers-reduced-motion: reduce)": { scrollBehavior: "auto" },
    },
  },

  variants: {
    size: {
      small: {
        vars: {
          [triggerMinHeight]: "40px",
          [labelFontSize]: vars.font.size.t4,
          [labelLineHeight]: vars.font.lineHeight.t4,
        },
        "@media": {
          // 목록이 스크롤 상자라 바깥으로 넓힌 조작 영역은 잘려서 높이를 늘려요.
          "(pointer: coarse)": { vars: { [triggerMinHeight]: touchMinHeight } },
        },
      },
      medium: {
        vars: {
          [triggerMinHeight]: touchMinHeight,
          [labelFontSize]: vars.font.size.t5,
          [labelLineHeight]: vars.font.lineHeight.t5,
        },
      },
    },
    layout: {
      // 탭이 너비를 똑같이 나눠요. 라벨이 길면 어절 단위로 줄을 바꿔 높이가 늘어요.
      fill: {
        vars: { [triggerFlex]: "1 1 0", [labelWhiteSpace]: "normal" },
      },
      // 탭이 라벨 너비만큼만 차지하고, 넘치면 목록이 가로로 스크롤돼요.
      hug: {
        vars: { [triggerFlex]: "0 0 auto", [labelWhiteSpace]: "nowrap" },
      },
    },
  },

  defaultVariants: {
    size: "medium",
    layout: "fill",
  },
});

export type ListVariants = NonNullable<RecipeVariants<typeof list>>;

// 선택한 탭 아래에 하나만 그려서 탭 사이를 미끄러져요. 위치와 너비는 TabsList가 재서 넣어요.
// 탭보다 뒤에 오는 positioned 요소라 hover 배경 위에 그려져요(Figma Indicator가 탭 안 맨 위 층).
export const indicator = style({
  position: "absolute",
  bottom: 0,
  left: 0,
  height: indicatorHeight,
  background: indicatorColor,
  pointerEvents: "none",
  transitionProperty: "transform, width, background-color",
  transitionDuration: vars.duration.normal,
  transitionTimingFunction: vars.easing.standard,
  "@media": {
    "(prefers-reduced-motion: reduce)": { transition: "none" },
  },
});

// ---- TabsTrigger

// 눌리면 색만 바꿔요(Figma Pressed, Foundation Motion "색상만 변경 · 축소 없음").
export const trigger = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flex: triggerFlex,
  // fill에서 긴 라벨이 탭을 넓히지 않고 줄바꿈되게 해요.
  minWidth: 0,
  boxSizing: "border-box",
  minHeight: triggerMinHeight,
  margin: 0,
  padding: `${vars.spacing[10]} ${vars.spacing[12]}`,
  border: "none",
  borderRadius: vars.radius.sm,
  background: "transparent",
  color: vars.color.fg.neutralMuted,
  // textStyles에 14/19·16/22 SemiBold 묶음이 없어서 크기·행간·굵기를 따로 써요.
  fontFamily: vars.font.family.base,
  fontSize: labelFontSize,
  lineHeight: labelLineHeight,
  fontWeight: vars.font.weight.semibold,
  textAlign: "center",
  whiteSpace: labelWhiteSpace,
  wordBreak: "keep-all",
  overflowWrap: "break-word",
  cursor: "pointer",
  WebkitTapHighlightColor: "transparent",
  transitionProperty: "background-color, color",
  transitionDuration: vars.duration.fast,
  transitionTimingFunction: vars.easing.standard,

  selectors: {
    // 목록이 스크롤 상자라 바깥 링은 위아래가 잘리고 옆 탭과 겹쳐요.
    "&:focus-visible": focusRingInset,
    // 세 규칙이 서로 겹치지 않게 나눠요. 규칙 순서에 기대지 않아요.
    [`&${activeSelector}:not(${disabledSelector})`]: {
      color: vars.color.fg.neutral,
    },
    [`&${disabledSelector}`]: {
      color: vars.color.fg.disabled,
      cursor: "not-allowed",
    },
    [`&:active:not(${disabledSelector})`]: {
      background: vars.color.bg.neutralWeakPressed,
    },
    // 하이드레이션 전이나 재지 못했을 때는 선택선이 숨어 있어서, 선택한 탭이 자기 밑줄을 그려요.
    [`${list.classNames.base}:has(> ${indicator}[hidden]) &${activeSelector}`]:
      {
        boxShadow: `inset 0 -${indicatorHeight} 0 ${indicatorColor}`,
      },
  },

  "@media": {
    "(hover: hover)": {
      selectors: {
        [`&:hover:not(:active, ${disabledSelector})`]: {
          background: vars.color.bg.neutralWeak,
        },
      },
    },
    "(prefers-reduced-motion: reduce)": { transition: "none" },
  },
});

// ---- TabsContent

// Radix가 패널을 Tab 키로 들르게 해요. Figma에 패널 포커스 모양이 없어서 다른 컴포넌트와 같은 바깥 링을 써요.
export const content = style({
  selectors: {
    "&:focus-visible": focusRing,
  },
});
