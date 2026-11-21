import type { Meta, StoryObj } from "@storybook/react-vite";

import { SwitchRow } from "./Switch";

const sizes = ["16", "24", "32"] as const;

const meta = {
  title: "Components/SwitchRow",
  component: SwitchRow,
  tags: ["autodocs"],
  args: {
    label: "댓글 알림",
    description: "내 글에 새 댓글이 달리면 알려 드려요.",
  },
  argTypes: {
    label: { control: "text" },
    description: { control: "text" },
    size: { control: "inline-radio", options: sizes },
    tone: { control: "inline-radio", options: ["neutral", "brand"] },
    checked: { control: "boolean" },
    defaultChecked: { control: "boolean" },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
  },
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/5e7PW74E0sWvXqhHC1fpqz/d5ng?node-id=230-108129",
    },
  },
  decorators: [
    (Story) => (
      // 설정 목록처럼 너비가 정해진 곳에서 스위치가 오른쪽 끝에 붙는지 봐요.
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SwitchRow>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 설정 목록의 한 줄이에요. 줄 어디를 눌러도 바뀌어요. */
export const Default: Story = {};

/** 라벨만으로 뜻이 분명하면 설명을 빼요. */
export const WithoutDescription: Story = {
  args: { description: undefined },
};

/** 목록의 글자 크기에 맞춰 골라요. 설명 크기는 그대로예요. */
export const Size: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {sizes.map((size) => (
        <SwitchRow key={size} {...args} size={size} />
      ))}
    </div>
  ),
};
