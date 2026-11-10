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
- 제어 상태는 `open`, `defaultOpen`, `onOpenChange` 세 이름으로 받고 안에서는 `openProp`이라 부른다. Radix 컴포넌트를 감싸면 셋을 그대로 넘긴다. 상태를 직접 가져야 하면 그때 `_internal/useControllableState`를 만든다
- 여러 부분으로 된 컴포넌트는 부분마다 이름으로 내보낸다: 루트는 `AlertDialog`, 나머지는 `AlertDialogContent`처럼 루트 이름을 앞에 붙인다. `export * as`나 객체로 묶은 이름공간(`AlertDialog.Content`)은 만들지 않는다
- 파일 순서: 상수(`NAME`) → 타입 → 컴포넌트 → 보조 함수 → export

## 렌더링

- 속성 순서에 뜻을 담는다: 쓰는 쪽이 바꿔도 되는 기본값(`type`, `aria-*`, `data-*`) → `{...buttonProps}` → 지켜야 할 것(className 합치기, 합친 이벤트 핸들러)
- 상태는 `data-*`로 드러내고(`data-disabled=""`, `data-state="open"`) 스타일은 그 속성을 본다. 크기나 variant 같은 정적 값만 recipe 클래스로 둔다
- asChild는 `const Comp = asChild ? Slot.Root : "button"`으로 렌더한다
- 쓰는 쪽 핸들러와 합칠 때는 `_internal/composeEventHandlers`의 `composeEventHandlers(onClick, …)`를 쓴다. 쓰는 쪽보다 먼저 막아야 하면 손으로 쓰고 이유를 주석으로 남긴다
- 클래스는 `clsx(styles.button(…), className)`로 합친다

## 서버 컴포넌트

쓰는 쪽이 Next.js App Router의 서버 컴포넌트에서 바로 import해도 깨지지 않아야 한다. `apps/next`의 `next build`가 검사한다.

- 이럴 때 파일 맨 위(import보다 앞)에 `"use client"`를 붙인다: hook을 쓸 때, 이벤트 핸들러나 render 함수를 만들어 요소·컴포넌트에 넘길 때, 브라우저 API를 쓸 때, 상태 있는 Radix 컴포넌트(Dialog 등)를 감쌀 때
- `Slot`만 쓰는 컴포넌트(`Link`), `_internal`의 순수 함수와 `.css.ts`, `index.ts`에는 붙이지 않는다. 붙이면 서버에서 렌더할 수 있는 컴포넌트까지 클라이언트 JS로 나간다
- 새 export는 `apps/next/app/page.tsx`에 렌더한다. 핸들러가 달라지는 prop(`loading`, `asChild`)도 따로 렌더한다

## 직접 만들기 전에 찾는다

필요한 동작은 이 순서로 찾고, 동작이 맞을 때만 쓴다.

1. `radix-ui`의 공개 컴포넌트와 유틸(`Slot`, `VisuallyHidden`, `Portal`, `Direction`, `AccessibleIcon`). 포커스 가두기·바깥 클릭 닫기·닫힘 애니메이션 같은 무거운 동작은 그 동작을 가진 컴포넌트(Dialog, Popover 등)를 감싸서 얻는다
2. React 기본 기능(`useId` 등)
3. 널리 쓰이는 작은 라이브러리(예: 클래스 합치기는 `clsx`). 손으로 짠 코드가 읽기 불편하면 먼저 라이브러리가 있는지 찾아보고, 크기·관리 상태·다른 디자인 시스템의 사용 여부를 비교해 `dependencies`에 넣는다
4. 직접 만든다. Radix 비공개 유틸과 같은 일이면 그 소스를 참고해 `components/_internal`에 같은 이름·계약으로 쓰고 `@see`로 출처를 남긴다

`radix-ui/internal`과 개별 `@radix-ui/*`는 쓰지 않는다(lint). Radix가 README마다 "internal utility, not intended for public usage"라고 밝힌 API라 버전을 올리면 예고 없이 바뀔 수 있다

## 정책을 둘 곳

컴포넌트 정책은 종류마다 정본을 한 곳에 두고, 나머지는 링크만 한다.

| 종류               | 예                                    | 정본                         | 다른 곳                                               |
| ------------------ | ------------------------------------- | ---------------------------- | ----------------------------------------------------- |
| 동작 계약          | loading이면 클릭을 막고 포커스는 남김 | 테스트 이름                  | prop JSDoc 한 줄                                      |
| 결정과 이유        | variant를 4개로 줄인 이유, 뺀 prop    | `docs/components/<이름>.md`  |                                                       |
| 사용 가이드        | 언제 쓰나, Do/Don't                   | Figma                        | 코드에서 고르는 걸 바꾸는 규칙만 컴포넌트 JSDoc 한 줄 |
| 여러 컴포넌트 공통 | disabled·loading을 aria로 바꾸는 규칙 | Figma Foundation과 공통 코드 | 공통 코드는 두 번째로 쓰일 때 만든다                  |
