import { vars } from "@d5ng/tokens";
import { style } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

import {
  control,
  inputBox,
  insetSpace,
  valueText,
} from "../_internal/inputBox.css";

// 쓰는 쪽 숫자(maxRows)라 인라인으로 받아요. 줄 높이·여백을 토큰으로 계산하는 건 여기서 해요.
export const maxRowsProperty = "--d5ng-textarea-field-max-rows";

// textarea가 여백을 가져요. Figma 여백 16에서 테두리 두께를 빼요(TextField와 같은 규칙).
const padding = insetSpace(vars.spacing[16]);

// 상자는 테두리·링만 그리고, textarea가 상자를 꽉 채워서 어디를 눌러도 포커스돼요.
export const box = style([
  inputBox,
  {
    ...valueText,
    display: "flex",
    flexDirection: "column",
    minHeight: vars.textarea.minHeight,
  },
]);

export const textarea = recipe({
  base: [
    control,
    {
      flexGrow: 1,
      boxSizing: "border-box",
      // 부모 너비를 꽉 채워요. field-sizing: content는 너비도 내용에 맞춰서 꼭 정해요.
      width: "100%",
      padding,
      wordBreak: "keep-all",
      overflowWrap: "break-word",
      // Figma에 손잡이가 없고, 늘린 높이가 heightMode·maxRows보다 앞서서 규칙이 하나 늘어요.
      resize: "none",
    },
  ],

  variants: {
    heightMode: {
      // 지원하지 않는 브라우저는 상자 최소 높이에 고정되고 안에서 스크롤해요. 입력은 돼요.
      auto: {
        "@supports": {
          "(field-sizing: content)": {
            fieldSizing: "content",
            // maxRows가 없으면 변수가 비어 max-height가 none이 돼요.
            maxHeight: `calc(var(${maxRowsProperty}) * ${vars.font.lineHeight.t5} + 2 * ${padding})`,
          },
        },
      },
      // rows가 높이를 정하고, 넘치면 안에서 스크롤해요.
      fixed: {},
    },
  },

  defaultVariants: {
    heightMode: "auto",
  },
});

export type TextareaVariants = NonNullable<RecipeVariants<typeof textarea>>;
