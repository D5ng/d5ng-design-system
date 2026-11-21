// footerButton이 Button의 size 클래스보다 뒤에 나와야 이겨서, Button CSS를 먼저 불러 순서를 고정해요.
import "../Button/Button.css";

import { textStyles, vars } from "@d5ng/tokens";
import { createVar, style } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

import { focusRing } from "../_internal/focusRing.css";
import {
  fadeSelectors,
  portalRoot,
  viewportMargin,
} from "../_internal/modal.css";

export { overlay } from "../_internal/modal.css";

// DialogBody가 붙이는 스크롤 상태예요. 위나 아래에 가려진 내용이 있다는 뜻이에요.
const overflowTopSelector = "[data-overflow-top]";
const overflowBottomSelector = "[data-overflow-bottom]";

// Foundation Layout 초안의 태블릿 경계예요. 너비 경계 토큰이 없어요.
const wideViewport = "screen and (min-width: 768px)";

// 노치·홈 표시줄을 피해요. 페이지가 viewport-fit=cover가 아니면 모두 0이에요.
const safeArea = {
  top: "env(safe-area-inset-top, 0px)",
  right: "env(safe-area-inset-right, 0px)",
  bottom: "env(safe-area-inset-bottom, 0px)",
  left: "env(safe-area-inset-left, 0px)",
};
const safeWidth = `(100% - ${safeArea.left} - ${safeArea.right})`;
const safeHeight = `(100% - ${safeArea.top} - ${safeArea.bottom})`;

const sidePadding = vars.spacing[24];
const footerGap = vars.spacing[8];

// 넘칠 때 흐림 높이이자 Body 아래 여백이에요. 같아야 맨 아래 내용이 흐림 위로 올라와요.
const fogHeight = vars.spacing[48];

// Body 위에 얹는 구분선·흐림 그림이에요. 스크롤 상태가 채우고, 아니면 none이에요.
const dividerLayer = createVar();
const fogLayer = createVar();

export const content = recipe({
  base: {
    ...portalRoot,

    position: "fixed",
    top: safeArea.top,
    right: safeArea.right,
    bottom: safeArea.bottom,
    left: safeArea.left,
    margin: "auto",
    // Figma: 768px 미만은 안전 영역 너비의 90%예요. 비율 토큰이 없어요.
    width: `calc(${safeWidth} * 0.9)`,
    height: "fit-content",
    // Figma: 안전 영역 높이의 80%예요. 비율 토큰이 없어요.
    maxHeight: `calc(${safeHeight} * 0.8)`,
    // 확대해서 Header와 Footer만으로 넘쳐도 버튼까지 스크롤로 닿게 해요.
    overflowY: "auto",

    display: "flex",
    flexDirection: "column",
    borderRadius: vars.radius.xl,
    background: vars.color.bg.layerFloating,
    boxShadow: vars.shadow.lg,

    "@media": {
      [wideViewport]: {
        width: `calc(${safeWidth} - ${viewportMargin} * 2)`,
      },
    },

    selectors: {
      ...fadeSelectors,
      "&:focus": { outline: "none" },
    },
  },

  variants: {
    // 좁은 화면에서도 이 너비를 넘지 않아요. Figma에 480·800에 맞는 크기 토큰이 없어요.
    size: {
      medium: { maxWidth: "480px" },
      large: { maxWidth: "800px" },
    },
  },

  defaultVariants: {
    size: "medium",
  },
});

export type DialogContentVariants = NonNullable<RecipeVariants<typeof content>>;

export const header = style({
  flexShrink: 0,
  display: "grid",
  // 닫기 버튼만 둘째 열에 놓여서, 버튼이 없으면 글이 너비를 다 써요.
  gridTemplateColumns: "minmax(0, 1fr)",
  alignItems: "start",
  gap: vars.spacing[8],
  padding: `${vars.spacing[24]} ${sidePadding} ${vars.spacing[16]}`,
});

export const title = style({
  ...textStyles.headingSection,
  margin: 0,
});

export const description = style({
  ...textStyles.bodyDefault,
  margin: 0,
  color: vars.color.fg.neutralMuted,
});

export const closeButton = style({
  // 제목과 설명 두 줄에 걸쳐 오른쪽 위에 붙어요.
  gridColumn: 2,
  gridRow: "1 / span 2",
});

export const body = style({
  position: "relative",
  flex: "1 1 auto",
  // 기본값(내용 높이)이면 줄어들지 않아서 Body가 스크롤되지 않아요.
  minHeight: 0,
  display: "flex",
  flexDirection: "column",

  vars: {
    [dividerLayer]: "none",
    [fogLayer]: "none",
  },

  selectors: {
    [`&${overflowTopSelector}`]: {
      vars: {
        [dividerLayer]: `linear-gradient(${vars.color.stroke.neutralMuted}, ${vars.color.stroke.neutralMuted})`,
      },
    },
    [`&${overflowBottomSelector}`]: {
      vars: {
        [fogLayer]: `linear-gradient(${vars.color.dialog.fogClear}, ${vars.color.bg.layerFloating})`,
      },
    },
    // 구분선과 흐림을 스크롤되는 내용 위에 얹어요.
    "&::before": {
      content: '""',
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      backgroundImage: `${dividerLayer}, ${fogLayer}`,
      // 구분선 두께는 Figma에도 토큰이 없어요. 흐림은 확대해서 Body가 아주 낮아져도 Header를 덮지 않게 해요.
      backgroundSize: `100% 1px, 100% min(${fogHeight}, 100%)`,
      backgroundPosition: "top, bottom",
      backgroundRepeat: "no-repeat",
    },
    // 스크롤 영역의 포커스 링이에요. 스크롤 영역에 그리면 ::before의 흐림이 링 아래쪽을 덮어서, 그 뒤 층에 그려요.
    "&:has(> :focus-visible)::after": {
      content: '""',
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      ...focusRing,
      // 좌우 끝이 표면 가장자리라 바깥 링은 Content가 잘라요. 같은 간격만큼 안쪽에 그려요.
      outlineOffset: `calc(${vars.focusRing.width} * -2)`,
      // 각진 링은 Footer 없을 때 표면의 둥근 아래 모서리에 잘려요. 안쪽으로 든 만큼 작은 모서리로 맞춰요.
      borderRadius: vars.radius.lg,
    },
  },
});

export const bodyViewport = style({
  flex: "1 1 auto",
  minHeight: 0,
  overflowY: "auto",
  padding: `0 ${sidePadding} ${sidePadding}`,

  selectors: {
    // 넘치는 동안만 아래 여백을 흐림만큼 늘려요. 포커스를 옮길 때도 흐림 밑에 멈추지 않아요.
    [`&${overflowTopSelector}, &${overflowBottomSelector}`]: {
      paddingBottom: fogHeight,
      scrollPaddingBottom: fogHeight,
    },
    // 링은 바깥 요소(body)의 ::after가 그려요.
    "&:focus-visible": { outline: "none" },
  },
});

export const footer = style({
  flexShrink: 0,
  display: "flex",
  flexWrap: "wrap",
  gap: footerGap,
  padding: `${vars.spacing[16]} ${sidePadding} ${sidePadding}`,
});

export const footerButton = style({
  // 두 버튼이 반씩 나눠 가져요. 라벨이 반 폭에 안 들어가면 줄이 넘어가 세로로 쌓이고, 각자 한 줄을 다 채워요.
  flex: `1 1 calc((100% - ${footerGap}) / 2)`,
  // Button의 최소 너비(높이와 같음)를 풀어 라벨 너비가 최소가 되게 해요. 줄 넘김은 이 값으로 정해져요.
  minWidth: "auto",
  // 라벨이 한 줄보다 길어도 버튼이 영역을 넘지 않게 해요.
  maxWidth: "100%",
});
