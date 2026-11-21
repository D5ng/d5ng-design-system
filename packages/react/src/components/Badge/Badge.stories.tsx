import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Check,
  CircleCheck,
  CircleX,
  Clock,
  Info,
  TriangleExclamationPoint,
} from "lucide-react";

import { Badge } from "./Badge";

const variants = ["weak", "solid", "outline"] as const;
const tones = [
  "neutral",
  "brand",
  "informative",
  "positive",
  "warning",
  "critical",
] as const;

const meta = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  args: { children: "상태" },
  argTypes: {
    children: { control: "text" },
    prefixIcon: { control: false },
  },
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/5e7PW74E0sWvXqhHC1fpqz/d5ng?node-id=253-227034",
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** 반복되는 목록은 `weak`, 유색·복잡한 배경 위에서는 `solid`나 `outline`을 써요. */
export const Variant: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 8 }}>
      {variants.map((variant) => (
        <Badge key={variant} {...args} variant={variant}>
          {variant}
        </Badge>
      ))}
    </div>
  ),
};

/** 뜻에 맞는 색을 골라요. 색은 variant마다 달라서 세 줄을 모두 보여 줘요. */
export const Tone: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 8 }}>
      {variants.map((variant) => (
        <div key={variant} style={{ display: "flex", gap: 8 }}>
          {tones.map((tone) => (
            <Badge key={tone} {...args} variant={variant} tone={tone}>
              {tone}
            </Badge>
          ))}
        </div>
      ))}
    </div>
  ),
};

/** 글자 크기는 같고 높이·여백·모서리만 달라요. */
export const Size: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <Badge {...args} size="medium" prefixIcon={<Info />}>
        medium
      </Badge>
      <Badge {...args} size="large" prefixIcon={<Info />}>
        large
      </Badge>
    </div>
  ),
};

/** 문구의 뜻을 돕는 아이콘이에요. 아이콘만으로 뜻을 전하지 않아요. */
export const PrefixIcon: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 8 }}>
      <Badge {...args} tone="positive" prefixIcon={<CircleCheck />}>
        완료
      </Badge>
      <Badge {...args} tone="warning" prefixIcon={<TriangleExclamationPoint />}>
        확인 필요
      </Badge>
      <Badge {...args} tone="critical" prefixIcon={<CircleX />}>
        실패
      </Badge>
      <Badge {...args} prefixIcon={<Clock />}>
        대기 중
      </Badge>
      <Badge {...args} variant="solid" tone="positive" prefixIcon={<Check />}>
        승인
      </Badge>
    </div>
  ),
};

/** 부모가 좁으면 한 줄로 말줄임돼요. 전체 문구가 중요하면 다른 곳에서도 보여 줘요. */
export const Truncated: Story = {
  render: (args) => (
    <div style={{ width: 180 }}>
      <Badge {...args} size="large" tone="warning" prefixIcon={<Info />}>
        추가 확인이 필요한 상태입니다
      </Badge>
    </div>
  ),
};
