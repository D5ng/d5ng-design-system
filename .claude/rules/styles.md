---
paths:
  - "**/*.css.ts"
---

# 스타일 (vanilla-extract)

컴포넌트 스타일은 `<Name>/<Name>.css.ts`에, 두 컴포넌트가 같이 쓰는 것은 `components/_internal/*.css.ts`에 둔다. 공통 스타일도 공통 코드와 같이 두 번째로 쓰일 때 옮긴다.

## 값은 토큰으로

- 색, 간격, 크기, 모서리, 그림자, 글자, 모션은 `@d5ng/tokens`의 `vars`로 쓴다. 글자 묶음은 `...textStyles.bodyDefault`처럼 펼친다
- 토큰이 없는 값만 숫자로 쓰고, 왜 없는지 주석을 단다(`// Figma에도 14에 맞는 spacing 토큰이 없어요.`)
- 테마(Light·Dark)는 토큰이 `[data-theme]`로 바꾼다. 컴포넌트 CSS에 테마 선택자를 쓰지 않는다
- 포커스 링은 `_internal/focusRing.css.ts`의 `focusRing`을 자기 포커스 선택자 안에 펼친다(`"&:focus-visible": focusRing`). 두께·색·띄움은 컴포넌트에서 따로 정하지 않고, 필요하면 모서리만 더한다(Link)

## 무엇을 recipe에, 무엇을 data 속성에

- **정적 값**(variant, size, fullWidth)은 `recipe`의 variants로 둔다. `defaultVariants`는 컴포넌트 prop의 `@default`와 같게 맞춘다
- **상태**(disabled, loading, open)는 컴포넌트가 붙인 `data-*` 속성을 선택자로 본다. Radix가 붙이는 속성(`data-state="open"`, `data-side`)도 그대로 쓴다
- 상태 선택자 문자열은 파일 위에 한 번만 정한다(`const disabledSelector = "[data-disabled]"`)
- variant마다 바뀌는 값이 여러 상태 규칙에 걸치면 `createVar`로 받는다. variant는 변수만 채우고, 상태 규칙은 한 곳에서 변수를 읽는다(`buttonBase.css.ts`). 파일 밖에서 채울 변수만 export한다

## 선택자와 우선순위

- 모든 스타일은 `@layer d5ng`에 들어간다(빌드가 감싼다). 쓰는 쪽 CSS가 레이어 밖에서 항상 이기므로 `!important`는 쓰지 않는다
- 클래스 하나 수준의 우선순위를 유지한다. `selectors`는 `&`를 대상으로만 쓸 수 있다(vanilla-extract 제약)
- 자식을 꾸며야 하면 자식에 클래스를 준다. 쓰는 쪽이 넣는 요소(아이콘 `svg`)처럼 클래스를 줄 수 없을 때만 `globalStyle`을 쓰고 이유를 단다
- 같은 속성을 두 클래스가 정하면 **나중에 정의된 쪽**이 이긴다. recipe는 base → variants(정의 순) → compoundVariants 순이고, import한 파일의 CSS가 먼저 나온다. 순서에 기대는 곳은 주석으로 남기고, 옮긴 뒤에는 빌드 CSS로 확인한다
- hover는 `@media (hover: hover)` 안에 둔다. 터치에서 hover가 남지 않게 한다

## 모션

- 시간과 곡선은 `vars.duration`, `vars.easing`을 쓴다
- 움직임은 `prefers-reduced-motion: reduce`에서 끄거나 줄인다. 끈 뒤에도 상태가 전달되는지(`aria-busy`, 색) 확인한다
- 새 CSS 기능은 `@supports`로 감싸고 없을 때의 값을 먼저 둔다(`linear()` 곡선)
- Radix `Presence`로 사라지는 부분(Dialog, Popover)은 **나갈 때 `transition`이 아니라 `keyframes` 애니메이션**을 쓴다. Presence는 `animationend`를 기다렸다가 DOM에서 뺀다

## Portal로 나가는 부분

- `Portal`로 `body`에 붙는 부분은 부모 스타일을 물려받지 못한다. 글꼴, 글자색, `box-sizing`을 그 부분이 직접 정한다

## 겹치는 층

- **z-index는 쓰지 않는다**: Portal이 `body` 끝에 붙어 DOM 순서로 위에 온다. 중첩되면 나중에 연 것이 위다. 근거는 `docs/components/alert-dialog.md`
- **부분 테마는 지원하지 않는다**: `data-theme`은 `html`에만 붙인다. 영역에 붙인 테마는 Portal 내용이 받지 못한다
