---
name: component
description: Figma에 디자인된 컴포넌트를 `@d5ng/react`에 새로 만들거나 크게 고친다. Figma 읽기 → 비교 → 계획 합의 → 구현 → 검증(FF 리뷰 포함) → 문서 → PR 순서를 지키게 한다. "컴포넌트 만들자", "<이름> 구현", "<이름> 작업해야 해", "/component"에 쓴다. 토큰 동기화는 /sync-tokens, 업로드만 할 때는 /pr을 쓴다.
---

# 컴포넌트 구현

이 파일은 **순서와 멈출 곳**만 다룬다. 규칙은 각자의 정본에 있고, 파일을 Read로 열 때 읽힌다.

| 무엇              | 정본                                             |
| ----------------- | ------------------------------------------------ |
| 컴포넌트 코드     | `.claude/rules/components.md`                    |
| 스타일(`.css.ts`) | `.claude/rules/styles.md`                        |
| 스토리·문서       | `.claude/rules/storybook.md`                     |
| 주석              | `.claude/rules/comments.md`                      |
| API 판단          | `docs/ff/`                                       |
| 결정과 이유       | `docs/components/<이름>.md` (형식은 `button.md`) |

**단계마다 멈춘다.** 각 단계 끝에 한 일과 다음 단계 계획을 보여 주고 합의받은 뒤 넘어간다. 앞 단계를 승인받았다고 다음 단계를 이어서 하지 않는다.

## 1. 읽기

- `docs/components/<이름>.md`가 있으면 먼저 읽는다. 이미 정한 것은 다시 따지지 않는다
- Figma 컴포넌트 페이지(읽기는 데스크톱 MCP)
  - 컴포넌트 세트의 속성(variant, boolean, 텍스트)
  - 문서 프레임의 Properties, Guidelines, **Specification**(수치), **Accessibility**(웹 구현 계약)
  - 중첩된 인스턴스가 어떤 컴포넌트·variant를 쓰는지(Archive 컴포넌트를 쓰면 짚는다)
  - "Web · 구현 전/중/구현됨" 표시
- `packages/tokens`에 필요한 토큰이 있는지, `components/_internal`에 다시 쓸 코드가 있는지

## 2. 비교

`/design-refs`를 쓴다. Radix primitive가 있으면 그 소스(`node_modules/.pnpm/@radix-ui+react-<이름>*`)에서 기본 동작(포커스, 닫힘, aria)도 본다. Figma 정책을 Radix 기본값이 이미 하는지 확인하면 짤 코드가 줄어든다.

## 3. 계획 합의

한 메시지에 모은다.

- 만들 파일과 공개 API(parts, props, 기본값)
- 테스트 이름 목록. 동작 계약의 정본이 된다
- 스토리 목록(`Default` + prop마다 하나)
- Specification 수치 → 토큰 대응표. 토큰이 없는 값은 따로 표시한다
- 정할 것 1~2개, 추천 먼저
- 다른 PR이 먼저 필요한지(예: Button variant 추가). PR 하나에는 한 가지 일만 담는다

## 4. 브랜치

`git flow feature start <kebab-case>`. develop·main에 직접 커밋하지 않는다. 다른 PR이 checkout을 쓰고 있으면 사용자에게 알리고 워크트리를 쓴다.

## 5. 구현

`.css.ts` → 컴포넌트 → 테스트 → 스토리 → `index.ts`와 `src/index.ts` export 순서로 만든다. 파일은 Read로 열고 Edit·Write로 고친다(규칙이 그때 읽힌다).

## 6. 검증

```bash
pnpm --filter @d5ng/react test
pnpm --filter @d5ng/storybook test
pnpm lint
pnpm typecheck
pnpm build
```

- Storybook을 띄워 Light·Dark를 눈으로 보고, Specification 수치를 실제 크기로 잰다
- 공통 코드를 옮겼으면 기존 컴포넌트의 빌드 CSS 규칙이 그대로인지 비교한다
- **`/ff-review`를 반드시 실행한다.** 지적마다 반영하거나, 반영하지 않는 이유를 한 줄로 남겨 사용자에게 보여 준다

## 7. 문서

- `docs/components/<이름>.md`: 정한 것, 뺀 것, 열린 질문. 정하지 않은 것은 쓰지 않는다
- Figma(쓰기는 figma-console `figma_execute`): 바꾸기 전에 버전을 저장하고, "Web · 구현됨"으로 바꾸고, 속성 이름을 prop 이름과 맞춘다

## 8. 올리기

`/pr`. 올린 뒤 Chromatic 빌드 링크의 시각 변경 수가 예상(새 스토리 수 × Light·Dark)과 맞는지 보고, 승인은 사용자에게 맡긴다. 머지도 사용자가 한다.
