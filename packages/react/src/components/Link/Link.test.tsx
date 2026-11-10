import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";

import { Link } from "./Link";

describe("Link", () => {
  it("글자를 이름으로 읽어요", async () => {
    await render(<Link href="#docs">공식 문서</Link>);

    await expect
      .element(page.getByRole("link", { name: "공식 문서" }))
      .toBeInTheDocument();
  });

  it("suffixIcon은 이름에 섞이지 않아요", async () => {
    // 이름이 붙은 아이콘을 넣어도 링크 이름은 문구만 남아야 해요.
    await render(
      <Link href="#docs" suffixIcon={<svg role="img" aria-label="외부 링크" />}>
        공식 문서
      </Link>,
    );

    await expect
      .element(page.getByRole("link", { name: "공식 문서", exact: true }))
      .toBeInTheDocument();
  });

  it("href가 있는 a 요소로 렌더해요", async () => {
    await render(<Link href="#docs">공식 문서</Link>);

    const link = page.getByRole("link", { name: "공식 문서" });
    expect(link.element().tagName).toBe("A");
    await expect.element(link).toHaveAttribute("href", "#docs");
  });

  it("target과 rel을 그대로 넘겨요", async () => {
    await render(
      <Link href="https://example.com" target="_blank" rel="noreferrer">
        공식 문서
      </Link>,
    );

    const link = page.getByRole("link", { name: "공식 문서" });
    await expect.element(link).toHaveAttribute("target", "_blank");
    await expect.element(link).toHaveAttribute("rel", "noreferrer");
  });

  it("Tab으로 오면 포커스 링이 보여요", async () => {
    // 색·두께는 토큰이 정하니 보이는지만 확인해요.
    await render(<Link href="#docs">공식 문서</Link>);
    const link = page.getByRole("link", { name: "공식 문서" }).element();
    expect(getComputedStyle(link).outlineStyle).toBe("none");

    await userEvent.tab();

    expect(getComputedStyle(link).outlineStyle).not.toBe("none");
  });

  it("className을 넘겨도 원래 스타일이 남아요", async () => {
    await render(
      <Link href="#docs" className="custom">
        공식 문서
      </Link>,
    );

    const link = page.getByRole("link", { name: "공식 문서" });
    await expect.element(link).toHaveClass("custom");
    // 우리 클래스 이름은 해시라서 개수로만 확인해요.
    expect(link.element().classList.length).toBeGreaterThan(1);
  });

  it("asChild면 자식 요소로 렌더해요", async () => {
    // 라우터 링크처럼 a를 직접 렌더하는 요소를 흉내 내요.
    await render(
      <Link asChild suffixIcon={<svg />}>
        <a href="#list" data-router="">
          글 목록
        </a>
      </Link>,
    );

    const link = page.getByRole("link", { name: "글 목록" });
    await expect.element(link).toHaveAttribute("data-router");
    expect(link.element().querySelector("svg")).not.toBeNull();
  });

  it("ref를 전달해요", async () => {
    const ref = createRef<HTMLAnchorElement>();
    await render(
      <Link ref={ref} href="#docs">
        공식 문서
      </Link>,
    );

    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });
});
