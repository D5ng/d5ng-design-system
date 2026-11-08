import { vars } from "@d5ng/tokens";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties } from "react";

// 시멘틱 색을 견본으로 보여 준다. 툴바에서 테마를 바꾸면 값이 같이 바뀌는지 확인하는 용도다.
const meta = {
  title: "Foundations/Colors",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;
type Kind = "bg" | "fg" | "stroke";

// vars의 값은 "var(--color-bg-layer-default)" 꼴이라 Figma와 비교하기 쉽게 변수 이름만 꺼낸다.
function cssVariableName(value: string) {
  return value.slice("var(".length, -")".length);
}

function sampleStyle(kind: Kind, value: string): CSSProperties {
  const box: CSSProperties = {
    width: 48,
    height: 48,
    borderRadius: 8,
    flexShrink: 0,
  };
  if (kind === "bg") {
    return {
      ...box,
      background: value,
      border: `1px solid ${vars.color.stroke.neutralWeak}`,
    };
  }
  if (kind === "fg") {
    return {
      ...box,
      display: "grid",
      placeItems: "center",
      color: value,
      fontSize: 20,
      fontWeight: 700,
    };
  }
  return { ...box, border: `2px solid ${value}` };
}

function Swatches({ kind }: { kind: Kind }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 18, marginBottom: 12 }}>{kind}</h2>
      <ul
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 12,
          listStyle: "none",
          padding: 0,
          margin: 0,
        }}
      >
        {Object.entries(vars.color[kind]).map(([name, value]) => (
          <li
            key={name}
            style={{ display: "flex", alignItems: "center", gap: 12 }}
          >
            <span style={sampleStyle(kind, value)}>
              {kind === "fg" ? "Aa" : null}
            </span>
            <span style={{ fontSize: 13 }}>
              <strong>{name}</strong>
              <br />
              <code style={{ color: vars.color.fg.neutralMuted }}>
                {cssVariableName(value)}
              </code>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export const Semantic: Story = {
  render: () => (
    <>
      <Swatches kind="bg" />
      <Swatches kind="fg" />
      <Swatches kind="stroke" />
    </>
  ),
};
