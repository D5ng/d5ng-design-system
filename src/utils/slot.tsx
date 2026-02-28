import type { HTMLAttributes, ReactElement, ReactNode, Ref } from "react"

import { Children, cloneElement, forwardRef, isValidElement } from "react"

import { Slottable } from "./slottable"

type MergePropsWithRef<P> = P & { ref?: Ref<HTMLElement> }

interface SlotProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
}

export const Slot = forwardRef<HTMLElement, SlotProps>(({ children, ...restProps }, forwardedRef) => {
  const childrenArray = Children.toArray(children)
  const slottable = childrenArray.find((child) => isValidElement(child) && child.type === Slottable) as ReactElement<{
    children: ReactNode
  }>

  if (slottable) {
    const newElement = slottable.props.children
    const newChildren = childrenArray.map((child) => {
      if (child !== slottable) {
        return child
      }

      if (Children.count(newElement) > 1) {
        console.warn("Slottable은 단일 요소로만 사용해야 합니다.")
        return Children.only(null)
      }

      return isValidElement(newElement) ? (newElement.props as { children: ReactNode }).children : null
    })

    return isValidElement(newElement)
      ? cloneElement(newElement, { ...restProps, ref: forwardedRef } as MergePropsWithRef<SlotProps>, newChildren)
      : null
  }

  if (Children.count(children) > 1) {
    console.warn("Slottable은 단일 요소로만 사용해야 합니다.")
    return Children.only(null)
  }

  return isValidElement(children)
    ? cloneElement(children, { ...restProps, ref: forwardedRef } as MergePropsWithRef<SlotProps>)
    : null
})

Slot.displayName = "Slot"
