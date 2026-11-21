import { describe, expect, it, vi } from "vitest";
import { renderHook } from "vitest-browser-react";

import { useControllableState } from "./useControllableState";

describe("useControllableState", () => {
  it("비제어면 안에서 값을 바꾸고 알려요", async () => {
    const onChange = vi.fn();
    const { result, act } = await renderHook(() =>
      useControllableState({ prop: undefined, defaultProp: true, onChange }),
    );

    await act(() => {
      result.current[1](false);
    });

    expect(result.current[0]).toBe(false);
    expect(onChange).toHaveBeenCalledExactlyOnceWith(false);
  });

  it("제어면 prop 값을 따르고 알리기만 해요", async () => {
    const onChange = vi.fn();
    const { result, act, rerender } = await renderHook(
      (prop?: boolean) =>
        useControllableState({ prop, defaultProp: true, onChange }),
      { initialProps: true },
    );

    await act(() => {
      result.current[1](false);
    });

    expect(result.current[0]).toBe(true);
    expect(onChange).toHaveBeenCalledExactlyOnceWith(false);

    await rerender(false);

    expect(result.current[0]).toBe(false);
  });

  it("같은 값이면 알리지 않아요", async () => {
    const onChange = vi.fn();
    const { result, act } = await renderHook(() =>
      useControllableState({ prop: undefined, defaultProp: true, onChange }),
    );

    await act(() => {
      result.current[1](true);
    });

    expect(onChange).not.toHaveBeenCalled();
  });
});
