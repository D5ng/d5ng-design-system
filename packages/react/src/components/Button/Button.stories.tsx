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

const variants = ["primary", "secondary", "ghost", "critical"] as const;

const sizes = ["xsmall", "small", "medium", "large"] as const;

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  args: { children: "변경 사항 저장" },
  argTypes: {
    children: { control: "text" },
    variant: { control: "inline-radio", options: variants },
    size: { control: "inline-radio", options: sizes },
    fullWidth: { control: "boolean" },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
    prefixIcon: { control: false },
    suffixIcon: { control: false },
  },
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/5e7PW74E0sWvXqhHC1fpqz/d5ng?node-id=136-3734",
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 가장 흔한 쓰임이에요. 기본은 primary · medium이에요. */
export const Default: Story = {};

/** 주요 동작 하나는 primary, 함께 놓는 보조 동작은 secondary·ghost로 해요. */
export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
      {variants.map((variant) => (
        <Button key={variant} {...args} variant={variant} />
      ))}
    </div>
  ),
};

/** 주변 요소의 높이에 맞춰 골라요. */
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      {sizes.map((size) => (
        <Button key={size} {...args} size={size} />
      ))}
    </div>
  ),
};

/** 아이콘은 문구를 돕기만 해요. 버튼 이름은 문구로만 읽혀요. */
export const WithIcon: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12 }}>
      <Button {...args} prefixIcon={<PlusIcon />} />
      <Button {...args} suffixIcon={<ArrowIcon />} />
      <Button {...args} prefixIcon={<PlusIcon />} suffixIcon={<ArrowIcon />} />
    </div>
  ),
};

/** 화면 아래 주요 동작처럼 너비를 꽉 채울 때 써요. */
export const FullWidth: Story = {
  args: { fullWidth: true },
  parameters: { layout: "padded" },
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
        <Button key={variant} {...args} variant={variant} />
      ))}
    </div>
  ),
};

/** 요청을 처리하는 동안 다시 누르지 못하게 해요. 너비는 그대로예요. */
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

/** 다른 화면으로 옮기기만 할 때 써요. 링크로 읽히고 모양만 버튼이에요. */
export const AsLink: Story = {
  render: (args) => (
    <Button {...args} asChild>
      <a href="#next">다음 단계로</a>
    </Button>
  ),
};
