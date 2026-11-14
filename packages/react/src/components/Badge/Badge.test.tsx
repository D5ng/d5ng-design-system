import { createRef } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";

import { Badge } from "./Badge";

const heightOf = (element: Element) => element.getBoundingClientRect().height;

describe("Badge", () => {
  afterEach(() => {
    document.documentElement.style.fontSize = "";
  });

  it("문구를 그대로 읽고 역할을 붙이지 않아요", async () => {
    await render(<Badge data-testid="badge">완료</Badge>);

    const badge = page.getByTestId("badge").element();
    expect(badge.tagName).toBe("SPAN");
    expect(badge.getAttribute("role")).toBeNull();
    expect(badge.textContent).toBe("완료");
  });

  it("prefixIcon은 스크린리더가 읽지 않아요", async () => {
    // 이름이 붙은 아이콘을 넣어도 접근성 트리에 나오지 않아야 해요.
    await render(
      <Badge prefixIcon={<svg role="img" aria-label="완료 아이콘" />}>
        완료
      </Badge>,
    );

    await expect.element(page.getByText("완료")).toBeInTheDocument();
    await expect
      .element(page.getByRole("img", { name: "완료 아이콘" }))
      .not.toBeInTheDocument();
  });

  it("Tab으로 포커스되지 않아요", async () => {
    await render(
      <>
        <button type="button">앞</button>
        <Badge>완료</Badge>
        <button type="button">뒤</button>
      </>,
    );

    await userEvent.tab();
    await userEvent.tab();

    await expect
      .element(page.getByRole("button", { name: "뒤" }))
      .toHaveFocus();
  });

  it("size마다 Figma 높이(20·24px)예요", async () => {
    await render(
      <>
        <Badge data-testid="medium">상태</Badge>
        <Badge data-testid="large" size="large">
          상태
        </Badge>
      </>,
    );

    expect(heightOf(page.getByTestId("medium").element())).toBe(20);
    expect(heightOf(page.getByTestId("large").element())).toBe(24);
  });

  it("outline 테두리가 크기를 밀지 않아요", async () => {
    // solid와 outline은 굵기가 같아서 크기도 같아야 해요. weak는 굵기가 달라 너비가 달라요.
    await render(
      <>
        <Badge data-testid="solid" variant="solid">
          확인 필요
        </Badge>
        <Badge data-testid="outline" variant="outline">
          확인 필요
        </Badge>
      </>,
    );

    const solid = page.getByTestId("solid").element().getBoundingClientRect();
    const outline = page
      .getByTestId("outline")
      .element()
      .getBoundingClientRect();
    expect(outline.width).toBe(solid.width);
    expect(outline.height).toBe(solid.height);
  });

  it("글자가 커지면 높이가 함께 늘어나요", async () => {
    // 브라우저 글자 크기를 200%로 키운 상황이에요. 글자 토큰이 rem이라 따라 커져요.
    document.documentElement.style.fontSize = "32px";
    await render(<Badge data-testid="badge">완료</Badge>);

    expect(heightOf(page.getByTestId("badge").element())).toBeGreaterThan(20);
  });

  it("부모가 좁으면 한 줄로 말줄임되고 문구는 그대로 남아요", async () => {
    await render(
      <div style={{ width: 80 }}>
        <Badge data-testid="badge">추가 확인이 필요한 상태입니다</Badge>
      </div>,
    );

    const badge = page.getByTestId("badge").element();
    const label = page.getByText("추가 확인이 필요한 상태입니다").element();
    expect(badge.getBoundingClientRect().width).toBeLessThanOrEqual(80);
    expect(heightOf(badge)).toBe(20);
    expect(label.scrollWidth).toBeGreaterThan(label.clientWidth);
    expect(badge.textContent).toBe("추가 확인이 필요한 상태입니다");
  });

  it("className을 넘겨도 원래 스타일이 남아요", async () => {
    await render(
      <Badge data-testid="badge" className="custom">
        완료
      </Badge>,
    );

    const badge = page.getByTestId("badge");
    await expect.element(badge).toHaveClass("custom");
    // 우리 클래스 이름은 해시라서 개수로만 확인해요.
    expect(badge.element().classList.length).toBeGreaterThan(1);
  });

  it("ref와 HTML 속성을 span에 넘겨요", async () => {
    const ref = createRef<HTMLSpanElement>();
    await render(
      <Badge ref={ref} id="status" title="검토 완료">
        완료
      </Badge>,
    );

    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(ref.current?.id).toBe("status");
    expect(ref.current?.title).toBe("검토 완료");
  });
});
