import type { HTMLAttributes, ReactElement, ReactNode } from "react"

import { Children, cloneElement, isValidElement } from "react"

import { Slottable } from "./slottable"

interface SlotProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
}

export function Slot({ children, ...restProps }: SlotProps) {
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

    return isValidElement(newElement) ? cloneElement(newElement, restProps, newChildren) : null
  }

  if (Children.count(children) > 1) {
    console.warn("Slottable은 단일 요소로만 사용해야 합니다.")
    return Children.only(null)
  }

  return isValidElement(children) ? cloneElement(children, restProps) : null
}
