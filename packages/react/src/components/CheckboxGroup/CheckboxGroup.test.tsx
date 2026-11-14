import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";

import { Checkbox } from "../Checkbox";
import { CheckboxGroup, type CheckboxGroupProps } from "./CheckboxGroup";

type TopicsProps = Omit<CheckboxGroupProps, "label" | "children">;

// 항목 셋짜리 그룹이에요. 첫 항목은 골라 둔 채 시작하고, 테스트마다 그룹 props만 바꿔요.
function Topics(groupProps: TopicsProps) {
  return (
    <CheckboxGroup label="관심 분야" {...groupProps}>
      <Checkbox name="topics" value="design" label="디자인" defaultChecked />
      <Checkbox name="topics" value="dev" label="개발" />
      <Checkbox name="topics" value="pm" label="기획" />
    </CheckboxGroup>
  );
}

const getForm = () => {
  const form = page.getByTestId("form").element();
  if (!(form instanceof HTMLFormElement)) {
    throw new Error("form을 찾지 못했어요.");
  }
  return form;
};

const getCheckedStates = () =>
  page
    .getByRole("checkbox")
    .elements()
    .map((checkbox) => checkbox.getAttribute("aria-checked"));

// 비활성 모양을 이루는 계산값이에요. 상자 바탕·테두리·아이콘 색, 라벨 색, 줄 커서를 봐요.
const readLook = (checkbox: Element) => {
  const surface = checkbox.firstElementChild;
  const row = checkbox.closest("label");
  const text = row?.lastElementChild;
  if (!surface || !row || !text) {
    throw new Error("상자나 라벨을 찾지 못했어요.");
  }
  const surfaceStyle = getComputedStyle(surface);
  return {
    background: surfaceStyle.backgroundColor,
    border: surfaceStyle.borderTopColor,
    icon: surfaceStyle.color,
    label: getComputedStyle(text).color,
    cursor: getComputedStyle(row).cursor,
  };
};

describe("CheckboxGroup", () => {
  it("제목이 그룹의 이름이 돼요", async () => {
    await render(<Topics />);

    await expect
      .element(page.getByRole("group", { name: "관심 분야" }))
      .toBeInTheDocument();
  });

  it("aria-labelledby를 넘기면 그 요소가 제목 대신 이름이 돼요", async () => {
    await render(
      <>
        <h2 id="section-title">알림 설정</h2>
        <Topics hideLabel aria-labelledby="section-title" />
      </>,
    );

    await expect
      .element(page.getByRole("group", { name: "알림 설정" }))
      .toBeInTheDocument();
  });

  it("description과 errorMessage를 그룹의 설명으로 연결해요", async () => {
    const { rerender } = await render(
      <Topics
        description="여러 개 골라도 돼요."
        errorMessage="하나 이상 골라 주세요."
      />,
    );
    const group = page.getByRole("group");

    await expect
      .element(group)
      .toHaveAccessibleDescription("여러 개 골라도 돼요.");

    await rerender(
      <Topics
        description="여러 개 골라도 돼요."
        errorMessage="하나 이상 골라 주세요."
        invalid
      />,
    );

    await expect
      .element(group)
      .toHaveAccessibleDescription("하나 이상 골라 주세요.");
  });

  it("aria-describedby를 넘기면 안내 연결에 더해요", async () => {
    await render(
      <>
        <p id="policy">고른 분야의 소식만 보내요.</p>
        <Topics description="여러 개 골라도 돼요." aria-describedby="policy" />
      </>,
    );

    await expect
      .element(page.getByRole("group"))
      .toHaveAccessibleDescription(
        "여러 개 골라도 돼요. 고른 분야의 소식만 보내요.",
      );
  });

  it("invalid여도 그룹과 항목에 aria-invalid를 붙이지 않아요", async () => {
    await render(<Topics invalid errorMessage="하나 이상 골라 주세요." />);

    await expect
      .element(page.getByRole("group"))
      .not.toHaveAttribute("aria-invalid");
    for (const checkbox of page.getByRole("checkbox").elements()) {
      expect(checkbox).not.toHaveAttribute("aria-invalid");
    }
  });

  it("required면 제목에 *만 붙이고 항목에는 required를 넘기지 않아요", async () => {
    await render(
      <form data-testid="form">
        <Topics required requirementIndicator />
      </form>,
    );

    await expect.element(page.getByText("*")).toBeVisible();
    await expect
      .element(page.getByRole("group"))
      .not.toHaveAttribute("aria-required");
    for (const checkbox of page.getByRole("checkbox").elements()) {
      expect(checkbox).not.toBeRequired();
    }
    const inputs = getForm().querySelectorAll('input[type="checkbox"]');
    expect(inputs).toHaveLength(3);
    for (const input of inputs) {
      expect(input).not.toBeRequired();
    }
  });

  it("disabled 그룹은 어떤 항목도 바꿀 수 없고 포커스도 받지 않아요", async () => {
    await render(<Topics disabled />);
    const before = getCheckedStates();

    // Playwright는 disabled 버튼을 못 누른다고 보고 기다려서, 검사를 건너뛰고 눌러요.
    for (const name of ["디자인", "개발", "기획"]) {
      await page.getByText(name).click({ force: true });
    }
    expect(getCheckedStates()).toEqual(before);

    await userEvent.tab();
    for (const checkbox of page.getByRole("checkbox").elements()) {
      expect(checkbox).not.toHaveFocus();
    }
  });

  it("disabled 그룹의 항목은 disabled Checkbox와 같은 모양이에요", async () => {
    await render(
      <>
        <Topics disabled />
        <Checkbox label="비활성 선택" defaultChecked disabled />
        <Checkbox label="비활성 미선택" disabled />
        <Checkbox label="활성 미선택" />
      </>,
    );
    const look = (name: string) =>
      readLook(page.getByRole("checkbox", { name }).element());

    expect(look("디자인")).toEqual(look("비활성 선택"));
    expect(look("개발")).toEqual(look("비활성 미선택"));
    // 비교가 헛돌지 않게 활성 모양과는 달라야 해요.
    expect(look("개발")).not.toEqual(look("활성 미선택"));
  });

  it("같은 name의 항목을 고르면 form에 모두 담겨요", async () => {
    await render(
      <form data-testid="form">
        <Topics />
      </form>,
    );

    await page.getByRole("checkbox", { name: "기획" }).click();

    expect(new FormData(getForm()).getAll("topics")).toEqual(["design", "pm"]);
  });

  it("disabled 그룹의 항목은 form에 담기지 않아요", async () => {
    await render(
      <form data-testid="form">
        <Topics disabled />
      </form>,
    );

    expect(new FormData(getForm()).getAll("topics")).toEqual([]);
  });

  it("className은 Field root에, ref·id·aria 속성은 묶음에 가요", async () => {
    const ref = createRef<HTMLFieldSetElement>();
    await render(
      <Topics
        ref={ref}
        id="topics"
        aria-details="topics-help"
        className="group-custom"
      />,
    );
    const group = page.getByRole("group").element();

    // Field root가 묶음을 바로 감싸요.
    const fieldRoot = group.parentElement;
    expect(fieldRoot).toHaveClass("group-custom");
    expect(group).not.toHaveClass("group-custom");
    // 우리 클래스 이름은 해시라서 개수로만 확인해요.
    expect(fieldRoot?.classList.length).toBeGreaterThan(1);
    expect(ref.current).toBe(group);
    expect(group).toHaveAttribute("id", "topics");
    expect(group).toHaveAttribute("aria-details", "topics-help");
  });
});
