import { vars } from "@d5ng/tokens";
import { style } from "@vanilla-extract/css";

// 표시(버튼)에 data-disabled가 붙으면 줄도 비활성으로 봐요.
const disabled = ":has([data-disabled])";
// 마우스로 누르면 줄이, 키보드 Space로 누르면 버튼만 :active가 돼서 둘 다 봐요.
const pressed = ":is(:active, :has(:active))";

// Checkbox·Switch·Radio의 라벨 줄이에요. 표시와 라벨을 함께 감싸서 줄 어디를 눌러도 반응해요.
// 최소 높이는 Figma가 컴포넌트마다 변수를 따로 둬서 각 컴포넌트가 정해요. 열 구성도 컴포넌트마다 달라요.
export const selectionRow = style({
  display: "grid",
  // 한 줄이면 최소 높이 안에서 가운데, 여러 줄이면 위에 붙어요(Figma Content 정렬).
  alignContent: "center",
  alignItems: "start",
  boxSizing: "border-box",
  padding: vars.spacing[8],
  cursor: "pointer",
  WebkitTapHighlightColor: "transparent",
  selectors: {
    [`&${disabled}`]: { cursor: "not-allowed" },
  },
});

// 라벨 글자나 여백을 눌러도 표시가 반응하게 줄을 봐요.
export const selectionRowPressed = `${selectionRow}${pressed}`;
// hover 규칙은 @media라 뒤에 나와요. 눌린 동안은 빼야 눌린 색이 보여요.
export const selectionRowHovered = `${selectionRow}:hover:not(${pressed})`;
// 라벨 글자처럼 버튼 밖에 있는 부분이 비활성을 알아야 할 때 봐요.
export const selectionRowDisabled = `${selectionRow}${disabled}`;
