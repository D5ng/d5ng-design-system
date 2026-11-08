import { vars } from "@d5ng/tokens";
import { createVar, keyframes, style } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

// variant마다 색만 바꾸고 상태 규칙은 base에서 한 번만 써요.
const bg = createVar();
const bgHover = createVar();
const bgPressed = createVar();
// Solid는 pressed 색, Outline·Ghost는 투명이에요.
const bgLoading = createVar();
const bgDisabled = createVar();
const fg = createVar();
const border = createVar();

const iconSize = createVar();
const loadingSize = createVar();

const disabledSelector = ':disabled, [aria-disabled="true"]';

function colors(values: {
  bg?: string;
  hover: string;
  pressed: string;
  fg: string;
  border?: string;
}) {
  const solid = values.bg !== undefined;
  return {
    vars: {
      [bg]: values.bg ?? "transparent",
      [bgHover]: values.hover,
      [bgPressed]: values.pressed,
      [bgLoading]: solid ? values.pressed : "transparent",
      [bgDisabled]: solid ? vars.color.bg.disabled : "transparent",
      [fg]: values.fg,
      [border]: values.border ?? "transparent",
    },
  };
}

function size(values: {
  height: string;
  radius: string;
  paddingX: string;
  paddingY: string;
  fontSize: string;
  lineHeight: string;
  gap: string;
  icon: string;
  loading: string;
}) {
  return {
    vars: { [iconSize]: values.icon, [loadingSize]: values.loading },
    minHeight: values.height,
    minWidth: values.height,
    borderRadius: values.radius,
    padding: `${values.paddingY} ${values.paddingX}`,
    fontSize: values.fontSize,
    lineHeight: values.lineHeight,
    gap: values.gap,
  };
}

export const button = recipe({
  base: {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    margin: 0,
    border: "none",
    // Outline은 Figma처럼 안쪽 1px 테두리라 패딩이 바뀌지 않아요.
    boxShadow: `inset 0 0 0 1px ${border}`,
    background: bg,
    color: fg,
    fontFamily: vars.font.family.base,
    fontWeight: vars.font.weight.bold,
    textDecoration: "none",
    whiteSpace: "nowrap",
    cursor: "pointer",
    userSelect: "none",
    WebkitTapHighlightColor: "transparent",
    transitionProperty: "background-color, transform",
    transitionDuration: vars.duration.normal,
    transitionTimingFunction: vars.easing.standard,

    selectors: {
      "&:focus-visible": {
        outline: `${vars.button.focusWidth} solid ${vars.color.stroke.focusRing}`,
        outlineOffset: vars.button.focusWidth,
      },
      "&:active:not(:disabled, [aria-disabled='true'])": {
        background: bgPressed,
        transitionDuration: vars.duration.fast,
      },
      [`&:is(${disabledSelector})`]: {
        cursor: "not-allowed",
      },
      "&:is(:disabled, [aria-disabled='true']):not([data-loading])": {
        background: bgDisabled,
        color: vars.color.fg.disabled,
      },
      "&[data-loading]": {
        background: bgLoading,
        cursor: "progress",
      },
    },

    "@media": {
      "(hover: hover)": {
        selectors: {
          "&:hover:not(:active, :disabled, [aria-disabled='true'])": {
            background: bgHover,
          },
        },
      },
    },
  },

  variants: {
    variant: {
      "brand-solid": colors({
        bg: vars.color.bg.actionPrimary,
        hover: vars.color.bg.actionPrimaryHover,
        pressed: vars.color.bg.actionPrimaryPressed,
        fg: vars.color.fg.onActionPrimary,
      }),
      "neutral-weak": colors({
        bg: vars.color.bg.neutralWeak,
        hover: vars.color.bg.neutralWeakHover,
        pressed: vars.color.bg.neutralWeakPressed,
        fg: vars.color.fg.neutral,
      }),
      "neutral-solid": colors({
        bg: vars.color.bg.actionNeutral,
        hover: vars.color.bg.actionNeutralHover,
        pressed: vars.color.bg.actionNeutralPressed,
        fg: vars.color.fg.onActionNeutral,
      }),
      "neutral-outline": colors({
        hover: vars.color.bg.neutralWeak,
        pressed: vars.color.bg.neutralWeakPressed,
        fg: vars.color.fg.neutral,
        border: vars.color.stroke.neutralMuted,
      }),
      // Figma에서 의도한 차이예요. pressed가 Neutral Outline보다 한 단계 옅어요.
      "brand-outline": colors({
        hover: vars.color.bg.neutralWeak,
        pressed: vars.color.bg.neutralWeakHover,
        fg: vars.color.fg.brand,
        border: vars.color.stroke.neutralMuted,
      }),
      ghost: colors({
        hover: vars.color.bg.neutralWeak,
        pressed: vars.color.bg.neutralWeakPressed,
        fg: vars.color.fg.neutral,
      }),
      "critical-solid": colors({
        bg: vars.color.bg.actionCritical,
        hover: vars.color.bg.actionCriticalHover,
        pressed: vars.color.bg.actionCriticalPressed,
        fg: vars.color.fg.onActionSolid,
      }),
    },
    size: {
      xsmall: size({
        height: vars.button.minHeight.xs,
        radius: vars.radius.full,
        // Figma에도 14에 맞는 spacing 토큰이 없어요.
        paddingX: "14px",
        paddingY: vars.spacing[6],
        fontSize: vars.font.size.t3,
        lineHeight: vars.font.lineHeight.t3,
        gap: vars.spacing[4],
        icon: vars.button.iconSize.xs,
        loading: vars.button.loadingSize.xs,
      }),
      small: size({
        height: vars.button.minHeight.sm,
        radius: vars.radius.lg,
        paddingX: vars.spacing[12],
        paddingY: vars.spacing[12],
        fontSize: vars.font.size.t4,
        lineHeight: vars.font.lineHeight.t4,
        gap: vars.spacing[8],
        icon: vars.button.iconSize.sm,
        loading: vars.button.loadingSize.sm,
      }),
      medium: size({
        height: vars.button.minHeight.md,
        radius: vars.radius.lg,
        paddingX: vars.spacing[16],
        paddingY: vars.spacing[12],
        fontSize: vars.font.size.t5,
        lineHeight: vars.font.lineHeight.t5,
        gap: vars.spacing[8],
        icon: vars.button.iconSize.md,
        loading: vars.button.loadingSize.md,
      }),
      large: size({
        height: vars.button.minHeight.lg,
        radius: vars.radius.lg,
        paddingX: vars.spacing[20],
        paddingY: vars.spacing[16],
        fontSize: vars.font.size.t6,
        lineHeight: vars.font.lineHeight.t6,
        gap: vars.spacing[8],
        icon: vars.button.iconSize.lg,
        loading: vars.button.loadingSize.lg,
      }),
    },
    width: {
      // 눌림 축소는 Hug만 해요. Fill은 넓어서 같은 배율이면 너무 많이 줄어요.
      hug: {
        selectors: {
          "&:active:not(:disabled, [aria-disabled='true'])": {
            transform: `scale(calc(1 - ${vars.press.maxReduction}))`,
          },
        },
        "@media": {
          "(prefers-reduced-motion: reduce)": {
            selectors: {
              "&:active:not(:disabled, [aria-disabled='true'])": {
                transform: "none",
              },
            },
          },
        },
      },
      fill: { display: "flex", width: "100%" },
    },
  },

  defaultVariants: {
    variant: "brand-solid",
    size: "small",
    width: "hug",
  },
});

export type ButtonVariants = NonNullable<RecipeVariants<typeof button>>;

// 로딩 중에도 너비가 그대로이도록 내용은 숨기기만 해요.
export const content = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "inherit",
  selectors: {
    "[data-loading] > &": { opacity: 0 },
  },
});

export const icon = style({
  display: "inline-flex",
  flexShrink: 0,
  width: iconSize,
  height: iconSize,
});

const spin = keyframes({ to: { transform: "rotate(360deg)" } });

export const spinner = style({
  position: "absolute",
  inset: 0,
  margin: "auto",
  width: loadingSize,
  height: loadingSize,
  animation: `${spin} 1s linear infinite`,
  "@media": {
    // 회전을 멈춰도 aria-busy로 처리 중임을 알려요.
    "(prefers-reduced-motion: reduce)": { animation: "none" },
  },
});
