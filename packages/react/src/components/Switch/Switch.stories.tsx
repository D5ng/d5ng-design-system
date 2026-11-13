import type { Meta, StoryObj } from "@storybook/react-vite";

import { Switch } from "./Switch";

const sizes = ["16", "24", "32"] as const;
const tones = ["neutral", "brand"] as const;

const meta = {
  title: "Components/Switch",
  component: Switch,
  tags: ["autodocs"],
  args: { label: "알림 받기" },
  argTypes: {
    label: { control: "text" },
    size: { control: "inline-radio", options: sizes },
    tone: { control: "inline-radio", options: tones },
    checked: { control: "boolean" },
    defaultChecked: { control: "boolean" },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
  },
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/5e7PW74E0sWvXqhHC1fpqz/d5ng?node-id=230-107911",
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

const stackStyle = {
  display: "flex",
  flexDirection: "column",
} as const;

/** 가장 흔한 쓰임이에요. 라벨과 줄 여백까지 눌러져요. 기본은 24 · neutral이에요. */
export const Default: Story = {};

/** 라벨이 길면 줄바꿈되고, 트랙은 첫 줄 가운데에 맞춰요. */
export const Label: Story = {
  args: {
    label:
      "마케팅 정보 알림을 받아요. 새 기능과 이벤트 소식을 앱 알림으로 보내 드려요.",
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

/** 주변 글자 크기에 맞춰 골라요. 라벨도 함께 커져요. */
export const Size: Story = {
  render: (args) => (
    <div style={stackStyle}>
      {sizes.map((size) => (
        <Switch key={size} {...args} size={size} />
      ))}
    </div>
  ),
};

/** neutral이 기본이고, 브랜드로 강조할 때만 brand를 써요. */
export const Tone: Story = {
  args: { defaultChecked: true },
  render: (args) => (
    <div style={stackStyle}>
      {tones.map((tone) => (
        <Switch key={tone} {...args} tone={tone} />
      ))}
    </div>
  ),
};

/** 켜짐과 꺼짐이에요. 쓰는 쪽이 값을 가지려면 `checked`와 `onCheckedChange`를 함께 넘겨요. */
export const Checked: Story = {
  render: (args) => (
    <div style={stackStyle}>
      <Switch {...args} label="꺼짐" />
      <Switch {...args} label="켜짐" defaultChecked />
    </div>
  ),
};

/** 지금은 바꿀 수 없어요. 켜짐 상태는 그대로 보여요. */
export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <div style={stackStyle}>
      <Switch {...args} />
      <Switch {...args} defaultChecked />
    </div>
  ),
  parameters: {
    // 비활성 색은 대비 기준(WCAG 1.4.3)에서 빠지는 게 맞아서 대비 검사를 꺼요.
    a11y: { config: { rules: [{ id: "color-contrast", enabled: false }] } },
  },
};

/** 바꾼 값을 저장하는 동안 다시 누르지 못하게 해요. 모양은 그대로예요. */
export const Loading: Story = {
  args: { loading: true },
  render: (args) => (
    <div style={stackStyle}>
      <Switch {...args} />
      <Switch {...args} defaultChecked />
    </div>
  ),
};
