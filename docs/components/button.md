# Button

누르면 바로 실행되는 동작이에요. 이 문서는 Button의 **결정과 이유**만 남겨요. 어디에 무엇을 두는지는 CLAUDE.md "정책을 둘 곳"을 따라요.

- **동작 계약**: `packages/react/src/components/Button/Button.test.tsx`의 테스트 이름이 정본이에요
- **사용 가이드**: Figma `Button & IconButton` 페이지
- **비교한 자료**(2026-11-09)
  - SEED: https://seed-design.io/react/components/action-button, `daangn/seed-design`의 `ActionButton.tsx`, `recipes/action-button.ts`
  - Montage: https://montage.wanted.co.kr/docs/components/actions/button/web, `/design`
  - Toss TDS: `@toss/tds-mobile` 2.5.1의 Button(눌림 효과만)

## 정한 것

- **variant 5개(`primary`, `neutral`, `secondary`, `ghost`, `critical`)**: 색(SEED `brandSolid`)이 아니라 중요도로 지어요. 색은 `_internal/buttonBase.css.ts`에서 이어요(`primary` → `bg/brand-solid`, `critical` → `bg/critical-solid`). 버튼 전용 색 토큰(`action-*`)은 brand와 값이 같고 Checkbox·Radio·Switch도 써서 brand로 합쳤어요
- **`neutral`은 `critical`처럼 쓰임새로 지어요**: 중요도는 `primary`와 같고 색만 달라서 중요도 이름으로는 구분되지 않아요. 브랜드 색의 "권장" 느낌 없이 강하게 보여야 할 때 써요(Alert Dialog `Tone=Neutral`). `contrast`도 봤지만 뜻을 따로 배워야 하고, `neutral`은 토큰 `bg/neutral-solid`와 이름이 그대로 이어져요
- **variant 하나로 표현**: Montage처럼 `variant`와 `color`로 나누면 `critical`+outline 같은 없는 조합이 생겨요(SEED와 같아요)
- **기본값 `variant="primary"`, `size="medium"`**: SEED의 `defaultVariants`와 같아요
- **size 4개(`xsmall`~`large`)**: Figma 값(32/44/48/56) 그대로예요
- **아이콘은 `prefixIcon`/`suffixIcon` prop**: 이름은 SEED를, 방식은 자식 조합(`<PrefixIcon>`)이 아니라 prop을 골랐어요. 다른 컴포넌트에도 아이콘 자리가 필요해지면 조합 방식을 더해도 깨지지 않아요
- **`fullWidth`**: Montage와 같아요. Figma의 Hug/Fill은 코드에서 바로 읽히지 않아요
- **`loading` 중에는 클릭을 막고 포커스는 남겨요**: Montage와 같고 SEED와 달라요. Foundation 규칙(aria-busy, 중복 방지, 포커스 유지)을 따라요. 쓰는 쪽 핸들러보다 먼저 막아야 해서 `composeEventHandlers`를 쓰지 않아요
- **`asChild`**: SEED와 같아요(Montage는 `as`). `Primitive.button`으로 렌더해요
- **상태는 `data-disabled`, `data-loading`으로 드러내요**: 누를 수 없으면(disabled나 loading) `data-disabled`가 붙고, CSS는 이 속성을 봐요. `asChild`로 `<a>`를 렌더해도 같은 스타일이 적용돼요
- **눌림 효과는 TDS와 같아요**: 0.96으로 줄고(꽉 찬 너비면 줄지 않음), 누를 때 `spring-rapid`(200ms), 뗄 때 `spring-quick`(350ms) 곡선이에요. 색은 TDS의 dim 막 대신 Figma의 pressed 토큰을 써요

## 뺀 것

- **Brand Outline, Neutral Outline**: 역할이 `primary`·`secondary`와 겹쳐요. 필요한 화면이 생기면 더해요. Neutral Solid는 Alert Dialog가 써서 `neutral`로 더했어요
- **`color`, `fontWeight`**(SEED Ghost 전용)
- **`bleed`, `bleedX`, `bleedY`, `flexGrow`**(SEED): 레이아웃 유틸 체계가 있어야 쓸모 있어요
- **`layout="iconOnly"`(SEED), `iconOnly`(Montage)**: [IconButton](icon-button.md)을 따로 둬요. aria-label을 타입으로 강제하기 쉬워요
- **`disableLoadingPreventEvents`, `disableInteraction`**(Montage)
- **반응형 size**(Montage의 `xl`/`lg`/… prop)

## 열린 질문

- **반전 표면 위의 Ghost**: Snackbar 같은 반전 표면용 값을 코드에 담는 방법은 #66에서 다뤄요
- **Alert Dialog의 `Tone`**(Brand/Neutral/Critical): 버튼 색은 `primary`·`neutral`·`critical`로 그려요. Tone을 어떤 API로 고를지는 Alert Dialog를 만들 때 정해요
