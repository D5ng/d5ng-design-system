import { createRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";

import { ChipButton, ChipToggle } from "./Chip";

// 이름이 붙은 아이콘을 넣어도 칩 이름은 글자만 남아야 해요.
const namedIcon = <svg role="img" aria-label="별" />;

describe("ChipButton", () => {
  it("글자를 이름으로 읽어요", async () => {
    await render(<ChipButton>추천순</ChipButton>);

    await expect
      .element(page.getByRole("button", { name: "추천순" }))
      .toBeInTheDocument();
  });

  it("앞 아이콘은 이름에 섞이지 않아요", async () => {
    await render(<ChipButton prefixIcon={namedIcon}>추천순</ChipButton>);

    await expect
      .element(page.getByRole("button", { name: "추천순", exact: true }))
      .toBeInTheDocument();
  });

  it("폼 안에서 기본으로 제출하지 않아요", async () => {
    await render(<ChipButton>추천순</ChipButton>);

    await expect
      .element(page.getByRole("button"))
      .toHaveAttribute("type", "button");
  });

  it("눌러도 선택 상태를 남기지 않아요", async () => {
    await render(<ChipButton>추천순</ChipButton>);
    const button = page.getByRole("button");

    await button.click();

    await expect.element(button).not.toHaveAttribute("aria-pressed");
    expect(button.element().querySelector("svg")).toBeNull();
  });

  it("disabled면 클릭이 막히고 포커스를 받지 않아요", async () => {
    const onClick = vi.fn();
    await render(
      <ChipButton disabled onClick={onClick}>
        추천순
      </ChipButton>,
    );
    const button = page.getByRole("button", { name: "추천순" });

    await expect.element(button).toBeDisabled();
    // 비활성 요소는 Playwright가 누를 수 있을 때까지 기다리기만 해서 force로 눌러요.
    await button.click({ force: true });
    expect(onClick).not.toHaveBeenCalled();

    await userEvent.tab();
    await expect.element(button).not.toHaveFocus();
  });

  it("small이어도 누르는 영역은 44×44px 이상이에요", async () => {
    // 글자가 짧아 겉면이 좁아도 버튼은 줄지 않아요.
    await render(<ChipButton size="small">A</ChipButton>);
    const { width, height } = page
      .getByRole("button")
      .element()
      .getBoundingClientRect();

    expect(width).toBeGreaterThanOrEqual(44);
    expect(height).toBeGreaterThanOrEqual(44);
  });

  it("className을 넘겨도 원래 스타일이 남고 ref를 전달해요", async () => {
    const ref = createRef<HTMLButtonElement>();
    await render(
      <ChipButton ref={ref} className="custom">
        추천순
      </ChipButton>,
    );
    const button = page.getByRole("button", { name: "추천순" });

    await expect.element(button).toHaveClass("custom");
    // 우리 클래스 이름은 해시라서 개수로만 확인해요.
    expect(button.element().classList.length).toBeGreaterThan(1);
    expect(ref.current).toBe(button.element());
  });
});

describe("ChipToggle", () => {
  it("누르면 aria-pressed가 바뀌고 이름은 그대로예요", async () => {
    await render(<ChipToggle>무료 배송</ChipToggle>);
    const toggle = page.getByRole("button", { name: "무료 배송" });
    await expect.element(toggle).toHaveAttribute("aria-pressed", "false");

    await toggle.click();
    await expect.element(toggle).toHaveAttribute("aria-pressed", "true");

    await toggle.click();
    await expect.element(toggle).toHaveAttribute("aria-pressed", "false");
  });

  it("Enter·Space로 바꿔요", async () => {
    await render(<ChipToggle>무료 배송</ChipToggle>);
    const toggle = page.getByRole("button");
    await userEvent.tab();

    await userEvent.keyboard("{Enter}");
    await expect.element(toggle).toHaveAttribute("aria-pressed", "true");

    await userEvent.keyboard(" ");
    await expect.element(toggle).toHaveAttribute("aria-pressed", "false");
  });

  it("pressed를 넘기면 onPressedChange만 부르고 상태는 쓰는 쪽이 바꿔요", async () => {
    const onPressedChange = vi.fn();
    await render(
      <ChipToggle pressed={false} onPressedChange={onPressedChange}>
        무료 배송
      </ChipToggle>,
    );
    const toggle = page.getByRole("button");

    await toggle.click();

    expect(onPressedChange).toHaveBeenCalledWith(true);
    await expect.element(toggle).toHaveAttribute("aria-pressed", "false");
  });

  it("쓰는 쪽이 pressed를 바꾸면 선택이 따라와요", async () => {
    function Controlled() {
      const [pressed, setPressed] = useState(false);
      return (
        <ChipToggle pressed={pressed} onPressedChange={setPressed}>
          무료 배송
        </ChipToggle>
      );
    }
    await render(<Controlled />);
    const toggle = page.getByRole("button");

    await toggle.click();

    await expect.element(toggle).toHaveAttribute("aria-pressed", "true");
  });

  it("선택 전후 너비가 같아요", async () => {
    // 체크 자리를 늘 남기고 2px 테두리는 그림자로 더해서 옆 칩이 밀리지 않아요.
    await render(
      <ChipToggle variant="outlineStrong" prefixIcon={namedIcon}>
        무료 배송
      </ChipToggle>,
    );
    const toggle = page.getByRole("button");
    const before = toggle.element().getBoundingClientRect().width;

    await toggle.click();
    await expect.element(toggle).toHaveAttribute("aria-pressed", "true");

    expect(toggle.element().getBoundingClientRect().width).toBe(before);
  });

  it("체크와 앞 아이콘은 스크린리더가 읽지 않아요", async () => {
    await render(
      <ChipToggle defaultPressed prefixIcon={namedIcon}>
        무료 배송
      </ChipToggle>,
    );
    const toggle = page.getByRole("button", { name: "무료 배송", exact: true });

    await expect.element(toggle).toBeInTheDocument();
    for (const icon of toggle.element().querySelectorAll("svg")) {
      expect(icon.closest('[aria-hidden="true"]')).not.toBeNull();
    }
  });

  it("disabled면 바뀌지 않고 선택 표시는 남아요", async () => {
    await render(
      <ChipToggle defaultPressed disabled>
        무료 배송
      </ChipToggle>,
    );
    const toggle = page.getByRole("button");

    await toggle.click({ force: true });
    await expect.element(toggle).toHaveAttribute("aria-pressed", "true");

    // 체크 자리는 선택 전에도 있어서 보이는지는 계산된 스타일로 봐요.
    const checkSlot = toggle.element().querySelector("svg")?.parentElement;
    if (!checkSlot) {
      throw new Error("체크를 찾지 못했어요.");
    }
    expect(getComputedStyle(checkSlot).visibility).toBe("visible");

    await userEvent.tab();
    await expect.element(toggle).not.toHaveFocus();
  });

  it("className을 넘겨도 원래 스타일이 남고 ref를 전달해요", async () => {
    const ref = createRef<HTMLButtonElement>();
    await render(
      <ChipToggle ref={ref} className="custom">
        무료 배송
      </ChipToggle>,
    );
    const toggle = page.getByRole("button");

    await expect.element(toggle).toHaveClass("custom");
    expect(toggle.element().classList.length).toBeGreaterThan(1);
    expect(ref.current).toBe(toggle.element());
  });
});
