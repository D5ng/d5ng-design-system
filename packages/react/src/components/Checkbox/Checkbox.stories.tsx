import type { Meta, StoryObj } from "@storybook/react-vite";

import { Checkbox } from "./Checkbox";

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  args: { label: "알림 받기" },
  argTypes: {
    label: { control: "text" },
    checked: {
      control: "inline-radio",
      options: [false, true, "indeterminate"],
    },
    defaultChecked: {
      control: "inline-radio",
      options: [false, true, "indeterminate"],
    },
  },
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/5e7PW74E0sWvXqhHC1fpqz/d5ng?node-id=224-99746",
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

const stackStyle = {
  display: "flex",
  flexDirection: "column",
} as const;

/** 가장 흔한 쓰임이에요. 라벨과 줄 여백까지 눌러져요. */
export const Default: Story = {};

/** 라벨이 길면 줄바꿈되고, 상자는 첫 줄 가운데에 맞춰요. */
export const Label: Story = {
  args: {
    label:
      "마케팅 정보 수신에 동의해요. 새 기능과 이벤트 소식을 이메일과 앱 알림으로 받아요.",
  },
  decorators: [
    (Story) => (
      // 좁은 폭에서 줄바꿈을 봐요.
      <div style={{ maxWidth: 280 }}>
        <Story />
      </div>
    ),
  ],
};

/** 라벨과 상자가 함께 커져요. */
export const Size: Story = {
  render: (args) => (
    <div style={stackStyle}>
      <Checkbox {...args} size="medium" />
      <Checkbox {...args} size="large" />
    </div>
  ),
};

/** 필수 선택은 테두리가 있는 square, 필수가 아닌 3개 이하의 가벼운 선택은 ghost를 써요. */
export const Variant: Story = {
  render: (args) => (
    <div style={stackStyle}>
      <Checkbox {...args} variant="square" />
      <Checkbox {...args} variant="square" defaultChecked />
      <Checkbox {...args} variant="ghost" />
      <Checkbox {...args} variant="ghost" defaultChecked />
    </div>
  ),
};

/** neutral이 기본이고, 브랜드로 강조할 때만 brand를 써요. */
export const Tone: Story = {
  args: { defaultChecked: true },
  render: (args) => (
    <div style={stackStyle}>
      <Checkbox {...args} tone="neutral" />
      <Checkbox {...args} tone="brand" />
      <Checkbox {...args} variant="ghost" tone="neutral" />
      <Checkbox {...args} variant="ghost" tone="brand" />
    </div>
  ),
};

/** regular가 기본이고, 강조가 필요할 때만 semibold를 써요. */
export const LabelWeight: Story = {
  render: (args) => (
    <div style={stackStyle}>
      <Checkbox {...args} labelWeight="regular" />
      <Checkbox {...args} labelWeight="semibold" />
    </div>
  ),
};

/** 선택과 일부 선택이에요. 일부 선택은 아래 항목 중 몇 개만 골랐을 때 써요. */
export const Checked: Story = {
  render: (args) => (
    <div style={stackStyle}>
      <Checkbox {...args} label="모두 동의" defaultChecked />
      <Checkbox {...args} label="일부 동의" defaultChecked="indeterminate" />
    </div>
  ),
};

/** 지금은 바꿀 수 없어요. 선택 상태는 그대로 보여요. */
export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <div style={stackStyle}>
      <Checkbox {...args} />
      <Checkbox {...args} defaultChecked />
      <Checkbox {...args} variant="ghost" defaultChecked />
    </div>
  ),
  parameters: {
    // 비활성 색은 대비 기준(WCAG 1.4.3)에서 빠지는 게 맞아서 대비 검사를 꺼요.
    a11y: { config: { rules: [{ id: "color-contrast", enabled: false }] } },
  },
};
