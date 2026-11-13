import type { Meta, StoryObj } from "@storybook/react-vite";
import { Search } from "lucide-react";

import { TextField } from "./TextField";

const sizes = ["small", "medium", "large"] as const;

const meta = {
  title: "Components/TextField",
  component: TextField,
  tags: ["autodocs"],
  args: { label: "이름", placeholder: "홍길동" },
  argTypes: {
    label: { control: "text" },
    size: { control: "inline-radio", options: sizes },
    description: { control: "text" },
    errorMessage: { control: "text" },
    prefixText: { control: "text" },
    suffixText: { control: "text" },
    prefixIcon: { control: false },
    headerAction: { control: false },
  },
  decorators: [
    (Story) => (
      // Figma 예시 폭이에요. 부모 너비를 꽉 채우는 모습을 좁은 폭에서 봐요.
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/5e7PW74E0sWvXqhHC1fpqz/d5ng?node-id=323-24817",
    },
  },
} satisfies Meta<typeof TextField>;

export default meta;

type Story = StoryObj<typeof meta>;

const stackStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 24,
} as const;

/** 가장 흔한 쓰임이에요. 라벨이 입력의 이름이 돼요. */
export const Default: Story = {};

/** 화면의 다른 입력·버튼과 높이를 맞춰 골라요. */
export const Size: Story = {
  render: (args) => (
    <div style={stackStyle}>
      {sizes.map((size) => (
        <TextField key={size} {...args} size={size} />
      ))}
    </div>
  ),
};

/** 입력할 내용을 아이콘으로 알아보기 쉽게 할 때 써요. 이름은 라벨이 맡아요. */
export const PrefixIcon: Story = {
  args: {
    label: "검색어",
    placeholder: "컴포넌트 이름",
    prefixIcon: <Search />,
  },
};

/** 값 앞에 늘 붙는 글자예요. 값에는 섞이지 않아요. */
export const PrefixText: Story = {
  args: {
    label: "블로그 주소",
    placeholder: "d5ng.dev",
    type: "url",
    prefixText: "https://",
  },
};

/** 값의 단위예요. 입력의 설명으로 읽혀요. */
export const SuffixText: Story = {
  args: {
    label: "가격",
    placeholder: "10,000",
    inputMode: "numeric",
    suffixText: "원",
  },
};

/** 무엇을 어떻게 적을지 미리 알려 줄 때 써요. 나머지 Field props는 Field 스토리에 있어요. */
export const Description: Story = {
  args: { description: "가족관계증명서에 적힌 이름으로 써 주세요." },
};

/** 값이 올바르지 않을 때예요. 오류 문구가 안내 자리를 대신해요. */
export const Invalid: Story = {
  args: {
    invalid: true,
    description: "가족관계증명서에 적힌 이름으로 써 주세요.",
    errorMessage: "이름을 입력해 주세요.",
  },
};

/** 고칠 수 없지만 읽고 복사할 값이에요. Tab으로 포커스돼요. */
export const ReadOnly: Story = {
  args: { label: "아이디", readOnly: true, defaultValue: "d5ng" },
};

/** 지금은 입력할 수 없어요. */
export const Disabled: Story = {
  render: (args) => (
    <div style={stackStyle}>
      <TextField {...args} disabled prefixIcon={<Search />} />
      <TextField {...args} disabled defaultValue="홍길동" suffixText="님" />
    </div>
  ),
  parameters: {
    // 비활성 색은 대비 기준(WCAG 1.4.3)에서 빠지는 게 맞아서 대비 검사를 꺼요.
    a11y: { config: { rules: [{ id: "color-contrast", enabled: false }] } },
  },
};
