import type { Meta, StoryObj } from "@storybook/react-vite";
import { Search } from "lucide-react";

import { ChipButton } from "./Chip";

const variants = ["solid", "outlineStrong", "outlineWeak"] as const;
const sizes = ["small", "medium", "large"] as const;

const meta = {
  title: "Components/Chip/ChipButton",
  component: ChipButton,
  tags: ["autodocs"],
  args: { children: "인기 검색어" },
  argTypes: {
    children: { control: "text" },
    variant: { control: "inline-radio", options: variants },
    size: { control: "inline-radio", options: sizes },
    disabled: { control: "boolean" },
    prefixIcon: { control: false },
  },
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/5e7PW74E0sWvXqhHC1fpqz/d5ng?node-id=261-237559",
    },
  },
} satisfies Meta<typeof ChipButton>;

export default meta;

type Story = StoryObj<typeof meta>;

const rowStyle = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: 8,
} as const;

/** 가장 흔한 쓰임이에요. 기본은 outlineWeak · medium이에요. */
export const Default: Story = {};

/** 배경으로 구분하면 solid, 테두리로 구분하면 outline을 써요. */
export const Variant: Story = {
  render: (args) => (
    <div style={rowStyle}>
      {variants.map((variant) => (
        <ChipButton key={variant} {...args} variant={variant} />
      ))}
    </div>
  ),
};

/** 겉면만 작아져요. 누르는 영역은 small도 44×44px 이상이에요. */
export const Size: Story = {
  render: (args) => (
    <div style={rowStyle}>
      {sizes.map((size) => (
        <ChipButton key={size} {...args} size={size} />
      ))}
    </div>
  ),
};

/** 아이콘은 글자를 돕기만 해요. 칩 이름은 글자로만 읽혀요. */
export const PrefixIcon: Story = {
  args: { prefixIcon: <Search /> },
};

/** 지금은 할 수 없는 동작이에요. */
export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <div style={rowStyle}>
      {variants.map((variant) => (
        <ChipButton key={variant} {...args} variant={variant} />
      ))}
    </div>
  ),
  parameters: {
    // 비활성 색은 대비 기준(WCAG 1.4.3)에서 빠지는 게 맞아서 대비 검사를 꺼요.
    a11y: { config: { rules: [{ id: "color-contrast", enabled: false }] } },
  },
};

/** 글자가 길면 칩 안에서 줄바꿈돼요. 부모보다 넓어지지 않아요. */
export const LongLabel: Story = {
  args: { children: "지금 가장 많이 찾는 겨울 캠핑 장비와 난로 추천" },
  decorators: [
    (Story) => (
      // 좁은 폭에서 줄바꿈을 봐요.
      <div style={{ maxWidth: 200 }}>
        <Story />
      </div>
    ),
  ],
};
