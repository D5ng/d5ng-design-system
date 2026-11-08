import { vars } from "@d5ng/tokens";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties } from "react";

import * as styles from "./Colors.css";

// 시멘틱 색 견본이에요. 툴바로 테마를 바꿔 값이 바뀌는지 봐요.
const meta = {
  title: "Foundations/Colors",
  parameters: {
    layout: "padded",
    a11y: {
      config: {
        // 글자색 견본 "Aa"는 대비 검사에서 빼요.
        // disabled·반전 바탕용 색은 일반 바탕에서 대비가 낮은 게 맞아요.
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

// "var(--d5ng-color-bg-layer-default)"에서 쓰는 쪽이 쓸 변수 이름만 꺼내요.
function cssVariableName(value: string) {
  return value.slice("var(".length, -")".length);
}

// 항목마다 달라지는 색만 인라인으로 넣어요.
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
