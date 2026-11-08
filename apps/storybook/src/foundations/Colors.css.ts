import { textStyles, vars } from "@d5ng/tokens";
import { style, styleVariants } from "@vanilla-extract/css";

export const section = style({
  marginBottom: vars.spacing[32],
});

export const heading = style({
  ...textStyles.headingSection,
  margin: `0 0 ${vars.spacing[12]}`,
});

export const list = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: vars.spacing[12],
  listStyle: "none",
  padding: 0,
  margin: 0,
});

export const item = style({
  display: "flex",
  alignItems: "center",
  gap: vars.spacing[12],
});

const sampleBase = style({
  width: 48,
  height: 48,
  borderRadius: vars.radius.md,
  flexShrink: 0,
});

// 글자색 견본 "Aa"예요. 접근성 검사에서 이 클래스 하나로 가리키려고 따로 둬요.
export const fgSampleText = style({
  ...textStyles.headingSection,
  display: "grid",
  placeItems: "center",
});

// 종류별 모양만 정해요. 색은 항목마다 달라서 스토리에서 넣어요.
export const sample = styleVariants({
  bg: [sampleBase, { border: `1px solid ${vars.color.stroke.neutralWeak}` }],
  fg: [sampleBase, fgSampleText],
  stroke: [sampleBase, { borderWidth: 2, borderStyle: "solid" }],
});

export const label = style(textStyles.caption);

export const variableName = style({
  fontFamily: vars.font.family.code,
  color: vars.color.fg.neutralMuted,
});
