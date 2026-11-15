import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef, useState } from "react";

import { Button } from "../Button";
import {
  DismissibleCallout,
  type DismissibleCalloutProps,
} from "./DismissibleCallout";

const tones = ["neutral", "informative", "positive"] as const;

const meta = {
  title: "Components/DismissibleCallout",
  component: DismissibleCallout,
  tags: ["autodocs"],
  args: {
    title: "안내",
    children: "새 편집기는 자동으로 저장돼요.",
  },
  argTypes: {
    title: { control: "text" },
    children: { control: "text" },
    tone: { control: "inline-radio", options: tones },
    prefixIcon: { control: false },
    hidePrefixIcon: { control: "boolean" },
    open: { control: false },
    defaultOpen: { control: "boolean" },
  },
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/5e7PW74E0sWvXqhHC1fpqz/d5ng?node-id=287-251760",
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DismissibleCallout>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 한 번 읽으면 닫아도 되는 안내예요. 닫으면 사라져요. */
export const Default: Story = {};

/** 주의·오류는 닫지 않아서 세 톤만 있어요. */
export const Tone: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 12 }}>
      {tones.map((tone) => (
        <DismissibleCallout key={tone} {...args} tone={tone} />
      ))}
    </div>
  ),
};

function ReopenExample(args: DismissibleCalloutProps) {
  const [open, setOpen] = useState(true);
  const reopenRef = useRef<HTMLButtonElement>(null);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    // 닫기 버튼이 사라지면 포커스가 body로 가서 다음에 누를 곳으로 옮겨요.
    reopenRef.current?.focus();
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <DismissibleCallout
        {...args}
        open={open}
        onOpenChange={handleOpenChange}
      />
      <div>
        <Button
          ref={reopenRef}
          variant="secondary"
          size="small"
          onClick={() => {
            setOpen(true);
          }}
        >
          안내 다시 보기
        </Button>
      </div>
    </div>
  );
}

/** 다시 보여 줄 수 있으면 `open`을 제어하고, 닫은 뒤 포커스를 `onOpenChange`에서 옮겨요. */
export const Open: Story = {
  render: (args) => <ReopenExample {...args} />,
};
