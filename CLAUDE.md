# d5ng-design-system

Radix UI 위에 만든 React 디자인 시스템. npm 패키지(`@d5ng/tokens`, `@d5ng/react`)로 배포하고 pnpm workspace로 관리한다. 혼자 운영하는 저장소라 리뷰어는 몇 달 뒤의 나다. 그래서 모든 기록은 "나중에 다시 읽어도 이해되는가"를 기준으로 쓴다.

## 일하는 방식

- 한 단계씩 한다. 단계마다 계획(만들 파일, 고를 버전·이름, 열린 결정)을 먼저 보여 주고 합의한 뒤 실행한다. 승인받은 계획이 여러 단계여도 이어서 실행하지 않는다
- 코드 파일은 Read로 열고 Edit·Write로 고친다. 경로별 규칙(`.claude/rules/`)은 그때 읽힌다. `sed`나 스크립트로 바로 고치면 규칙이 읽히지 않는다

## 브랜치 (git flow)

- `develop`이 기본 브랜치다. `main`은 npm에 배포된 상태와 같다. 둘 다 직접 커밋하지 않는다
- 작업은 `git flow feature start <이름>`으로 시작하고, **PR로 develop에 머지**한다. `git flow feature finish`는 로컬에서 바로 머지해 버리므로 쓰지 않는다
- 브랜치 이름은 `feature/<kebab-case>` 하나로 쓴다. 작업 종류는 PR 제목과 라벨이 알려주므로 `fix/`, `chore/` 같은 접두어는 붙이지 않는다
- 머지 방식
  - feature → develop: **squash**. PR 제목이 곧 커밋 메시지가 된다
  - release/hotfix → main: **merge commit**. squash하면 main과 develop의 히스토리가 갈라진다

## 커밋

Conventional Commits 형식에 요약은 한글 짧은 명사형으로 쓴다(`feat(react): Button 로딩 상태 추가`). scope는 패키지 이름이고, 저장소 전체면 생략한다. `commit-msg` 훅(`commitlint.config.js`)이 검사하고, `--no-verify`로 건너뛰지 않는다.

## 글쓰기

이슈, PR, 커밋 본문, 코드 주석은 모두 **한글 ~요체로 최대한 간결하게**, 처음 보는 사람도 이해할 수 있게 쓴다. 이슈는 무엇을 왜 하는지, PR은 어떻게 했는지를 남기고 같은 내용을 두 번 쓰지 않는다.

## 코드 품질

코드와 컴포넌트 API의 좋고 나쁨은 Frontend Fundamentals로 판단한다. 항목별 요지, 적용하지 않는 경우, props API 적용은 `docs/ff/`에 있으니 근거로 들 때는 해당 파일을 먼저 읽는다. FF는 변경 비용을 비교하는 기준이지 prop 철자를 정하는 명세가 아니다(`docs/ff/README.md`의 "API를 판단할 때의 경계"). 판단이 갈리면 가독성(`docs/ff/r*`)을 먼저 본다.

## 무엇이 어디에 있나

| 무엇                   | 위치                                     | 읽히는 때                                       |
| ---------------------- | ---------------------------------------- | ----------------------------------------------- |
| 컴포넌트 구현 순서     | `/component` 스킬                        | 컴포넌트를 새로 만들거나 크게 고칠 때           |
| 컴포넌트 코드 규칙     | `.claude/rules/components.md`            | `packages/react/src`의 파일을 열 때             |
| 스타일 규칙            | `.claude/rules/styles.md`                | `.css.ts` 파일을 열 때                          |
| 코드 주석 규칙         | `.claude/rules/comments.md`              | `.ts`·`.tsx`·`.js` 파일을 열 때                 |
| Storybook 규칙         | `.claude/rules/storybook.md`             | 스토리, `apps/storybook`, 컴포넌트 파일을 열 때 |
| 이슈·커밋·PR·라벨 규칙 | `/pr` 스킬(`.claude/skills/pr/rules.md`) | 이슈나 PR을 올릴 때                             |
| 배포 순서와 버전 규칙  | `docs/release.md`                        | changeset을 쓰거나 배포할 때                    |
| Figma 토큰 동기화      | `/sync-tokens` 스킬                      | Figma 변수가 바뀌었을 때                        |
| SEED·Montage 비교      | `/design-refs` 스킬                      | 컴포넌트를 계획하거나 비교할 때                 |
| FF 항목별 문서         | `docs/ff/`                               | 코드·API를 판단할 때                            |
| FF 리뷰 순서           | `/ff-review` 스킬                        | 변경을 FF 기준으로 리뷰할 때                    |
| 컴포넌트 결정과 이유   | `docs/components/<이름>.md`              | 그 컴포넌트를 고칠 때                           |

이름 규칙, 주석 머리말, 커밋 제목처럼 lint와 훅이 지키는 규칙은 어기면 에러 메시지가 알려 준다.
