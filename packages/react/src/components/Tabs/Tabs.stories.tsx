import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Button } from "../Button";
import {
  Tabs,
  TabsContent,
  TabsList,
  type TabsListProps,
  TabsTrigger,
} from ".";

const order = [
  { value: "overview", label: "개요", content: "주문 번호와 결제 금액이에요." },
  {
    value: "delivery",
    label: "배송",
    content: "배송 상태와 도착 예정일이에요.",
  },
  { value: "refund", label: "환불", content: "환불 요청과 진행 상황이에요." },
];

const menu = [
  "전체",
  "주문 내역",
  "배송 조회",
  "교환 신청",
  "반품 신청",
  "환불 내역",
  "1:1 문의",
];

type OrderPartsProps = Pick<TabsListProps, "size" | "layout"> & {
  disabledValue?: string;
};

// 스토리마다 Tabs props만 바꾸고 목록과 패널은 같이 써요.
function OrderParts({ disabledValue, ...listProps }: OrderPartsProps) {
  return (
    <>
      <TabsList aria-label="주문 정보" {...listProps}>
        {order.map(({ value, label }) => (
          <TabsTrigger
            key={value}
            value={value}
            disabled={value === disabledValue}
          >
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
      {order.map(({ value, content }) => (
        <TabsContent key={value} value={value} style={{ paddingTop: 16 }}>
          {content}
        </TabsContent>
      ))}
    </>
  );
}

const meta = {
  title: "Components/Tabs",
  component: Tabs,
  subcomponents: { TabsList, TabsTrigger, TabsContent },
  tags: ["autodocs"],
  args: { defaultValue: "overview" },
  argTypes: {
    value: { control: false },
    defaultValue: { control: "text" },
    activationMode: {
      control: "inline-radio",
      options: ["automatic", "manual"],
    },
    children: { control: false },
  },
  render: (args) => (
    <Tabs {...args}>
      <OrderParts />
    </Tabs>
  ),
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/5e7PW74E0sWvXqhHC1fpqz/d5ng?node-id=250-222767",
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

const stackStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 32,
} as const;

/** 같은 화면의 내용을 몇 갈래로 나눌 때 써요. 선택한 탭 아래로 선택선이 미끄러져요. */
export const Default: Story = {};

/** `medium`이 기본이고, 좁은 영역이나 보조 탐색에만 `small`을 써요. 터치에서는 `small`도 44px 높이예요. */
export const Size: Story = {
  render: (args) => (
    <div style={stackStyle}>
      <Tabs {...args}>
        <OrderParts size="medium" />
      </Tabs>
      <Tabs {...args}>
        <OrderParts size="small" />
      </Tabs>
    </div>
  ),
};

/** 탭이 적고 라벨이 짧으면 `fill`, 많거나 라벨 길이가 제각각이면 `hug`예요. `hug`는 고른 탭이 보이게 가로로 스크롤해요. */
export const Layout: Story = {
  render: (args) => (
    <div style={stackStyle}>
      <Tabs {...args}>
        <OrderParts layout="fill" />
      </Tabs>
      <div style={{ maxWidth: 320 }}>
        <Tabs defaultValue="1:1 문의">
          <TabsList aria-label="주문 메뉴" layout="hug">
            {menu.map((label) => (
              <TabsTrigger key={label} value={label}>
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  ),
};

/** 패널을 그리는 데 시간이 걸리면 `manual`로 둬요. 방향키는 포커스만 옮기고 Enter·Space로 골라요. */
export const ActivationMode: Story = {
  args: { activationMode: "manual" },
};

/** 지금 고를 수 없는 탭이에요. 방향키 이동에서도 빠져요. */
export const Disabled: Story = {
  render: (args) => (
    <Tabs {...args}>
      <OrderParts disabledValue="refund" />
    </Tabs>
  ),
  parameters: {
    // 비활성 색은 대비 기준(WCAG 1.4.3)에서 빠지는 게 맞아서 대비 검사를 꺼요.
    a11y: { config: { rules: [{ id: "color-contrast", enabled: false }] } },
  },
};

function ControlledExample() {
  const [value, setValue] = useState("overview");

  return (
    <div style={stackStyle}>
      <Button
        variant="secondary"
        size="small"
        style={{ alignSelf: "flex-start" }}
        onClick={() => {
          setValue("delivery");
        }}
      >
        배송 탭으로 이동
      </Button>
      <Tabs value={value} onValueChange={setValue}>
        <OrderParts />
      </Tabs>
    </div>
  );
}

/** 선택을 URL이나 다른 상태와 맞춰야 할 때 `value`와 `onValueChange`를 같이 써요. */
export const Controlled: Story = {
  render: () => <ControlledExample />,
};
