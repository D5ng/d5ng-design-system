import type { Meta, StoryObj } from "@storybook/react-vite";
import { House, Search } from "lucide-react";

import { IconButton } from "./IconButton";

const variants = [
  "primary",
  "neutral",
  "secondary",
  "ghost",
  "critical",
] as const;

const sizes = ["xsmall", "small", "medium", "large"] as const;

const meta = {
  title: "Components/IconButton",
  component: IconButton,
  tags: ["autodocs"],
  args: { "aria-label": "검색", children: <Search /> },
  argTypes: {
    "aria-label": { control: "text" },
    children: { control: false },
    variant: { control: "inline-radio", options: variants },
    size: { control: "inline-radio", options: sizes },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
  },
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/5e7PW74E0sWvXqhHC1fpqz/d5ng?node-id=136-5238",
    },
  },
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 가장 흔한 쓰임이에요. 기본은 primary · medium이에요. */
export const Default: Story = {};

/** 보조 동작에는 ghost·secondary를 먼저 봐요. */
export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
      {variants.map((variant) => (
        <IconButton key={variant} {...args} variant={variant} />
      ))}
    </div>
  ),
};

/** 함께 놓는 Button과 같은 size를 골라요. */
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      {sizes.map((size) => (
        <IconButton key={size} {...args} size={size} />
      ))}
    </div>
  ),
};

/** 지금은 할 수 없는 동작이에요. */
export const Disabled: Story = {
  args: { disabled: true },
  parameters: {
    // 비활성 색은 대비 기준(WCAG 1.4.3)에서 빠지는 게 맞아서 대비 검사를 꺼요.
    a11y: { config: { rules: [{ id: "color-contrast", enabled: false }] } },
  },
  render: (args) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
      {variants.map((variant) => (
        <IconButton key={variant} {...args} variant={variant} />
      ))}
    </div>
  ),
};

/** 요청을 처리하는 동안 다시 누르지 못하게 해요. 크기는 그대로예요. */
export const Loading: Story = {
  args: { loading: true },
  render: (args) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
      {variants.map((variant) => (
        <IconButton key={variant} {...args} variant={variant} />
      ))}
    </div>
  ),
};

/** 다른 화면으로 옮기기만 할 때 써요. 아이콘은 `<a>` 안에 넣어요. */
export const AsLink: Story = {
  args: { "aria-label": "홈으로", variant: "ghost" },
  render: (args) => (
    <IconButton {...args} asChild>
      <a href="#home">
        <House />
      </a>
    </IconButton>
  ),
};
