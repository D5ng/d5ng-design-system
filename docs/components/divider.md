# Divider

콘텐츠 사이의 경계를 나누는 1px 선이에요. 이 문서는 Divider의 **결정과 이유**만 남겨요.

- **동작 계약**: `packages/react/src/components/Divider/Divider.test.tsx`의 테스트 이름이 정본이에요
- **사용 가이드**: Figma `Divider` 페이지
- **비교한 자료**(2026-11-14)
  - SEED: https://seed-design.io/llms/components/divider.txt, https://seed-design.io/llms/react/components/divider.txt, https://raw.githubusercontent.com/daangn/seed-design/dev/packages/react/src/components/Divider/Divider.tsx, https://raw.githubusercontent.com/daangn/seed-design/dev/packages/rootage/components/divider.yaml
  - Montage: https://montage.wanted.co.kr/docs/utilities/web-utility-components/divider
  - Radix: `@radix-ui/react-separator` 1.2.0 빌드 파일

## 정한 것

- **Radix Separator의 `<div role="separator">`로 렌더해요**: `<hr>`이면 쓰는 쪽의 전역 `hr {}`(블로그 본문 CSS, normalize)가 `@layer d5ng` 밖이라 우선순위와 상관없이 margin·색을 덮어요. `<hr>`의 장점인 CSS 없는 환경(읽기 모드·RSS)은 마크다운 `---`를 그리는 Article Body의 일이에요. 요소 종류는 `docs/release.md`의 약속이라 바꾸면 minor예요
- **`"use client"`가 없어요**: hook도 핸들러도 없이 Radix 부품에 값만 넘겨요(Link와 같아요). Radix Separator 배포물에 이미 `"use client"`가 있어요
- **강도 축은 `tone: "subtle" | "muted"`, 기본 `subtle`이에요**: Figma 속성 `Tone`을 그대로 쓰고, 값은 토큰 `stroke/neutral-subtle`·`stroke/neutral-muted`의 끝말이에요. 다른 컴포넌트의 `tone`은 색 역할(`neutral`·`brand`)을 고르지만 여기서는 같은 회색의 진하기를 골라서 `/design-refs` 이름 규칙에 예외로 적었어요(FF P1). 값이 겹치지 않아 잘못 넘기면 TS가 막아요. 어느 쪽이 진한지는 이름만으로 안 보여서 prop JSDoc과 Tone 스토리가 알려 줘요
  - `neutralSubtle`·`neutralMuted`는 두 값 모두 neutral이라 앞말이 정보를 더하지 않아요. `emphasis`는 이 축 하나를 위한 새 낱말이라 고르지 않았어요
  - 기본값은 SEED(Muted) 대신 Figma(Subtle)를 따라요. Switch 기본 size와 같은 판단이에요
- **inset은 `"none" | "16" | "24"`예요**: Figma 값과 글자까지 같아요(Switch size 선례). SEED는 16 하나(boolean)지만 Figma는 24도 있어요
- **Figma 12조합을 모두 열어요**: Vertical과 Inset 24는 아직 쓰는 화면이 없지만 CSS 몇 줄이고 다른 prop과 조합을 늘리지 않아요. 빼면 Figma에서도 변형 6개를 지워야 같이 움직여요
- **선은 테두리로 그려요**: 고대비 모드(forced-colors)는 배경색을 지우고 테두리는 시스템 색으로 남겨요. 가로는 `border-block-end`, 세로는 `border-inline-end` 1px이에요. 두께는 Figma에도 변수가 없어서 숫자예요
- **inset은 선 방향 양 끝의 margin이에요**: 테두리는 padding 밖에 그려져서 padding으로는 선이 줄지 않아요. inset variant는 변수 하나만 채우고 orientation이 그 변수를 `margin-inline`이나 `margin-block`으로 읽어요. `compoundVariants` 4개로 펼치면 값이 한곳에서 읽히지만, inset 값을 더할 때 고칠 곳이 둘로 늘어요(FF R6보다 C2)
- **앞뒤 간격은 부모의 `gap`이 맡아요**: 선과 수직인 방향에는 margin이 없어요. Figma Guidelines가 "간격은 부모 레이아웃"이에요
- **부모를 따라 늘어나요**: `align-self: stretch`라 flex 부모가 가운데 정렬해도 가로선은 너비를, 세로선은 높이를 채워요. 세로선은 flex 부모가 있어야 높이가 생겨서 prop JSDoc에 적었어요. `flex-shrink: 0`으로 좁은 줄에서 사라지지 않아요
- **`decorative`는 기본 `false`예요**: HTML `hr`·SEED·Radix가 모두 기본으로 읽혀요(shadcn만 true). 빠뜨렸을 때 "구분선"이 한 번 더 읽히는 쪽이, 구조가 조용히 사라지는 쪽보다 알아채기 쉬워요. Figma Accessibility도 숨기기를 선택으로 써요
- **목록 안 구분선은 항목 안에 `decorative`로 넣어요**: 목록(`<ul>`) 안에는 항목만 둘 수 있어요. 컴포넌트 JSDoc에 한 줄로 적었어요
- **Figma 속성 이름은 prop과 같아요**: `orientation`·`tone`·`inset`과 값까지 코드 철자로 맞췄어요

## 뺀 것

- **`asChild`**: 계획에서는 `<ul>` 안의 `<li>`를 구분선으로 그리려고 넣었지만, `<li role="separator">`는 목록 항목이 아니게 돼서 axe `list` 규칙에 걸렸어요. 문장 안 `<span>` 같은 다른 쓰임은 아직 화면이 없어요. 나중에 더해도 깨지지 않아요
- **`children`**: 글자를 넣는 "또는" 구분선은 Figma에 없어요
- **`thickness`, 아무 토큰이나 받는 `color`, 반응형 prop**(SEED·Montage): Figma가 두께 1px·색 2개로 막았고, 굵은 구획은 선이 아니라 배경 레이어와 간격으로 만들라고 해요(SEED도 "8px Divider는 없다")
- **앞뒤 여백 prop**: 부모가 맡아요

## 열린 질문

- **Light의 `subtle`(gray/100)은 흰 배경과 대비가 아주 낮아요**: Figma는 장식선에 3:1을 강제하지 않지만 기본값이 가장 흐린 쪽이에요. 실제 화면에서 보고 다시 봐요
- **Select는 Divider 대신 따로 그린 `Select Divider`를 써요**(Figma): 값은 Muted·16과 같아요. Select를 구현할 때 Divider 인스턴스로 바꿔요
- **Menu가 두 번째 사용처예요**: Radix DropdownMenu에 자기 Separator가 있어서 모양만 같아요. Divider 스타일을 `_internal`로 옮길지는 Menu PR이 정해요
