import { textStyles, vars } from "@d5ng/tokens";
import { createVar, globalStyle, style } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

import { focusRing } from "../_internal/focusRing.css";

// tone이 채우고 배경·hover·pressed 규칙과 앞 아이콘이 읽어요.
const toneBg = createVar();
const toneIcon = createVar();
// ActionableCallout의 hover·pressed가 바꾸는 덮개 농도예요.
const overlay = createVar();

// Figma가 Callout 아이콘 16px을 변수로 묶지 않았어요.
const iconSize = "16px";

function tone(bg: string, icon: string) {
  return { vars: { [toneBg]: bg, [toneIcon]: icon } };
}

// ---- 루트

export const root = recipe({
  base: {
    display: "flex",
    alignItems: "flex-start",
    gap: vars.spacing[8],
    boxSizing: "border-box",
    // 닫기·화살표 자리에 위아래 여백을 더한 높이예요. 세 타입의 한 줄 높이가 같아져요.
    minHeight: `calc(${vars.button.minHeight.sm} + ${vars.spacing[4]} * 2)`,
    paddingBlock: vars.spacing[4],
    paddingInlineStart: vars.spacing[16],
    paddingInlineEnd: vars.spacing[8],
    borderRadius: vars.radius.lg,
    background: toneBg,
    // button·a로 그려도 같은 글자가 되게 글꼴까지 정해요.
    ...textStyles.bodySmall,
    color: vars.color.fg.neutral,
  },
  variants: {
    tone: {
      neutral: tone(vars.color.bg.neutralWeak, vars.color.fg.neutral),
      informative: tone(
        vars.color.bg.informativeWeak,
        vars.color.fg.informative,
      ),
      positive: tone(vars.color.bg.positiveWeak, vars.color.fg.positive),
      warning: tone(vars.color.bg.warningWeak, vars.color.fg.warning),
      critical: tone(vars.color.bg.criticalWeak, vars.color.fg.critical),
    },
  },
  defaultVariants: { tone: "neutral" },
});

export type RootVariants = NonNullable<RecipeVariants<typeof root>>;

// root 뒤에 정의해서 같은 우선순위의 background가 이 규칙으로 바뀌어요.
export const actionable = style({
  vars: { [overlay]: "0%" },
  width: "100%",
  margin: 0,
  border: "none",
  textAlign: "start",
  textDecoration: "none",
  cursor: "pointer",
  WebkitTapHighlightColor: "transparent",
  selectors: {
    "&:focus-visible": focusRing,
    "&:active": { vars: { [overlay]: "10%" } },
  },
  "@media": {
    "(hover: hover)": {
      selectors: {
        "&:hover:not(:active)": { vars: { [overlay]: "6%" } },
      },
    },
  },
  // Figma는 톤 배경 위에 bg/neutral-solid를 6%·10%로 덮어요. 톤마다 hover 토큰이 없어서 섞어서 만들어요.
  // color-mix()를 모르면 hover·pressed 없이 톤 배경 그대로예요.
  "@supports": {
    "(background: color-mix(in srgb, red, blue))": {
      background: `color-mix(in srgb, ${vars.color.bg.neutralSolid} ${overlay}, ${toneBg})`,
    },
  },
});

// ---- 내용

export const content = style({
  display: "flex",
  flex: 1,
  gap: vars.spacing[12],
  minWidth: 0,
  paddingBlock: vars.spacing[12],
  paddingInlineEnd: vars.spacing[8],
});

export const prefixIcon = style({
  display: "flex",
  alignItems: "center",
  flexShrink: 0,
  // 첫 줄 높이 안에서 가운데라서 설명이 여러 줄이어도 첫 줄에 맞아요.
  height: vars.font.lineHeight.t4,
  color: toneIcon,
});

// 쓰는 쪽이 넘긴 아이콘도 같은 크기로 맞춰요. 아이콘 라이브러리마다 기본 크기가 달라요.
globalStyle(`${prefixIcon} > svg`, { width: iconSize, height: iconSize });

export const message = style({
  flex: 1,
  minWidth: 0,
});

export const title = style({
  fontWeight: vars.font.weight.semibold,
});

// ---- 화살표

export const arrow = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  // DismissibleCallout의 닫기(IconButton small)와 같은 자리예요.
  width: vars.button.minHeight.sm,
  height: vars.button.minHeight.sm,
  color: vars.color.fg.neutral,
});

export const arrowIcon = style({
  width: iconSize,
  height: iconSize,
});
