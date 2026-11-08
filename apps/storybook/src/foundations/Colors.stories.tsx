import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { type ColorSection, componentSection, sections } from "./colorGroups";
import * as styles from "./Colors.css";
import { ColorSwatch } from "./ColorSwatch";

// 역할별로 묶은 색 띠예요. 색을 누르면 지금 테마의 값과 팔레트 참조를 보여 줘요.
const meta = {
  title: "Foundations/Colors",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

function Section({ section }: { section: ColorSection }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{section.title}</h2>
      <p className={styles.sectionLead}>{section.description}</p>
      {section.families.map((family) => (
        <div key={family.title} className={styles.family}>
          <h3 className={styles.familyTitle}>{family.title}</h3>
          {family.description ? (
            <p className={styles.familyLead}>{family.description}</p>
          ) : null}
          <ul className={styles.bar}>
            {family.tokens.map((token) => (
              <ColorSwatch key={token.name} token={token} />
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

export const Semantic: Story = {
  render: () => (
    <main className={styles.page}>
      <p className={styles.eyebrow}>Foundations</p>
      <h1 className={styles.title}>Colors</h1>
      <p className={styles.lead}>
        역할에 맞는 색을 고르면 Light와 Dark에서 같은 의미를 유지합니다.
        앱에서는 역할 색을 쓰고 팔레트 색은 직접 쓰지 않습니다. 툴바에서 테마를
        바꿀 수 있고, 색을 누르면 값을 볼 수 있습니다.
      </p>
      {sections.map((section) => (
        <Section key={section.title} section={section} />
      ))}
      <Section section={componentSection} />
    </main>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByRole("button", { name: "fg/neutral-muted" }),
    );
    const popover = canvas.getByRole("dialog", { name: "fg/neutral-muted" });
    await expect(popover).toBeVisible();
    await expect(popover).toHaveTextContent(/#[0-9A-F]{6}/);
  },
};
