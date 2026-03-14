import { fn } from "storybook/test"

import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "./button"

const meta = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary"],
    },
    size: {
      control: "select",
      options: ["default", "small", "icon"],
    },
    disabled: {
      control: "boolean",
    },
  },
  args: {
    onClick: fn(),
    children: "버튼",
  },
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Primary",
  },
}

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary",
  },
}

export const Tertiary: Story = {
  args: {
    variant: "tertiary",
    children: "Tertiary",
  },
}

export const Default: Story = {
  args: {
    variant: "primary",
    size: "default",
    children: "Default",
  },
}

export const Small: Story = {
  args: {
    variant: "primary",
    size: "small",
    children: "Small",
  },
}

export const Icon: Story = {
  args: {
    variant: "primary",
    size: "icon",
    children: "🔘",
  },
}

export const Disabled: Story = {
  args: {
    variant: "primary",
    disabled: true,
    children: "Disabled",
  },
}

export const WithLeftIcon: Story = {
  args: {
    variant: "primary",
    leftIcon: <span>←</span>,
    children: "이전",
  },
}

export const WithRightIcon: Story = {
  args: {
    variant: "primary",
    rightIcon: <span>→</span>,
    children: "다음",
  },
}

export const AsChild: Story = {
  args: {
    asChild: true,
    variant: "primary",
    children: <a href="#link">링크처럼 사용</a>,
  },
}
