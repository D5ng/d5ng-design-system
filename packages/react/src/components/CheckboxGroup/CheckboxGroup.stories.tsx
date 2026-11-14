import type { Meta, StoryObj } from "@storybook/react-vite";

import { Checkbox } from "../Checkbox";
import { CheckboxGroup } from "./CheckboxGroup";

const items = (
  <>
    <Checkbox name="topics" value="design" label="디자인" defaultChecked />
    <Checkbox name="topics" value="dev" label="개발" />
    <Checkbox name="topics" value="pm" label="기획" />
  </>
);

const meta = {
  title: "Components/CheckboxGroup",
  component: CheckboxGroup,
  subcomponents: { Checkbox },
  tags: ["autodocs"],
  args: { label: "관심 분야", children: items },
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
      url: "https://www.figma.com/design/5e7PW74E0sWvXqhHC1fpqz/d5ng?node-id=224-100278",
    },
  },
} satisfies Meta<typeof CheckboxGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 가장 흔한 쓰임이에요. 제목이 그룹의 이름이 되고, 항목마다 따로 골라요. */
export const Default: Story = {};

/** 꼭 하나 이상 골라야 할 때예요. 스크린리더는 `*`를 읽지 않아서 조건을 안내 문구로 알려요. */
export const Required: Story = {
  args: {
    required: true,
    requirementIndicator: true,
    description: "하나 이상 골라 주세요.",
  },
};

/** 그룹 전체를 지금은 바꿀 수 없어요. 고른 항목은 그대로 보이고 form 제출에서 빠져요. */
export const Disabled: Story = {
  args: { disabled: true, description: "가입한 뒤에 바꿀 수 있어요." },
  parameters: {
    // 비활성 색은 대비 기준(WCAG 1.4.3)에서 빠지는 게 맞아서 대비 검사를 꺼요.
    a11y: { config: { rules: [{ id: "color-contrast", enabled: false }] } },
  },
};

/** 고른 항목이 조건에 맞지 않을 때예요. 상자 색은 그대로이고 오류 문구가 알려요. */
export const Invalid: Story = {
  args: {
    invalid: true,
    description: "하나 이상 골라 주세요.",
    errorMessage: "관심 분야를 하나 이상 골라 주세요.",
    children: (
      <>
        <Checkbox name="topics" value="design" label="디자인" />
        <Checkbox name="topics" value="dev" label="개발" />
        <Checkbox name="topics" value="pm" label="기획" />
      </>
    ),
  },
};
