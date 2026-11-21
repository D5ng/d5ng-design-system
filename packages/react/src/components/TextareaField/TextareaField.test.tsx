import { createRef, type SubmitEvent } from "react";
import { describe, expect, it, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";

import { TextareaField } from "./TextareaField";

// 높이·링·테두리는 textarea가 아니라 textarea를 감싼 상자가 그려요.
const boxOf = (textarea: Element) => {
  if (!textarea.parentElement) {
    throw new Error("textarea를 감싼 상자가 없어요.");
  }
  return textarea.parentElement;
};

const heightOf = (element: Element) => element.getBoundingClientRect().height;

// 한 줄은 22px, 위아래 여백은 15px씩, 테두리는 1px씩이에요(Figma 16px 여백 = 15 + 테두리 1).
const boxHeightFor = (lines: number) => lines * 22 + 15 * 2 + 1 * 2;

const lines = (count: number) =>
  Array.from({ length: count }, (_, index) => `${String(index + 1)}줄`).join(
    "\n",
  );

describe("TextareaField", () => {
  it("textarea를 렌더하고 name·placeholder·rows를 넘겨요", async () => {
    await render(
      <TextareaField
        label="소개"
        name="bio"
        placeholder="자기소개를 적어 주세요"
        rows={4}
      />,
    );

    const textarea = page.getByRole("textbox", { name: "소개" });
    await expect.element(textarea).toHaveAttribute("name", "bio");
    await expect
      .element(textarea)
      .toHaveAttribute("placeholder", "자기소개를 적어 주세요");
    await expect.element(textarea).toHaveAttribute("rows", "4");
    expect(textarea.element().tagName).toBe("TEXTAREA");
  });

  it("ref는 textarea에, className은 root에 가요", async () => {
    const ref = createRef<HTMLTextAreaElement>();
    await render(<TextareaField ref={ref} label="소개" className="custom" />);

    const textarea = page.getByRole("textbox").element();
    expect(ref.current).toBe(textarea);
    const root = document.querySelector(".custom");
    expect(root).toContainElement(textarea);
    expect(textarea.classList.contains("custom")).toBe(false);
  });

  it("라벨·설명·오류가 textarea와 이어져요", async () => {
    await render(
      <>
        <TextareaField label="소개" description="500자 이내로 적어 주세요" />
        <TextareaField
          label="메모"
          invalid
          description="다른 사람에게 보여요"
          errorMessage="메모를 입력해 주세요"
        />
      </>,
    );

    await expect
      .element(page.getByRole("textbox", { name: "소개" }))
      .toHaveAccessibleDescription("500자 이내로 적어 주세요");
    const memo = page.getByRole("textbox", { name: "메모" });
    await expect
      .element(memo)
      .toHaveAccessibleDescription("메모를 입력해 주세요");
    await expect.element(memo).toHaveAttribute("aria-invalid", "true");
  });

  it("aria-describedby를 넘기면 안내 연결에 더해요", async () => {
    await render(
      <>
        <TextareaField
          label="소개"
          description="500자 이내로 적어 주세요"
          aria-describedby="bio-hint"
        />
        <p id="bio-hint">프로필에 보여요</p>
      </>,
    );

    await expect
      .element(page.getByRole("textbox"))
      .toHaveAccessibleDescription("500자 이내로 적어 주세요 프로필에 보여요");
  });

  it("aria-labelledby를 넘기면 textarea에 그대로 붙여요", async () => {
    await render(
      <>
        <h2 id="review-title">리뷰</h2>
        <TextareaField label="내용" aria-labelledby="review-title" />
      </>,
    );

    await expect
      .element(page.getByRole("textbox"))
      .toHaveAttribute("aria-labelledby", "review-title");
  });

  it("Enter를 누르면 줄이 바뀌고 form을 제출하지 않아요", async () => {
    const onSubmit = vi.fn((event: SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();
    });
    await render(
      <form onSubmit={onSubmit}>
        <TextareaField label="소개" />
      </form>,
    );

    const textarea = page.getByRole("textbox");
    await userEvent.type(textarea, "첫 줄{Enter}둘째 줄");

    await expect.element(textarea).toHaveValue("첫 줄\n둘째 줄");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("readOnly면 값을 바꿀 수 없지만 포커스할 수 있어요", async () => {
    await render(<TextareaField label="소개" readOnly defaultValue="안녕" />);

    await userEvent.tab();
    await userEvent.keyboard("하세요");

    const textarea = page.getByRole("textbox");
    await expect.element(textarea).toHaveFocus();
    await expect.element(textarea).toHaveValue("안녕");
  });

  it("disabled면 Tab으로 포커스되지 않아요", async () => {
    await render(<TextareaField label="소개" disabled />);

    await userEvent.tab();

    const textarea = page.getByRole("textbox");
    await expect.element(textarea).toBeDisabled();
    await expect.element(textarea).not.toHaveFocus();
  });

  it("Tab으로 오면 상자에 포커스 링이 보여요", async () => {
    // 색·두께는 토큰이 정하니 보이는지만 확인해요.
    await render(<TextareaField label="소개" />);
    const box = boxOf(page.getByRole("textbox").element());
    expect(getComputedStyle(box).outlineStyle).toBe("none");

    await userEvent.tab();

    expect(getComputedStyle(box).outlineStyle).not.toBe("none");
  });

  it("invalid면 포커스 링이 오류 색이에요", async () => {
    await render(<TextareaField label="소개" invalid />);
    const box = boxOf(page.getByRole("textbox").element());

    await userEvent.tab();

    const boxStyle = getComputedStyle(box);
    expect(boxStyle.outlineStyle).not.toBe("none");
    expect(boxStyle.outlineColor).toBe(boxStyle.borderTopColor);
  });

  it("비어 있어도 상자 높이가 100px이에요", async () => {
    await render(
      <>
        <TextareaField label="자동" />
        <TextareaField label="고정" heightMode="fixed" />
      </>,
    );

    for (const name of ["자동", "고정"]) {
      const textarea = page.getByRole("textbox", { name }).element();
      expect(heightOf(boxOf(textarea))).toBe(100);
    }
  });

  it("기본(auto)이면 줄이 늘 때 높이가 늘어요", async () => {
    await render(<TextareaField label="소개" />);
    const textarea = page.getByRole("textbox");
    const box = boxOf(textarea.element());

    await userEvent.fill(textarea, lines(6));

    expect(heightOf(box)).toBe(boxHeightFor(6));
  });

  it("기본(auto)이면 rows를 넘겨도 내용에 맞춰요", async () => {
    await render(<TextareaField label="소개" rows={6} />);

    const textarea = page.getByRole("textbox").element();
    expect(heightOf(boxOf(textarea))).toBe(100);
  });

  it("maxRows를 넘으면 높이가 멈추고 안에서 스크롤돼요", async () => {
    await render(
      <TextareaField label="소개" maxRows={8} defaultValue={lines(12)} />,
    );
    const textarea = page.getByRole("textbox").element();

    // Figma 최대 높이 예시(8줄)와 같은 208px이에요.
    expect(heightOf(boxOf(textarea))).toBe(boxHeightFor(8));
    expect(textarea.scrollHeight).toBeGreaterThan(textarea.clientHeight);
  });

  it("fixed면 줄이 늘어도 높이가 그대로예요", async () => {
    await render(<TextareaField label="소개" heightMode="fixed" />);
    const textarea = page.getByRole("textbox");
    const box = boxOf(textarea.element());

    await userEvent.fill(textarea, lines(6));

    expect(heightOf(box)).toBe(100);
    expect(textarea.element().scrollHeight).toBeGreaterThan(
      textarea.element().clientHeight,
    );
  });

  it("fixed면 rows만큼 높아져요", async () => {
    await render(<TextareaField label="소개" heightMode="fixed" rows={6} />);

    const textarea = page.getByRole("textbox").element();
    expect(heightOf(boxOf(textarea))).toBe(boxHeightFor(6));
  });

  it("입력하면 글자 수가 늘어요", async () => {
    await render(<TextareaField label="소개" maxCharacterCount={10} />);
    const textarea = page.getByRole("textbox");
    await expect.element(textarea).toHaveAccessibleDescription("0/10");

    // 이모지는 type이 반쪽씩 입력해서 깨져요. 이모지 세기는 countGraphemes 테스트가 맡아요.
    await userEvent.type(textarea, "안녕");

    await expect.element(textarea).toHaveAccessibleDescription("2/10");
  });

  it("value를 넘기면 글자 수가 value를 따라요", async () => {
    const onChange = vi.fn();
    const screen = await render(
      <TextareaField
        label="소개"
        maxCharacterCount={10}
        value="안녕"
        onChange={onChange}
      />,
    );
    const textarea = page.getByRole("textbox");
    await expect.element(textarea).toHaveAccessibleDescription("2/10");

    await screen.rerender(
      <TextareaField
        label="소개"
        maxCharacterCount={10}
        value="안녕하세요"
        onChange={onChange}
      />,
    );

    await expect.element(textarea).toHaveAccessibleDescription("5/10");
  });

  it("제한을 넘겨도 입력을 자르지 않아요", async () => {
    await render(<TextareaField label="소개" maxCharacterCount={3} />);
    const textarea = page.getByRole("textbox");

    await userEvent.type(textarea, "가나다라");

    await expect.element(textarea).toHaveValue("가나다라");
    await expect.element(textarea).toHaveAccessibleDescription("4/3");
  });

  it("받은 onChange를 그대로 불러요", async () => {
    const onChange = vi.fn();
    await render(<TextareaField label="소개" onChange={onChange} />);

    await userEvent.type(page.getByRole("textbox"), "안녕");

    expect(onChange).toHaveBeenCalled();
    await expect.element(page.getByRole("textbox")).toHaveValue("안녕");
  });
});
