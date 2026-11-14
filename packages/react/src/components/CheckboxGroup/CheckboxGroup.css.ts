import { vars } from "@d5ng/tokens";
import { style } from "@vanilla-extract/css";

// 비활성을 브라우저가 항목에 전하게 묶음을 fieldset으로 그려요. 기본 테두리·여백은 지워요.
export const group = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing[4],
  margin: 0,
  padding: 0,
  border: "none",
});
