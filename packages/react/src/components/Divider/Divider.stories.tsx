import { textStyles, vars } from "@d5ng/tokens";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Divider } from "./Divider";

const orientations = ["horizontal", "vertical"] as const;
const tones = ["subtle", "muted"] as const;
const insets = ["none", "16", "24"] as const;

const meta = {
  title: "Components/Divider",
  component: Divider,
  tags: ["autodocs"],
  argTypes: {
    orientation: { control: "inline-radio", options: orientations },
    tone: { control: "inline-radio", options: tones },
    inset: { control: "inline-radio", options: insets },
    decorative: { control: "boolean" },
  },
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/5e7PW74E0sWvXqhHC1fpqz/d5ng?node-id=287-251250",
    },
  },
} satisfies Meta<typeof Divider>;

export default meta;

type Story = StoryObj<typeof meta>;

const textStyle = {
  ...textStyles.bodyDefault,
  margin: 0,
  color: vars.color.fg.neutral,
} as const;

const stackStyle = {
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing[16],
} as const;

const captionStyle = {
  ...textStyles.caption,
  margin: 0,
  color: vars.color.fg.neutralMuted,
} as const;

/** 위아래 내용을 나눠요. 앞뒤 간격은 부모의 `gap`이 맡아요. 기본은 horizontal · subtle · none이에요. */
export const Default: Story = {
  render: (args) => (
    <div style={stackStyle}>
      <p style={textStyle}>콘텐츠 영역</p>
      <Divider {...args} />
      <p style={textStyle}>부가 정보와 다음 내용을 나누는 경계예요.</p>
    </div>
  ),
};

/** 좌우 내용을 나눠요. 높이는 flex 부모를 따라요. */
export const Vertical: Story = {
  args: { orientation: "vertical" },
  render: (args) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: vars.spacing[12],
        height: 24,
      }}
    >
      <span style={textStyle}>d5ng</span>
      <Divider {...args} />
      <span style={textStyle}>2026년 11월 14일</span>
    </div>
  ),
};

/** 반복 항목 사이는 `subtle`, 의미 단위·섹션 경계는 `muted`예요. */
export const Tone: Story = {
  render: (args) => (
    <div style={stackStyle}>
      {tones.map((tone) => (
        <div key={tone} style={{ ...stackStyle, gap: vars.spacing[8] }}>
          <p style={captionStyle}>{tone}</p>
          <Divider {...args} tone={tone} />
        </div>
      ))}
    </div>
  ),
};

/** 선의 시작을 목록 글자의 시작 위치에 맞춰요. */
export const Inset: Story = {
  render: (args) => (
    <div style={stackStyle}>
      {(["16", "24"] as const).map((inset) => (
        <div
          key={inset}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: vars.spacing[12],
            paddingBlock: vars.spacing[12],
            background: vars.color.bg.layerDefault,
          }}
        >
          <p style={{ ...textStyle, paddingInline: vars.spacing[inset] }}>
            inset {inset} · 기본 설정
          </p>
          <Divider {...args} inset={inset} />
          <p style={{ ...textStyle, paddingInline: vars.spacing[inset] }}>
            inset {inset} · 알림 설정
          </p>
        </div>
      ))}
    </div>
  ),
};

const listItems = ["기본 설정", "알림 설정", "개인정보 설정"];

/** 목록이 이미 항목을 나눌 때 써요. 목록에는 항목만 둘 수 있어서 선은 항목 안에 넣고, 마지막 항목에는 두지 않아요. */
export const Decorative: Story = {
  args: { decorative: true },
  render: (args) => (
    <ul style={{ ...stackStyle, gap: vars.spacing[12], padding: 0, margin: 0 }}>
      {listItems.map((item, index) => (
        <li
          key={item}
          style={{ ...stackStyle, gap: vars.spacing[12], listStyle: "none" }}
        >
          <span style={textStyle}>{item}</span>
          {index < listItems.length - 1 ? <Divider {...args} /> : null}
        </li>
      ))}
    </ul>
  ),
};
