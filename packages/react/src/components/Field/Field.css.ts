import { textStyles, vars } from "@d5ng/tokens";
import { style } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

// 상태 선택자는 한 곳에서만 정해요. Field가 root에 붙이는 data 속성을 봐요.
const invalidSelector = "[data-invalid]";
const disabledSelector = "[data-disabled]";

export const root = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing[8],
});

// 부품마다 같은 비활성 색 규칙을 붙여요. invalid와 우선순위가 같아서 invalid 규칙보다 뒤에 둬야 disabled가 이겨요.
const disabledColor = {
  [`${root}${disabledSelector} &`]: { color: vars.color.fg.disabled },
};

// ---- header

export const header = style({
  display: "flex",
  alignItems: "center",
  gap: vars.spacing[10],
  paddingInline: vars.spacing[2],
});

export const label = recipe({
  base: {
    // 긴 라벨이 보조 액션을 밀어내지 않고 줄바꿈되게 해요.
    minWidth: 0,
    fontFamily: vars.font.family.base,
    fontSize: vars.font.size.t5,
    lineHeight: vars.font.lineHeight.t5,
    // textStyles에 16/22 묶음이 없어서 한글 줄바꿈 규칙만 따로 맞춰요.
    wordBreak: "keep-all",
    overflowWrap: "break-word",
    color: vars.color.fg.neutral,
    selectors: disabledColor,
  },

  variants: {
    weight: {
      medium: { fontWeight: vars.font.weight.medium },
      semibold: { fontWeight: vars.font.weight.semibold },
    },
  },

  defaultVariants: {
    weight: "medium",
  },
});

export type LabelVariants = NonNullable<RecipeVariants<typeof label>>;

// 여러 줄 라벨의 끝에 붙도록 inline으로 둬요(Figma Guidelines).
export const requiredMark = style({
  display: "inline-block",
  // Figma가 표시 크기를 변수로 묶지 않았어요.
  width: "6px",
  height: "6px",
  marginInlineStart: vars.spacing[2],
  // 첫 줄 윗변에서 4px 아래에 둬요(Figma).
  verticalAlign: "top",
  marginTop: vars.spacing[4],
  color: vars.color.fg.critical,
  selectors: disabledColor,
});

export const optional = style({
  marginInlineStart: vars.spacing[4],
  fontSize: vars.font.size.t4,
  // 라벨과 같은 22px 행간에 윗변을 맞춰요(Figma). 기준선에 맞추면 글자 크기가 달라 줄이 24px로 커져요.
  lineHeight: vars.font.lineHeight.t5,
  verticalAlign: "top",
  fontWeight: vars.font.weight.regular,
  color: vars.color.fg.neutralMuted,
  selectors: disabledColor,
});

// 라벨을 숨겨도 오른쪽에 남도록 justify-content 대신 auto 여백으로 밀어요.
export const headerAction = style({
  display: "flex",
  flexShrink: 0,
  marginInlineStart: "auto",
});

// ---- footer

export const footer = style({
  display: "flex",
  gap: vars.spacing[8],
  paddingInline: vars.spacing[2],
});

const message = style({
  ...textStyles.bodySmall,
  display: "flex",
  flex: 1,
  alignItems: "flex-start",
  gap: vars.spacing[6],
  minWidth: 0,
});

export const description = style([
  message,
  {
    color: vars.color.fg.neutralMuted,
    selectors: disabledColor,
  },
]);

export const errorMessage = style([
  message,
  {
    color: vars.color.fg.critical,
    selectors: disabledColor,
  },
]);

// 색은 문구 색(currentColor)을 따라가요.
export const messageIcon = style({
  flexShrink: 0,
  // Figma가 아이콘 크기를 변수로 묶지 않았어요.
  width: "16px",
  height: "16px",
});

export const count = style({
  ...textStyles.bodySmall,
  flexShrink: 0,
  color: vars.color.fg.neutralMuted,
  selectors: {
    [`${root}${invalidSelector} &`]: { color: vars.color.fg.critical },
    ...disabledColor,
  },
});

// 값이 있을 때만 현재 값이 진해요. 비었거나 상태 색일 때는 count 색을 따라가요.
export const countCurrent = style({
  color: vars.color.fg.neutral,
  selectors: {
    [`&[data-empty], ${root}${invalidSelector} &, ${root}${disabledSelector} &`]:
      { color: "inherit" },
  },
});
