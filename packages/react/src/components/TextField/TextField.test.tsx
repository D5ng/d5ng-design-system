import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";

import { TextField } from "./TextField";

// 링과 테두리는 입력이 아니라 입력을 감싼 상자가 그려요.
const boxOf = (input: Element) => {
  if (!input.parentElement) {
    throw new Error("입력을 감싼 상자가 없어요.");
  }
  return input.parentElement;
};

describe("TextField", () => {
  it("라벨이 입력의 이름이 돼요", async () => {
    await render(<TextField label="이름" />);

    await expect
      .element(page.getByRole("textbox", { name: "이름" }))
      .toBeInTheDocument();
  });

  it("description과 errorMessage를 입력의 설명으로 연결해요", async () => {
    await render(
      <>
        <TextField label="이름" description="실명으로 적어 주세요" />
        <TextField
          label="별명"
          invalid
          description="다른 사람에게 보여요"
          errorMessage="별명을 입력해 주세요"
        />
      </>,
    );

    await expect
      .element(page.getByRole("textbox", { name: "이름" }))
      .toHaveAccessibleDescription("실명으로 적어 주세요");
    await expect
      .element(page.getByRole("textbox", { name: "별명" }))
      .toHaveAccessibleDescription("별명을 입력해 주세요");
  });

  it("aria-describedby를 넘기면 안내 연결에 더해요", async () => {
    await render(
      <>
        <TextField
          label="이름"
          description="실명으로 적어 주세요"
          aria-describedby="name-hint"
        />
        <p id="name-hint">가입 뒤에는 바꿀 수 없어요</p>
      </>,
    );

    await expect
      .element(page.getByRole("textbox"))
      .toHaveAccessibleDescription(
        "실명으로 적어 주세요 가입 뒤에는 바꿀 수 없어요",
      );
  });

  it("invalid면 입력에 aria-invalid를 붙여요", async () => {
    await render(<TextField label="이름" invalid />);

    await expect
      .element(page.getByRole("textbox"))
      .toHaveAttribute("aria-invalid", "true");
  });

  it("required·disabled를 입력에 넘겨요", async () => {
    await render(<TextField label="이름" required disabled />);

    const input = page.getByRole("textbox");
    await expect.element(input).toBeRequired();
    await expect.element(input).toBeDisabled();
  });

  it("readOnly면 값을 고칠 수 없고 포커스는 받아요", async () => {
    await render(<TextField label="이름" readOnly defaultValue="홍길동" />);

    await userEvent.tab();
    await userEvent.keyboard("수정");

    const input = page.getByRole("textbox");
    await expect.element(input).toHaveFocus();
    await expect.element(input).toHaveValue("홍길동");
  });

  it("name·placeholder·defaultValue·onChange는 입력에 그대로 넘겨요", async () => {
    const onChange = vi.fn();
    await render(
      <TextField
        label="이름"
        name="name"
        placeholder="홍길동"
        defaultValue="김"
        onChange={onChange}
      />,
    );

    const input = page.getByRole("textbox");
    await expect.element(input).toHaveAttribute("name", "name");
    await expect.element(input).toHaveAttribute("placeholder", "홍길동");
    await expect.element(input).toHaveValue("김");

    await userEvent.type(input, "철수");

    expect(onChange).toHaveBeenCalled();
    await expect.element(input).toHaveValue("김철수");
  });

  it("ref를 입력에 전달해요", async () => {
    const ref = createRef<HTMLInputElement>();
    await render(<TextField ref={ref} label="이름" />);

    expect(ref.current).toBe(page.getByRole("textbox").element());
  });

  it("className을 넘겨도 root의 원래 스타일이 남아요", async () => {
    await render(<TextField label="이름" className="custom" />);

    const root = document.querySelector(".custom");
    expect(root).toContainElement(page.getByRole("textbox").element());
    // 우리 클래스 이름은 해시라서 개수로만 확인해요.
    expect(root?.classList.length).toBeGreaterThan(1);
  });

  it("prefixIcon은 스크린리더가 읽지 않아요", async () => {
    // 이름이 붙은 아이콘을 넣어도 입력의 이름과 설명에 섞이지 않아야 해요.
    await render(
      <TextField
        label="검색어"
        prefixIcon={<svg role="img" aria-label="돋보기" />}
      />,
    );

    const input = page.getByRole("textbox", { name: "검색어", exact: true });
    await expect.element(input).toBeInTheDocument();
    await expect.element(input).not.toHaveAttribute("aria-describedby");
    await expect
      .element(page.getByRole("img", { name: "돋보기" }))
      .not.toBeInTheDocument();
  });

  it("prefixText·suffixText를 입력의 설명에 더해요", async () => {
    await render(
      <TextField
        label="가격"
        prefixText="약"
        suffixText="원"
        description="부가세 포함이에요"
      />,
    );

    const input = page.getByRole("textbox", { name: "가격", exact: true });
    await expect
      .element(input)
      .toHaveAccessibleDescription("약 원 부가세 포함이에요");
    await expect.element(input).toHaveValue("");
  });

  it("상자의 빈 곳이나 아이콘을 누르면 입력에 포커스가 가요", async () => {
    await render(
      <TextField
        label="가격"
        prefixIcon={<svg data-testid="icon" />}
        suffixText="원"
      />,
    );
    const input = page.getByRole("textbox");

    await page.getByTestId("icon").click();
    await expect.element(input).toHaveFocus();

    input.element().blur();
    await page.getByText("원").click();
    await expect.element(input).toHaveFocus();

    input.element().blur();
    // 상자의 왼쪽 위 여백이에요.
    await page
      .elementLocator(boxOf(input.element()))
      .click({ position: { x: 4, y: 4 } });
    await expect.element(input).toHaveFocus();
  });

  it("disabled면 상자를 눌러도 포커스가 가지 않아요", async () => {
    await render(
      <TextField
        label="가격"
        disabled
        prefixIcon={<svg data-testid="icon" />}
      />,
    );

    await page.getByTestId("icon").click();

    await expect.element(page.getByRole("textbox")).not.toHaveFocus();
  });

  it("Tab으로 오면 상자에 포커스 링이 보여요", async () => {
    // 색·두께는 토큰이 정하니 보이는지만 확인해요.
    await render(<TextField label="이름" />);
    const box = boxOf(page.getByRole("textbox").element());
    expect(getComputedStyle(box).outlineStyle).toBe("none");

    await userEvent.tab();

    expect(getComputedStyle(box).outlineStyle).not.toBe("none");
  });

  it("invalid면 포커스 링이 오류 색이에요", async () => {
    // invalid 테두리도 오류 색이라, 링이 기본 색으로 남으면 둘이 달라져요.
    await render(<TextField label="이름" invalid />);
    const box = boxOf(page.getByRole("textbox").element());

    await userEvent.tab();

    const boxStyle = getComputedStyle(box);
    expect(boxStyle.outlineStyle).not.toBe("none");
    expect(boxStyle.outlineColor).toBe(boxStyle.borderTopColor);
  });
});
