import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";

import { Switch, SwitchRow } from "./Switch";

const getForm = () => {
  const form = page.getByTestId("form").element();
  if (!(form instanceof HTMLFormElement)) {
    throw new Error("form을 찾지 못했어요.");
  }
  return form;
};

describe("Switch", () => {
  it("누르면 켜지고 다시 누르면 꺼져요", async () => {
    await render(<Switch label="알림 받기" />);
    const control = page.getByRole("switch");

    await control.click();
    await expect.element(control).toBeChecked();

    await control.click();
    await expect.element(control).not.toBeChecked();
  });

  it("라벨 글자를 눌러도 바뀌어요", async () => {
    await render(<Switch label="알림 받기" />);

    await page.getByText("알림 받기").click();

    await expect.element(page.getByRole("switch")).toBeChecked();
  });

  it("Space와 Enter로 바뀌어요", async () => {
    await render(<Switch label="알림 받기" />);
    const control = page.getByRole("switch");

    await userEvent.tab();
    await userEvent.keyboard(" ");
    await expect.element(control).toBeChecked();

    await userEvent.keyboard("{Enter}");
    await expect.element(control).not.toBeChecked();
  });

  it("이름은 라벨이고 켜짐·꺼짐에 따라 바뀌지 않아요", async () => {
    await render(<Switch label="알림 받기" />);
    const control = page.getByRole("switch", {
      name: "알림 받기",
      exact: true,
    });
    await expect.element(control).toBeInTheDocument();

    await control.click();

    await expect.element(control).toBeChecked();
    await expect.element(control).toHaveAccessibleName("알림 받기");
  });

  it("disabled면 값이 그대로고 포커스를 받지 않아요", async () => {
    await render(<Switch label="알림 받기" disabled />);
    const control = page.getByRole("switch");

    await expect.element(control).toBeDisabled();
    // Playwright는 disabled 입력의 라벨도 못 누른다고 보고 기다려서, 검사를 건너뛰고 눌러요.
    await page.getByText("알림 받기").click({ force: true });
    await expect.element(control).not.toBeChecked();

    await userEvent.tab();
    await expect.element(control).not.toHaveFocus();
  });

  it("loading이면 aria-busy를 알리고 클릭과 키보드를 무시해요", async () => {
    const onCheckedChange = vi.fn();
    await render(
      <Switch label="알림 받기" loading onCheckedChange={onCheckedChange} />,
    );
    const control = page.getByRole("switch");
    await expect.element(control).toHaveAttribute("aria-busy", "true");
    await expect.element(control).toHaveAttribute("aria-disabled", "true");

    // aria-disabled면 Playwright가 누를 수 있을 때까지 기다리기만 해서 force로 눌러요.
    await control.click({ force: true });
    await page.getByText("알림 받기").click({ force: true });
    await userEvent.tab();
    await userEvent.keyboard(" ");
    await userEvent.keyboard("{Enter}");

    expect(onCheckedChange).not.toHaveBeenCalled();
    await expect.element(control).not.toBeChecked();
  });

  it("loading이 돼도 포커스가 남아요", async () => {
    const { rerender } = await render(<Switch label="알림 받기" />);
    await userEvent.tab();
    const control = page.getByRole("switch");
    await expect.element(control).toHaveFocus();

    await rerender(<Switch label="알림 받기" loading />);

    await expect.element(control).toHaveFocus();
  });

  it("disabled와 loading을 같이 주면 loading처럼 포커스가 남아요", async () => {
    await render(<Switch label="알림 받기" disabled loading />);
    await userEvent.tab();

    const control = page.getByRole("switch");
    await expect.element(control).toHaveFocus();
    await expect.element(control).toHaveAttribute("aria-disabled", "true");
  });

  it("checked를 넘기면 값은 쓰는 쪽이 정해요", async () => {
    const onCheckedChange = vi.fn();
    await render(
      <Switch
        label="알림 받기"
        checked={false}
        onCheckedChange={onCheckedChange}
      />,
    );
    const control = page.getByRole("switch");

    await control.click();

    expect(onCheckedChange).toHaveBeenCalledExactlyOnceWith(true);
    await expect.element(control).not.toBeChecked();
  });

  it("폼 안에서 라벨을 눌러도 한 번만 바뀌어요", async () => {
    // 폼 안에서는 Radix가 숨은 input으로 click을 한 번 더 보내요. 라벨이 그걸 다시 받으면 두 번 바뀌어요.
    const onCheckedChange = vi.fn();
    await render(
      <form>
        <Switch label="알림 받기" onCheckedChange={onCheckedChange} />
      </form>,
    );

    await page.getByText("알림 받기").click();

    expect(onCheckedChange).toHaveBeenCalledExactlyOnceWith(true);
    await expect.element(page.getByRole("switch")).toBeChecked();
  });

  it("폼에 name·value로 제출되고 reset이면 처음 값으로 돌아가요", async () => {
    await render(
      <form data-testid="form">
        <Switch label="알림 받기" name="notify" value="yes" />
      </form>,
    );
    const form = getForm();
    const control = page.getByRole("switch");
    expect(new FormData(form).get("notify")).toBeNull();

    await control.click();
    expect(new FormData(form).get("notify")).toBe("yes");

    form.reset();
    await expect.element(control).not.toBeChecked();
  });

  it("숨은 input은 버튼과 같은 자리에 겹쳐요", async () => {
    // 브라우저가 required 안내 말풍선을 input 자리에 띄워서 스위치를 가리켜야 해요.
    await render(
      <form data-testid="form">
        <Switch label="알림 받기" required />
      </form>,
    );
    const input = getForm().querySelector('input[type="checkbox"]');
    if (!input) {
      throw new Error("숨은 input을 찾지 못했어요.");
    }

    expect(input.getBoundingClientRect().toJSON()).toEqual(
      page.getByRole("switch").element().getBoundingClientRect().toJSON(),
    );
  });

  it("Tab으로 오면 포커스 링이 보여요", async () => {
    // 색·두께는 토큰이 정하니 보이는지만 확인해요.
    await render(<Switch label="알림 받기" />);
    const control = page.getByRole("switch").element();
    expect(getComputedStyle(control).outlineStyle).toBe("none");

    await userEvent.tab();

    expect(getComputedStyle(control).outlineStyle).not.toBe("none");
  });

  it("ref는 버튼에, className은 바깥 요소에 붙어요", async () => {
    const ref = createRef<HTMLButtonElement>();
    await render(
      <Switch
        ref={ref}
        label="알림 받기"
        id="notify"
        className="custom"
        style={{ marginTop: 4 }}
      />,
    );
    const control = page.getByRole("switch");

    expect(ref.current).toBe(control.element());
    await expect.element(control).toHaveAttribute("id", "notify");
    const root = control.element().closest("label");
    expect(root).toHaveClass("custom");
    expect(root).toHaveStyle({ marginTop: "4px" });
    // 우리 클래스 이름은 해시라서 개수로만 확인해요.
    expect(root?.classList.length).toBeGreaterThan(1);
  });
});

describe("SwitchRow", () => {
  it("설명을 눌러도 바뀌어요", async () => {
    await render(
      <SwitchRow label="알림 받기" description="새 댓글이 달리면 알려요" />,
    );

    await page.getByText("새 댓글이 달리면 알려요").click();

    await expect.element(page.getByRole("switch")).toBeChecked();
  });

  it("설명은 설명으로 읽히고 이름에 섞이지 않아요", async () => {
    await render(
      <SwitchRow label="알림 받기" description="새 댓글이 달리면 알려요" />,
    );
    const control = page.getByRole("switch");

    await expect.element(control).toHaveAccessibleName("알림 받기");
    await expect
      .element(control)
      .toHaveAccessibleDescription("새 댓글이 달리면 알려요");
  });

  it("쓰는 쪽 aria-describedby와 설명을 함께 읽어요", async () => {
    await render(
      <>
        <p id="hint">언제든 끌 수 있어요</p>
        <SwitchRow
          label="알림 받기"
          description="새 댓글이 달리면 알려요"
          aria-describedby="hint"
        />
      </>,
    );

    await expect
      .element(page.getByRole("switch"))
      .toHaveAccessibleDescription(
        "새 댓글이 달리면 알려요 언제든 끌 수 있어요",
      );
  });

  it("설명이 없으면 aria-describedby를 붙이지 않아요", async () => {
    await render(<SwitchRow label="알림 받기" />);

    await expect
      .element(page.getByRole("switch"))
      .not.toHaveAttribute("aria-describedby");
  });
});
