# d5ng-design-system

Radix UI 위에 만든 React 디자인 시스템. npm 패키지(`@d5ng/tokens`, `@d5ng/react`)로 배포하고 pnpm workspace로 관리한다. 혼자 운영하는 저장소라 리뷰어는 몇 달 뒤의 나다. 그래서 모든 기록은 "나중에 다시 읽어도 이해되는가"를 기준으로 쓴다.

## 브랜치 (git flow)

- `develop`이 기본 브랜치다. `main`은 npm에 배포된 상태와 같다. 둘 다 직접 커밋하지 않는다
- 작업은 `git flow feature start <이름>`으로 시작하고, **PR로 develop에 머지**한다. `git flow feature finish`는 로컬에서 바로 머지해 버리므로 쓰지 않는다
- 브랜치 이름은 `feature/<kebab-case>` 하나로 쓴다. 작업 종류는 PR 제목과 라벨이 알려주므로 `fix/`, `chore/` 같은 접두어는 붙이지 않는다
- 머지 방식
  - feature → develop: **squash**. PR 제목이 곧 커밋 메시지가 된다
  - release/hotfix → main: **merge commit**. squash하면 main과 develop의 히스토리가 갈라진다

## 커밋과 PR 제목

Conventional Commits 형식에 요약은 한글로, 짧은 명사형으로 쓴다. scope는 패키지 이름이고, 저장소 전체에 걸친 변경이면 생략한다. 본문이 필요하면 ~요체로 한두 줄만 쓴다.

```
feat(react): Button 로딩 상태 추가
fix(tokens): 다크 모드 테두리 색 수정
chore: 이슈 폼 추가
```

규칙의 기준은 `commitlint.config.js`이고, `commit-msg` 훅이 커밋마다 검사한다. type은 `feat`, `fix`, `refactor`, `docs`, `chore`, `test`만 쓴다. 훅을 `--no-verify`로 건너뛰지 않는다.

## 글쓰기

이슈, PR, 커밋 본문은 모두 **한글 ~요체로 최대한 간결하게**, 처음 보는 사람도 이해할 수 있게 쓴다. PR 본문의 목록 항목만 예외로 ~요 없이 개조식으로 쓴다(아래 "PR"). "왜", "어떻게" 같은 형식적인 헤딩은 쓰지 않는다.

코드 주석도 ~요체로 핵심만 짧게 쓴다. 한 줄에 한 가지만 말하고 "~하는 용도다", "~하므로" 같은 군더더기는 뺀다.

- 예: `// 컴포넌트를 소스에서 읽어서 .css.ts를 처리할 플러그인이 필요해요.`

## 코드 품질

코드와 컴포넌트 API의 좋고 나쁨은 Frontend Fundamentals로 판단한다. 항목별 요지, 적용하지 않는 경우, props API 적용은 `docs/ff/`에 있으니 근거로 들 때는 해당 파일을 먼저 읽는다. FF는 변경 비용을 비교하는 기준이지 prop 철자를 정하는 명세가 아니다(`docs/ff/README.md`의 "API를 판단할 때의 경계"). 판단이 갈리면 가독성(`docs/ff/r*`)을 먼저 본다.

## 컴포넌트 코드

구현 수준은 Radix Primitive(`toggle.tsx`, `collapsible.tsx`)를 기준으로 삼는다. 구조는 Radix를 따르고, 아래 이름 규칙은 우리 것을 쓴다. "(lint)"가 붙은 규칙은 `eslint.config.js`의 `no-restricted-syntax`가 검사한다.

### 이름과 형태

- 컴포넌트는 `function` 선언으로, 그 안에서 만드는 함수는 `const` 화살표 함수로 쓴다 (lint)
- props 타입은 파일 안에서 `Props`라고 짓는다. 한 파일에 컴포넌트가 둘 이상이면 `TriggerProps`처럼 나눈다. 패키지 밖으로는 `export type { Props as ButtonProps }`처럼 컴포넌트 이름을 붙여 내보낸다
- props는 매개변수에서 구조 분해하고, 나머지는 렌더하는 부분 이름으로 받는다: `...buttonProps`, `...triggerProps`, `...contentProps` (lint는 `restProps`, `props`, `rest`를 막는다. 이름이 부분과 맞는지는 리뷰에서 본다)
- 제어 상태는 `open`, `defaultOpen`, `onOpenChange` 세 이름으로 받고 안에서는 `openProp`이라 부른다. 셋은 `useControllableState({ caller: NAME })`로 묶는다
- 파일 순서: 상수(`NAME`) → 타입 → 컴포넌트 → 보조 함수 → export

### 렌더링

- 속성 순서에 뜻을 담는다: 쓰는 쪽이 바꿔도 되는 기본값(`type`, `aria-*`, `data-*`) → `{...buttonProps}` → 지켜야 할 것(className 합치기, 합친 이벤트 핸들러)
- 상태는 `data-*`로 드러내고(`data-disabled=""`, `data-state="open"`) 스타일은 그 속성을 본다. 크기나 variant 같은 정적 값만 recipe 클래스로 둔다
- asChild는 `Primitive.*`로 렌더한다
- 쓰는 쪽 핸들러와 합칠 때는 `composeEventHandlers(onClick, …)`를 쓴다. 쓰는 쪽보다 먼저 막아야 하면 손으로 쓰고 이유를 주석으로 남긴다

### Radix를 먼저 찾는다

필요한 동작은 이 순서로 찾고, 동작이 맞을 때만 쓴다.

1. `radix-ui`의 컴포넌트와 유틸(`Slot`, `VisuallyHidden`, `Portal`, `Direction`, `AccessibleIcon`)
2. `radix-ui/internal`(`useControllableState`, `composeEventHandlers`, `useComposedRefs`, `Primitive`, `Presence`, `FocusScope`, `DismissableLayer`, `RovingFocus`, `Context` 등). Radix Themes도 이 경로를 쓴다
3. 통합 패키지에 없을 때만 개별 `@radix-ui/*`를 `radix-ui`가 쓰는 버전으로 설치한다(`react-use-previous`, `number`, `react-use-rect`). `@radix-ui/react-*`는 `no-restricted-imports`가 막으니 그 패키지만 예외로 추가한다
4. React 기본 기능(`useId` 등)
5. 직접 만든다

### 정책을 둘 곳

컴포넌트 정책은 종류마다 정본을 한 곳에 두고, 나머지는 링크만 한다.

| 종류               | 예                                    | 정본                         | 다른 곳                                               |
| ------------------ | ------------------------------------- | ---------------------------- | ----------------------------------------------------- |
| 동작 계약          | loading이면 클릭을 막고 포커스는 남김 | 테스트 이름                  | prop JSDoc 한 줄                                      |
| 결정과 이유        | variant를 4개로 줄인 이유, 뺀 prop    | `docs/components/<이름>.md`  |                                                       |
| 사용 가이드        | 언제 쓰나, Do/Don't                   | Figma                        | 코드에서 고르는 걸 바꾸는 규칙만 컴포넌트 JSDoc 한 줄 |
| 여러 컴포넌트 공통 | disabled·loading을 aria로 바꾸는 규칙 | Figma Foundation과 공통 코드 | 공통 코드는 두 번째로 쓰일 때 만든다                  |

## 이슈와 PR의 역할

이슈는 **무엇을 왜 해야 하는지**, PR은 **그걸 어떻게 했는지**를 남긴다. 같은 내용을 두 번 쓰지 않는다.

- PR은 항상 이슈를 먼저 만들고 본문의 `Closes #번호`로 연결한다
- 이슈와 PR 모두 담당자는 나(`--assignee @me`)로 지정하고, 라벨은 같게 맞춘다

## 이슈

- 본문에는 문제와 이유를 쓴다. 해결 방법이 정해져 있으면 방향만 한 줄로 적는다
- 제목: `[컴포넌트명] 한 줄 요약`. 특정 컴포넌트와 상관없으면 요약만 쓴다
- 웹에서는 폼(`.github/ISSUE_TEMPLATE/`)이 구조를 잡아 준다. **`gh issue create`에는 폼이 적용되지 않으므로**, 같은 제목의 섹션으로 본문을 직접 쓰고 `--label`로 라벨을 붙인다

| 종류        | 라벨                         | 본문 섹션                                                                                              |
| ----------- | ---------------------------- | ------------------------------------------------------------------------------------------------------ |
| 버그        | `type: bug`                  | 어떤 문제인가요?(고장 / 디자인과 다름 / 접근성) · 어떻게 하면 생기나요? · 어떻게 되어야 하나요? · 참고 |
| 새 컴포넌트 | `type: feature`              | 어떤 상황에서 필요한가요? · Figma 링크 · 이렇게 쓰고 싶어요 · 참고                                     |
| 개선        | `type: enhancement`          | 지금은 어떤가요? · 어떻게 바뀌면 좋겠나요? · 기존 사용처가 깨지나요?                                   |
| 문서·설정   | `type: docs` / `type: chore` | 형식 없음. 무엇을 왜 하는지 두세 줄                                                                    |

## PR

- 대상 브랜치는 develop이다 (release/hotfix만 main)
- PR 하나에는 한 가지 일만 담는다. 제목을 한 줄로 못 쓰겠으면 나눌 때다
- 본문에는 어떻게 바꿨는지를 쓴다. 바뀐 내용 한두 문장에, 필요하면 핵심 결정, 하지 않은 선택, 직접 확인한 것을 짧은 목록으로 덧붙인다. 이유는 이슈에 있으니 다시 풀어 쓰지 않는다
- 목록이 길면 `### 추가한 규칙`, `### 참고`처럼 내용을 묶는 짧은 헤딩을 2~3개까지 쓴다. 짧은 PR에는 헤딩을 쓰지 않는다
- 목록 항목은 `**이름**: 한 줄 설명`으로 쓰고, 설명은 ~요 없이 개조식(~함, ~음, 명사형)으로 끝낸다. 목록 앞 도입 문장은 ~요체 그대로 쓴다
  - 예: `- **CSS는 한 파일**: 조사한 6곳 중 5곳이 한 파일만 import하게 함`
- 시각적 변화가 있으면 스크린샷, 쓰는 쪽 코드가 깨지면 고치는 방법을 덧붙인다

## 라벨

`.github/labels.json`이 기준이다. 라벨마다의 뜻은 그 파일의 `description`에 있다. 바꿀 때는 파일을 고친 뒤 `scripts/sync-labels.sh`를 실행한다(지울 라벨이 있으면 `--prune`).

- `type:`은 이슈·PR마다 **하나만** 붙인다
- `pkg:`는 건드린 패키지마다 붙인다
- `breaking`: props·토큰의 이름이나 타입이 바뀌거나 사라질 때, 또는 기본 동작이 바뀔 때. 메이저 버전이 올라간다
- `a11y`: 키보드, 스크린리더, 색 대비와 관련된 일

## Storybook MCP

UI 컴포넌트를 만들거나 쓸 때는 `pnpm storybook`을 띄우고 `.mcp.json`의 `d5ng-storybook` 서버(`http://localhost:6006/mcp`)를 쓴다. 작업 순서는 서버가 연결될 때 보내는 지침을 따른다.

- 문서에 없는 props는 만들어 쓰지 않고 나에게 묻는다
- 스토리는 `test-run`으로, 컴포넌트 테스트는 `pnpm test`로 확인한다

## Storybook 문서

사용 가이드(언제 쓰나, variant 고르기, 조합, Do/Don't, Anatomy)는 Figma에만 쓰고, Storybook에는 코드로 쓰는 법만 남긴다.

- 컴포넌트와 props 설명은 컴포넌트 소스의 JSDoc에 쓴다. 스토리의 `parameters.docs.description`이나 `argTypes.description`에 다시 쓰지 않는다
- 문서에 보여야 할 prop은 props 타입에 직접 선언하고 기본값은 `@default`로 적는다. recipe 기본값과 HTML 속성은 문서 표에 잡히지 않는다
- 코드에서 고르는 걸 바꾸는 규칙만 컴포넌트 JSDoc에 한 줄로 옮긴다. AI는 Figma를 읽지 못한다
- 스토리는 `Default`(args만) 하나와 prop마다 하나씩 만들고, 스토리 위 JSDoc에 언제 쓰는지 한 줄 적는다
- 조합 전체 매트릭스, hover·pressed를 흉내 내는 스토리는 만들지 않는다
- 접근성 검사를 끄는 스토리는 끄는 rule과 이유를 주석으로 남긴다
- meta의 `parameters.design`으로 Figma 컴포넌트 세트를 연결한다
