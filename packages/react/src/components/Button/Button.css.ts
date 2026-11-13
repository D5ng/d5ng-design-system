import { vars } from "@d5ng/tokens";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

import * as buttonBase from "../_internal/buttonBase.css";

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
    vars: {
      [buttonBase.iconSize]: values.icon,
      [buttonBase.loadingSize]: values.loading,
    },
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
  base: buttonBase.root,

  variants: {
    variant: buttonBase.variantColors,
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
      false: buttonBase.pressScale,
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
