import { vars } from "@d5ng/tokens";
import { globalStyle, style } from "@vanilla-extract/css";

import { focusRing } from "../_internal/focusRing.css";

// 문장 안에서 줄바꿈되도록 inline으로 둬요. inline-flex면 긴 링크가 한 덩어리로 넘어가요.
export const link = style({
  display: "inline",
  // 크기·행간·굵기는 주변 문장을 따라요(Figma에 size 속성이 없음).
  font: "inherit",
  color: vars.color.fg.brand,
  textDecorationLine: "underline",
  // Figma에도 밑줄 두께와 오프셋 토큰이 없어요.
  textDecorationThickness: "1px",
  textUnderlineOffset: "3px",
  textDecorationSkipInk: "auto",
  WebkitTapHighlightColor: "transparent",

  selectors: {
    "&:focus-visible": {
      ...focusRing,
      // 글자에는 모서리가 없어서 링 모서리만 작게 둥글려요.
      borderRadius: vars.radius.sm,
    },
    "&:active": {
      color: vars.color.fg.brandPressed,
    },
  },

  "@media": {
    "(hover: hover)": {
      selectors: {
        "&:hover:not(:active)": {
          color: vars.color.fg.brandHover,
        },
      },
    },
  },
});

// inline-block이라 부모 밑줄이 아이콘까지 이어지지 않아요.
export const icon = style({
  display: "inline-block",
  // 16px 문장에서 14px(Figma)이에요. em이라 문장 크기를 따라가요.
  width: "0.875em",
  height: "0.875em",
  // 아이콘처럼 문장 크기를 따라가요. 16px 문장에서 4px(Figma spacing/4)예요.
  marginInlineStart: "0.25em",
  verticalAlign: "middle",
});

// 아이콘 라이브러리마다 기본 크기가 달라서 자리에 맞춰 늘이거나 줄여요.
globalStyle(`${icon} > svg`, {
  display: "block",
  width: "100%",
  height: "100%",
});
