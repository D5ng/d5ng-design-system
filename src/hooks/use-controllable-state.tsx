/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Dispatch, SetStateAction } from "react"

import { useCallback, useEffect, useRef, useState } from "react"

import { useCallbackRef } from "./use-callback-ref"

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
  const [uncontrolledProp, setUncontrolledProp, onChangeCallback] = useUncontrollableState<T>({ defaultProp, onChange })

  const isControlled = prop !== undefined
  const value = isControlled ? prop : uncontrolledProp

  const setValue = useCallback<Dispatch<SetStateAction<T>>>(
    (nextValue) => {
      if (isControlled) {
        const value = isFunction(nextValue) ? nextValue(prop) : nextValue
        if (value !== prop) {
          onChangeCallback?.(value)
        }
      } else {
        setUncontrolledProp(nextValue)
      }
    },
    [isControlled, onChangeCallback, prop, setUncontrolledProp],
  )

  return [value, setValue] as const
}

function useUncontrollableState<T>({
  defaultProp,
  onChange,
}: Omit<UseControllableState<T>, "prop">): [T, Dispatch<SetStateAction<T>>, ((...args: any[]) => void) | undefined] {
  const [value, setValue] = useState(defaultProp)

  const prevValueRef = useRef(value)
  const onChangeCallback = useCallbackRef(onChange)

  useEffect(() => {
    if (prevValueRef.current !== value) {
      onChangeCallback?.(value)
      prevValueRef.current = value
    }
  }, [onChangeCallback, value])

  return [value, setValue, onChangeCallback] as const
}

function isFunction(value: unknown): value is (...args: any[]) => any {
  return typeof value === "function"
}
