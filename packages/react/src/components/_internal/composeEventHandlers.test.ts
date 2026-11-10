import { describe, expect, it, vi } from "vitest";

import { composeEventHandlers } from "./composeEventHandlers";

describe("composeEventHandlers", () => {
  it("쓰는 쪽 핸들러를 먼저 부르고 우리 핸들러를 불러요", () => {
    const calls: string[] = [];
    const handler = composeEventHandlers(
      () => calls.push("theirs"),
      () => calls.push("ours"),
    );

    handler(new Event("test", { cancelable: true }));

    expect(calls).toEqual(["theirs", "ours"]);
  });

  it("쓰는 쪽이 preventDefault()하면 우리 핸들러는 건너뛰어요", () => {
    const ourHandler = vi.fn();
    const handler = composeEventHandlers((event: Event) => {
      event.preventDefault();
    }, ourHandler);

    handler(new Event("test", { cancelable: true }));

    expect(ourHandler).not.toHaveBeenCalled();
  });
});
