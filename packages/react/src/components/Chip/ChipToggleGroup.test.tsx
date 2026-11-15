import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";

import { ChipToggle } from "./Chip";
import { ChipToggleGroup, type ChipToggleGroupProps } from "./ChipToggleGroup";

type FiltersProps = Omit<ChipToggleGroupProps, "label" | "children">;

// 칩 셋짜리 묶음이에요. 첫 칩은 켠 채 시작하고, 테스트마다 묶음 props만 바꿔요.
function Filters(groupProps: FiltersProps) {
  return (
    <ChipToggleGroup label="배송" {...groupProps}>
      <ChipToggle defaultPressed>무료 배송</ChipToggle>
      <ChipToggle>오늘 출발</ChipToggle>
      <ChipToggle>새벽 도착</ChipToggle>
    </ChipToggleGroup>
  );
}

const getChips = () => page.getByRole("button").elements();

const getPressedStates = () =>
  getChips().map((chip) => chip.getAttribute("aria-pressed"));

// 칩 모양을 이루는 계산값이에요. 선택 색과 테두리는 버튼 안의 겉면이 그려요.
const readLook = (chip: Element) => {
  const surface = chip.firstElementChild;
  if (!surface) {
    throw new Error("겉면을 찾지 못했어요.");
  }
  const surfaceStyle = getComputedStyle(surface);
  return {
    background: surfaceStyle.backgroundColor,
    border: surfaceStyle.borderTopColor,
    emphasis: surfaceStyle.boxShadow,
    color: surfaceStyle.color,
    cursor: getComputedStyle(chip).cursor,
  };
};

describe("ChipToggleGroup", () => {
  it("제목이 묶음의 이름이 돼요", async () => {
    await render(<Filters />);

    await expect
      .element(page.getByRole("group", { name: "배송" }))
      .toBeInTheDocument();
  });

  it("description과 errorMessage를 묶음의 설명으로 연결해요", async () => {
    const { rerender } = await render(
      <Filters
        description="여러 개 켜도 돼요."
        errorMessage="하나 이상 켜 주세요."
      />,
    );
    const group = page.getByRole("group");

    await expect
      .element(group)
      .toHaveAccessibleDescription("여러 개 켜도 돼요.");

    await rerender(
      <Filters
        description="여러 개 켜도 돼요."
        errorMessage="하나 이상 켜 주세요."
        invalid
      />,
    );

    await expect
      .element(group)
      .toHaveAccessibleDescription("하나 이상 켜 주세요.");
  });

  it("invalid여도 묶음과 항목에 aria-invalid를 붙이지 않아요", async () => {
    await render(<Filters invalid errorMessage="하나 이상 켜 주세요." />);

    await expect
      .element(page.getByRole("group"))
      .not.toHaveAttribute("aria-invalid");
    for (const chip of getChips()) {
      expect(chip).not.toHaveAttribute("aria-invalid");
    }
  });

  it("항목마다 Tab으로 멈추고 방향키로는 옮기지 않아요", async () => {
    await render(<Filters />);
    const [first, second] = getChips();

    await userEvent.tab();
    expect(first).toHaveFocus();

    await userEvent.keyboard("{ArrowRight}");
    expect(first).toHaveFocus();

    await userEvent.tab();
    expect(second).toHaveFocus();
  });

  it("disabled 묶음은 어떤 항목도 바꿀 수 없고 포커스도 받지 않아요", async () => {
    await render(<Filters disabled />);
    const before = getPressedStates();

    // Playwright는 disabled 버튼을 못 누른다고 보고 기다려서, 검사를 건너뛰고 눌러요.
    for (const name of ["무료 배송", "오늘 출발", "새벽 도착"]) {
      await page.getByRole("button", { name }).click({ force: true });
    }
    expect(getPressedStates()).toEqual(before);

    await userEvent.tab();
    for (const chip of getChips()) {
      expect(chip).not.toHaveFocus();
    }
  });

  it("disabled 묶음의 항목은 disabled ChipToggle과 같은 모양이에요(선택 표시 포함)", async () => {
    await render(
      <>
        <Filters disabled />
        <ChipToggle defaultPressed disabled>
          비활성 켬
        </ChipToggle>
        <ChipToggle disabled>비활성 끔</ChipToggle>
        <ChipToggle>활성 끔</ChipToggle>
      </>,
    );
    const look = (name: string) =>
      readLook(page.getByRole("button", { name }).element());

    expect(look("무료 배송")).toEqual(look("비활성 켬"));
    expect(look("오늘 출발")).toEqual(look("비활성 끔"));
    // 비교가 헛돌지 않게 활성 모양과는 달라야 해요.
    expect(look("오늘 출발")).not.toEqual(look("활성 끔"));
  });

  it("className은 Field root에, ref·id·aria 속성은 묶음에 가요", async () => {
    const ref = createRef<HTMLFieldSetElement>();
    await render(
      <Filters
        ref={ref}
        id="filters"
        aria-details="filters-help"
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
    expect(group).toHaveAttribute("id", "filters");
    expect(group).toHaveAttribute("aria-details", "filters-help");
  });
});
