import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-react";

import { IconButton } from "./IconButton";

// 키보드·disabled+loading 같은 상태 규칙의 세부는 Button 테스트가 맡아요. 여기서는 연결됐는지만 봐요.
describe("IconButton", () => {
  it("aria-label을 이름으로 읽고 아이콘 이름은 섞이지 않아요", async () => {
    // 이름이 붙은 아이콘을 넣어도 버튼 이름은 aria-label만 남아야 해요.
    await render(
      <IconButton aria-label="검색">
        <svg role="img" aria-label="돋보기" />
      </IconButton>,
    );

    await expect
      .element(page.getByRole("button", { name: "검색", exact: true }))
      .toBeInTheDocument();
  });

  it("aria-label이 없으면 타입 에러예요", async () => {
    await render(
      // @ts-expect-error 이름이 없으면 스크린리더가 무엇을 하는 버튼인지 읽지 못해요.
      <IconButton>
        <svg />
      </IconButton>,
    );

    // 타입 검사를 건너뛰면 이름 없는 버튼이 그려져요.
    await expect.element(page.getByRole("button")).not.toHaveAccessibleName();
  });

  it("폼 안에서 기본으로 제출하지 않아요", async () => {
    await render(
      <IconButton aria-label="검색">
        <svg />
      </IconButton>,
    );

    await expect
      .element(page.getByRole("button"))
      .toHaveAttribute("type", "button");
  });

  it("disabled면 클릭이 막혀요", async () => {
    const onClick = vi.fn();
    await render(
      <IconButton aria-label="검색" disabled onClick={onClick}>
        <svg />
      </IconButton>,
    );

    const button = page.getByRole("button", { name: "검색" });
    await expect.element(button).toBeDisabled();
    // 비활성 요소는 Playwright가 누를 수 있을 때까지 기다리기만 해서 force로 눌러요.
    await button.click({ force: true });
    expect(onClick).not.toHaveBeenCalled();
  });

  it("loading이면 aria-busy를 알리고 클릭을 무시해요", async () => {
    const onClick = vi.fn();
    await render(
      <IconButton aria-label="검색" loading onClick={onClick}>
        <svg />
      </IconButton>,
    );

    const button = page.getByRole("button", { name: "검색" });
    await expect.element(button).toHaveAttribute("aria-busy", "true");
    await expect.element(button).toHaveAttribute("aria-disabled", "true");
    await button.click({ force: true });
    expect(onClick).not.toHaveBeenCalled();
  });

  it("asChild면 자식 요소 안의 아이콘을 감싸요", async () => {
    await render(
      <IconButton asChild aria-label="홈으로">
        <a href="#home">
          <svg />
        </a>
      </IconButton>,
    );

    const link = page.getByRole("link", { name: "홈으로" });
    await expect.element(link).toHaveAttribute("href", "#home");
    await expect.element(link).not.toHaveAttribute("type");
    expect(
      link.element().querySelector('[aria-hidden="true"] > svg'),
    ).not.toBeNull();
  });

  it("ref를 전달해요", async () => {
    const ref = createRef<HTMLButtonElement>();
    await render(
      <IconButton ref={ref} aria-label="검색">
        <svg />
      </IconButton>,
    );

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
