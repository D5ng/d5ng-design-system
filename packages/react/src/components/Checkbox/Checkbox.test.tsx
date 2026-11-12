import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";

import { Field } from "../Field";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("라벨이 체크박스의 이름이 돼요", async () => {
    await render(<Checkbox label="알림 받기" />);

    await expect
      .element(page.getByRole("checkbox", { name: "알림 받기" }))
      .toBeInTheDocument();
  });

  it("라벨을 누르면 선택이 바뀌어요", async () => {
    await render(<Checkbox label="알림 받기" />);

    await page.getByText("알림 받기").click();

    await expect.element(page.getByRole("checkbox")).toBeChecked();
  });

  it("Space로 바꾸고 Enter로는 바꾸지 않아요", async () => {
    await render(<Checkbox label="알림 받기" />);
    const checkbox = page.getByRole("checkbox");

    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    await expect.element(checkbox).not.toBeChecked();

    await userEvent.keyboard(" ");
    await expect.element(checkbox).toBeChecked();
  });

  it('checked="indeterminate"면 aria-checked가 mixed예요', async () => {
    await render(<Checkbox label="전체 선택" checked="indeterminate" />);

    await expect
      .element(page.getByRole("checkbox"))
      .toHaveAttribute("aria-checked", "mixed");
  });

  it("일부 선택에서 누르면 선택이 돼요", async () => {
    await render(<Checkbox label="전체 선택" defaultChecked="indeterminate" />);

    await page.getByRole("checkbox").click();

    await expect
      .element(page.getByRole("checkbox"))
      .toHaveAttribute("aria-checked", "true");
  });

  it("disabled면 눌러도 바뀌지 않고 포커스도 받지 않아요", async () => {
    await render(<Checkbox label="알림 받기" disabled />);
    const checkbox = page.getByRole("checkbox");

    // Playwright는 disabled 입력의 라벨도 못 누른다고 보고 기다려서, 검사를 건너뛰고 눌러요.
    await page.getByText("알림 받기").click({ force: true });
    await expect.element(checkbox).not.toBeChecked();

    await userEvent.tab();
    await expect.element(checkbox).not.toHaveFocus();
  });

  it("id·aria-*·ref는 버튼에, className은 줄에 붙어요", async () => {
    const ref = createRef<HTMLButtonElement>();
    await render(
      <Checkbox
        ref={ref}
        label="알림 받기"
        id="notify"
        aria-describedby="hint"
        className="custom"
      />,
    );
    const checkbox = page.getByRole("checkbox");

    await expect.element(checkbox).toHaveAttribute("id", "notify");
    await expect.element(checkbox).toHaveAttribute("aria-describedby", "hint");
    expect(ref.current).toBe(checkbox.element());
    const row = checkbox.element().closest("label");
    expect(row).toHaveClass("custom");
    // 우리 클래스 이름은 해시라서 개수로만 확인해요.
    expect(row?.classList.length).toBeGreaterThan(1);
  });

  it("form 안이면 name·value가 제출되고 required가 숨은 input에 붙어요", async () => {
    await render(
      <form data-testid="form">
        <Checkbox
          label="약관에 동의해요"
          name="terms"
          value="agreed"
          defaultChecked
          required
        />
      </form>,
    );
    const form = page.getByTestId("form").element();
    if (!(form instanceof HTMLFormElement)) {
      throw new Error("form을 찾지 못했어요.");
    }

    expect(new FormData(form).get("terms")).toBe("agreed");
    expect(form.querySelector('input[type="checkbox"]')).toBeRequired();
  });

  it("숨은 input은 상자와 같은 자리에 겹쳐요", async () => {
    // 브라우저의 required 검증 말풍선이 이 input을 가리켜요.
    await render(
      <form>
        <Checkbox label="약관에 동의해요" required />
      </form>,
    );
    const box = page.getByRole("checkbox").element().getBoundingClientRect();
    const input = document
      .querySelector('input[type="checkbox"]')
      ?.getBoundingClientRect();

    expect(input?.toJSON()).toEqual(box.toJSON());
  });

  it("Field로 감싸면 안내·오류가 체크박스의 설명으로 이어져요", async () => {
    await render(
      <Field
        label="약관"
        description="서비스를 쓰려면 동의해야 해요"
        errorMessage="약관에 동의해 주세요"
        invalid
      >
        {(control) => <Checkbox {...control} label="이용약관에 동의해요" />}
      </Field>,
    );
    const checkbox = page.getByRole("checkbox", {
      name: "약관 이용약관에 동의해요",
    });

    await expect
      .element(checkbox)
      .toHaveAccessibleDescription("약관에 동의해 주세요");
    await expect.element(checkbox).toHaveAttribute("aria-invalid", "true");
  });

  it("아이콘은 스크린리더가 읽지 않아요", async () => {
    await render(<Checkbox label="알림 받기" defaultChecked />);

    const icons = page.getByRole("checkbox").element().querySelectorAll("svg");
    expect(icons.length).toBeGreaterThan(0);
    for (const icon of icons) {
      expect(icon).toHaveAttribute("aria-hidden", "true");
    }
  });
});
