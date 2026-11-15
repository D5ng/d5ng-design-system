import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";

import { composeRefs } from "./composeRefs";

describe("composeRefs", () => {
  it("객체 ref와 함수 ref에 같은 요소를 넣어요", () => {
    const objectRef = createRef<HTMLDivElement>();
    const callbackRef = vi.fn();
    const node = document.createElement("div");

    composeRefs(objectRef, callbackRef, undefined)(node);

    expect(objectRef.current).toBe(node);
    expect(callbackRef).toHaveBeenCalledWith(node);
  });

  it("정리 함수가 있으면 떨어질 때 부르고 나머지 ref는 비워요", () => {
    const objectRef = createRef<HTMLDivElement>();
    const cleanup = vi.fn();
    const node = document.createElement("div");

    const detach = composeRefs(objectRef, () => cleanup)(node);
    expect(detach).toBeTypeOf("function");
    if (typeof detach === "function") {
      detach();
    }

    expect(cleanup).toHaveBeenCalledOnce();
    expect(objectRef.current).toBeNull();
  });

  it("정리 함수가 없으면 아무것도 돌려주지 않아요", () => {
    // React가 null로 다시 불러 비우는 기존 방식을 따라요.
    const detach = composeRefs(createRef<HTMLDivElement>())(
      document.createElement("div"),
    );

    expect(detach).toBeUndefined();
  });
});
