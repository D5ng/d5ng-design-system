# 배포와 버전

`@d5ng/react`를 npm에 올리는 순서와 버전 번호 규칙이에요. `@d5ng/tokens`는 react 빌드에 녹아 들어가서 따로 배포하지 않아요(`private`). 도구는 [changesets](https://github.com/changesets/changesets)를 써요. 정한 이유와 release-please·semantic-release와의 비교는 [계획 문서](https://claude.ai/artifact/MDEfgcYFTZtoo9vn3Cjsa3)(2026-11-10)에 있어요.

## 버전으로 약속하는 것

버전 번호는 "업데이트해도 쓰는 쪽 코드가 안 깨지는가"에 대한 약속이에요. 기준은 `breaking` 라벨과 같은 "쓰는 쪽 코드를 고쳐야 하는가"예요.

| 약속하는 것              | 예                                           |
| ------------------------ | -------------------------------------------- |
| 진입 경로                | `@d5ng/react`, `@d5ng/react/styles.css`      |
| export 이름              | `Button`, `ButtonProps`                      |
| props의 이름·타입·기본값 | `variant`, `loading`, `type` 기본 `"button"` |
| 렌더되는 요소 종류       | Button은 `<button>`, Link는 `<a>`            |
| CSS 변수 이름            | `--d5ng-color-bg-brand-weak`                 |
| 레이어·테마 스위치       | `@layer d5ng`, `<html data-theme="dark">`    |
| 설치·빌드 조건           | React 19 peer, ESM 전용, `dependencies` 목록 |

약속하지 않는 것도 있어요.

- **CSS 변수 값과 시각 결과**(색, 모서리, 간격): 디자인을 고치는 게 디자인 시스템의 일이에요. 대신 CHANGELOG에 적어요
- **해시 클래스와 안쪽 DOM**(`_15aq0p50`, 버튼 안의 `span`): 빌드마다 바뀌거나 내부 구현이에요
- **상태 속성**(`data-disabled`, `data-loading`): README와 Storybook에서 안내하지 않아요. 쓰는 쪽 안내에 적는 순간부터 약속이 돼요

## 변경 종류별 번호

0.x 동안은 한 칸씩 내려서 올려요. `pnpm add`가 적는 `^0.1.0`은 0.1.9는 받고 0.2.0은 받지 않아서, 0.x에서는 가운데 숫자가 major 역할을 해요([semver 4항](https://semver.org/#spec-item-4), [캐럿 범위](https://github.com/npm/node-semver#caret-ranges-123-025-004)).

| 변경                          | 예                                                | 1.0 이후                           | 0.x 동안         |
| ----------------------------- | ------------------------------------------------- | ---------------------------------- | ---------------- |
| 공개 API 제거·이름 변경       | prop 삭제, `--d5ng-*` 이름 변경, 레이어 이름 변경 | major                              | minor            |
| 타입 좁힘                     | variant 값 제거, 필수 prop 추가                   | major                              | minor            |
| 기본값·기본 동작 변경         | 기본 variant, `type` 기본값, 렌더 요소 변경       | major                              | minor            |
| 설치·빌드 조건 변경           | React 범위 좁힘, `radix-ui`를 peer로 옮김         | major                              | minor            |
| 컴포넌트가 쓰는 CSS 변수 변경 | 다른 변수를 읽어서 쓰는 쪽이 덮어쓴 값이 안 먹음  | major                              | minor            |
| 기능 추가                     | 새 컴포넌트·prop·variant·토큰, 타입 넓힘          | minor                              | patch            |
| 폐기 예고                     | `@deprecated` 표시와 대안 안내                    | minor                              | patch            |
| 시각 변경                     | 토큰 값, 그림자, 모서리                           | minor                              | patch            |
| 크기가 바뀌는 시각 변경       | 버튼 높이, 기본 간격                              | minor, CHANGELOG에 "레이아웃 확인" | patch, 같은 표시 |
| 버그·접근성 수정              | 포커스 링, aria 속성                              | patch                              | patch            |
| 배포물이 안 바뀜              | 문서, 스토리, 테스트, 내부 리팩터                 | 없음                               | 없음             |

- **0.x에서는 changeset에 `major`를 쓰지 않아요**: 0.x에서 major를 고르면 0.2.0이 아니라 1.0.0이 돼요
- **시각 변경은 깨는 변경이 아니에요**: 코드는 그대로 돌아요. 높이·간격처럼 주변 레이아웃을 밀 수 있으면 CHANGELOG에 따로 적어요
- **버그 수정이 동작을 바꿀 때**: 문서에 적은 동작과 다르게 동작하던 걸 고치면 patch예요. 문서에 적은 동작 자체를 바꾸면 깨는 변경이에요
- **tokens만 바꾼 PR**: tokens는 react에 녹아 들어가니 `@d5ng/react`의 번호를 위 표대로 올려요

## changeset 쓰기

배포물이 바뀌는 PR에는 changeset을 하나 넣어요. 위 표에서 "없음"이 아닌 변경이에요.

```bash
pnpm changeset   # 패키지와 등급을 고르고 설명을 적어요
```

`.changeset/<임의 이름>.md`가 생기고, 본문이 그대로 `packages/react/CHANGELOG.md`에 들어가요. PR 본문은 "어떻게 했는지"를, changeset은 "쓰는 쪽에게 뭐가 달라지는지"를 남겨요.

- **패키지는 `@d5ng/react`**: tokens만 바꿔도 react를 골라요
- **본문**: 한글 ~요체 한두 줄이에요. 깨는 변경이면 고치는 방법을 전후 코드로 덧붙여요
- **크기가 바뀌는 시각 변경**: "레이아웃 확인"과 바뀐 값을 적어요
- **빠뜨리면**: 그 변경이 CHANGELOG에서 빠져요. 아직 CI가 검사하지 않아요
- **CHANGELOG 형식**: changesets 기본 형식이라 항목 앞에 커밋 해시가 붙어요. squash 커밋 제목에 `(#번호)`가 있어서 해시로 PR을 찾을 수 있어요

0.x에서 깨는 변경을 적는 예예요(가상의 변경이에요).

```markdown
---
"@d5ng/react": minor
---

Button의 `tone` prop을 `variant`로 합쳤어요. `tone="critical"`은 `variant="critical"`로 바꿔 주세요.
```

## 배포 순서

버전 번호는 release 브랜치에서만 바뀌고, npm 배포는 main에서만 해요. 그래서 main은 늘 npm에 배포된 상태와 같아요.

1. **기능 PR**: changeset을 같은 PR에 넣어요(위 절)
2. **release 시작**: `git flow release start 0.2.0`으로 develop에서 브랜치를 따요. git flow가 없으면 `git checkout -b release/0.2.0 develop`이에요
3. **버전 올리기**: `pnpm changeset version`이 번호와 CHANGELOG를 바꾸고 changeset 파일을 지워요. 번호가 예상과 같은지 보고 `chore(react): 0.2.0 배포 준비`로 커밋해요
4. **main 머지**: release에서 main으로 PR을 열어요. CI의 `Pack check`(아래 "배포 전 확인")가 통과하면 merge commit으로 머지해요
5. **배포(직접)**: main에서 `npm login`한 상태로 `pnpm release`를 실행해요. 패키지만 빌드하고(`apps/*`는 빼요) npm에 올린 뒤 `@d5ng/react@0.2.0` 태그를 만들어요. 그다음 `git push origin --tags`를 해요
6. **되돌리기**: main에서 develop으로 PR을 열고 merge commit으로 머지해요. develop이 바뀐 번호와 CHANGELOG를 받아요

**hotfix**는 main에서 `hotfix/0.2.1`을 따서 고치고 patch changeset을 넣은 뒤 3번부터 같게 해요.

Claude는 1–4번과 6번의 브랜치·PR을 만들 수 있어요. 머지와 5번은 직접 해요.

## 배포 전 확인

npm은 한 번 쓴 번호를 지워도 다시 못 쓰고([npm unpublish](https://docs.npmjs.com/cli/commands/npm-unpublish)), 지우는 것도 배포 후 72시간 안에만 돼요([npm 정책](https://docs.npmjs.com/policies/unpublish)). 그래서 올리기 전에 실제로 올라갈 tgz로 Next 예제 앱(`apps/next`)을 빌드해 봐요. 레지스트리에는 아무것도 남지 않아요.

```bash
scripts/check-pack.sh
```

- **CI**: main으로 가는 PR에서 `.github/workflows/pack-check.yml`이 같은 스크립트를 돌려요. Actions 탭에서 직접 실행할 수도 있어요. 단계마다의 이유는 스크립트 주석에 있어요
- **블로그가 생기면**: 같은 tgz를 블로그에도 설치해서 빌드해 봐요
- **잘못 올렸을 때**: 지우기보다 `npm deprecate @d5ng/react@0.2.0 "이유"`로 경고를 남기고 고친 patch를 내요
- **미리 받아 봐야 할 일이 잦아지면**: changesets의 snapshot 배포(`snapshot` 태그)나 pre 모드(`next` 태그)를 써요. 태그가 `latest`가 아니라서 `pnpm add`의 기본값에 잡히지 않아요

## 폐기 절차

없애기 전에 먼저 알려요. 주석 규칙(`.claude/rules/comments.md`)대로 `@deprecated`에 대신 쓸 것과 없어질 버전을 적어요.

1. **폐기 예고 릴리스**: `@deprecated`와 대안을 넣어요(1.0 이후 minor, 0.x에서 patch)
2. **제거 릴리스**: 다음 깨는 변경 릴리스에서 없애요

0.x에서는 1번을 건너뛸 수 있지만, 블로그가 쓰는 API라면 한 번 거쳐요.

## Figma와 맞추기

코드와 디자인이 같이 움직이도록, 릴리스마다 "이 번호의 코드는 이 시점의 Figma와 같다"는 기준점을 양쪽에 남겨요.

| 때                          | Figma에서                                          | 코드에서                                                                       |
| --------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------ |
| 토큰 동기화(`/sync-tokens`) | 변수 이름을 바꾸면 깨는 변경인 걸 알고 바꿔요      | 값만 바뀌면 시각 변경, 이름이 바뀌거나 사라지면 깨는 변경으로 changeset을 써요 |
| 컴포넌트 PR 머지            | 상태를 `Web · 구현됨`으로 바꿔요                   | changeset을 넣어요                                                             |
| 릴리스(5번 뒤)              | 이번에 들어간 컴포넌트 상태에 "0.2.0부터"를 붙여요 | CHANGELOG와 태그가 남아요                                                      |

- **상태의 번호**: 블로그에서 "이 컴포넌트를 쓰려면 몇 버전이 필요한가"를 Figma에서 바로 알 수 있어요
- **Figma 버전 기록은 저장하지 않아요**(2026-11-11 결정): 기준점은 컴포넌트 상태의 번호와 CHANGELOG예요

## 1.0.0을 내는 기준

1. 블로그가 배포되어 이 패키지를 실제로 쓰고 있어요
2. 진행 중인 큰 결정이 끝났어요(지금은 `radix-ui` peer 여부)
3. 마지막 깨는 변경 뒤로 릴리스를 두 번 더 냈는데 깨는 변경이 없었어요

## 아직 하지 않은 것

- **changeset 누락 CI 검사**: 자주 빠지면 붙여요
- **자동 배포**: 흐름이 굳으면 GitHub Actions와 npm trusted publishing을 검토해요
- **PR 링크가 붙는 CHANGELOG**(`@changesets/changelog-github`): 버전을 올릴 때마다 GitHub 토큰이 필요해서 기본 형식을 써요
- **`moduleResolution: nodenext`**: d.ts의 상대 import에 확장자가 없어서 TS2834가 나요. `bundler`(Next, Vite 기본값)에서는 괜찮아요
