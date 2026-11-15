import type { Meta, StoryObj } from "@storybook/react-vite";

import { ActionableCallout } from "./ActionableCallout";

const tones = [
  "neutral",
  "informative",
  "positive",
  "warning",
  "critical",
] as const;

const meta = {
  title: "Components/ActionableCallout",
  component: ActionableCallout,
  tags: ["autodocs"],
  args: {
    title: "안내",
    children: "알림을 받으려면 알림 설정을 켜 주세요.",
  },
  argTypes: {
    title: { control: "text" },
    children: { control: "text" },
    tone: { control: "inline-radio", options: tones },
    prefixIcon: { control: false },
    hidePrefixIcon: { control: "boolean" },
    hideArrow: { control: "boolean" },
    asChild: { control: false },
  },
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/5e7PW74E0sWvXqhHC1fpqz/d5ng?node-id=287-251665",
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ActionableCallout>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 눌러서 자세한 내용으로 가는 안내예요. 안내 전체가 버튼 하나예요. */
export const Default: Story = {};

/** 안내의 성격에 맞춰 골라요. hover·pressed는 톤 배경 위에 같은 농도로 덮여요. */
export const Tone: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 12 }}>
      {tones.map((tone) => (
        <ActionableCallout key={tone} {...args} tone={tone} />
      ))}
    </div>
  ),
};

/** 다른 페이지로 갈 때 `<a>`나 라우터의 링크를 감싸요. */
export const AsChild: Story = {
  render: (args) => (
    <ActionableCallout {...args} asChild>
      <a href="#settings">알림을 받으려면 알림 설정을 켜 주세요.</a>
    </ActionableCallout>
  ),
};

/** 이동보다 그 자리에서 실행하는 동작이라 화살표가 어울리지 않을 때 빼요. */
export const HideArrow: Story = {
  args: { hideArrow: true },
};
