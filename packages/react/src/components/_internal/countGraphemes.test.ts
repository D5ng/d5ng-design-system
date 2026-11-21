import { describe, expect, it } from "vitest";

import { countGraphemes } from "./countGraphemes";

describe("countGraphemes", () => {
  it("이모지와 한글을 한 글자로 세요", () => {
    // 가족 이모지는 UTF-16으로 11자리, 국기는 4자리예요.
    expect(countGraphemes("👨‍👩‍👧🇰🇷한글")).toBe(4);
  });

  it("빈 값은 0이에요", () => {
    expect(countGraphemes("")).toBe(0);
  });
});
