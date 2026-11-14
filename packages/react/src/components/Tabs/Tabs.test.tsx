import { createRef } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";

import { Tabs, TabsContent, type TabsProps, TabsTrigger } from "./Tabs";
import { TabsList } from "./TabsList";

// 탭 셋과 패널 셋이에요. 테스트마다 Tabs props만 바꿔요.
function OrderTabs(tabsProps: TabsProps) {
  return (
    <Tabs {...tabsProps}>
      <TabsList aria-label="주문 정보">
        <TabsTrigger value="overview">개요</TabsTrigger>
        <TabsTrigger value="delivery">배송</TabsTrigger>
        <TabsTrigger value="refund">환불</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">주문 개요예요.</TabsContent>
      <TabsContent value="delivery">배송 정보예요.</TabsContent>
      <TabsContent value="refund">환불 정보예요.</TabsContent>
    </Tabs>
  );
}

const MENU = [
  "전체",
  "주문 내역",
  "배송 조회",
  "교환 신청",
  "반품 신청",
  "환불 내역",
  "1:1 문의",
];

// 좁은 폭에 hug 탭 일곱 개라 목록이 가로로 넘쳐요.
function MenuTabs(tabsProps: TabsProps) {
  return (
    <div style={{ width: 240 }}>
      <Tabs {...tabsProps}>
        <TabsList aria-label="주문 메뉴" layout="hug">
          {MENU.map((label) => (
            <TabsTrigger key={label} value={label}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}

// 라벨만 바꿔 그려서 탭 너비가 달라지게 해요.
function LabelTabs({ label }: { label: string }) {
  return (
    <Tabs defaultValue="delivery">
      <TabsList aria-label="주문 정보" layout="hug">
        <TabsTrigger value="delivery">{label}</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

const getList = () => {
  const list = page.getByRole("tablist").element();
  if (!(list instanceof HTMLElement)) {
    throw new Error("탭 목록을 찾지 못했어요.");
  }
  return list;
};

const getIndicator = () => {
  const indicator = getList().querySelector(":scope > span[aria-hidden]");
  if (!(indicator instanceof HTMLElement)) {
    throw new Error("선택선을 찾지 못했어요.");
  }
  return indicator;
};

const getTabBox = (name: string) =>
  page.getByRole("tab", { name }).element().getBoundingClientRect();

describe("Tabs", () => {
  it("고른 탭의 패널만 보이고 나머지 패널은 내용 없이 숨어요", async () => {
    await render(<OrderTabs defaultValue="delivery" />);

    // 숨은 패널은 역할 검색에서 빠져서 하나만 잡혀요.
    await expect
      .element(page.getByRole("tabpanel"))
      .toHaveTextContent("배송 정보예요.");
    const hiddenPanels = document.querySelectorAll(
      "[role='tabpanel'][data-state='inactive']",
    );
    expect(hiddenPanels).toHaveLength(2);
    for (const panel of hiddenPanels) {
      expect(panel).toHaveAttribute("hidden");
      expect(panel).toBeEmptyDOMElement();
    }
  });

  it("탭을 누르면 그 탭이 선택되고 onValueChange가 그 value로 불려요", async () => {
    const onValueChange = vi.fn();
    await render(
      <OrderTabs defaultValue="overview" onValueChange={onValueChange} />,
    );
    const delivery = page.getByRole("tab", { name: "배송" });

    await delivery.click();

    await expect.element(delivery).toHaveAttribute("aria-selected", "true");
    await expect
      .element(page.getByRole("tabpanel"))
      .toHaveTextContent("배송 정보예요.");
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith("delivery");
  });

  it("방향키로 포커스를 옮기면 그 탭이 바로 선택돼요", async () => {
    await render(<OrderTabs defaultValue="overview" />);
    const delivery = page.getByRole("tab", { name: "배송" });

    await userEvent.tab();
    await userEvent.keyboard("{ArrowRight}");

    await expect.element(delivery).toHaveFocus();
    await expect.element(delivery).toHaveAttribute("aria-selected", "true");
  });

  it('activationMode="manual"이면 방향키는 포커스만 옮기고 Enter·Space로 선택해요', async () => {
    await render(<OrderTabs defaultValue="overview" activationMode="manual" />);
    const overview = page.getByRole("tab", { name: "개요" });
    const delivery = page.getByRole("tab", { name: "배송" });
    const refund = page.getByRole("tab", { name: "환불" });

    await userEvent.tab();
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(delivery).toHaveFocus();
    await expect.element(delivery).toHaveAttribute("aria-selected", "false");
    await expect.element(overview).toHaveAttribute("aria-selected", "true");

    await userEvent.keyboard("{Enter}");
    await expect.element(delivery).toHaveAttribute("aria-selected", "true");

    await userEvent.keyboard("{ArrowRight}");
    await expect.element(refund).toHaveFocus();
    await userEvent.keyboard(" ");
    await expect.element(refund).toHaveAttribute("aria-selected", "true");
  });

  it("방향키는 끝에서 처음으로 돌고, Home·End는 처음·마지막 사용 가능한 탭으로 가요", async () => {
    await render(
      <Tabs defaultValue="overview">
        <TabsList aria-label="주문 정보">
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="delivery">배송</TabsTrigger>
          <TabsTrigger value="refund">환불</TabsTrigger>
          <TabsTrigger value="review" disabled>
            후기
          </TabsTrigger>
        </TabsList>
      </Tabs>,
    );
    const overview = page.getByRole("tab", { name: "개요" });
    const refund = page.getByRole("tab", { name: "환불" });

    await userEvent.tab();
    await userEvent.keyboard("{ArrowLeft}");
    await expect.element(refund).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(overview).toHaveFocus();

    await userEvent.keyboard("{End}");
    await expect.element(refund).toHaveFocus();
    await userEvent.keyboard("{Home}");
    await expect.element(overview).toHaveFocus();
  });

  it("비활성 탭은 눌러도 선택되지 않고 방향키 이동에서 빠져요", async () => {
    await render(
      <Tabs defaultValue="overview">
        <TabsList aria-label="주문 정보">
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="delivery" disabled>
            배송
          </TabsTrigger>
          <TabsTrigger value="refund">환불</TabsTrigger>
        </TabsList>
      </Tabs>,
    );
    const delivery = page.getByRole("tab", { name: "배송" });
    const refund = page.getByRole("tab", { name: "환불" });

    await userEvent.tab();
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(refund).toHaveFocus();
    await expect.element(refund).toHaveAttribute("aria-selected", "true");

    // Playwright는 disabled 버튼을 못 누른다고 보고 기다려서, 검사를 건너뛰고 눌러요.
    await delivery.click({ force: true });
    await expect.element(delivery).toHaveAttribute("aria-selected", "false");
    await expect.element(refund).toHaveAttribute("aria-selected", "true");
  });

  it("Tab 키로 목록에 들어오면 선택된 탭에 포커스가 가고, 한 번 더 누르면 패널로 가요", async () => {
    await render(<OrderTabs defaultValue="delivery" />);

    await userEvent.tab();
    await expect.element(page.getByRole("tab", { name: "배송" })).toHaveFocus();

    await userEvent.tab();
    await expect.element(page.getByRole("tabpanel")).toHaveFocus();
  });

  it("탭은 aria-selected·aria-controls로, 패널은 aria-labelledby로 서로 이어져요", async () => {
    await render(<OrderTabs defaultValue="overview" />);
    const overview = page.getByRole("tab", { name: "개요" }).element();
    const panel = page.getByRole("tabpanel").element();

    expect(overview).toHaveAttribute("aria-selected", "true");
    expect(overview).toHaveAttribute("aria-controls", panel.id);
    expect(panel).toHaveAttribute("aria-labelledby", overview.id);
    await expect
      .element(page.getByRole("tab", { name: "배송" }))
      .toHaveAttribute("aria-selected", "false");
    await expect
      .element(page.getByRole("tabpanel", { name: "개요" }))
      .toBeInTheDocument();
  });

  it("목록은 aria-label이나 aria-labelledby로 이름을 받아요. 둘 다 없으면 타입 에러예요", async () => {
    await render(
      <>
        <h2 id="order-title">주문</h2>
        <Tabs defaultValue="overview">
          <TabsList aria-labelledby="order-title">
            <TabsTrigger value="overview">개요</TabsTrigger>
          </TabsList>
        </Tabs>
        <Tabs defaultValue="overview">
          <TabsList aria-label="배송 정보">
            <TabsTrigger value="overview">개요</TabsTrigger>
          </TabsList>
        </Tabs>
        <Tabs defaultValue="overview">
          {/* @ts-expect-error 이름이 없으면 스크린리더가 무슨 탭 묶음인지 읽지 못해요. */}
          <TabsList>
            <TabsTrigger value="overview">개요</TabsTrigger>
          </TabsList>
        </Tabs>
      </>,
    );

    await expect
      .element(page.getByRole("tablist", { name: "주문" }))
      .toBeInTheDocument();
    await expect
      .element(page.getByRole("tablist", { name: "배송 정보" }))
      .toBeInTheDocument();
    // 타입 검사를 건너뛰면 이름 없는 목록이 그려져요.
    await expect
      .element(page.getByRole("tablist").nth(2))
      .not.toHaveAccessibleName();
  });

  it("value도 defaultValue도 없으면 타입 에러예요", async () => {
    await render(
      // @ts-expect-error 고른 탭이 없으면 아무 패널도 보이지 않아요.
      <Tabs>
        <TabsList aria-label="주문 정보">
          <TabsTrigger value="overview">개요</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">주문 개요예요.</TabsContent>
      </Tabs>,
    );

    // 타입 검사를 건너뛰면 Radix가 빈 값으로 시작해서 아무 탭도 고르지 않아요.
    await expect
      .element(page.getByRole("tab"))
      .toHaveAttribute("aria-selected", "false");
    expect(page.getByRole("tabpanel").elements()).toHaveLength(0);
  });

  it('layout="fill"이면 탭이 목록 너비를 똑같이 나눠요', async () => {
    await render(
      <div style={{ width: 600 }}>
        <OrderTabs defaultValue="overview" />
      </div>,
    );

    for (const tab of page.getByRole("tab").elements()) {
      expect(tab.getBoundingClientRect().width).toBeCloseTo(200, 0);
    }
  });

  it('layout="hug"에서 선택한 탭이 목록 밖에 있으면 처음 그릴 때 보이게 가로로만 스크롤돼요', async () => {
    // 목록이 화면 아래에 있어도 페이지는 그대로인지 봐요.
    await render(
      <>
        <div style={{ height: 3000 }} />
        <MenuTabs defaultValue="1:1 문의" />
      </>,
    );
    const list = getList();
    const listBox = list.getBoundingClientRect();
    const tabBox = getTabBox("1:1 문의");

    expect(window.scrollY).toBe(0);
    expect(list.scrollLeft).toBeGreaterThan(0);
    expect(tabBox.left).toBeGreaterThanOrEqual(listBox.left);
    expect(tabBox.right).toBeLessThanOrEqual(listBox.right + 0.5);
  });

  it("바깥에서 value를 바꿔도 스크롤이 선택한 탭을 따라가요", async () => {
    const { rerender } = await render(<MenuTabs value="1:1 문의" />);
    const list = getList();
    expect(list.scrollLeft).toBeGreaterThan(0);

    await rerender(<MenuTabs value="전체" />);

    await expect.poll(() => list.scrollLeft).toBe(0);
  });

  it("선택선이 선택한 탭의 위치·너비로 옮겨가요", async () => {
    await render(<OrderTabs defaultValue="overview" />);
    const indicator = getIndicator();
    expect(indicator).toBeVisible();

    await page.getByRole("tab", { name: "환불" }).click();

    // 전환이 끝날 때까지 기다려요.
    await expect
      .poll(() => indicator.getBoundingClientRect().left)
      .toBeCloseTo(getTabBox("환불").left, 0);
    expect(indicator.getBoundingClientRect().width).toBeCloseTo(
      getTabBox("환불").width,
      0,
    );
  });

  it("라벨이 바뀌어 탭 너비가 달라지면 선택선도 따라가요", async () => {
    const { rerender } = await render(<LabelTabs label="배송" />);
    const indicator = getIndicator();
    const before = indicator.getBoundingClientRect().width;

    await rerender(<LabelTabs label="배송 조회와 반품 신청" />);

    const tab = page.getByRole("tab").element();
    await expect
      .poll(() => indicator.getBoundingClientRect().width)
      .toBeCloseTo(tab.getBoundingClientRect().width, 0);
    expect(indicator.getBoundingClientRect().width).toBeGreaterThan(before);
  });

  it("하이드레이션 전에는 선택한 탭이 CSS로 밑줄을 그려요", () => {
    // 서버가 보낸 HTML만 붙이고 React를 연결하지 않아서 선택선을 재지 않아요.
    const host = document.createElement("div");
    host.innerHTML = renderToString(<OrderTabs defaultValue="delivery" />);
    document.body.append(host);

    const active = host.querySelector("[role='tab'][data-state='active']");
    const inactive = host.querySelector("[role='tab'][data-state='inactive']");
    if (!active || !inactive) {
      throw new Error("탭을 찾지 못했어요.");
    }
    expect(host.querySelector("span[aria-hidden]")).toHaveAttribute("hidden");
    expect(getComputedStyle(active).boxShadow).not.toBe("none");
    expect(getComputedStyle(inactive).boxShadow).toBe("none");

    host.remove();
  });

  it("className·ref는 부품마다 정한 요소에 가요", async () => {
    const rootRef = createRef<HTMLDivElement>();
    const listRef = createRef<HTMLDivElement>();
    const triggerRef = createRef<HTMLButtonElement>();
    const contentRef = createRef<HTMLDivElement>();
    await render(
      <Tabs ref={rootRef} className="root-custom" defaultValue="overview">
        <TabsList ref={listRef} className="list-custom" aria-label="주문 정보">
          <TabsTrigger
            ref={triggerRef}
            className="trigger-custom"
            value="overview"
          >
            개요
          </TabsTrigger>
        </TabsList>
        <TabsContent
          ref={contentRef}
          className="content-custom"
          value="overview"
        >
          주문 개요예요.
        </TabsContent>
      </Tabs>,
    );
    const list = page.getByRole("tablist").element();
    const trigger = page.getByRole("tab").element();
    const content = page.getByRole("tabpanel").element();

    expect(rootRef.current).toBe(list.parentElement);
    expect(rootRef.current).toHaveClass("root-custom");
    expect(listRef.current).toBe(list);
    expect(triggerRef.current).toBe(trigger);
    expect(contentRef.current).toBe(content);
    expect(list).toHaveClass("list-custom");
    expect(trigger).toHaveClass("trigger-custom");
    expect(content).toHaveClass("content-custom");
    // 우리 클래스 이름은 해시라서 개수로만 확인해요.
    expect(list.classList.length).toBeGreaterThan(1);
    expect(trigger.classList.length).toBeGreaterThan(1);
    expect(content.classList.length).toBeGreaterThan(1);
  });
});
