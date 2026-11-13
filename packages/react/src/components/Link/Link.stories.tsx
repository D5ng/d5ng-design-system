import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowRight, ExternalLink } from "lucide-react";

import { Link } from "./Link";

const meta = {
  title: "Components/Link",
  component: Link,
  tags: ["autodocs"],
  args: { children: "공식 문서", href: "#docs" },
  argTypes: {
    children: { control: "text" },
    suffixIcon: { control: false },
  },
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/5e7PW74E0sWvXqhHC1fpqz/d5ng?node-id=271-244942",
    },
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** 외부 문서는 `ExternalLink`, 순서가 있는 이동은 화살표를 뒤에 붙여요. 아이콘 없이 쓰는 게 기본이에요. */
export const SuffixIcon: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 24 }}>
      <Link {...args} suffixIcon={<ExternalLink />}>
        공식 문서
      </Link>
      <Link {...args} href="#next" suffixIcon={<ArrowRight />}>
        다음 글
      </Link>
    </div>
  ),
};

/** 라우터의 링크 컴포넌트에 스타일만 입힐 때 써요. */
export const AsChild: Story = {
  render: (args) => (
    <Link {...args} asChild>
      <a href="#list">글 목록</a>
    </Link>
  ),
};

/** 글자 크기·행간은 주변 문장을 따르고, 긴 링크는 문장과 함께 줄바꿈돼요. */
export const InParagraph: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 16, maxWidth: 360 }}>
      {[14, 16, 18].map((fontSize) => (
        <p key={fontSize} style={{ margin: 0, fontSize, lineHeight: 1.5 }}>
          {fontSize}px 문장이에요. 자세한 규칙은{" "}
          <Link {...args} suffixIcon={<ExternalLink />}>
            WAI-ARIA Authoring Practices의 링크 패턴 문서
          </Link>
          에서 볼 수 있어요.
        </p>
      ))}
    </div>
  ),
};
