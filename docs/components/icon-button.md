# IconButton

아이콘만으로 실행하는 동작이에요. 이 문서는 IconButton의 **결정과 이유**만 남겨요. Button과 같은 결정(variant 이름, 상태 규칙, 눌림 효과)은 [button.md](button.md)를 따라요.

- **동작 계약**: `packages/react/src/components/IconButton/IconButton.test.tsx`의 테스트 이름이 정본이에요
- **사용 가이드**: Figma `Button & IconButton` 페이지
- **비교한 자료**(2026-11-09)
  - SEED: https://seed-design.io/react/components/action-button, `daangn/seed-design`의 `ActionButton.tsx`, `action-button.yaml`
  - Montage: https://montage.wanted.co.kr/docs/components/actions/icon-button/web, `/design`
  - Radix Themes: `icon-button.tsx`, `_internal/base-button.tsx`

## 정한 것

- **Button과 따로 둬요**: SEED는 `ActionButton layout="iconOnly"`로 합쳤지만, 따로 두면 `aria-label`을 타입으로 강제하기 쉬워요(button.md "뺀 것")
- **아이콘은 `children`으로 받아요**: SEED·Montage·Radix Themes와 같아요. `icon` prop이면 `asChild`일 때만 children이 생겨 모드마다 props가 갈려요(FF R1). children이면 `asChild`와 상관없이 "버튼 안에 들어갈 것" 하나예요. Figma의 아이콘 교체 속성 이름도 `children`으로 맞췄어요
- **`aria-label`은 필수예요**: Button의 children은 이름으로 읽히는 문구인데, IconButton의 children은 스크린리더가 읽지 않는 아이콘이에요. 같은 이름의 뜻이 달라서(FF P1) 이름이 빠지면 타입 에러가 나게 했어요. SEED는 경고만, Montage는 권장만 해요
- **variant는 Button과 같고, size 4개, 기본 `primary`·`medium`**: Figma 값 그대로예요. 크기는 32/44/48/56 정사각형이고 Button과 같은 `button/*` 토큰을 써요
- **`loading`, `asChild`**: Figma에 loading 상태가 있고, 상태 규칙을 Button과 같이 써서 더하는 비용이 없어요. Montage에는 loading이 없어요
- **공통 코드는 `components/_internal/`에 둬요**: 상태 규칙(`buttonState.ts`), 스피너, 색·상태·눌림 스타일(`buttonBase.css.ts`)을 Button과 같이 써요. Figma가 이 부분을 "Button과 같다"고 정했어요. 크기와 내용 배치는 각자 가져요(FF K2)
- **공통 렌더 컴포넌트(`ButtonBase`)는 두지 않아요**: Radix Themes 방식이에요. 컴포넌트 파일만 읽어서는 로딩 때 무엇이 그려지는지 안 보이고(FF R6), 스피너가 `<a>` 안에 들어가는 게 Slot의 형제 합치기에 기대게 돼요
- **아이콘은 Lucide(`lucide-react`)예요**: Figma 아이콘이 모두 Lucide라 이름과 모양이 그대로 맞아요. 스피너도 Figma loading 상태와 같은 `LoaderCircle`이고, 스토리 아이콘도 여기서 가져와요

## 뺀 것

- **`aria-labelledby`**: 지금 쓸 화면이 없어요. 나중에 더해도 쓰는 쪽은 깨지지 않아요
- **Montage의 `interactionEffect`, `interactionOverflow`, `size={number}`, background·outlined variant**: 지금 쓸 화면이 없어요

## 열린 질문

- **반전 표면 위의 Ghost**: #66에서 Button과 같이 다뤄요
