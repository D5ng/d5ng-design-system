import { textStyles, vars } from "@d5ng/tokens";
import { globalStyle, style } from "@vanilla-extract/css";

export const page = style({
  maxWidth: 960,
  margin: "0 auto",
  padding: `${vars.spacing[48]} ${vars.spacing[32]} ${vars.spacing[80]}`,
});

export const eyebrow = style({
  ...textStyles.caption,
  margin: 0,
  color: vars.color.fg.brand,
});

export const title = style({
  ...textStyles.headingPage,
  margin: `${vars.spacing[8]} 0 ${vars.spacing[12]}`,
});

export const lead = style({
  ...textStyles.bodyDefault,
  margin: 0,
  color: vars.color.fg.neutralMuted,
});

export const section = style({
  marginTop: vars.spacing[64],
  paddingTop: vars.spacing[32],
  borderTop: `1px solid ${vars.color.stroke.neutralMuted}`,
});

export const sectionTitle = style({
  ...textStyles.headingSection,
  margin: 0,
});

export const sectionLead = style({
  ...textStyles.bodySmall,
  margin: `${vars.spacing[8]} 0 0`,
  color: vars.color.fg.neutralMuted,
});

export const family = style({
  marginTop: vars.spacing[40],
});

export const familyTitle = style({
  ...textStyles.headingGroup,
  margin: 0,
});

export const familyLead = style({
  ...textStyles.bodySmall,
  margin: `${vars.spacing[8]} 0 0`,
  color: vars.color.fg.neutralMuted,
});

// 색 띠예요. 칸마다 같은 너비를 나눠 가져요.
export const bar = style({
  position: "relative",
  display: "flex",
  margin: `${vars.spacing[16]} 0 0`,
  padding: 0,
  listStyle: "none",
});

export const segment = style({
  flex: "1 1 0",
  minWidth: 0,
});

// 칸 전체(색과 이름)가 버튼이에요. 누르면 값을 보여 주는 팝오버가 열려요.
export const swatchButton = style({
  display: "block",
  width: "100%",
  padding: 0,
  border: 0,
  background: "none",
  color: "inherit",
  font: "inherit",
  textAlign: "left",
  cursor: "pointer",
  ":focus-visible": {
    outline: `2px solid ${vars.color.stroke.focusRing}`,
    outlineOffset: 2,
    borderRadius: vars.radius.sm,
  },
});

// 반투명 색이 보이도록 바닥에 체크무늬를 깔아요.
const checker = `conic-gradient(${vars.color.bg.neutralWeak} 25%, ${vars.color.bg.layerDefault} 0 50%, ${vars.color.bg.neutralWeak} 0 75%, ${vars.color.bg.layerDefault} 0) 0 0 / 12px 12px`;

const swatchHeight = 40;

export const swatchColor = style({
  position: "relative",
  display: "block",
  height: swatchHeight,
  background: checker,
  selectors: {
    [`${segment}:first-child &`]: {
      borderStartStartRadius: vars.radius.sm,
      borderEndStartRadius: vars.radius.sm,
    },
    [`${segment}:last-child &`]: {
      borderStartEndRadius: vars.radius.sm,
      borderEndEndRadius: vars.radius.sm,
    },
  },
});

// 색은 항목마다 달라서 인라인으로 넣어요.
export const swatchFill = style({
  position: "absolute",
  inset: 0,
  borderRadius: "inherit",
});

// 흰 바탕에 흰 칸이 묻히지 않게 띠 전체에 테두리를 한 겹 덮어요.
globalStyle(`${bar}::after`, {
  content: '""',
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: swatchHeight,
  border: `1px solid ${vars.color.stroke.neutralMuted}`,
  borderRadius: vars.radius.sm,
  pointerEvents: "none",
});

export const swatchLabel = style({
  ...textStyles.caption,
  display: "block",
  marginTop: vars.spacing[6],
  paddingRight: vars.spacing[8],
  color: vars.color.fg.neutralMuted,
  overflowWrap: "anywhere",
});

// 팝오버는 top layer에 떠요. 위치는 열릴 때 버튼 아래로 맞춰요.
export const popover = style({
  position: "absolute",
  inset: "auto",
  margin: 0,
  width: 320,
  padding: vars.spacing[16],
  border: `1px solid ${vars.color.stroke.neutralMuted}`,
  borderRadius: vars.radius.md,
  background: vars.color.bg.layerFloating,
  color: vars.color.fg.neutral,
  boxShadow: vars.shadow.md,
});

export const popoverHeader = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.spacing[12],
});

export const popoverTitle = style({
  ...textStyles.labelDefault,
  margin: 0,
  fontFamily: vars.font.family.code,
});

export const copyButton = style({
  ...textStyles.caption,
  flexShrink: 0,
  padding: `${vars.spacing[4]} ${vars.spacing[8]}`,
  border: `1px solid ${vars.color.stroke.neutralWeak}`,
  borderRadius: vars.radius.sm,
  background: vars.color.bg.layerFloating,
  color: vars.color.fg.neutral,
  cursor: "pointer",
  ":hover": { background: vars.color.bg.neutralWeakHover },
  ":focus-visible": {
    outline: `2px solid ${vars.color.stroke.focusRing}`,
    outlineOffset: 2,
  },
});

export const details = style({
  display: "grid",
  gridTemplateColumns: "auto 1fr",
  gap: `${vars.spacing[6]} ${vars.spacing[16]}`,
  margin: `${vars.spacing[12]} 0 0`,
});

export const detailTerm = style({
  ...textStyles.caption,
  color: vars.color.fg.neutralMuted,
});

export const detailValue = style({
  ...textStyles.caption,
  margin: 0,
  fontFamily: vars.font.family.code,
  overflowWrap: "anywhere",
});

export const modeDot = style({
  display: "inline-block",
  width: 10,
  height: 10,
  marginRight: vars.spacing[6],
  borderRadius: vars.radius.full,
  boxShadow: `inset 0 0 0 1px ${vars.color.stroke.neutralWeak}`,
  verticalAlign: "-1px",
});
