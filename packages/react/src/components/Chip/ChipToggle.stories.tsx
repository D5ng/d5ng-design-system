import type { Meta, StoryObj } from "@storybook/react-vite";
import { Truck } from "lucide-react";

import { ChipToggle } from "./Chip";

const variants = ["solid", "outlineStrong", "outlineWeak"] as const;
const sizes = ["small", "medium", "large"] as const;

const meta = {
  title: "Components/Chip/ChipToggle",
  component: ChipToggle,
  tags: ["autodocs"],
  args: { children: "무료 배송" },
  argTypes: {
    children: { control: "text" },
    variant: { control: "inline-radio", options: variants },
    size: { control: "inline-radio", options: sizes },
    pressed: { control: "boolean" },
    defaultPressed: { control: "boolean" },
    disabled: { control: "boolean" },
    prefixIcon: { control: false },
  },
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/5e7PW74E0sWvXqhHC1fpqz/d5ng?node-id=261-237559",
    },
  },
} satisfies Meta<typeof ChipToggle>;

export default meta;

type Story = StoryObj<typeof meta>;

const rowStyle = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: 8,
} as const;

/** 가장 흔한 쓰임이에요. 누를 때마다 선택과 해제가 바뀌어요. */
export const Default: Story = {};

/** 선택하면 끝에 체크가 보여요. 너비는 그대로예요. */
export const Pressed: Story = {
  render: (args) => (
    <div style={rowStyle}>
      <ChipToggle {...args} />
      <ChipToggle {...args} defaultPressed />
    </div>
  ),
};

/** 선택하면 solid는 배경이 채워지고, outline은 테두리가 굵어져요. */
export const Variant: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 8 }}>
      {variants.map((variant) => (
        <div key={variant} style={rowStyle}>
          <ChipToggle {...args} variant={variant} />
          <ChipToggle {...args} variant={variant} defaultPressed />
        </div>
      ))}
    </div>
  ),
};

/** 겉면만 작아져요. 누르는 영역은 small도 44×44px 이상이에요. */
export const Size: Story = {
  args: { defaultPressed: true },
  render: (args) => (
    <div style={rowStyle}>
      {sizes.map((size) => (
        <ChipToggle key={size} {...args} size={size} />
      ))}
    </div>
  ),
};

/** 아이콘은 글자를 돕기만 해요. 칩 이름은 글자로만 읽혀요. */
export const PrefixIcon: Story = {
  args: { prefixIcon: <Truck />, defaultPressed: true },
};

/** 지금은 바꿀 수 없어요. 선택 상태는 그대로 보여요. */
export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <div style={{ display: "grid", gap: 8 }}>
      {variants.map((variant) => (
        <div key={variant} style={rowStyle}>
          <ChipToggle {...args} variant={variant} />
          <ChipToggle {...args} variant={variant} defaultPressed />
        </div>
      ))}
    </div>
  ),
  parameters: {
    // 비활성 색은 대비 기준(WCAG 1.4.3)에서 빠지는 게 맞아서 대비 검사를 꺼요.
    a11y: { config: { rules: [{ id: "color-contrast", enabled: false }] } },
  },
};
