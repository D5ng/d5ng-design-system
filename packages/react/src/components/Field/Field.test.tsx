import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-react";

import { Field, type FieldControlProps } from "./Field";

// TextField 없이 계약만 보려고 native input을 써요.
const renderInput = (control: FieldControlProps) => <input {...control} />;

// RadioGroup 없이 group 계약만 보려고 빈 radiogroup을 써요. div엔 required·disabled가 없어서 aria로 바꿔요.
const renderGroup = ({
  required,
  disabled,
  ...groupProps
}: FieldControlProps) => (
  <div
    role="radiogroup"
    aria-required={required || undefined}
    aria-disabled={disabled || undefined}
    {...groupProps}
  />
);

// 라벨 글자에 표시가 섞이면 getByText로 못 찾아서 입력에 이어진 라벨을 따라가요.
const labelOf = (name: string) => {
  const input = page.getByRole("textbox", { name, exact: true }).element();
  if (!(input instanceof HTMLInputElement) || !input.labels?.[0]) {
    throw new Error(`${name} 입력에 이어진 라벨이 없어요.`);
  }
  return input.labels[0];
};

describe("Field", () => {
  it("라벨이 입력의 이름이 돼요", async () => {
    await render(<Field label="이름">{renderInput}</Field>);

    await expect
      .element(page.getByRole("textbox", { name: "이름" }))
      .toBeInTheDocument();
  });

  it("라벨을 누르면 입력에 포커스가 가요", async () => {
    await render(<Field label="이름">{renderInput}</Field>);

    await page.getByText("이름").click();

    await expect.element(page.getByRole("textbox")).toHaveFocus();
  });

  it("hideLabel이어도 입력의 이름은 남아요", async () => {
    await render(
      <Field label="이름" hideLabel>
        {renderInput}
      </Field>,
    );

    await expect
      .element(page.getByRole("textbox", { name: "이름" }))
      .toBeInTheDocument();
  });

  it("id를 넘기면 입력과 라벨이 그 id를 써요", async () => {
    await render(
      <Field label="이메일" id="email">
        {renderInput}
      </Field>,
    );

    const input = page.getByRole("textbox", { name: "이메일" });
    await expect.element(input).toHaveAttribute("id", "email");
  });

  it("group이면 라벨이 control의 aria-labelledby가 되고 label for를 두지 않아요", async () => {
    await render(
      <Field label="받는 방법" group>
        {renderGroup}
      </Field>,
    );

    await expect
      .element(page.getByRole("radiogroup", { name: "받는 방법" }))
      .toBeInTheDocument();
    expect(document.querySelector("label")).toBeNull();
  });

  it("group이면 hideLabel이어도 라벨이 이름이 돼요", async () => {
    await render(
      <Field label="받는 방법" group hideLabel>
        {renderGroup}
      </Field>,
    );

    await expect
      .element(page.getByRole("radiogroup", { name: "받는 방법" }))
      .toBeInTheDocument();
  });

  it("group이 아니면 aria-labelledby 없이 label for로 이어요", async () => {
    await render(<Field label="이름">{renderInput}</Field>);

    await expect
      .element(page.getByRole("textbox", { name: "이름" }))
      .not.toHaveAttribute("aria-labelledby");
    expect(labelOf("이름")).toHaveTextContent("이름");
  });

  it("description을 입력의 설명으로 연결해요", async () => {
    await render(
      <Field label="이름" description="실명으로 적어 주세요">
        {renderInput}
      </Field>,
    );

    await expect
      .element(page.getByRole("textbox"))
      .toHaveAccessibleDescription("실명으로 적어 주세요");
  });

  it("글자 수를 입력의 설명에 더해요", async () => {
    await render(
      <Field
        label="이름"
        description="실명으로 적어 주세요"
        characterCount={{ current: 3, max: 30 }}
      >
        {renderInput}
      </Field>,
    );

    await expect
      .element(page.getByRole("textbox"))
      .toHaveAccessibleDescription("실명으로 적어 주세요 3/30");
  });

  it("안내도 글자 수도 없으면 aria-describedby를 붙이지 않아요", async () => {
    // 없는 요소를 가리키는 id가 남지 않아야 해요.
    await render(<Field label="이름">{renderInput}</Field>);

    await expect
      .element(page.getByRole("textbox"))
      .not.toHaveAttribute("aria-describedby");
  });

  it("invalid면 입력에 aria-invalid를 붙여요", async () => {
    await render(
      <Field label="이름" invalid>
        {renderInput}
      </Field>,
    );

    await expect
      .element(page.getByRole("textbox"))
      .toHaveAttribute("aria-invalid", "true");
  });

  it("invalid면 errorMessage가 description을 대신해요", async () => {
    await render(
      <Field
        label="이름"
        invalid
        description="실명으로 적어 주세요"
        errorMessage="이름을 입력해 주세요"
      >
        {renderInput}
      </Field>,
    );

    await expect
      .element(page.getByRole("textbox"))
      .toHaveAccessibleDescription("이름을 입력해 주세요");
    await expect
      .element(page.getByText("실명으로 적어 주세요"))
      .not.toBeInTheDocument();
  });

  it("invalid가 아니면 errorMessage를 보여 주지 않아요", async () => {
    await render(
      <Field
        label="이름"
        description="실명으로 적어 주세요"
        errorMessage="이름을 입력해 주세요"
      >
        {renderInput}
      </Field>,
    );

    await expect
      .element(page.getByText("이름을 입력해 주세요"))
      .not.toBeInTheDocument();
    await expect
      .element(page.getByRole("textbox"))
      .toHaveAccessibleDescription("실명으로 적어 주세요");
  });

  it("invalid여도 errorMessage가 없으면 description을 남겨요", async () => {
    await render(
      <Field label="이름" invalid description="실명으로 적어 주세요">
        {renderInput}
      </Field>,
    );

    await expect
      .element(page.getByRole("textbox"))
      .toHaveAccessibleDescription("실명으로 적어 주세요");
  });

  it("글자 수가 max를 넘어도 invalid를 바꾸지 않아요", async () => {
    // 넘었을 때 오류로 볼지는 쓰는 쪽이 정해요.
    await render(
      <Field label="이름" characterCount={{ current: 35, max: 30 }}>
        {renderInput}
      </Field>,
    );

    await expect
      .element(page.getByRole("textbox"))
      .not.toHaveAttribute("aria-invalid");
  });

  it("disabled면 입력에 disabled를 넘겨요", async () => {
    await render(
      <Field label="이름" disabled>
        {renderInput}
      </Field>,
    );

    await expect.element(page.getByRole("textbox")).toBeDisabled();
  });

  it("required면 입력에 required를 넘겨요", async () => {
    await render(
      <Field label="이름" required>
        {renderInput}
      </Field>,
    );

    await expect.element(page.getByRole("textbox")).toBeRequired();
  });

  it("requirementIndicator면 required일 때 *를, 아닐 때 선택을 붙여요", async () => {
    await render(
      <>
        <Field label="이름" required requirementIndicator>
          {renderInput}
        </Field>
        <Field label="별명" requirementIndicator>
          {renderInput}
        </Field>
      </>,
    );

    expect(labelOf("이름")).toHaveTextContent("이름*");
    expect(labelOf("별명")).toHaveTextContent("별명선택");
  });

  it("필수·선택 표시는 입력의 이름에 섞이지 않아요", async () => {
    // 필수 여부는 표시가 아니라 required로 알려요.
    await render(
      <>
        <Field label="이름" required requirementIndicator>
          {renderInput}
        </Field>
        <Field label="별명" requirementIndicator>
          {renderInput}
        </Field>
      </>,
    );

    await expect
      .element(page.getByRole("textbox", { name: "이름", exact: true }))
      .toBeInTheDocument();
    await expect
      .element(page.getByRole("textbox", { name: "별명", exact: true }))
      .toBeInTheDocument();
  });

  it("headerAction은 라벨 옆에 두고 이름에 섞이지 않아요", async () => {
    await render(
      <Field label="이름" headerAction={<button type="button">도움말</button>}>
        {renderInput}
      </Field>,
    );

    await expect
      .element(page.getByRole("textbox", { name: "이름", exact: true }))
      .toBeInTheDocument();
    const header = labelOf("이름").parentElement;
    expect(header).toContainElement(
      page.getByRole("button", { name: "도움말" }).element(),
    );
  });

  it("className을 넘겨도 원래 스타일이 남아요", async () => {
    await render(
      <Field label="이름" className="custom" data-testid="field">
        {renderInput}
      </Field>,
    );

    const field = page.getByTestId("field");
    await expect.element(field).toHaveClass("custom");
    // 우리 클래스 이름은 해시라서 개수로만 확인해요.
    expect(field.element().classList.length).toBeGreaterThan(1);
  });

  it("ref를 root에 전달해요", async () => {
    const ref = createRef<HTMLDivElement>();
    await render(
      <Field ref={ref} label="이름">
        {renderInput}
      </Field>,
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toContainElement(page.getByRole("textbox").element());
  });
});
