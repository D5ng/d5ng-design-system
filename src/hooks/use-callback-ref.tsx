/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef } from "react"

type Callback = (...args: any[]) => void

export function useCallbackRef(callback: Callback | undefined) {
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }) // NOTE: 디펜던시를 추가하면, useEffect 내부적으로 현재의 callback과 이전의 callback을 비교하는 연산이 수행되기에, 강제적으로 업데이트를 하기 위해 디펜던시 제거

  return useMemo(
    () =>
      (...args: any[]) =>
        callbackRef.current?.(...args),
    [],
  ) as Callback | undefined
}
