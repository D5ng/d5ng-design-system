import type { Meta, StoryObj } from "@storybook/react-vite";
import { CircleCheck, Clock, LayoutGrid } from "lucide-react";

import { ChipRadioGroup, ChipRadioGroupItem } from "./ChipRadioGroup";

const variants = ["solid", "outlineStrong", "outlineWeak"] as const;
const sizes = ["small", "medium", "large"] as const;

const items = (
  <>
    <ChipRadioGroupItem value="all">전체</ChipRadioGroupItem>
    <ChipRadioGroupItem value="open">진행 중</ChipRadioGroupItem>
    <ChipRadioGroupItem value="done">완료</ChipRadioGroupItem>
  </>
);

const meta = {
  title: "Components/Chip/ChipRadioGroup",
  component: ChipRadioGroup,
  subcomponents: { ChipRadioGroupItem },
  tags: ["autodocs"],
  args: { label: "상태", defaultValue: "all", children: items },
  argTypes: {
    label: { control: "text" },
    description: { control: "text" },
    errorMessage: { control: "text" },
    variant: { control: "inline-radio", options: variants },
    size: { control: "inline-radio", options: sizes },
    headerAction: { control: false },
    children: { control: false },
  },
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/5e7PW74E0sWvXqhHC1fpqz/d5ng?node-id=261-238229",
    },
  },
} satisfies Meta<typeof ChipRadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

const stackStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 24,
} as const;

/** 가장 흔한 쓰임이에요. 처음 고른 "전체"에서 시작하고, 방향키로 옮기면 바로 골라져요. */
export const Default: Story = {};

/** 그룹이 모든 칩의 모양을 정해요. 칩마다 다르게 두지 않아요. */
export const Variant: Story = {
  render: (args) => (
    <div style={stackStyle}>
      {variants.map((variant) => (
        <ChipRadioGroup
          key={variant}
          {...args}
          label={variant}
          variant={variant}
        />
      ))}
    </div>
  ),
};

/** 겉면만 작아져요. 누르는 영역은 small도 44×44px 이상이에요. */
export const Size: Story = {
  render: (args) => (
    <div style={stackStyle}>
      {sizes.map((size) => (
        <ChipRadioGroup key={size} {...args} label={size} size={size} />
      ))}
    </div>
  ),
};

/** 아이콘은 글자를 돕기만 해요. 칩 이름은 글자로만 읽혀요. */
export const PrefixIcon: Story = {
  args: {
    children: (
      <>
        <ChipRadioGroupItem value="all" prefixIcon={<LayoutGrid />}>
          전체
        </ChipRadioGroupItem>
        <ChipRadioGroupItem value="open" prefixIcon={<Clock />}>
          진행 중
        </ChipRadioGroupItem>
        <ChipRadioGroupItem value="done" prefixIcon={<CircleCheck />}>
          완료
        </ChipRadioGroupItem>
      </>
    ),
  },
};

/** 그룹 전체를 지금은 고를 수 없어요. 고른 칩은 그대로 보여요. */
export const Disabled: Story = {
  args: { disabled: true, description: "불러오는 동안은 바꿀 수 없어요." },
  parameters: {
    // 비활성 색은 대비 기준(WCAG 1.4.3)에서 빠지는 게 맞아서 대비 검사를 꺼요.
    a11y: { config: { rules: [{ id: "color-contrast", enabled: false }] } },
  },
};

/** 몇 칩만 고를 수 없을 때예요. 방향키 이동에서도 빠져요. */
export const DisabledItem: Story = {
  args: {
    children: (
      <>
        <ChipRadioGroupItem value="all">전체</ChipRadioGroupItem>
        <ChipRadioGroupItem value="open">진행 중</ChipRadioGroupItem>
        <ChipRadioGroupItem value="done" disabled>
          완료(0건)
        </ChipRadioGroupItem>
      </>
    ),
  },
  parameters: {
    // 비활성 색은 대비 기준(WCAG 1.4.3)에서 빠지는 게 맞아서 대비 검사를 꺼요.
    a11y: { config: { rules: [{ id: "color-contrast", enabled: false }] } },
  },
};

/** 고르지 않았거나 고를 수 없는 값일 때예요. 칩 색은 그대로이고 오류 문구가 알려요. */
export const Invalid: Story = {
  args: {
    defaultValue: undefined,
    invalid: true,
    description: "하나를 골라 주세요.",
    errorMessage: "상태를 골라 주세요.",
  },
};
