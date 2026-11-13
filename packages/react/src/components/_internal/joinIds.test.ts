import { describe, expect, it } from "vitest";

import { joinIds } from "./joinIds";

describe("joinIds", () => {
  it("빈 id는 빼고 공백으로 이어요", () => {
    expect(joinIds("a", undefined, "", "b")).toBe("a b");
  });

  it("남는 id가 없으면 undefined예요", () => {
    expect(joinIds(undefined, "")).toBeUndefined();
  });
});
