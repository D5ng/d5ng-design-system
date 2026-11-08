# Button

- 비교한 날: 2026-11-09
- 읽은 것:
  - https://seed-design.io/react/components/action-button
  - `daangn/seed-design`의 `packages/react/src/components/ActionButton/ActionButton.tsx`, `packages/qvism-preset/src/recipes/action-button.ts`
  - https://montage.wanted.co.kr/docs/components/actions/button/web
  - https://montage.wanted.co.kr/docs/components/actions/button/design

## 정한 것

- **variant 4개(`primary`, `secondary`, `ghost`, `critical`)**: 따로 브랜드 색이 없어서 색이 아니라 역할로 지음. 주 색(파랑이냐 검정이냐)은 `bg/action-primary` 토큰 값만 바꾸면 됨
- **variant 하나로 표현**: Montage처럼 `variant`+`color`로 나누면 `critical`+outline 같은 없는 조합이 생김(SEED와 같음)
- **기본값 `variant="primary"`, `size="medium"`**: SEED의 `defaultVariants`와 같음
- **size 4개(`xsmall`~`large`)**: Figma 값(32/44/48/56) 그대로
- **아이콘은 `prefixIcon`/`suffixIcon` prop**: 이름은 SEED를 따름. 방식은 SEED의 자식 조합(`<PrefixIcon>`)이 아니라 prop. 다른 컴포넌트에도 아이콘 자리가 필요해지면 그때 조합 방식을 추가함
- **`fullWidth`**: Montage와 같음. Figma의 Hug/Fill은 코드에서 바로 읽히지 않음
- **`loading` 중에는 클릭을 막고 포커스는 남김**: Montage와 같고 SEED와 다름. 우리 Foundation 규칙(aria-busy, 중복 방지, 포커스 유지)을 따름
- **`asChild`**: SEED와 같음. Montage는 `as`

## 뺀 것

- **Brand Outline, Neutral Outline, Neutral Solid**: 역할이 `primary`·`secondary`와 겹침. 필요한 화면이 생기면 추가
- **`color`, `fontWeight`(SEED Ghost 전용)**
- **`bleed`, `bleedX`, `bleedY`, `flexGrow`(SEED)**: 레이아웃 유틸 체계가 있어야 쓸모 있음
- **`layout="iconOnly"`(SEED), `iconOnly`(Montage)**: IconButton을 따로 둠. aria-label을 타입으로 강제하기 쉬움
- **`disableLoadingPreventEvents`, `disableInteraction`(Montage)**
- **반응형 size(`xl`/`lg`/… prop, Montage)**

## 나중에 볼 것

- Alert Dialog의 `Tone`(Brand/Neutral/Critical)도 같은 이유로 정리 대상. Figma에서 `Tone=Neutral`이 빠진 Neutral Solid 버튼을 씀
- Snackbar 위의 Ghost(Inverse 표면)는 Snackbar를 만들 때
