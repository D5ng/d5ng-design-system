// 자동 생성 파일이에요. 직접 고치지 말고 `pnpm generate`를 실행해요.

import { vars } from "./vars";

export const textStyles = {
  display: {
    fontFamily: vars.font.family.base,
    fontSize: vars.font.size.t13,
    lineHeight: vars.font.lineHeight.t13,
    fontWeight: vars.font.weight.bold,
  },
  headingPage: {
    fontFamily: vars.font.family.base,
    fontSize: vars.font.size.t10,
    lineHeight: vars.font.lineHeight.t10,
    fontWeight: vars.font.weight.bold,
  },
  headingSection: {
    fontFamily: vars.font.family.base,
    fontSize: vars.font.size.t7,
    lineHeight: vars.font.lineHeight.t7,
    fontWeight: vars.font.weight.semibold,
  },
  headingGroup: {
    fontFamily: vars.font.family.base,
    fontSize: vars.font.size.t6,
    lineHeight: vars.font.lineHeight.t6,
    fontWeight: vars.font.weight.semibold,
  },
  bodyDefault: {
    fontFamily: vars.font.family.base,
    fontSize: vars.font.size.t5,
    lineHeight: vars.font.lineHeight.t6,
    fontWeight: vars.font.weight.regular,
  },
  bodySmall: {
    fontFamily: vars.font.family.base,
    fontSize: vars.font.size.t4,
    lineHeight: vars.font.lineHeight.t4,
    fontWeight: vars.font.weight.regular,
  },
  caption: {
    fontFamily: vars.font.family.base,
    fontSize: vars.font.size.t3,
    lineHeight: vars.font.lineHeight.t3,
    fontWeight: vars.font.weight.regular,
  },
  labelDefault: {
    fontFamily: vars.font.family.base,
    fontSize: vars.font.size.t4,
    lineHeight: vars.font.lineHeight.t4,
    fontWeight: vars.font.weight.medium,
  },
  codeBlock: {
    fontFamily: vars.font.family.code,
    fontSize: vars.font.size.code,
    lineHeight: vars.font.lineHeight.code,
    fontWeight: vars.font.weight.regular,
  },
} as const;
