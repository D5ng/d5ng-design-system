import { vars } from "@d5ng/tokens";

// 키보드 포커스 링이에요. 컴포넌트마다 자기 포커스 선택자 안에 펼쳐 써요.
// 선택자까지 묶지 않은 건 포커스를 받는 요소와 링을 그리는 요소가 다를 수 있어서예요(TextField).
// box-shadow는 forced-colors에서 지워져서 outline으로 그려요.
// 띄움은 Figma도 변수 없이 링 위치로만 정해서, 두께와 같은 값을 써요.
export const focusRing = {
  outline: `${vars.focusRing.width} solid ${vars.color.stroke.focusRing}`,
  outlineOffset: vars.focusRing.width,
};
