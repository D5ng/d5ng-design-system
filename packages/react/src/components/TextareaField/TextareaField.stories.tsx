import type { Meta, StoryObj } from "@storybook/react-vite";

import { TextareaField } from "./TextareaField";

const longValue = Array.from(
  { length: 12 },
  (_, index) => `${String(index + 1)}번째 줄이에요. 줄이 늘면 상자도 늘어요.`,
).join("\n");

const meta = {
  title: "Components/TextareaField",
  component: TextareaField,
  tags: ["autodocs"],
  args: { label: "소개", placeholder: "자기소개를 적어 주세요" },
  argTypes: {
    label: { control: "text" },
    heightMode: { control: "inline-radio", options: ["auto", "fixed"] },
    description: { control: "text" },
    errorMessage: { control: "text" },
    headerAction: { control: false },
  },
  decorators: [
    (Story) => (
      // Figma 예시 폭이에요. 부모 너비를 꽉 채우는 모습을 좁은 폭에서 봐요.
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/5e7PW74E0sWvXqhHC1fpqz/d5ng?node-id=220-77533",
    },
  },
} satisfies Meta<typeof TextareaField>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 가장 흔한 쓰임이에요. 입력할수록 높이가 늘어요. */
export const Default: Story = {};

/** 화면 배치 때문에 높이가 바뀌면 안 될 때 써요. `rows`만큼 높고 넘치면 안에서 스크롤해요. */
export const Fixed: Story = {
  args: { heightMode: "fixed", rows: 6, defaultValue: longValue },
};

/** 길게 쓸 수 있지만 화면을 다 차지하면 안 될 때 써요. 8줄에서 멈추고 안에서 스크롤해요. */
export const MaxRows: Story = {
  args: { maxRows: 8, defaultValue: longValue },
};

/** 길이 제한을 알려 줄 때 써요. 넘어도 입력을 막지 않아요. */
export const MaxCharacterCount: Story = {
  args: {
    maxCharacterCount: 100,
    description: "100자 이내로 적어 주세요.",
    defaultValue: "안녕하세요. 디자인 시스템을 만들고 있어요.",
  },
};

/** 값이 올바르지 않을 때예요. 오류 문구가 안내 자리를 대신해요. */
export const Invalid: Story = {
  args: {
    invalid: true,
    description: "100자 이내로 적어 주세요.",
    errorMessage: "소개를 입력해 주세요.",
  },
};

/** 고칠 수 없지만 읽고 복사할 값이에요. Tab으로 포커스돼요. */
export const ReadOnly: Story = {
  args: {
    readOnly: true,
    defaultValue: "가입할 때 적은 소개예요. 지금은 고칠 수 없어요.",
  },
};

/** 지금은 입력할 수 없어요. */
export const Disabled: Story = {
  args: { disabled: true },
  parameters: {
    // 비활성 색은 대비 기준(WCAG 1.4.3)에서 빠지는 게 맞아서 대비 검사를 꺼요.
    a11y: { config: { rules: [{ id: "color-contrast", enabled: false }] } },
  },
};
