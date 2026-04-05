import type { ComponentPropsWithoutRef, ComponentRef } from "react"

import { forwardRef } from "react"
import { createPortal } from "react-dom"

import { useIsHydrated as useIsClient } from "@/hooks/use-is-hydrated"

type PortalElement = ComponentRef<"div">
interface PortalProps extends ComponentPropsWithoutRef<"div"> {
  container?: Element
}

const Portal = forwardRef<PortalElement, PortalProps>(({ children, container: containerProp, ...restProps }, ref) => {
  const isClient = useIsClient()

  const container = containerProp ?? (isClient && globalThis?.document?.body)
  return container
    ? createPortal(
        <div {...restProps} ref={ref}>
          {children}
        </div>,
        container,
      )
    : null
})

Portal.displayName = "Portal"

export { Portal }
