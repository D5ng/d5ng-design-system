import type { HTMLAttributes, ReactNode } from "react"

import { cva } from "class-variance-authority"

import { cn } from "@/lib/cn"
import { Slot } from "@/utils/slot"
import { Slottable } from "@/utils/slottable"

import type { VariantProps } from "class-variance-authority"

const badgeVariants = cva("inline-flex items-center justify-center rounded-full px-2 py-1.5 text-caption-md gap-1", {
  variants: {
    variant: {
      primary: "bg-highlight-darkest text-neutral-light-lightest",
      secondary: "bg-highlight-lightest text-highlight-darkest",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
})

interface Props extends VariantProps<typeof badgeVariants>, HTMLAttributes<HTMLDivElement> {
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  asChild?: boolean
}

export function Badge({ className, children, variant, leftIcon, rightIcon, asChild, ...restProps }: Props) {
  const Component = asChild ? Slot : "div"

  return (
    <Component className={cn(badgeVariants({ variant }), className)} {...restProps}>
      {Boolean(leftIcon) && (
        <div className="flex h-3 w-3 items-center justify-center" aria-hidden="true">
          {leftIcon}
        </div>
      )}
      <Slottable>
        <span className="px-1">{children}</span>
      </Slottable>
      {Boolean(rightIcon) && (
        <div className="flex h-3 w-3 items-center justify-center" aria-hidden="true">
          {rightIcon}
        </div>
      )}
    </Component>
  )
}
