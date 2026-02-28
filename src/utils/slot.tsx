import type { HTMLAttributes, ReactElement, ReactNode, Ref } from "react"

import { Children, cloneElement, forwardRef, isValidElement } from "react"

import { composeRefs } from "./compose-refs"
import { Slottable } from "./slottable"

type MergePropsWithRef<P> = P & { ref?: Ref<HTMLElement> }

interface SlotProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
}

/**
 * 상위 컴포넌트가 하위 컴포넌트에게 렌더링을 위임하는 유틸리티 컴포넌트
 * @param children - 하위 컴포넌트
 * @param restProps - 나머지 속성
 * @param forwardedRef - 상위 컴포넌트에서 전달된 ref
 * @returns ReactElement
 *
 * @see {@link https://github.com/radix-ui/primitives/blob/main/packages/react/slot/src/slot.tsx Radix UI의 Slot 참조}
 */
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
      ? cloneElement(
          newElement,
          {
            ...restProps,
            ref: composeRefs(forwardedRef, getElementRef(newElement)),
          } as MergePropsWithRef<SlotProps>,
          newChildren,
        )
      : null
  }

  if (Children.count(children) > 1) {
    console.warn("Slottable은 단일 요소로만 사용해야 합니다.")
    return Children.only(null)
  }

  return isValidElement(children)
    ? cloneElement(children, {
        ...restProps,
        ref: composeRefs(forwardedRef, getElementRef(children)),
      } as MergePropsWithRef<SlotProps>)
    : null
})

Slot.displayName = "Slot"

/**
 * ReactElement의 ref를 추출하는 유틸리티 함수
 * @param element - ReactElement
 * @returns Ref<unknown>
 *
 * @see {@link https://github.com/radix-ui/primitives/blob/main/packages/react/slot/src/slot.tsx#L203 Radix UI의 getElementRef 참조}
 *
 * React 19에서는 element.props.ref를 사용해야하지만, 그 미만 버전에서는 element.ref로 접근합니다. 따라서 버전 차이로 인한 console.error를 방지하기 위해 두 가지를 모두 확인합니다.
 */
function getElementRef(element: ReactElement) {
  return (element.props as { ref?: Ref<unknown> }).ref || (element as unknown as { ref?: Ref<unknown> }).ref
}
