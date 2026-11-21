import { describe, expect, it, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";

import { ActionableCallout } from "./ActionableCallout";

describe("ActionableCallout", () => {
  it('기본은 type="button"인 버튼이고 이름은 제목과 설명이에요', async () => {
    await render(
      <ActionableCallout title="안내">설정을 확인해 주세요.</ActionableCallout>,
    );

    const button = page.getByRole("button", {
      name: "안내 설정을 확인해 주세요.",
    });
    await expect.element(button).toHaveAttribute("type", "button");
  });

  it("누르거나 Enter·Space면 onClick이 불려요", async () => {
    const onClick = vi.fn();
    await render(
      <ActionableCallout onClick={onClick}>
        설정을 확인해 주세요.
      </ActionableCallout>,
    );

    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");
    await page.getByRole("button").click();

    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it("asChild면 자식 a에 그리고 href가 남아요", async () => {
    await render(
      <ActionableCallout asChild title="안내">
        <a href="#settings">설정을 확인해 주세요.</a>
      </ActionableCallout>,
    );

    const link = page.getByRole("link", { name: "안내 설정을 확인해 주세요." });
    await expect.element(link).toHaveAttribute("href", "#settings");
    expect(link.element().hasAttribute("type")).toBe(false);
  });

  it("화살표는 스크린리더가 읽지 않고, hideArrow면 그리지 않아요", async () => {
    const { container, rerender } = await render(
      <ActionableCallout hidePrefixIcon>설명</ActionableCallout>,
    );

    expect(container.querySelector("[aria-hidden] svg")).not.toBeNull();

    await rerender(
      <ActionableCallout hidePrefixIcon hideArrow>
        설명
      </ActionableCallout>,
    );

    expect(container.querySelector("svg")).toBeNull();
  });

  it("Tab으로 오면 포커스 링이 보여요", async () => {
    // 색·두께는 토큰이 정하니 보이는지만 확인해요.
    await render(<ActionableCallout>설명</ActionableCallout>);
    const button = page.getByRole("button").element();
    expect(getComputedStyle(button).outlineStyle).toBe("none");

    await userEvent.tab();

    expect(getComputedStyle(button).outlineStyle).not.toBe("none");
  });
});
