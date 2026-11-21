import { vars } from "@d5ng/tokens";
import { style } from "@vanilla-extract/css";

import { focusRing } from "./focusRing.css";

// TextField·TextareaField가 같이 쓰는 입력 상자예요. 상자가 테두리·배경·링을 그리고, 입력은 글자만 그려요.

// 상태 선택자는 한 곳에서만 정해요. 컴포넌트가 상자에 붙이는 data 속성을 봐요.
export const invalidSelector = "[data-invalid]";
export const disabledSelector = "[data-disabled]";
export const readOnlySelector = "[data-readonly]";

// 2px 테두리는 1px border에 안쪽 그림자 1px을 더해 그려요.
// border를 2px로 바꾸면 글자가 1px 밀려요. 1px을 border로 남겨야 forced-colors에서도 상자가 보여요.
const emphasisBorder = (color: string) => ({
  borderColor: color,
  boxShadow: `inset 0 0 0 ${vars.textField.borderWidth} ${color}`,
});

// Figma 테두리는 안쪽(INSIDE)이라 여백에 안 잡히지만 CSS border는 잡혀서 그만큼 빼요.
export const insetSpace = (space: string) =>
  `calc(${space} - ${vars.textField.borderWidth})`;

// 입력 값 글자(16/22 Regular)예요.
// textStyles에 16/22 묶음이 없어서 글자 토큰을 직접 써요(Field 라벨과 같아요).
export const valueText = {
  fontFamily: vars.font.family.base,
  fontSize: vars.font.size.t5,
  lineHeight: vars.font.lineHeight.t5,
  fontWeight: vars.font.weight.regular,
};

// 상자 안의 입력 요소예요. 여백·크기는 컴포넌트마다 달라서 여기서 정하지 않아요.
export const control = style({
  margin: 0,
  border: 0,
  // 포커스 링은 상자가 그려요.
  outline: "none",
  background: "transparent",
  font: "inherit",
  color: "inherit",
  selectors: {
    "&::placeholder": {
      color: vars.color.fg.placeholder,
      // Firefox는 placeholder를 반투명하게 그려서 토큰 색이 흐려져요.
      opacity: 1,
    },
    "&:disabled::placeholder": { color: vars.color.fg.disabled },
    "&:disabled": { cursor: "not-allowed" },
  },
});

// 이기는 순서는 disabled > invalid > focus > hover > 기본이에요.
// :has()는 안쪽 선택자의 우선순위를 가져와서, 규칙 순서 대신 :not()으로 겹치지 않게 해요.
// :focus-within은 쓰지 않아요. 상자 안 버튼(지우기)에 포커스가 가도 링이 켜져요.
const focused = `:has(${control}:focus-visible)`;

export const inputBox = style({
  boxSizing: "border-box",
  border: `${vars.textField.borderWidth} solid ${vars.color.stroke.neutralStrong}`,
  borderRadius: vars.radius.lg,
  background: vars.color.bg.layerDefault,
  color: vars.color.fg.neutral,
  cursor: "text",

  selectors: {
    [`&${readOnlySelector}:not(${disabledSelector})`]: {
      background: vars.color.bg.neutralWeak,
    },
    // readOnly는 편집할 수 없어서 테두리는 그대로 두고 링만 그려요.
    [`&:not(${invalidSelector}, ${readOnlySelector})${focused}`]:
      emphasisBorder(vars.color.stroke.brandSolid),
    [`&${invalidSelector}:not(${disabledSelector})`]: emphasisBorder(
      vars.color.stroke.critical,
    ),
    [`&${focused}`]: focusRing,
    // 테두리가 오류 색이라 링도 맞춰요. 두께·띄움은 공통 값 그대로예요.
    [`&${invalidSelector}${focused}`]: {
      outlineColor: vars.color.stroke.critical,
    },
    [`&${disabledSelector}`]: {
      borderColor: vars.color.stroke.neutralWeak,
      background: vars.color.bg.disabled,
      color: vars.color.fg.disabled,
      cursor: "not-allowed",
    },
  },

  "@media": {
    "(hover: hover)": {
      selectors: {
        [`&:hover:not(${invalidSelector}, ${disabledSelector}, ${readOnlySelector}, ${focused})`]:
          { borderColor: vars.color.stroke.neutralContrast },
      },
    },
  },
});
