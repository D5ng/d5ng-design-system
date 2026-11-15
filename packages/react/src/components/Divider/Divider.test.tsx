import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";

import { Divider } from "./Divider";

describe("Divider", () => {
  it("기본은 separator로 읽히고 aria-orientation을 붙이지 않아요", async () => {
    // separator의 기본 방향이 가로라서 속성을 붙이지 않아도 가로로 읽혀요.
    await render(<Divider />);

    const divider = page.getByRole("separator");
    await expect.element(divider).toBeInTheDocument();
    await expect.element(divider).not.toHaveAttribute("aria-orientation");
  });

  it('orientation="vertical"이면 aria-orientation="vertical"을 붙여요', async () => {
    await render(<Divider orientation="vertical" />);

    await expect
      .element(page.getByRole("separator"))
      .toHaveAttribute("aria-orientation", "vertical");
  });

  it("decorative면 보조기술이 읽지 않아요", async () => {
    await render(
      <Divider decorative orientation="vertical" data-testid="line" />,
    );

    expect(page.getByRole("separator").elements()).toHaveLength(0);
    const line = page.getByTestId("line");
    await expect.element(line).toHaveAttribute("role", "none");
    await expect.element(line).not.toHaveAttribute("aria-orientation");
  });

  it("Tab으로 포커스가 가지 않아요", async () => {
    await render(
      <>
        <button type="button">앞</button>
        <Divider />
        <button type="button">뒤</button>
      </>,
    );

    await userEvent.tab();
    await userEvent.tab();

    await expect
      .element(page.getByRole("button", { name: "뒤" }))
      .toHaveFocus();
  });

  it("가로는 부모 너비를 채우고 두께는 1px이에요", async () => {
    // flex 부모가 가운데 정렬해도 줄어들지 않아야 해요.
    await render(
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: 200,
        }}
      >
        <Divider />
      </div>,
    );

    const rect = page.getByRole("separator").element().getBoundingClientRect();
    expect(rect.width).toBe(200);
    expect(rect.height).toBe(1);
  });

  it("세로는 flex 부모의 높이를 따르고 두께는 1px이에요", async () => {
    await render(
      <div style={{ display: "flex", height: 32 }}>
        <span>왼쪽</span>
        <Divider orientation="vertical" />
        <span>오른쪽</span>
      </div>,
    );

    const rect = page.getByRole("separator").element().getBoundingClientRect();
    expect(rect.width).toBe(1);
    expect(rect.height).toBe(32);
  });

  it("inset은 선 양 끝을 안쪽으로 옮겨요(가로는 좌우, 세로는 위아래)", async () => {
    await render(
      <>
        <div data-testid="row" style={{ width: 200 }}>
          <Divider inset="16" />
        </div>
        <div style={{ display: "flex", height: 96 }}>
          <Divider orientation="vertical" inset="24" />
        </div>
      </>,
    );

    const [horizontal, vertical] = page
      .getByRole("separator")
      .elements()
      .map((element) => element.getBoundingClientRect());
    const row = page.getByTestId("row").element().getBoundingClientRect();
    expect(horizontal?.width).toBe(168);
    expect((horizontal?.left ?? 0) - row.left).toBe(16);
    expect(vertical?.height).toBe(48);
  });

  it("앞뒤에 여백을 두지 않아요", async () => {
    // 간격은 부모의 gap이 맡아요. inset은 선 방향의 양 끝에만 붙어요.
    await render(
      <>
        <Divider inset="16" />
        <Divider orientation="vertical" inset="16" />
      </>,
    );

    const [horizontal, vertical] = page
      .getByRole("separator")
      .elements()
      .map((element) => getComputedStyle(element));
    expect(horizontal?.marginTop).toBe("0px");
    expect(horizontal?.marginBottom).toBe("0px");
    expect(vertical?.marginLeft).toBe("0px");
    expect(vertical?.marginRight).toBe("0px");
  });

  it("className을 넘겨도 원래 스타일이 남아요", async () => {
    await render(<Divider className="custom" />);

    const divider = page.getByRole("separator");
    await expect.element(divider).toHaveClass("custom");
    // 우리 클래스 이름은 해시라서 개수로만 확인해요.
    expect(divider.element().classList.length).toBeGreaterThan(1);
  });

  it("ref를 전달해요", async () => {
    const ref = createRef<HTMLDivElement>();
    await render(<Divider ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
