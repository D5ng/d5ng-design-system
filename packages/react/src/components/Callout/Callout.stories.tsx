import type { Meta, StoryObj } from "@storybook/react-vite";
import { Sparkles } from "lucide-react";

import { Link } from "../Link";
import { Callout } from "./Callout";

const tones = [
  "neutral",
  "informative",
  "positive",
  "warning",
  "critical",
] as const;

const meta = {
  title: "Components/Callout",
  component: Callout,
  tags: ["autodocs"],
  args: {
    title: "안내",
    children: "변경한 설정은 다음 접속부터 적용돼요.",
  },
  argTypes: {
    title: { control: "text" },
    children: { control: "text" },
    tone: { control: "inline-radio", options: tones },
    prefixIcon: { control: false },
    hidePrefixIcon: { control: "boolean" },
  },
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/5e7PW74E0sWvXqhHC1fpqz/d5ng?node-id=287-251561",
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Callout>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 화면 안에 머무는 짧은 안내예요. */
export const Default: Story = {};

/** 안내의 성격에 맞춰 골라요. 앞 아이콘도 톤마다 바뀌어요. */
export const Tone: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 12 }}>
      {tones.map((tone) => (
        <Callout key={tone} {...args} tone={tone} />
      ))}
    </div>
  ),
};

/** 설명만으로 뜻이 분명하면 제목을 빼요. */
export const WithoutTitle: Story = {
  args: { title: undefined },
};

/** 톤 기본 아이콘이 내용과 맞지 않을 때만 바꿔요. */
export const PrefixIcon: Story = {
  args: { prefixIcon: <Sparkles /> },
};

/** 아이콘 없이 글자만 둘 때 써요. */
export const HidePrefixIcon: Story = {
  args: { hidePrefixIcon: true },
};

/** 설명 문장 안에 `Link`를 넣어요. 좁은 화면에서 긴 문장은 아이콘 옆에서 줄바꿈돼요. */
export const InlineLink: Story = {
  args: {
    tone: "informative",
    children: (
      <>
        변경한 설정은 다음 접속부터 적용돼요. 바로 적용하려면 로그아웃한 뒤 다시
        로그인해 주세요. <Link href="#guide">설정 가이드 보기</Link>
      </>
    ),
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
};
