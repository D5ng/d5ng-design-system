import type { ComponentPropsWithoutRef, ComponentRef } from "react"

import { forwardRef, useLayoutEffect, useState } from "react"
import { createPortal } from "react-dom"

type PortalElement = ComponentRef<"div">
interface PortalProps extends ComponentPropsWithoutRef<"div"> {
  container?: Element
}

const Portal = forwardRef<PortalElement, PortalProps>(({ children, container: containerProp, ...restProps }, ref) => {
  const [mounted, setMounted] = useState(false)
  // NOTE: Next.js의 하이드레이션 불일치로 인한 에러 방지
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useLayoutEffect(() => setMounted(true), [])

  const container = containerProp ?? (mounted && globalThis?.document?.body)
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
