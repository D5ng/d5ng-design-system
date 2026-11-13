---
name: design-refs
description: SEED(당근)와 Montage(원티드) 디자인 시스템에서 컴포넌트·Foundation 자료를 찾아 우리 프로젝트와 비교하고, 무엇을 가져오고 뺄지 추천한다. 새 컴포넌트를 계획하거나 prop 이름·variant·토큰·사용 가이드를 정할 때, "SEED는 어떻게 해?", "몽타주랑 비교해 줘", "다른 디자인 시스템은?", "레퍼런스 찾아줘", /design-refs에 쓴다.
---

# SEED·Montage 비교

큰 회사의 시스템을 그대로 옮기지 않고, 혼자 운영하는 이 프로젝트에 맞게 줄여서 가져오려고 쓴다.

**두 사이트의 내용은 저장소에 옮겨 적지 않는다.** 문서는 계속 바뀌고 복사본이 먼저 낡는다. 매번 원본을 읽고, 남기는 것은 우리가 내린 결론(`docs/components/<컴포넌트>.md`)뿐이다. 인용은 짧게 하고 요약은 우리 말로 쓴다.

## 순서

1. **이전 결론 읽기.** `docs/components/<컴포넌트>.md`가 있으면 먼저 읽는다. 사용자가 다시 보자고 하지 않으면 이미 정한 것은 다시 따지지 않고, 새로 묻는 것만 본다.
2. **대응 찾기.** `references/component-map.md`에서 SEED와 Montage의 이름을 찾는다. 이름이 다른 경우가 많다(Button은 SEED `action-button`). 표에 없거나 "추정"이면 `references/sources.md`의 인덱스로 확인하고 표를 고친다.
3. **원본 읽기.** `references/sources.md`의 순서를 따른다. 페이지가 여럿이면 병렬로 받는다.
   - SEED: 디자인 스펙 → React API → 문서에 없는 기본값·동작은 GitHub 소스
   - Montage: design 탭(사용 가이드) → web 탭(props)
4. **우리 상태 보기.** Figma는 데스크톱 MCP로 열린 파일을 읽고, `packages/tokens`의 토큰과 `packages/react`의 코드, 이미 정한 결정(CLAUDE.md, `docs/components/`)을 본다.
5. **비교하고 추천하기.** 아래 "결과 형식"대로 쓴다.
6. **결론 남기기.** 사용자가 정하면 `docs/components/<컴포넌트>.md`를 만들거나 고친다. 형식은 `docs/components/button.md`를 따른다. 정하지 않은 것은 쓰지 않는다.

## 판단 기준

- **추가는 안 깨지고 빼기는 깨진다.** 지금 쓸 화면이 있는 것만 넣고, 나머지는 필요해질 때 추가한다.
- **비용은 개수보다 조합이다.** variant 하나는 색 매핑 몇 줄이지만 prop 하나는 다른 prop과의 조합을 늘린다. 줄일 때는 prop과 동작부터 본다.
- **이름은 개발 prop 이름이 기준이다.** Figma 속성도 같은 이름으로 맞춘다. prop은 색이 아니라 중요도로 짓는다(SEED `brandSolid` 대신 `primary`). 색 이름(`brand`, `critical`)은 토큰이 맡는다.
- **두 곳이 갈리면 이유를 본다.** SEED는 당근 앱(모바일 웹뷰, 큰 팀), Montage는 원티드(웹·iOS·Android 공통)를 위한 것이다. 한쪽만 하는 것은 그 이유가 우리에게도 있는지 따진다.
- **우리 Foundation이 우선이다.** Figma Foundation 페이지의 규칙(WCAG 2.2 AA, 클릭 영역, 로딩·포커스 규칙)과 어긋나면 두 곳을 따르지 않는다.
- **우리 스택에서 되는지 본다.** React 19, Radix(`asChild`), vanilla-extract recipe, `@d5ng/tokens` CSS 변수.

## 결과 형식

표 하나와, 지금 판단을 바꿀 한두 가지만 쓴다. 빠진 것을 모두 짚지 않는다.

| 항목 | SEED | Montage | 우리(지금) | 추천 |
| ---- | ---- | ------- | ---------- | ---- |

- 표 아래에 가져올 것, 뺄 것, 다르게 갈 것을 한 줄씩 이유와 함께 쓴다.
- 정할 것은 1~2개만, 추천을 먼저 쓴다.
- 확인하지 못한 것(Montage는 소스가 없음)은 "확인 못 함"이라고 쓰고 추측으로 채우지 않는다.
- 끝에 읽은 URL을 단다.
