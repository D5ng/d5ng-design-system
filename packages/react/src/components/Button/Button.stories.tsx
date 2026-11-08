import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./Button";

// 아이콘 패키지를 정하기 전이라 견본 아이콘만 그려요.
function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none">
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none">
      <path
        d="M5 12h14m-6-6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const variants = [
  "brand-solid",
  "neutral-weak",
  "neutral-solid",
  "neutral-outline",
  "brand-outline",
  "ghost",
  "critical-solid",
] as const;

const sizes = ["xsmall", "small", "medium", "large"] as const;

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  args: { children: "변경 사항 저장" },
  argTypes: {
    variant: { control: "select", options: variants },
    size: { control: "inline-radio", options: sizes },
    width: { control: "inline-radio", options: ["hug", "fill"] },
    leadingIcon: { control: false },
    trailingIcon: { control: false },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
      {variants.map((variant) => (
        <Button key={variant} {...args} variant={variant} />
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      {sizes.map((size) => (
        <Button key={size} {...args} size={size} />
      ))}
    </div>
  ),
};

export const WithIcon: Story = {
  // 아이콘은 한쪽에만 둘 수 있어서 args를 통째로 넘기지 않아요.
  render: ({ variant, size, width, children }) => (
    <div style={{ display: "flex", gap: 12 }}>
      <Button {...{ variant, size, width }} leadingIcon={<PlusIcon />}>
        {children}
      </Button>
      <Button {...{ variant, size, width }} trailingIcon={<ArrowIcon />}>
        {children}
      </Button>
    </div>
  ),
};

export const Fill: Story = {
  args: { width: "fill" },
  parameters: { layout: "padded" },
};

// 비활성 색은 대비 기준(WCAG 1.4.3)에서 빠지는 게 맞아서 대비 검사를 꺼요.
export const Disabled: Story = {
  args: { disabled: true },
  parameters: {
    a11y: { config: { rules: [{ id: "color-contrast", enabled: false }] } },
  },
  render: (args) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
      {variants.map((variant) => (
        <Button key={variant} {...args} variant={variant} />
      ))}
    </div>
  ),
};

export const Loading: Story = {
  args: { loading: true },
  render: (args) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
      {variants.map((variant) => (
        <Button key={variant} {...args} variant={variant} />
      ))}
    </div>
  ),
};

export const AsLink: Story = {
  render: (args) => (
    <Button {...args} asChild>
      <a href="#next">다음 단계로</a>
    </Button>
  ),
};
