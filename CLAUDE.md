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

Conventional Commits 형식으로, 영어로 쓴다. scope는 패키지 이름이고, 저장소 전체에 걸친 변경이면 생략한다.

```
feat(react): add loading state to Button
fix(tokens): correct dark mode border color
chore: add issue forms
```

## 이슈

- 제목: `[컴포넌트명] 한 줄 요약`. 특정 컴포넌트와 상관없으면 요약만 쓴다
- 본문은 한국어로 쓴다
- 웹에서는 폼(`.github/ISSUE_TEMPLATE/`)이 구조를 잡아 준다. **`gh issue create`에는 폼이 적용되지 않으므로**, 같은 제목의 섹션으로 본문을 직접 쓰고 `--label`로 라벨을 붙인다

| 종류 | 라벨 | 본문 섹션 |
|---|---|---|
| 버그 | `type: bug` | 어떤 문제인가요?(고장 / 디자인과 다름 / 접근성) · 어떻게 하면 생기나요? · 어떻게 되어야 하나요? · 참고 |
| 새 컴포넌트 | `type: feature` | 어떤 상황에서 필요한가요? · Figma 링크 · 이렇게 쓰고 싶어요 · 참고 |
| 개선 | `type: enhancement` | 지금은 어떤가요? · 어떻게 바뀌면 좋겠나요? · 기존 사용처가 깨지나요? |
| 문서·설정 | `type: docs` / `type: chore` | 형식 없음. 무엇을 왜 하는지 두세 줄 |

## PR

- 대상 브랜치는 develop이다 (release/hotfix만 main)
- PR 하나에는 한 가지 일만 담는다. 제목을 한 줄로 못 쓰겠으면 나눌 때다
- 본문은 한국어로, `.github/pull_request_template.md`의 섹션을 따른다. 섹션마다 작성 요령이 주석으로 달려 있다. 필요 없는 섹션은 지운다
- **`gh pr create --body`에는 템플릿이 적용되지 않으므로**, 같은 섹션 제목으로 본문을 직접 쓰고 주석은 넣지 않는다

## 라벨

`.github/labels.json`이 기준이다. 라벨마다의 뜻은 그 파일의 `description`에 있다. 바꿀 때는 파일을 고친 뒤 `scripts/sync-labels.sh`를 실행한다(지울 라벨이 있으면 `--prune`).

- `type:`은 이슈·PR마다 **하나만** 붙인다
- `pkg:`는 건드린 패키지마다 붙인다
- `breaking`: props·토큰의 이름이나 타입이 바뀌거나 사라질 때, 또는 기본 동작이 바뀔 때. 메이저 버전이 올라간다
- `a11y`: 키보드, 스크린리더, 색 대비와 관련된 일
