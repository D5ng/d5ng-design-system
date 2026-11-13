import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";

import { RadioGroup, RadioGroupItem, type RadioGroupProps } from "./RadioGroup";

type ChannelsProps = Omit<RadioGroupProps, "label" | "children">;

// 항목 셋짜리 그룹이에요. 테스트마다 그룹 props만 바꿔요.
function Channels(groupProps: ChannelsProps) {
  return (
    <RadioGroup label="받는 방법" {...groupProps}>
      <RadioGroupItem value="email" label="이메일" />
      <RadioGroupItem value="sms" label="문자" />
      <RadioGroupItem value="push" label="앱 알림" />
    </RadioGroup>
  );
}

// Radix는 키를 누르고 있는 동안 포커스가 옮겨 가면 그 항목을 골라요.
// 포커스는 다음 틱에 옮겨서, 바로 떼면 keyup이 먼저 와 고르지 않아요. 사람처럼 잠깐 누르고 있다 떼요.
const pressArrowDown = async () => {
  await userEvent.keyboard("{ArrowDown>}");
  await new Promise((resolve) => setTimeout(resolve, 50));
  await userEvent.keyboard("{/ArrowDown}");
};

const getForm = () => {
  const form = page.getByTestId("form").element();
  if (!(form instanceof HTMLFormElement)) {
    throw new Error("form을 찾지 못했어요.");
  }
  return form;
};

describe("RadioGroup", () => {
  it("제목이 그룹의 이름이 돼요", async () => {
    await render(<Channels />);

    await expect
      .element(page.getByRole("radiogroup", { name: "받는 방법" }))
      .toBeInTheDocument();
  });

  it("description과 errorMessage를 그룹의 설명으로 연결해요", async () => {
    const { rerender } = await render(
      <Channels
        description="하나만 고를 수 있어요."
        errorMessage="받는 방법을 골라 주세요."
      />,
    );
    const group = page.getByRole("radiogroup");

    await expect
      .element(group)
      .toHaveAccessibleDescription("하나만 고를 수 있어요.");

    await rerender(
      <Channels
        description="하나만 고를 수 있어요."
        errorMessage="받는 방법을 골라 주세요."
        invalid
      />,
    );

    await expect
      .element(group)
      .toHaveAccessibleDescription("받는 방법을 골라 주세요.");
  });

  it("aria-describedby를 넘기면 안내 연결에 더해요", async () => {
    await render(
      <>
        <p id="policy">알림은 언제든 끌 수 있어요.</p>
        <Channels
          description="하나만 고를 수 있어요."
          aria-describedby="policy"
        />
      </>,
    );

    await expect
      .element(page.getByRole("radiogroup"))
      .toHaveAccessibleDescription(
        "하나만 고를 수 있어요. 알림은 언제든 끌 수 있어요.",
      );
  });

  it("invalid면 그룹에 aria-invalid를 붙이고 항목에는 붙이지 않아요", async () => {
    await render(<Channels invalid />);

    await expect
      .element(page.getByRole("radiogroup"))
      .toHaveAttribute("aria-invalid", "true");
    for (const radio of page.getByRole("radio").elements()) {
      expect(radio).not.toHaveAttribute("aria-invalid");
    }
  });

  it("required면 그룹에 aria-required를 붙이고 form 안의 숨은 input에 required를 넘겨요", async () => {
    await render(
      <form data-testid="form">
        <Channels name="channel" required />
      </form>,
    );

    await expect
      .element(page.getByRole("radiogroup"))
      .toHaveAttribute("aria-required", "true");
    const inputs = getForm().querySelectorAll('input[type="radio"]');
    expect(inputs).toHaveLength(3);
    for (const input of inputs) {
      expect(input).toBeRequired();
    }
  });

  it("항목의 label이 항목의 이름이 돼요", async () => {
    await render(<Channels />);

    await expect
      .element(page.getByRole("radio", { name: "이메일" }))
      .toBeInTheDocument();
  });

  it("행의 빈 곳을 눌러도 항목이 골라져요", async () => {
    await render(<Channels />);
    const radio = page.getByRole("radio", { name: "문자" });
    const row = radio.element().closest("label");
    expect(row).toBeInstanceOf(HTMLElement);

    // 마크와 글자 밖인 행 여백의 모서리를 눌러요.
    await userEvent.click(row as HTMLElement, { position: { x: 2, y: 2 } });

    await expect.element(radio).toBeChecked();
  });

  it("선택된 항목을 다시 눌러도 선택이 유지돼요", async () => {
    await render(<Channels />);
    const radio = page.getByRole("radio", { name: "이메일" });

    await radio.click();
    await radio.click();

    await expect.element(radio).toBeChecked();
  });

  it("방향키로 옮기면 다음 항목이 골라져요", async () => {
    await render(<Channels defaultValue="email" />);
    const sms = page.getByRole("radio", { name: "문자" });

    await userEvent.tab();
    await pressArrowDown();

    await expect.element(sms).toHaveFocus();
    await expect.element(sms).toBeChecked();
  });

  it("Tab은 선택된 항목으로 들어가요", async () => {
    await render(<Channels defaultValue="push" />);

    await userEvent.tab();

    await expect
      .element(page.getByRole("radio", { name: "앱 알림" }))
      .toHaveFocus();
  });

  it("disabled 항목은 방향키 이동과 선택에서 빠져요", async () => {
    await render(
      <RadioGroup label="받는 방법" defaultValue="email">
        <RadioGroupItem value="email" label="이메일" />
        <RadioGroupItem value="sms" label="문자" disabled />
        <RadioGroupItem value="push" label="앱 알림" />
      </RadioGroup>,
    );
    const sms = page.getByRole("radio", { name: "문자" });
    const push = page.getByRole("radio", { name: "앱 알림" });

    await userEvent.tab();
    await pressArrowDown();
    await expect.element(push).toHaveFocus();
    await expect.element(push).toBeChecked();

    // Playwright는 disabled 버튼을 못 누른다고 보고 기다려서, 검사를 건너뛰고 눌러요.
    await page.getByText("문자").click({ force: true });
    await expect.element(sms).not.toBeChecked();
  });

  it("disabled 그룹은 어떤 항목도 고를 수 없어요", async () => {
    await render(<Channels disabled />);

    for (const name of ["이메일", "문자", "앱 알림"]) {
      await page.getByText(name).click({ force: true });
    }
    for (const radio of page.getByRole("radio").elements()) {
      expect(radio).not.toBeChecked();
    }

    await userEvent.tab();
    for (const radio of page.getByRole("radio").elements()) {
      expect(radio).not.toHaveFocus();
    }
  });

  it("defaultValue로 시작하고 onValueChange로 고른 값을 알려요", async () => {
    const onValueChange = vi.fn();
    await render(
      <Channels defaultValue="email" onValueChange={onValueChange} />,
    );

    await expect
      .element(page.getByRole("radio", { name: "이메일" }))
      .toBeChecked();

    await page.getByRole("radio", { name: "문자" }).click();

    expect(onValueChange).toHaveBeenCalledWith("sms");
  });

  it("form 안에서 라벨을 눌러도 onValueChange는 한 번만 불려요", async () => {
    // 라벨 안에 버튼과 숨은 input이 같이 있어서 클릭이 두 번 처리되지 않는지 봐요.
    const onValueChange = vi.fn();
    await render(
      <form>
        <Channels name="channel" onValueChange={onValueChange} />
      </form>,
    );

    await page.getByText("문자").click();

    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith("sms");
  });

  it("form을 제출하면 name과 고른 value가 담겨요", async () => {
    await render(
      <form data-testid="form">
        <Channels name="channel" defaultValue="email" />
      </form>,
    );

    await page.getByRole("radio", { name: "앱 알림" }).click();

    expect(new FormData(getForm()).getAll("channel")).toEqual(["push"]);
  });

  it("className을 넘겨도 원래 스타일이 남아요(그룹은 Field root, 항목은 행)", async () => {
    await render(
      <RadioGroup label="받는 방법" className="group-custom">
        <RadioGroupItem value="email" label="이메일" className="item-custom" />
      </RadioGroup>,
    );
    const group = page.getByRole("radiogroup").element();
    const row = page.getByRole("radio").element().closest("label");

    // Field root가 radiogroup을 바로 감싸요.
    const fieldRoot = group.parentElement;
    expect(fieldRoot).toHaveClass("group-custom");
    expect(group).not.toHaveClass("group-custom");
    expect(row).toHaveClass("item-custom");
    // 우리 클래스 이름은 해시라서 개수로만 확인해요.
    expect(fieldRoot?.classList.length).toBeGreaterThan(1);
    expect(row?.classList.length).toBeGreaterThan(1);
  });

  it("항목의 ref·id·aria 속성은 radio 버튼에 가요", async () => {
    const ref = createRef<HTMLButtonElement>();
    await render(
      <RadioGroup label="받는 방법">
        <RadioGroupItem
          ref={ref}
          value="email"
          label="이메일"
          id="channel-email"
          aria-describedby="hint"
        />
      </RadioGroup>,
    );
    const radio = page.getByRole("radio");

    await expect.element(radio).toHaveAttribute("id", "channel-email");
    await expect.element(radio).toHaveAttribute("aria-describedby", "hint");
    expect(ref.current).toBe(radio.element());
  });

  it("숨은 input은 마크와 같은 자리에 겹쳐요", async () => {
    // 브라우저의 required 검증 말풍선이 이 input을 가리켜요.
    await render(
      <form>
        <Channels name="channel" required />
      </form>,
    );
    const mark = page
      .getByRole("radio", { name: "이메일" })
      .element()
      .getBoundingClientRect();
    const input = document
      .querySelector('input[type="radio"]')
      ?.getBoundingClientRect();

    expect(input?.toJSON()).toEqual(mark.toJSON());
  });
});
