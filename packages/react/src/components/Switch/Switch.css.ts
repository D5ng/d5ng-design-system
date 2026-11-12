import { textStyles, vars } from "@d5ng/tokens";
import { createVar, style } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

import { focusRing } from "../_internal/focusRing.css";

// 상태 선택자는 한 곳에서만 정해요. 버튼에 Radix가 붙이는 data-state와 Switch가 붙이는 속성을 봐요.
const checkedSelector = '[data-state="checked"]';
const disabledSelector = "[data-disabled]";
const loadingSelector = "[data-loading]";

// size가 줄에서 채우고 트랙·thumb·라벨이 읽어요.
const trackWidth = createVar();
const trackHeight = createVar();
const thumbOn = createVar();
const thumbOff = createVar();
const gap = createVar();
// textStyles에 13·16 Medium 묶음이 없어서 크기마다 글자 크기와 행간을 따로 받아요.
const labelFontSize = createVar();
const labelLineHeight = createVar();

// tone이 채우는 켜짐 색이에요.
const trackOn = createVar();
const trackOnHover = createVar();
const trackOnPressed = createVar();
const thumbColor = createVar();

// 트랙이 지금 쓰는 색이에요. 켜짐·비활성 규칙은 control에서 이 변수만 바꾸고 트랙이 읽어요.
const bg = createVar();
const bgHover = createVar();
const bgPressed = createVar();

// Figma는 32에만 inset 변수를 묶었어요. 세 크기 모두 (높이 − 켜진 thumb) / 2와 같아서 계산해요.
const inset = `calc((${trackHeight} - ${thumbOn}) / 2)`;
// 꺼짐과 켜짐에서 thumb 가운데가 움직이는 거리예요.
const travel = `calc(${trackWidth} - 2 * ${inset} - ${thumbOn})`;
// 라벨 첫 줄과 트랙의 가운데를 맞춰요. 높은 쪽은 내리지 않아요(Figma 라벨 위 여백 0·2.5·5px, 16의 트랙 위 1px).
const markOffset = `max(0px, calc((${labelLineHeight} - ${trackHeight}) / 2))`;
const textOffset = `max(0px, calc((${trackHeight} - ${labelLineHeight}) / 2))`;

// ---- 줄

const rowBase = style({
  display: "grid",
  // 한 줄이면 44px 안에서 가운데, 여러 줄이면 위에 붙어요(Figma Content 정렬).
  alignContent: "center",
  alignItems: "start",
  boxSizing: "border-box",
  minHeight: vars.switch.minTargetHeight,
  padding: vars.spacing[8],
  cursor: "pointer",
  WebkitTapHighlightColor: "transparent",
  selectors: {
    [`&:has(${disabledSelector}):not(:has(${loadingSelector}))`]: {
      cursor: "not-allowed",
    },
    [`&:has(${loadingSelector})`]: { cursor: "progress" },
  },
});

const sizeVariants = {
  "16": {
    vars: {
      [trackWidth]: vars.switch.width16,
      [trackHeight]: vars.switch.height16,
      [thumbOn]: vars.switch.thumbOn16,
      [thumbOff]: vars.switch.thumbOff16,
      [gap]: vars.spacing[6],
      [labelFontSize]: vars.font.size.t3,
      [labelLineHeight]: vars.font.lineHeight.t3,
    },
  },
  "24": {
    vars: {
      [trackWidth]: vars.switch.width24,
      [trackHeight]: vars.switch.height24,
      [thumbOn]: vars.switch.thumbOn24,
      [thumbOff]: vars.switch.thumbOff24,
      [gap]: vars.spacing[8],
      [labelFontSize]: vars.font.size.t4,
      [labelLineHeight]: vars.font.lineHeight.t4,
    },
  },
  "32": {
    vars: {
      [trackWidth]: vars.switch.width32,
      [trackHeight]: vars.switch.height32,
      [thumbOn]: vars.switch.thumbOn32,
      [thumbOff]: vars.switch.thumbOff32,
      [gap]: vars.spacing[10],
      [labelFontSize]: vars.font.size.t5,
      [labelLineHeight]: vars.font.lineHeight.t5,
    },
  },
};

const toneVariants = {
  neutral: {
    vars: {
      [trackOn]: vars.color.bg.neutralSolid,
      [trackOnHover]: vars.color.bg.neutralSolidHover,
      [trackOnPressed]: vars.color.bg.neutralSolidPressed,
      [thumbColor]: vars.color.fg.onNeutralSolid,
    },
  },
  brand: {
    vars: {
      [trackOn]: vars.color.bg.brandSolid,
      [trackOnHover]: vars.color.bg.brandSolidHover,
      [trackOnPressed]: vars.color.bg.brandSolidPressed,
      [thumbColor]: vars.color.fg.onBrandSolid,
    },
  },
};

// Switch는 표시가 왼쪽, 라벨이 오른쪽이에요.
export const root = recipe({
  base: [
    rowBase,
    {
      gridTemplateColumns: "auto minmax(0, 1fr)",
      columnGap: gap,
      // 눌리는 곳이 라벨 글자 끝까지예요. 긴 라벨은 부모 너비 안에서 줄바꿈돼요.
      width: "fit-content",
    },
  ],
  variants: { size: sizeVariants, tone: toneVariants },
  defaultVariants: { size: "24", tone: "neutral" },
});

// SwitchRow는 라벨·설명이 왼쪽에서 너비를 채우고 표시가 오른쪽 끝이에요.
export const row = recipe({
  base: [
    rowBase,
    {
      gridTemplateColumns: "minmax(0, 1fr) auto",
      columnGap: vars.spacing[16],
    },
  ],
  variants: { size: sizeVariants, tone: toneVariants },
  defaultVariants: { size: "24", tone: "neutral" },
});

export type RootVariants = NonNullable<RecipeVariants<typeof root>>;

// ---- 표시

// Radix가 폼 안에서 숨은 input을 버튼 바로 뒤에 붙이고 왼쪽으로 버튼 너비만큼 옮겨요.
// 버튼과 input이 한 줄에 나란히 있어야 input이 버튼 위에 겹쳐서, flex 대신 인라인으로 둬요.
export const markSlot = style({
  position: "relative",
  display: "block",
  paddingTop: markOffset,
  // 줄 높이가 버튼 높이보다 커지지 않게 해요.
  lineHeight: 0,
});

export const control = style({
  display: "inline-flex",
  verticalAlign: "top",
  boxSizing: "border-box",
  margin: 0,
  padding: 0,
  border: "none",
  // 포커스 링이 트랙 모양을 따라 둥글어져요.
  borderRadius: vars.radius.full,
  background: "none",
  cursor: "inherit",
  vars: {
    [bg]: vars.color.switch.trackOff,
    [bgHover]: vars.color.switch.trackOffHover,
    [bgPressed]: vars.color.switch.trackOffPressed,
  },
  selectors: {
    "&:focus-visible": focusRing,
    // 비활성은 아래 규칙만 받게 빼요. 규칙 순서에 기대지 않아요.
    [`&${checkedSelector}:not(${disabledSelector})`]: {
      vars: {
        [bg]: trackOn,
        [bgHover]: trackOnHover,
        [bgPressed]: trackOnPressed,
      },
    },
    // hover·눌림은 아래 interactive에서만 붙어서 비활성은 배경만 바꿔요.
    [`&${disabledSelector}`]: {
      vars: { [bg]: vars.color.bg.disabled },
    },
  },
});

// 비활성·로딩이면 hover·눌림 반응을 꺼요. 로딩은 모양을 그대로 둬요(Button과 같은 계약).
const interactive = `${control}:not(${disabledSelector}, ${loadingSelector})`;
// 라벨 글자나 여백을 눌러도 트랙이 반응하게 줄을 봐요.
// 마우스로 누르면 줄이, 키보드 Space로 누르면 버튼만 :active가 돼서 둘 다 봐요.
const rowPressed = `${rowBase}:is(:active, :has(:active))`;
const rowHovered = `${rowBase}:hover:not(:active, :has(:active))`;

// 눌리면 이것만 줄어요. 포커스 링은 control에 있어서 제자리에 남아요(Motion Foundation).
export const track = style({
  position: "relative",
  display: "block",
  boxSizing: "border-box",
  width: trackWidth,
  height: trackHeight,
  borderRadius: vars.radius.full,
  background: bg,
  // 누를 때는 spring-rapid, 뗄 때는 spring-quick으로 Button과 같게 움직여요.
  transitionProperty: "background-color, transform",
  transitionDuration: vars.duration.springQuick,
  transitionTimingFunction: vars.easing.standard,

  selectors: {
    [`${rowPressed} ${interactive} > &`]: {
      background: bgPressed,
      transform: `scale(calc(1 - ${vars.press.maxReduction}))`,
      transitionDuration: vars.duration.springRapid,
    },
    // 테두리 대신 그림자로 그려서 thumb 자리가 상태마다 같아요.
    // Figma가 비활성 테두리 두께를 변수로 묶지 않아서 숫자로 써요.
    [`${control}${disabledSelector} > &`]: {
      boxShadow: `inset 0 0 0 1px ${vars.color.stroke.neutralWeak}`,
    },
  },

  "@media": {
    "(hover: hover)": {
      selectors: {
        [`${rowHovered} ${interactive} > &`]: { background: bgHover },
      },
    },
    "(prefers-reduced-motion: reduce)": {
      selectors: {
        [`${rowPressed} ${interactive} > &`]: { transform: "none" },
      },
    },
  },

  // 곡선이 var()라 배열 대체값은 동작하지 않아요. linear()를 모르면 standard 곡선을 그대로 써요.
  "@supports": {
    "(transition-timing-function: linear(0, 1))": {
      transitionTimingFunction: vars.easing.springQuick,
      selectors: {
        [`${rowPressed} ${interactive} > &`]: {
          transitionTimingFunction: vars.easing.springRapid,
        },
      },
    },
  },
});

// 가운데를 기준으로 두면 꺼짐에서 켜짐으로 커져도 thumb가 트랙 세로 가운데에 남아요.
export const thumb = style({
  position: "absolute",
  top: "50%",
  left: `calc(${inset} + ${thumbOn} / 2)`,
  width: thumbOff,
  height: thumbOff,
  borderRadius: vars.radius.full,
  background: thumbColor,
  transform: "translate(-50%, -50%)",
  transitionProperty: "width, height, transform, background-color",
  transitionDuration: vars.duration.normal,
  transitionTimingFunction: vars.easing.standard,
  selectors: {
    [`&${checkedSelector}`]: {
      width: thumbOn,
      height: thumbOn,
      transform: `translate(calc(-50% + ${travel}), -50%)`,
    },
    // disabled와 loading을 같이 주면 Radix가 thumb에 data-disabled를 붙이지 않아서 버튼을 봐요.
    [`${control}${disabledSelector} &`]: { background: vars.color.fg.disabled },
  },
  "@media": {
    // 움직임 없이 바로 옮겨요. 켜짐은 위치와 트랙 색으로 알려요.
    "(prefers-reduced-motion: reduce)": {
      transitionProperty: "background-color",
    },
  },
});

// ---- 글자

// Switch는 라벨에, SwitchRow는 라벨·설명 묶음에 붙여요.
export const text = style({
  minWidth: 0,
  paddingTop: textOffset,
});

// 라벨 자체를 flex로 두면 라벨 안의 글자와 링크가 줄마다 나뉘어서 묶음에만 써요.
export const stack = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing[4],
});

const disabledText = {
  [`${rowBase}:has(${disabledSelector}) &`]: { color: vars.color.fg.disabled },
};

export const label = style({
  fontFamily: vars.font.family.base,
  fontSize: labelFontSize,
  lineHeight: labelLineHeight,
  fontWeight: vars.font.weight.medium,
  // textStyles 묶음을 쓰지 않아서 한글 줄바꿈 규칙만 따로 맞춰요.
  wordBreak: "keep-all",
  overflowWrap: "break-word",
  color: vars.color.fg.neutral,
  selectors: disabledText,
});

export const description = style({
  ...textStyles.caption,
  color: vars.color.fg.neutralMuted,
  selectors: disabledText,
});
