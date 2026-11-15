import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";

import { ChipToggle } from "./Chip";
import {
  ChipRadioGroup,
  ChipRadioGroupItem,
  type ChipRadioGroupProps,
} from "./ChipRadioGroup";

type StatusProps = Omit<ChipRadioGroupProps, "label" | "children">;

// 칩 셋짜리 그룹이에요. 테스트마다 그룹 props만 바꿔요.
function Status(groupProps: StatusProps) {
  return (
    <ChipRadioGroup label="상태" {...groupProps}>
      <ChipRadioGroupItem value="all">전체</ChipRadioGroupItem>
      <ChipRadioGroupItem value="open">진행 중</ChipRadioGroupItem>
      <ChipRadioGroupItem value="done">완료</ChipRadioGroupItem>
    </ChipRadioGroup>
  );
}

// 이름이 붙은 아이콘을 넣어도 칩 이름은 글자만 남아야 해요.
const namedIcon = <svg role="img" aria-label="별" />;

// Radix는 키를 누르고 있는 동안 포커스가 옮겨 가면 그 항목을 골라요.
// 포커스는 다음 틱에 옮겨서, 바로 떼면 keyup이 먼저 와 고르지 않아요. 사람처럼 잠깐 누르고 있다 떼요.
const pressArrowRight = async () => {
  await userEvent.keyboard("{ArrowRight>}");
  await new Promise((resolve) => setTimeout(resolve, 50));
  await userEvent.keyboard("{/ArrowRight}");
};

const getForm = () => {
  const form = page.getByTestId("form").element();
  if (!(form instanceof HTMLFormElement)) {
    throw new Error("form을 찾지 못했어요.");
  }
  return form;
};

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
    minHeight: surfaceStyle.minHeight,
    padding: surfaceStyle.padding,
    fontSize: surfaceStyle.fontSize,
    cursor: getComputedStyle(chip).cursor,
  };
};

describe("ChipRadioGroup", () => {
  it("제목이 그룹의 이름이 돼요", async () => {
    await render(<Status />);

    await expect
      .element(page.getByRole("radiogroup", { name: "상태" }))
      .toBeInTheDocument();
  });

  it("description과 errorMessage를 그룹의 설명으로 연결해요", async () => {
    const { rerender } = await render(
      <Status
        description="하나만 골라요."
        errorMessage="상태를 골라 주세요."
      />,
    );
    const group = page.getByRole("radiogroup");

    await expect.element(group).toHaveAccessibleDescription("하나만 골라요.");

    await rerender(
      <Status
        description="하나만 골라요."
        errorMessage="상태를 골라 주세요."
        invalid
      />,
    );

    await expect
      .element(group)
      .toHaveAccessibleDescription("상태를 골라 주세요.");
  });

  it("invalid면 그룹에 aria-invalid를 붙이고 항목에는 붙이지 않아요", async () => {
    await render(<Status invalid />);

    await expect
      .element(page.getByRole("radiogroup"))
      .toHaveAttribute("aria-invalid", "true");
    for (const radio of page.getByRole("radio").elements()) {
      expect(radio).not.toHaveAttribute("aria-invalid");
    }
  });

  it("항목의 글자가 이름이 되고 앞 아이콘은 읽지 않아요", async () => {
    await render(
      <ChipRadioGroup label="상태">
        <ChipRadioGroupItem value="all" prefixIcon={namedIcon}>
          전체
        </ChipRadioGroupItem>
      </ChipRadioGroup>,
    );

    await expect
      .element(page.getByRole("radio", { name: "전체", exact: true }))
      .toBeInTheDocument();
  });

  it("방향키로 옮기면 바로 골라져요", async () => {
    await render(<Status defaultValue="all" />);
    const open = page.getByRole("radio", { name: "진행 중" });

    await userEvent.tab();
    await pressArrowRight();

    await expect.element(open).toHaveFocus();
    await expect.element(open).toBeChecked();
  });

  it("고른 항목을 다시 눌러도 풀리지 않아요", async () => {
    await render(<Status />);
    const all = page.getByRole("radio", { name: "전체" });

    await all.click();
    await all.click();

    await expect.element(all).toBeChecked();
  });

  it("Tab은 고른 항목으로 한 번만 들어가요", async () => {
    await render(
      <>
        <Status defaultValue="done" />
        <button type="button">다음</button>
      </>,
    );

    await userEvent.tab();
    await expect
      .element(page.getByRole("radio", { name: "완료" }))
      .toHaveFocus();

    await userEvent.tab();
    await expect
      .element(page.getByRole("button", { name: "다음" }))
      .toHaveFocus();
  });

  it("disabled 항목은 방향키 이동과 선택에서 빠지고 고른 표시는 남아요", async () => {
    await render(
      <>
        <ChipRadioGroup label="상태" defaultValue="all">
          <ChipRadioGroupItem value="all">전체</ChipRadioGroupItem>
          <ChipRadioGroupItem value="open" disabled>
            진행 중
          </ChipRadioGroupItem>
          <ChipRadioGroupItem value="done">완료</ChipRadioGroupItem>
        </ChipRadioGroup>
        {/* 비활성 배경은 선택과 상관없이 같아서 solid도 2px 테두리로 선택을 남겨요. */}
        <ChipRadioGroup label="지난 상태" variant="solid" defaultValue="past">
          <ChipRadioGroupItem value="past" disabled>
            지난달
          </ChipRadioGroupItem>
          <ChipRadioGroupItem value="older" disabled>
            그 전
          </ChipRadioGroupItem>
        </ChipRadioGroup>
      </>,
    );
    const open = page.getByRole("radio", { name: "진행 중" });
    const done = page.getByRole("radio", { name: "완료" });

    await userEvent.tab();
    await pressArrowRight();
    await expect.element(done).toHaveFocus();
    await expect.element(done).toBeChecked();

    // Playwright는 disabled 버튼을 못 누른다고 보고 기다려서, 검사를 건너뛰고 눌러요.
    await open.click({ force: true });
    await expect.element(open).not.toBeChecked();

    const past = page.getByRole("radio", { name: "지난달" });
    await expect.element(past).toBeChecked();
    expect(readLook(past.element()).emphasis).not.toBe(
      readLook(page.getByRole("radio", { name: "그 전" }).element()).emphasis,
    );
  });

  it("disabled 그룹은 어떤 항목도 고를 수 없어요", async () => {
    await render(<Status disabled />);

    for (const radio of page.getByRole("radio").all()) {
      await radio.click({ force: true });
    }
    for (const radio of page.getByRole("radio").elements()) {
      expect(radio).not.toBeChecked();
    }

    await userEvent.tab();
    for (const radio of page.getByRole("radio").elements()) {
      expect(radio).not.toHaveFocus();
    }
  });

  it("비활성 fieldset 안에서는 disabled 그룹과 같은 모양이에요", async () => {
    // Radix가 data-disabled를 붙이지 않아도 브라우저가 막은 버튼은 비활성으로 그려요.
    await render(
      <>
        <fieldset disabled>
          <Status defaultValue="all" />
        </fieldset>
        <Status defaultValue="all" disabled />
        <Status defaultValue="all" />
      </>,
    );
    // 그룹마다 항목이 셋이라 순서로 골라요.
    const look = (index: number) =>
      readLook(page.getByRole("radio").nth(index).element());

    // 고른 항목과 고르지 않은 항목을 하나씩 봐요.
    expect(look(0)).toEqual(look(3));
    expect(look(1)).toEqual(look(4));
    // 비교가 헛돌지 않게 활성 모양과는 달라야 해요.
    expect(look(1)).not.toEqual(look(7));
  });

  it("defaultValue로 시작하고 onValueChange로 고른 값을 알려요", async () => {
    const onValueChange = vi.fn();
    await render(<Status defaultValue="all" onValueChange={onValueChange} />);

    await expect
      .element(page.getByRole("radio", { name: "전체" }))
      .toBeChecked();

    await page.getByRole("radio", { name: "완료" }).click();

    expect(onValueChange).toHaveBeenCalledWith("done");
  });

  it("form을 제출하면 name과 고른 value가 담겨요", async () => {
    await render(
      <form data-testid="form">
        <Status name="status" defaultValue="all" />
      </form>,
    );

    await page.getByRole("radio", { name: "진행 중" }).click();

    expect(new FormData(getForm()).getAll("status")).toEqual(["open"]);
  });

  it("숨은 input은 칩과 같은 자리에 겹쳐요", async () => {
    // 브라우저의 required 검증 말풍선이 이 input을 가리켜요. 줄 처음이 아닌 칩도 봐요.
    await render(
      <form>
        <Status name="status" required />
      </form>,
    );
    const radios = page.getByRole("radio").elements();
    const inputs = document.querySelectorAll('input[type="radio"]');

    expect(inputs).toHaveLength(3);
    radios.forEach((radio, index) => {
      const inputRect = inputs[index]?.getBoundingClientRect();
      const radioRect = radio.getBoundingClientRect();
      // Radix가 버튼 크기를 정수 px로 재서 input을 만들어요. 1px 안쪽 차이는 같은 자리로 봐요.
      for (const side of ["left", "top", "width", "height"] as const) {
        expect(
          Math.abs((inputRect?.[side] ?? Infinity) - radioRect[side]),
        ).toBeLessThan(1);
      }
    });
  });

  it("그룹의 variant·size가 모든 항목에 같은 모양으로 가요", async () => {
    // 같은 variant·size의 ChipToggle과 계산값이 같아야 해요.
    await render(
      <>
        <ChipRadioGroup
          label="상태"
          variant="outlineStrong"
          size="large"
          defaultValue="all"
        >
          <ChipRadioGroupItem value="all">전체</ChipRadioGroupItem>
          <ChipRadioGroupItem value="open">진행 중</ChipRadioGroupItem>
        </ChipRadioGroup>
        <ChipToggle variant="outlineStrong" size="large" defaultPressed>
          전체
        </ChipToggle>
        <ChipToggle variant="outlineStrong" size="large">
          진행 중
        </ChipToggle>
        <ChipToggle>기본 모양</ChipToggle>
      </>,
    );
    const radioLook = (name: string) =>
      readLook(page.getByRole("radio", { name }).element());
    const toggleLook = (name: string) =>
      readLook(page.getByRole("button", { name }).element());

    expect(radioLook("전체")).toEqual(toggleLook("전체"));
    expect(radioLook("진행 중")).toEqual(toggleLook("진행 중"));
    // 비교가 헛돌지 않게 기본 모양과는 달라야 해요.
    expect(radioLook("진행 중")).not.toEqual(toggleLook("기본 모양"));
  });

  it("선택 전후 너비가 같아요", async () => {
    await render(<Status variant="outlineWeak" />);
    const all = page.getByRole("radio", { name: "전체" });
    const before = all.element().getBoundingClientRect().width;

    await all.click();
    await expect.element(all).toBeChecked();

    expect(all.element().getBoundingClientRect().width).toBe(before);
  });

  it("className은 바깥에 가고 ref·aria 속성은 radio 버튼에 가요(그룹은 Field root, 항목은 칸)", async () => {
    const ref = createRef<HTMLButtonElement>();
    await render(
      <ChipRadioGroup label="상태" className="group-custom">
        <ChipRadioGroupItem
          ref={ref}
          value="all"
          id="status-all"
          aria-describedby="hint"
          className="item-custom"
        >
          전체
        </ChipRadioGroupItem>
      </ChipRadioGroup>,
    );
    const group = page.getByRole("radiogroup").element();
    const radio = page.getByRole("radio");
    const slot = radio.element().parentElement;

    // Field root가 radiogroup을 바로 감싸요.
    const fieldRoot = group.parentElement;
    expect(fieldRoot).toHaveClass("group-custom");
    expect(group).not.toHaveClass("group-custom");
    expect(slot).toHaveClass("item-custom");
    expect(radio.element()).not.toHaveClass("item-custom");
    // 우리 클래스 이름은 해시라서 개수로만 확인해요.
    expect(fieldRoot?.classList.length).toBeGreaterThan(1);
    expect(slot?.classList.length).toBeGreaterThan(1);

    await expect.element(radio).toHaveAttribute("id", "status-all");
    await expect.element(radio).toHaveAttribute("aria-describedby", "hint");
    expect(ref.current).toBe(radio.element());
  });
});
