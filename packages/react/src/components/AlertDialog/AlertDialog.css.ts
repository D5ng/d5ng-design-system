// actionButton이 Button의 size 클래스보다 뒤에 나와야 이겨서, Button CSS를 먼저 불러 순서를 고정해요.
import "../Button/Button.css";

import { textStyles, vars } from "@d5ng/tokens";
import { keyframes, style } from "@vanilla-extract/css";

// Radix가 붙이는 열림 상태예요. Presence가 닫힐 때 animationend를 기다렸다가 DOM에서 빼요.
const openSelector = '&[data-state="open"]';
const closedSelector = '&[data-state="closed"]';

const fadeIn = keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
const fadeOut = keyframes({ from: { opacity: 1 }, to: { opacity: 0 } });

// Figma와 같이 열 때 250ms, 닫을 때 150ms 페이드예요. 위치가 움직이지 않아서 움직임 줄이기에서도 그대로 둬요.
const fadeSelectors = {
  [openSelector]: {
    animation: `${fadeIn} ${vars.duration.slow} ${vars.easing.enter}`,
  },
  [closedSelector]: {
    animation: `${fadeOut} ${vars.duration.normal} ${vars.easing.exit}`,
  },
};

// 화면 가장자리에서 띄우는 최소 여백이에요.
const viewportMargin = vars.spacing[24];

// Figma Specification의 간격이에요. 메시지 안(제목–설명–오류), 메시지와 버튼 사이, 버튼 사이예요.
const messageGap = vars.spacing[8];
const messageToActions = vars.spacing[16];
const actionsGap = vars.spacing[8];

export const overlay = style({
  position: "fixed",
  inset: 0,
  background: vars.color.bg.scrim,
  selectors: fadeSelectors,
});

export const content = style({
  // Portal로 body에 붙어서 부모 스타일을 물려받지 못해요. 글꼴·글자색·box-sizing을 직접 정해요.
  boxSizing: "border-box",
  fontFamily: vars.font.family.base,
  color: vars.color.fg.neutral,

  position: "fixed",
  inset: 0,
  margin: "auto",
  width: `calc(100% - ${viewportMargin} * 2)`,
  // Figma에 272에 맞는 크기 토큰이 없어요.
  maxWidth: "272px",
  height: "fit-content",
  // 확대하거나 낮은 화면에서도 버튼까지 스크롤로 닿게 해요.
  maxHeight: `calc(100% - ${viewportMargin} * 2)`,
  overflowY: "auto",

  display: "flex",
  flexDirection: "column",
  gap: messageGap,
  padding: vars.spacing[20],
  borderRadius: vars.radius.xl,
  background: vars.color.bg.layerFloating,
  boxShadow: vars.shadow.lg,

  selectors: {
    ...fadeSelectors,
    "&:focus": { outline: "none" },
  },
});

export const title = style({
  ...textStyles.headingGroup,
  margin: 0,
});

export const description = style({
  ...textStyles.bodyDefault,
  margin: 0,
});

export const errorMessage = style({
  ...textStyles.bodySmall,
  margin: 0,
  color: vars.color.fg.critical,
});

export const actions = style({
  display: "flex",
  flexWrap: "wrap",
  gap: actionsGap,
  // content의 gap이 이미 메시지 간격만큼 띄우니, 나머지만 더해요.
  marginTop: `calc(${messageToActions} - ${messageGap})`,
});

export const actionButton = style({
  // 두 버튼이 반씩 나눠 가져요. 라벨이 반 폭에 안 들어가면 줄이 넘어가 세로로 쌓이고, 각자 한 줄을 다 채워요.
  flex: `1 1 calc((100% - ${actionsGap}) / 2)`,
  // Button의 최소 너비(높이와 같음)를 풀어 라벨 너비가 최소가 되게 해요. 줄 넘김은 이 값으로 정해져요.
  minWidth: "auto",
  // 라벨이 한 줄보다 길어도 버튼이 영역을 넘지 않게 해요.
  maxWidth: "100%",
});
