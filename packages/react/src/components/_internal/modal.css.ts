import { vars } from "@d5ng/tokens";
import { keyframes, style } from "@vanilla-extract/css";

// Dialog와 AlertDialog가 같이 써요. Figma도 두 컴포넌트가 같은 Dialog Backdrop을 써서 함께 바뀌어요.

// Radix가 붙이는 열림 상태예요. Presence가 닫힐 때 animationend를 기다렸다가 DOM에서 빼요.
const openSelector = '&[data-state="open"]';
const closedSelector = '&[data-state="closed"]';

const fadeIn = keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
const fadeOut = keyframes({ from: { opacity: 1 }, to: { opacity: 0 } });

// Figma와 같이 열 때 250ms, 닫을 때 150ms 페이드예요. 위치가 움직이지 않아서 움직임 줄이기에서도 그대로 둬요.
export const fadeSelectors = {
  [openSelector]: {
    animation: `${fadeIn} ${vars.duration.slow} ${vars.easing.enter}`,
  },
  [closedSelector]: {
    animation: `${fadeOut} ${vars.duration.normal} ${vars.easing.exit}`,
  },
};

// 화면 가장자리에서 띄우는 최소 여백이에요.
export const viewportMargin = vars.spacing[24];

// Portal로 body에 붙어서 부모 스타일을 물려받지 못해요. 표면이 글꼴·글자색·box-sizing을 직접 정해요.
export const portalRoot = {
  boxSizing: "border-box",
  fontFamily: vars.font.family.base,
  color: vars.color.fg.neutral,
} as const;

export const overlay = style({
  position: "fixed",
  inset: 0,
  background: vars.color.bg.scrim,
  selectors: fadeSelectors,
});
