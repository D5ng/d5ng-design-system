import { vars } from "@d5ng/tokens";
import { globalStyle } from "@vanilla-extract/css";

// 쓰는 쪽 앱처럼 바탕과 글자에 토큰을 입혀서 다크 모드에서 화면 전체가 바뀌게 해요.
globalStyle("body", {
  background: vars.color.bg.layerDefault,
  color: vars.color.fg.neutral,
});
