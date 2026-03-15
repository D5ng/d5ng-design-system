import type { HTMLAttributes } from "react"

import { cva } from "class-variance-authority"

import { cn } from "@/lib/cn"

import type { VariantProps } from "class-variance-authority"

const DEFAULT_ACCESSIBLE_LABEL = "로딩 중"
const VIEWBOX_SIZE = 24
const CENTER = VIEWBOX_SIZE / 2
const RADIUS = 10
const STROKE_WIDTH = 2

const loadingVariants = cva("text-current", {
  variants: {
    center: {
      true: "absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4",
      false: "relative",
    },
    size: {
      default: "w-5 h-5",
      large: "w-8 h-8",
      small: "w-4 h-4",
    },
  },
  defaultVariants: {
    size: "default",
    center: true,
  },
})

type LoadingVariant = VariantProps<typeof loadingVariants>

interface LoadingProps extends HTMLAttributes<HTMLDivElement>, LoadingVariant {
  "aria-label"?: string
}
export function Loading({
  className,
  center = true,
  size = "default",
  "aria-label": ariaLabel = DEFAULT_ACCESSIBLE_LABEL,
  ...restProps
}: LoadingProps) {
  return (
    <div
      role="status"
      aria-label={ariaLabel}
      className={cn(loadingVariants({ center, size }), className)}
      {...restProps}
    >
      <svg className="loading-circular" viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`} width="100%" height="100%">
        <circle
          className="loading-path"
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth={STROKE_WIDTH}
          strokeMiterlimit="10"
        />
      </svg>
    </div>
  )
}

Loading.displayName = "Loading"
