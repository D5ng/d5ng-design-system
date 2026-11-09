import { vars } from "@d5ng/tokens";
import { createVar, globalStyle, keyframes, style } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

// variant마다 색만 바꾸고 상태 규칙은 base에서 한 번만 써요.
const bg = createVar();
const bgHover = createVar();
const bgPressed = createVar();
const bgDisabled = createVar();
const fg = createVar();

const iconSize = createVar();
const loadingSize = createVar();

// 상태 선택자는 한 곳에서만 정해요. Button.tsx가 붙이는 data 속성을 봐요.
const disabledSelector = "[data-disabled]";
const loadingSelector = "[data-loading]";

function colors(values: {
  bg: string;
  hover: string;
  pressed: string;
  disabled: string;
  fg: string;
}) {
  return {
    vars: {
      [bg]: values.bg,
      [bgHover]: values.hover,
      [bgPressed]: values.pressed,
      [bgDisabled]: values.disabled,
      [fg]: values.fg,
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
    background: bg,
    color: fg,
    fontFamily: vars.font.family.base,
    fontWeight: vars.font.weight.semibold,
    textDecoration: "none",
    whiteSpace: "nowrap",
    cursor: "pointer",
    userSelect: "none",
    WebkitTapHighlightColor: "transparent",
    // 누를 때는 spring-rapid, 뗄 때는 spring-quick으로 TDS 스프링과 같게 움직여요.
    transitionProperty: "background-color, transform",
    transitionDuration: vars.duration.springQuick,
    transitionTimingFunction: vars.easing.standard,

    selectors: {
      "&:focus-visible": {
        outline: `${vars.button.focusWidth} solid ${vars.color.stroke.focusRing}`,
        outlineOffset: vars.button.focusWidth,
      },
      [`&:active:not(${disabledSelector})`]: {
        background: bgPressed,
        transitionDuration: vars.duration.springRapid,
      },
      [`&:is(${disabledSelector})`]: {
        cursor: "not-allowed",
      },
      [`&:is(${disabledSelector}):not(${loadingSelector})`]: {
        background: bgDisabled,
        color: vars.color.fg.disabled,
      },
      // Figma처럼 모든 variant가 로딩 중에는 눌린 배경을 유지해요.
      [`&${loadingSelector}`]: {
        background: bgPressed,
        cursor: "progress",
      },
    },

    "@media": {
      "(hover: hover)": {
        selectors: {
          [`&:hover:not(:active, ${disabledSelector})`]: {
            background: bgHover,
          },
        },
      },
    },

    // 곡선이 var()라 배열 대체값은 동작하지 않아요. linear()를 모르면 standard 곡선을 그대로 써요.
    "@supports": {
      "(transition-timing-function: linear(0, 1))": {
        transitionTimingFunction: vars.easing.springQuick,
        selectors: {
          [`&:active:not(${disabledSelector})`]: {
            transitionTimingFunction: vars.easing.springRapid,
          },
        },
      },
    },
  },

  variants: {
    variant: {
      primary: colors({
        bg: vars.color.bg.actionPrimary,
        hover: vars.color.bg.actionPrimaryHover,
        pressed: vars.color.bg.actionPrimaryPressed,
        disabled: vars.color.bg.disabled,
        fg: vars.color.fg.onActionPrimary,
      }),
      secondary: colors({
        bg: vars.color.bg.neutralWeak,
        hover: vars.color.bg.neutralWeakHover,
        pressed: vars.color.bg.neutralWeakPressed,
        disabled: vars.color.bg.disabled,
        fg: vars.color.fg.neutral,
      }),
      // 배경 없이 글자만 보이다가 hover·pressed에서만 배경이 생겨요.
      ghost: colors({
        bg: "transparent",
        hover: vars.color.bg.neutralWeak,
        pressed: vars.color.bg.neutralWeakPressed,
        disabled: "transparent",
        fg: vars.color.fg.neutral,
      }),
      critical: colors({
        bg: vars.color.bg.actionCritical,
        hover: vars.color.bg.actionCriticalHover,
        pressed: vars.color.bg.actionCriticalPressed,
        disabled: vars.color.bg.disabled,
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
    fullWidth: {
      // 눌림 축소는 콘텐츠 너비일 때만 해요. 꽉 찬 너비는 같은 배율이면 너무 많이 줄어요.
      false: {
        selectors: {
          [`&:active:not(${disabledSelector})`]: {
            transform: `scale(calc(1 - ${vars.press.maxReduction}))`,
          },
        },
        "@media": {
          "(prefers-reduced-motion: reduce)": {
            selectors: {
              [`&:active:not(${disabledSelector})`]: {
                transform: "none",
              },
            },
          },
        },
      },
      true: { display: "flex", width: "100%" },
    },
  },

  defaultVariants: {
    variant: "primary",
    size: "medium",
    fullWidth: false,
  },
});

export type ButtonVariants = NonNullable<RecipeVariants<typeof button>>;

// 로딩 중에도 너비가 그대로이도록 내용은 숨기기만 해요.
export const content = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "inherit",
  selectors: {
    [`${loadingSelector} > &`]: { opacity: 0 },
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
