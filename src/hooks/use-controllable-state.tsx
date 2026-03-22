/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Dispatch, RefObject, SetStateAction } from "react"

import { useCallback, useEffect, useRef, useState } from "react"

interface UseControllableState<T> {
  prop?: T | undefined
  defaultProp: T
  onChange?: (...args: any[]) => void
}

export function useControllableState<T>({
  prop,
  defaultProp,
  onChange = () => {},
}: UseControllableState<T>): [T, Dispatch<SetStateAction<T>>] {
  const [uncontrolledProp, setUncontrolledProp, onChangeRef] = useUncontrollableState<T>({ defaultProp, onChange })

  const isControlled = prop !== undefined
  const value = isControlled ? prop : uncontrolledProp

  const setValue = useCallback<Dispatch<SetStateAction<T>>>(
    (nextValue) => {
      if (isControlled) {
        const value = isFunction(nextValue) ? nextValue(prop) : nextValue
        if (value !== prop) {
          onChangeRef.current?.(value)
        }
      } else {
        setUncontrolledProp(nextValue)
      }
    },
    [isControlled, prop, onChangeRef, setUncontrolledProp],
  )

  return [value, setValue] as const
}

function useUncontrollableState<T>({
  defaultProp,
  onChange,
}: Omit<UseControllableState<T>, "prop">): [
  T,
  Dispatch<SetStateAction<T>>,
  RefObject<((...args: any[]) => void) | undefined>,
] {
  const [value, setValue] = useState(defaultProp)

  const prevValueRef = useRef(value)

  const onChangeRef = useRef(onChange)
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    if (prevValueRef.current !== value) {
      onChangeRef.current?.(value)
      prevValueRef.current = value
    }
  }, [value])

  return [value, setValue, onChangeRef] as const
}

function isFunction(value: unknown): value is (...args: any[]) => any {
  return typeof value === "function"
}
