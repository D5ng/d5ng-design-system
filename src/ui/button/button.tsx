import type { ButtonHTMLAttributes, ReactNode } from "react"

import { cva } from "class-variance-authority"

import { cn } from "@/lib/cn"
import { Slot } from "@/utils/slot"
import { Slottable } from "@/utils/slottable"

import type { VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "flex items-center justify-center gap-2 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-highlight-darkest focus:ring-offset-2",
  {
    variants: {
      variant: {
        primary: "bg-highlight-darkest text-neutral-light-lightest hover:bg-highlight-dark",
        secondary: "border-2 border-highlight-darkest text-highlight-darkest hover:bg-highlight-lightest",
        tertiary: "text-highlight-darkest hover:bg-highlight-lightest",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed",
        false: "opacity-100 cursor-pointer",
      },
      size: {
        default: "text-action-lg px-4 py-3 rounded-xl",
        small: "text-action-md px-3 py-2 rounded-lg",
        icon: "w-8 h-8 rounded-lg",
      },
    },
    compoundVariants: [
      {
        variant: "primary",
        disabled: true,
        className: "hover:bg-highlight-darkest focus:ring-0 focus:ring-offset-0",
      },
      {
        variant: "secondary",
        disabled: true,
        className: "hover:bg-transparent focus:ring-0 focus:ring-offset-0",
      },
      {
        variant: "tertiary",
        disabled: true,
        className: "hover:bg-transparent focus:ring-0 focus:ring-offset-0",
      },
    ],
    defaultVariants: {
      variant: "primary",
      size: "default",
      disabled: false,
    },
  },
)

type ButtonVariant = VariantProps<typeof buttonVariants>

interface Props extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariant {
  asChild?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  disabled?: boolean
}

export function Button({
  asChild,
  leftIcon,
  rightIcon,
  children,
  className,
  variant,
  disabled,
  size,
  ...restProps
}: Props) {
  const Component = asChild ? Slot : "button"
  return (
    <Component className={cn(buttonVariants({ variant, disabled, size }), className)} {...restProps}>
      {Boolean(leftIcon) && <div className="flex h-3 w-3 items-center justify-center">{leftIcon}</div>}
      <Slottable>{children}</Slottable>
      {Boolean(rightIcon) && <div className="flex h-3 w-3 items-center justify-center">{rightIcon}</div>}
    </Component>
  )
}
