---
paths:
  - "packages/react/src/**/*.{ts,tsx}"
---

# 컴포넌트 코드

구현 수준은 Radix Primitive(`toggle.tsx`, `collapsible.tsx`)를 기준으로 삼는다. 구조는 Radix를 따르고, 아래 이름 규칙은 우리 것을 쓴다. "(lint)"가 붙은 규칙은 `eslint.config.js`의 `no-restricted-syntax`가 검사한다.

## 이름과 형태

- 컴포넌트는 `function` 선언으로, 그 안에서 만드는 함수는 `const` 화살표 함수로 쓴다 (lint)
- props 타입은 컴포넌트 이름 뒤에 `Props`를 붙여 `ButtonProps`처럼 짓고, 패키지 밖으로도 그 이름 그대로 내보낸다. 파일 안에서만 쓰는 보조 컴포넌트도 `AliasProps`처럼 같은 규칙을 따른다
- props는 매개변수에서 구조 분해하고, 나머지는 렌더하는 부분 이름으로 받는다: `...buttonProps`, `...triggerProps`, `...contentProps` (lint는 `restProps`, `props`, `rest`를 막는다. 이름이 부분과 맞는지는 리뷰에서 본다)
- 제어 상태는 `open`, `defaultOpen`, `onOpenChange` 세 이름으로 받고 안에서는 `openProp`이라 부른다. 셋은 `useControllableState({ caller: NAME })`로 묶는다
- 파일 순서: 상수(`NAME`) → 타입 → 컴포넌트 → 보조 함수 → export

## 렌더링

- 속성 순서에 뜻을 담는다: 쓰는 쪽이 바꿔도 되는 기본값(`type`, `aria-*`, `data-*`) → `{...buttonProps}` → 지켜야 할 것(className 합치기, 합친 이벤트 핸들러)
- 상태는 `data-*`로 드러내고(`data-disabled=""`, `data-state="open"`) 스타일은 그 속성을 본다. 크기나 variant 같은 정적 값만 recipe 클래스로 둔다
- asChild는 `Primitive.*`로 렌더한다
- 쓰는 쪽 핸들러와 합칠 때는 `composeEventHandlers(onClick, …)`를 쓴다. 쓰는 쪽보다 먼저 막아야 하면 손으로 쓰고 이유를 주석으로 남긴다

## Radix를 먼저 찾는다

필요한 동작은 이 순서로 찾고, 동작이 맞을 때만 쓴다.

1. `radix-ui`의 컴포넌트와 유틸(`Slot`, `VisuallyHidden`, `Portal`, `Direction`, `AccessibleIcon`)
2. `radix-ui/internal`(`useControllableState`, `composeEventHandlers`, `useComposedRefs`, `Primitive`, `Presence`, `FocusScope`, `DismissableLayer`, `RovingFocus`, `Context` 등). Radix Themes도 이 경로를 쓴다
3. 통합 패키지에 없을 때만 개별 `@radix-ui/*`를 `radix-ui`가 쓰는 버전으로 설치한다(`react-use-previous`, `number`, `react-use-rect`). `@radix-ui/react-*`는 `no-restricted-imports`가 막으니 그 패키지만 예외로 추가한다
4. React 기본 기능(`useId` 등)
5. 직접 만든다

## 정책을 둘 곳

컴포넌트 정책은 종류마다 정본을 한 곳에 두고, 나머지는 링크만 한다.

| 종류               | 예                                    | 정본                         | 다른 곳                                               |
| ------------------ | ------------------------------------- | ---------------------------- | ----------------------------------------------------- |
| 동작 계약          | loading이면 클릭을 막고 포커스는 남김 | 테스트 이름                  | prop JSDoc 한 줄                                      |
| 결정과 이유        | variant를 4개로 줄인 이유, 뺀 prop    | `docs/components/<이름>.md`  |                                                       |
| 사용 가이드        | 언제 쓰나, Do/Don't                   | Figma                        | 코드에서 고르는 걸 바꾸는 규칙만 컴포넌트 JSDoc 한 줄 |
| 여러 컴포넌트 공통 | disabled·loading을 aria로 바꾸는 규칙 | Figma Foundation과 공통 코드 | 공통 코드는 두 번째로 쓰일 때 만든다                  |
