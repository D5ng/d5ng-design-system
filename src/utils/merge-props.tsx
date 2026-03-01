// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyProps = Record<string, any>

/**
 * 상위 컴포넌트와 하위 컴포넌트의 props를 병합하는 유틸리티 함수
 * - `className`은 문자열로 합쳐집니다.
 * - `style`은 객체로 합쳐집니다.
 * - `onEvent`는 하나의 함수로 합치고 상위 컴포넌트의 핸들러가 먼저 실행되며, 그 다음 하위 컴포넌트의 핸들러가 실행됩니다.
 *
 * @why 상위 컴포넌트와 하위 컴포넌트의 props를 특정 하나로 덮어씌우는 방식은 기능을 추가할 때 확장성과 유연성이 떨어집니다.
 *
 * @param slotProps - 상위 컴포넌트의 props
 * @param childProps - 하위 컴포넌트의 props
 * @returns 병합된 props
 */
export function mergeProps(slotProps: AnyProps, childProps: AnyProps) {
  const overrideProps = { ...childProps }

  for (const propName in childProps) {
    const slotPropValue = slotProps[propName]
    const childPropValue = childProps[propName]

    switch (propName) {
      case "style":
        overrideProps[propName] = { ...slotPropValue, ...childPropValue }
        break

      case "className":
        overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(" ")
        break

      default: {
        const isHandler = /^on[A-Z]/.test(propName)
        if (isHandler) {
          const mergedFunction = mergeFunction(slotPropValue, childPropValue)

          if (mergedFunction) {
            overrideProps[propName] = mergedFunction
          } else if (slotPropValue) {
            overrideProps[propName] = slotPropValue
          }
        }
      }
    }
  }

  // NOTE: 동일한 key가 있을 경우, 하위 컴포넌트의 props로 덮어씌웁니다.
  return { ...slotProps, ...overrideProps }
}

function mergeFunction(slotFunction: (...args: unknown[]) => void, childFunction: (...args: unknown[]) => void) {
  if (typeof slotFunction === "function" && typeof childFunction) {
    return (...args: unknown[]) => {
      slotFunction(...args)
      childFunction(...args)
    }
  }
}
