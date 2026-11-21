import { vars } from "@d5ng/tokens";
import { createVar, globalStyle, style } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

// tone은 색 다섯 개만 채우고, variant가 그중 무엇을 배경·테두리·글자에 쓸지 골라요.
// 이렇게 나누면 variant 3 × tone 6 조합을 compoundVariants 18개로 늘어놓지 않아도 돼요.
const weakBg = createVar();
const solidBg = createVar();
const fg = createVar();
const onSolidFg = createVar();
const outlineStroke = createVar();

const iconSize = createVar();

// Figma에도 Badge 테두리 두께 변수가 없어요.
const borderWidth = "1px";

// Figma 테두리는 안쪽(INSIDE)이라 여백에 안 잡히지만 CSS border는 잡혀서 그만큼 빼요.
const insetSpace = (space: string) => `calc(${space} - ${borderWidth})`;

const toneColors = (values: {
  weakBg: string;
  solidBg: string;
  fg: string;
  onSolidFg: string;
  outlineStroke: string;
}) => ({
  vars: {
    [weakBg]: values.weakBg,
    [solidBg]: values.solidBg,
    [fg]: values.fg,
    [onSolidFg]: values.onSolidFg,
    [outlineStroke]: values.outlineStroke,
  },
});

export const badge = recipe({
  base: {
    display: "inline-flex",
    alignItems: "center",
    boxSizing: "border-box",
    // 부모가 좁으면 배지도 줄어들어서 라벨이 말줄임돼요.
    minWidth: 0,
    maxWidth: "100%",
    // weak·solid도 투명한 테두리를 둬요. forced-colors에서 배경이 사라져도 상자가 보여요.
    border: `${borderWidth} solid transparent`,
    fontFamily: vars.font.family.base,
    fontSize: vars.font.size.t2,
    lineHeight: vars.font.lineHeight.t2,
  },

  variants: {
    variant: {
      weak: {
        backgroundColor: weakBg,
        color: fg,
        fontWeight: vars.font.weight.medium,
      },
      solid: {
        backgroundColor: solidBg,
        color: onSolidFg,
        fontWeight: vars.font.weight.semibold,
      },
      outline: {
        backgroundColor: "transparent",
        borderColor: outlineStroke,
        color: fg,
        fontWeight: vars.font.weight.semibold,
      },
    },
    // Outline 테두리는 Figma가 글자색 토큰에 묶었어요. stroke 토큰에는 tone별 색이 없어요.
    tone: {
      neutral: toneColors({
        weakBg: vars.color.bg.neutralWeak,
        solidBg: vars.color.bg.neutralSolid,
        fg: vars.color.fg.neutralMuted,
        onSolidFg: vars.color.fg.onNeutralSolid,
        outlineStroke: vars.color.stroke.neutralMuted,
      }),
      brand: toneColors({
        weakBg: vars.color.bg.brandWeak,
        solidBg: vars.color.bg.brandSolid,
        fg: vars.color.fg.brand,
        onSolidFg: vars.color.fg.onBrandSolid,
        outlineStroke: vars.color.fg.brand,
      }),
      informative: toneColors({
        weakBg: vars.color.bg.informativeWeak,
        solidBg: vars.color.bg.informativeSolid,
        fg: vars.color.fg.informative,
        onSolidFg: vars.color.fg.onInformativeSolid,
        outlineStroke: vars.color.fg.informative,
      }),
      positive: toneColors({
        weakBg: vars.color.bg.positiveWeak,
        solidBg: vars.color.bg.positiveSolid,
        fg: vars.color.fg.positive,
        onSolidFg: vars.color.fg.onPositiveSolid,
        outlineStroke: vars.color.fg.positive,
      }),
      warning: toneColors({
        weakBg: vars.color.bg.warningWeak,
        solidBg: vars.color.bg.warningSolid,
        fg: vars.color.fg.warning,
        onSolidFg: vars.color.fg.onWarningSolid,
        outlineStroke: vars.color.fg.warning,
      }),
      critical: toneColors({
        weakBg: vars.color.bg.criticalWeak,
        solidBg: vars.color.bg.criticalSolid,
        fg: vars.color.fg.critical,
        onSolidFg: vars.color.fg.onCriticalSolid,
        outlineStroke: vars.color.fg.critical,
      }),
    },
    // 높이와 아이콘 크기는 Figma가 변수로 묶지 않아서 숫자로 써요.
    // 높이는 최소값이라 글자를 키우면 배지도 커져요.
    size: {
      medium: {
        vars: { [iconSize]: "12px" },
        minHeight: "20px",
        padding: `${insetSpace(vars.spacing[2])} ${insetSpace(vars.spacing[6])}`,
        gap: vars.spacing[2],
        borderRadius: vars.radius.sm,
      },
      large: {
        vars: { [iconSize]: "14px" },
        minHeight: "24px",
        padding: `${insetSpace(vars.spacing[4])} ${insetSpace(vars.spacing[8])}`,
        gap: vars.spacing[2],
        borderRadius: vars.radius.md,
      },
    },
  },

  defaultVariants: {
    variant: "weak",
    tone: "neutral",
    size: "medium",
  },
});

export type BadgeVariants = NonNullable<RecipeVariants<typeof badge>>;

export const prefix = style({
  display: "inline-flex",
  flexShrink: 0,
  width: iconSize,
  height: iconSize,
});

// 아이콘 라이브러리마다 기본 크기가 달라서 자리에 맞춰 늘이거나 줄여요.
globalStyle(`${prefix} > svg`, { width: "100%", height: "100%" });

// 글자를 감싼 요소가 있어야 말줄임이 돼요. flex의 글자 조각에는 스타일을 줄 수 없어요.
export const label = style({
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});
