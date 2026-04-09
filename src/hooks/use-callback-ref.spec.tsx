import { renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { useCallbackRef } from "./use-callback-ref"

describe("useCallbackRef", () => {
  describe("반환된 함수의 참조 안정성", () => {
    it("초기 렌더링 후 반환된 함수는 일정한 참조를 유지한다", () => {
      const { result, rerender } = renderHook(() => useCallbackRef(vi.fn()))
      const firstRef = result.current
      rerender()
      expect(result.current).toBe(firstRef)
    })

    it("콜백이 변경되어도 반환된 함수의 참조는 변하지 않는다", () => {
      const { result, rerender } = renderHook(({ cb }) => useCallbackRef(cb), {
        initialProps: { cb: vi.fn() },
      })
      const firstRef = result.current
      rerender({ cb: vi.fn() })
      expect(result.current).toBe(firstRef)
    })
  })

  describe("최신 콜백 호출", () => {
    it("처음 등록된 콜백을 올바르게 호출한다", () => {
      const cb = vi.fn()
      const { result } = renderHook(() => useCallbackRef(cb))
      result.current?.()
      expect(cb).toHaveBeenCalledOnce()
    })

    it("콜백이 변경된 후 호출하면 최신 콜백이 실행된다", () => {
      const oldCb = vi.fn()
      const newCb = vi.fn()
      const { result, rerender } = renderHook(({ cb }) => useCallbackRef(cb), {
        initialProps: { cb: oldCb },
      })
      rerender({ cb: newCb })
      result.current?.()
      expect(newCb).toHaveBeenCalledOnce()
    })

    it("이전 콜백은 더 이상 호출되지 않는다", () => {
      const oldCb = vi.fn()
      const newCb = vi.fn()
      const { result, rerender } = renderHook(({ cb }) => useCallbackRef(cb), {
        initialProps: { cb: oldCb },
      })
      rerender({ cb: newCb })
      result.current?.()
      expect(oldCb).not.toHaveBeenCalled()
    })
  })

  describe("인수 전달", () => {
    it("반환된 함수에 전달된 인수가 콜백에 그대로 전달된다", () => {
      const cb = vi.fn()
      const { result } = renderHook(() => useCallbackRef(cb))
      result.current?.("hello", 42)
      expect(cb).toHaveBeenCalledWith("hello", 42)
    })
  })

  describe("undefined 처리", () => {
    it("콜백이 undefined일 때 에러 없이 동작한다", () => {
      const { result } = renderHook(() => useCallbackRef(undefined))
      expect(() => result.current?.()).not.toThrow()
    })

    it("콜백이 undefined에서 함수로 변경되면 이후 호출에서 실행된다", () => {
      const callbackSpy = vi.fn()
      const cb: () => void = callbackSpy
      const initialProps: { cb: (() => void) | undefined } = { cb: undefined }
      const { result, rerender } = renderHook(({ cb }: { cb: (() => void) | undefined }) => useCallbackRef(cb), {
        initialProps,
      })
      rerender({ cb })
      result.current?.()
      expect(callbackSpy).toHaveBeenCalledOnce()
    })

    it("콜백이 함수에서 undefined로 변경되면 이후 호출에서 실행되지 않는다", () => {
      const callbackSpy = vi.fn()
      const cb: () => void = callbackSpy
      const initialProps: { cb: (() => void) | undefined } = { cb }
      const { result, rerender } = renderHook(({ cb }: { cb: (() => void) | undefined }) => useCallbackRef(cb), {
        initialProps,
      })

      rerender({ cb: undefined })
      expect(() => result.current?.()).not.toThrow()
      expect(callbackSpy).not.toHaveBeenCalled()
    })
  })
})
