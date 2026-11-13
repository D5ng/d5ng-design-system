import { vars } from "@d5ng/tokens";
import { globalStyle } from "@vanilla-extract/css";

// 쓰는 쪽 앱처럼 바탕과 글자에 토큰을 입혀서 다크 모드에서 화면 전체가 바뀌게 해요.
globalStyle("body", {
  background: vars.color.bg.layerDefault,
  color: vars.color.fg.neutral,
  // 글꼴을 물려받는 컴포넌트(Link)가 쓰는 쪽 앱에서처럼 보이게 해요.
  fontFamily: vars.font.family.base,
});
