import type { Meta, StoryObj } from "@storybook/react-vite";

import { ChipToggle } from "./Chip";
import { ChipToggleGroup } from "./ChipToggleGroup";

const items = (
  <>
    <ChipToggle defaultPressed>무료 배송</ChipToggle>
    <ChipToggle>오늘 출발</ChipToggle>
    <ChipToggle>새벽 도착</ChipToggle>
  </>
);

const meta = {
  title: "Components/Chip/ChipToggleGroup",
  component: ChipToggleGroup,
  subcomponents: { ChipToggle },
  tags: ["autodocs"],
  args: { label: "배송", children: items },
  argTypes: {
    label: { control: "text" },
    description: { control: "text" },
    errorMessage: { control: "text" },
    headerAction: { control: false },
    children: { control: false },
  },
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/5e7PW74E0sWvXqhHC1fpqz/d5ng?node-id=261-239069",
    },
  },
} satisfies Meta<typeof ChipToggleGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 가장 흔한 쓰임이에요. 제목이 묶음의 이름이 되고, 칩마다 따로 켜고 꺼요. */
export const Default: Story = {};

/** 묶음 전체를 지금은 바꿀 수 없어요. 켠 칩은 그대로 보여요. */
export const Disabled: Story = {
  args: { disabled: true, description: "불러오는 동안은 바꿀 수 없어요." },
  parameters: {
    // 비활성 색은 대비 기준(WCAG 1.4.3)에서 빠지는 게 맞아서 대비 검사를 꺼요.
    a11y: { config: { rules: [{ id: "color-contrast", enabled: false }] } },
  },
};

/** 켠 칩이 조건에 맞지 않을 때예요. 칩 색은 그대로이고 오류 문구가 알려요. */
export const Invalid: Story = {
  args: {
    invalid: true,
    description: "하나 이상 켜 주세요.",
    errorMessage: "배송 조건을 하나 이상 켜 주세요.",
    children: (
      <>
        <ChipToggle>무료 배송</ChipToggle>
        <ChipToggle>오늘 출발</ChipToggle>
        <ChipToggle>새벽 도착</ChipToggle>
      </>
    ),
  },
};
