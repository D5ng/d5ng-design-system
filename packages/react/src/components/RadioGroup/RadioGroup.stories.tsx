import type { Meta, StoryObj } from "@storybook/react-vite";

import { RadioGroup, RadioGroupItem } from "./RadioGroup";

const items = (
  <>
    <RadioGroupItem value="email" label="이메일" />
    <RadioGroupItem value="sms" label="문자" />
    <RadioGroupItem value="push" label="앱 알림" />
  </>
);

const meta = {
  title: "Components/RadioGroup",
  component: RadioGroup,
  subcomponents: { RadioGroupItem },
  tags: ["autodocs"],
  args: { label: "받는 방법", defaultValue: "email", children: items },
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
      url: "https://www.figma.com/design/5e7PW74E0sWvXqhHC1fpqz/d5ng?node-id=226-104196",
    },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

const stackStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 24,
} as const;

/** 가장 흔한 쓰임이에요. 제목이 그룹의 이름이 되고, 행 여백까지 눌러져요. */
export const Default: Story = {};

/** 마크와 라벨이 함께 커져요. 한 그룹의 항목은 모두 같은 크기예요. */
export const Size: Story = {
  render: (args) => (
    <div style={stackStyle}>
      <RadioGroup {...args} size="medium" />
      <RadioGroup {...args} size="large" />
    </div>
  ),
};

/** neutral이 기본이고, 브랜드로 강조할 때만 brand를 써요. */
export const Tone: Story = {
  render: (args) => (
    <div style={stackStyle}>
      <RadioGroup {...args} tone="neutral" />
      <RadioGroup {...args} tone="brand" />
    </div>
  ),
};

/** 항목 라벨은 regular가 기본이고, 강조가 필요할 때만 semibold를 써요. */
export const LabelWeight: Story = {
  args: {
    children: (
      <>
        <RadioGroupItem value="email" label="이메일" labelWeight="regular" />
        <RadioGroupItem value="sms" label="문자" labelWeight="semibold" />
      </>
    ),
  },
};

/** 그룹 전체를 지금은 고를 수 없어요. 고른 항목은 그대로 보여요. */
export const Disabled: Story = {
  args: { disabled: true, description: "가입한 뒤에 바꿀 수 있어요." },
  parameters: {
    // 비활성 색은 대비 기준(WCAG 1.4.3)에서 빠지는 게 맞아서 대비 검사를 꺼요.
    a11y: { config: { rules: [{ id: "color-contrast", enabled: false }] } },
  },
};

/** 몇 항목만 고를 수 없을 때예요. 방향키 이동에서도 빠져요. */
export const DisabledItem: Story = {
  args: {
    defaultValue: "sms",
    children: (
      <>
        <RadioGroupItem value="email" label="이메일" />
        <RadioGroupItem value="sms" label="문자" disabled />
        <RadioGroupItem value="push" label="앱 알림(준비 중)" disabled />
      </>
    ),
  },
  parameters: {
    // 비활성 색은 대비 기준(WCAG 1.4.3)에서 빠지는 게 맞아서 대비 검사를 꺼요.
    a11y: { config: { rules: [{ id: "color-contrast", enabled: false }] } },
  },
};

/** 고르지 않았거나 고를 수 없는 값일 때예요. 마크 색은 그대로이고 오류 문구가 알려요. */
export const Invalid: Story = {
  args: {
    defaultValue: undefined,
    invalid: true,
    description: "하나를 골라 주세요.",
    errorMessage: "받는 방법을 골라 주세요.",
  },
};

/** 라벨이 길면 줄바꿈되고, 마크는 첫 줄 가운데에 맞춰요. */
export const LongLabel: Story = {
  args: {
    children: (
      <>
        <RadioGroupItem
          value="email"
          label="이메일로 받아요. 주문 내역과 배송 소식을 한 번에 모아서 보내 드려요."
        />
        <RadioGroupItem value="sms" label="문자" />
      </>
    ),
  },
  decorators: [
    (Story) => (
      // 좁은 폭에서 줄바꿈을 봐요.
      <div style={{ maxWidth: 240 }}>
        <Story />
      </div>
    ),
  ],
};
