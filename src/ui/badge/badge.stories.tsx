import type { Meta, StoryObj } from "@storybook/react-vite"

import { Badge } from "./badge"

const meta = {
  title: "UI/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary"],
    },
  },
} satisfies Meta<typeof Badge>

export default meta

type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Badge",
  },
}

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Badge",
  },
}

export const WithLeftIcon: Story = {
  args: {
    variant: "primary",
    leftIcon: <span>🚀</span>,
    children: "Badge",
  },
}

export const WithRightIcon: Story = {
  args: {
    variant: "primary",
    rightIcon: <span>🚀</span>,
    children: "Badge",
  },
}
