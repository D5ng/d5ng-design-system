import { vars } from "@d5ng/tokens";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

import * as buttonBase from "../_internal/buttonBase.css";

function size(values: {
  size: string;
  radius: string;
  icon: string;
  loading: string;
}) {
  return {
    vars: {
      [buttonBase.iconSize]: values.icon,
      [buttonBase.loadingSize]: values.loading,
    },
    width: values.size,
    height: values.size,
    borderRadius: values.radius,
  };
}

export const iconButton = recipe({
  // 늘 콘텐츠 크기라서 눌림 축소를 항상 붙여요.
  base: [
    buttonBase.root,
    buttonBase.pressScale,
    {
      // flex 줄 안에서 줄어들면 조작 영역이 Figma 크기보다 작아져요.
      flexShrink: 0,
      padding: 0,
    },
  ],

  variants: {
    variant: buttonBase.variantColors,
    size: {
      xsmall: size({
        size: vars.button.minHeight.xs,
        radius: vars.radius.full,
        icon: vars.button.iconSize.xs,
        loading: vars.button.loadingSize.xs,
      }),
      small: size({
        size: vars.button.minHeight.sm,
        radius: vars.radius.lg,
        icon: vars.button.iconSize.sm,
        loading: vars.button.loadingSize.sm,
      }),
      medium: size({
        size: vars.button.minHeight.md,
        radius: vars.radius.lg,
        icon: vars.button.iconSize.md,
        loading: vars.button.loadingSize.md,
      }),
      large: size({
        size: vars.button.minHeight.lg,
        radius: vars.radius.lg,
        icon: vars.button.iconSize.lg,
        loading: vars.button.loadingSize.lg,
      }),
    },
  },

  defaultVariants: {
    variant: "primary",
    size: "medium",
  },
});

export type IconButtonVariants = NonNullable<RecipeVariants<typeof iconButton>>;
