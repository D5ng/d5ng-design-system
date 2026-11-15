import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";

import { Callout } from "./Callout";

describe("Callout", () => {
  it("제목과 설명 사이에 공백 글자가 있어요", async () => {
    // CSS 여백만 두면 복사하거나 스크린리더가 읽을 때 "안내변경한"처럼 붙어요.
    const { container } = await render(
      <Callout title="안내">변경한 설정은 다음 접속부터 적용돼요.</Callout>,
    );

    expect(container.textContent).toMatch(/^안내\s+변경한/);
  });

  it("제목 없이 설명만 그릴 수 있어요", async () => {
    const { container } = await render(
      <Callout>변경한 설정은 다음 접속부터 적용돼요.</Callout>,
    );

    expect(container.textContent).toBe("변경한 설정은 다음 접속부터 적용돼요.");
  });

  it("role을 붙이지 않고 탭 순서에 들어가지 않아요", async () => {
    const { container } = await render(<Callout title="안내">설명</Callout>);

    expect(container.firstElementChild?.hasAttribute("role")).toBe(false);

    await userEvent.tab();

    expect(document.activeElement).toBe(document.body);
  });

  it("앞 아이콘은 스크린리더가 읽지 않아요", async () => {
    // 이름이 붙은 아이콘을 넣어도 접근성 트리에 남지 않아야 해요.
    await render(
      <Callout prefixIcon={<svg role="img" aria-label="정보" />}>설명</Callout>,
    );

    await expect.element(page.getByRole("img")).not.toBeInTheDocument();
  });

  it("prefixIcon을 넘기면 톤 기본 아이콘 대신 그려요", async () => {
    const { container } = await render(
      <Callout prefixIcon={<svg data-testid="custom-icon" />}>설명</Callout>,
    );

    expect(container.querySelectorAll("svg")).toHaveLength(1);
    await expect.element(page.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("hidePrefixIcon이면 아이콘 자리를 그리지 않아요", async () => {
    const { container } = await render(<Callout hidePrefixIcon>설명</Callout>);

    expect(container.querySelector("[aria-hidden]")).toBeNull();
  });

  it("넘긴 role·className·ref는 루트에 붙어요", async () => {
    const ref = createRef<HTMLDivElement>();
    await render(
      <Callout ref={ref} role="status" className="custom">
        저장했어요.
      </Callout>,
    );

    const root = page.getByRole("status").element();
    expect(ref.current).toBe(root);
    expect(root.classList.contains("custom")).toBe(true);
  });
});
