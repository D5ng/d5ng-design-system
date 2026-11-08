import { vars } from "@d5ng/tokens";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties } from "react";

import * as styles from "./Colors.css";

// 시멘틱 색을 견본으로 보여 준다. 툴바에서 테마를 바꾸면 값이 같이 바뀌는지 확인하는 용도다.
const meta = {
  title: "Foundations/Colors",
  parameters: {
    layout: "padded",
    a11y: {
      config: {
        // 글자색 견본 "Aa"는 색을 보여 주는 용도다. disabled나 반전 바탕용 글자색은
        // 일반 바탕에서 대비가 낮은 게 맞으므로 이 요소만 대비 검사에서 뺀다.
        rules: [
          { id: "color-contrast", selector: `*:not(.${styles.fgSampleText})` },
        ],
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;
type Kind = "bg" | "fg" | "stroke";

// vars의 값은 "var(--color-bg-layer-default)" 꼴이라 Figma와 비교하기 쉽게 변수 이름만 꺼낸다.
function cssVariableName(value: string) {
  return value.slice("var(".length, -")".length);
}

// 견본에서 항목마다 달라지는 색만 인라인으로 넣는다.
function colorStyle(kind: Kind, value: string): CSSProperties {
  if (kind === "bg") {
    return { background: value };
  }
  if (kind === "fg") {
    return { color: value };
  }
  return { borderColor: value };
}

function Swatches({ kind }: { kind: Kind }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>{kind}</h2>
      <ul className={styles.list}>
        {Object.entries(vars.color[kind]).map(([name, value]) => (
          <li key={name} className={styles.item}>
            <span
              className={styles.sample[kind]}
              style={colorStyle(kind, value)}
            >
              {kind === "fg" ? "Aa" : null}
            </span>
            <span className={styles.label}>
              <strong>{name}</strong>
              <br />
              <code className={styles.variableName}>
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
