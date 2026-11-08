import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";

import { Button } from "./Button";

describe("Button", () => {
  it("글자를 이름으로 읽어요", async () => {
    await render(<Button>저장</Button>);

    await expect
      .element(page.getByRole("button", { name: "저장" }))
      .toBeInTheDocument();
  });

  it("앞뒤 아이콘은 이름에 섞이지 않아요", async () => {
    // 이름이 붙은 아이콘을 넣어도 버튼 이름은 문구만 남아야 해요.
    await render(
      <Button
        prefixIcon={<svg role="img" aria-label="더하기" />}
        suffixIcon={<svg role="img" aria-label="화살표" />}
      >
        저장
      </Button>,
    );

    await expect
      .element(page.getByRole("button", { name: "저장", exact: true }))
      .toBeInTheDocument();
  });

  it("폼 안에서 기본으로 제출하지 않아요", async () => {
    await render(<Button>저장</Button>);

    await expect
      .element(page.getByRole("button"))
      .toHaveAttribute("type", "button");
  });

  it("disabled면 클릭이 막혀요", async () => {
    const onClick = vi.fn();
    await render(
      <Button disabled onClick={onClick}>
        저장
      </Button>,
    );

    const button = page.getByRole("button", { name: "저장" });
    await expect.element(button).toBeDisabled();
    // 비활성 요소는 Playwright가 누를 수 있을 때까지 기다리기만 해서 force로 눌러요.
    await button.click({ force: true });
    expect(onClick).not.toHaveBeenCalled();
  });

  it("loading이면 aria-busy를 알리고 클릭을 무시해요", async () => {
    const onClick = vi.fn();
    await render(
      <Button loading onClick={onClick}>
        저장
      </Button>,
    );

    const button = page.getByRole("button", { name: "저장" });
    await expect.element(button).toHaveAttribute("aria-busy", "true");
    await expect.element(button).toHaveAttribute("aria-disabled", "true");
    await button.click({ force: true });
    expect(onClick).not.toHaveBeenCalled();
  });

  it("loading이 돼도 포커스가 남아요", async () => {
    const { rerender } = await render(<Button>저장</Button>);
    await userEvent.tab();
    const button = page.getByRole("button", { name: "저장" });
    await expect.element(button).toHaveFocus();

    await rerender(<Button loading>저장</Button>);

    await expect.element(button).toHaveFocus();
  });

  it("loading이면 키보드로 눌러도 실행하지 않아요", async () => {
    // 포커스를 남기니 실제로 다시 누르는 길은 키보드예요.
    const onClick = vi.fn();
    await render(
      <Button loading onClick={onClick}>
        저장
      </Button>,
    );
    await userEvent.tab();
    await expect.element(page.getByRole("button")).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");

    expect(onClick).not.toHaveBeenCalled();
  });

  it("disabled와 loading을 같이 주면 loading처럼 포커스가 남아요", async () => {
    await render(
      <Button disabled loading>
        저장
      </Button>,
    );
    await userEvent.tab();

    const button = page.getByRole("button", { name: "저장" });
    await expect.element(button).toHaveFocus();
    await expect.element(button).toHaveAttribute("aria-disabled", "true");
  });

  it("Tab으로 오면 포커스 링이 보여요", async () => {
    // 색·두께는 토큰이 정하니 보이는지만 확인해요.
    await render(<Button>저장</Button>);
    const button = page.getByRole("button", { name: "저장" }).element();
    expect(getComputedStyle(button).outlineStyle).toBe("none");

    await userEvent.tab();

    expect(getComputedStyle(button).outlineStyle).not.toBe("none");
  });

  it("className을 넘겨도 원래 스타일이 남아요", async () => {
    await render(<Button className="custom">저장</Button>);

    const button = page.getByRole("button", { name: "저장" });
    await expect.element(button).toHaveClass("custom");
    // 우리 클래스 이름은 해시라서 개수로만 확인해요.
    expect(button.element().classList.length).toBeGreaterThan(1);
  });

  it("asChild면 자식 요소로 렌더해요", async () => {
    await render(
      <Button asChild>
        <a href="#next">다음</a>
      </Button>,
    );

    const link = page.getByRole("link", { name: "다음" });
    await expect.element(link).toHaveAttribute("href", "#next");
    await expect.element(link).not.toHaveAttribute("type");
  });

  it("asChild에 disabled를 주면 aria-disabled로 알리고 클릭을 막아요", async () => {
    const onClick = vi.fn();
    await render(
      <Button asChild disabled onClick={onClick}>
        <a href="#next">다음</a>
      </Button>,
    );

    const link = page.getByRole("link", { name: "다음" });
    await expect.element(link).toHaveAttribute("aria-disabled", "true");
    await link.click({ force: true });
    expect(onClick).not.toHaveBeenCalled();
    expect(window.location.hash).not.toBe("#next");
  });

  it("ref를 전달해요", async () => {
    const ref = createRef<HTMLButtonElement>();
    await render(<Button ref={ref}>저장</Button>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
