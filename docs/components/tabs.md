# Tabs

같은 화면의 관련 내용을 나눠서 한 번에 패널 하나만 보여 줘요. 이 문서는 Tabs·TabsList·TabsTrigger·TabsContent의 **결정과 이유**만 남겨요.

- **동작 계약**: `packages/react/src/components/Tabs/Tabs.test.tsx`의 테스트 이름이 정본이에요
- **사용 가이드**: Figma `Tabs` 페이지
- **계획**: [Tabs 계획](https://claude.ai/artifact/Artq1uXbwkA6ryDZFhwY4P)(D1·D2, 2026-11-14 확정)
- **비교한 자료**(2026-11-14)
  - SEED: https://seed-design.io/llms/components/tabs.txt, https://seed-design.io/llms/react/components/tabs.txt, https://seed-design.io/rootage/components/tablist.json, https://seed-design.io/rootage/components/tab.json
  - Montage: https://montage.wanted.co.kr/docs/components/navigations/tab/design, `/web`
  - Radix: `@radix-ui/react-tabs` 1.2.1 빌드 파일(`radix-ui` 1.8.1)

## 정한 것

- **부품 네 개를 따로 내보내요**: `Tabs`·`TabsList`·`TabsTrigger`·`TabsContent`예요. 이름은 Radix·shadcn과 같아요. Figma Spec의 "items 배열" 문장은 코드에 맞게 고쳤어요
- **`value`나 `defaultValue` 중 하나는 꼭 받아요(타입)**: Radix는 둘 다 없으면 빈 값으로 시작해서 아무 탭도 고르지 않고 패널도 비어요. Figma는 "한 번에 하나 선택"이에요
- **`TabsList`는 `aria-label`이나 `aria-labelledby` 중 하나를 꼭 받아요(타입)**: Figma Accessibility가 목록 이름을 계약으로 적었고 Radix는 붙여 주지 않아요. IconButton의 `aria-label` 필수와 같은 방식이에요
- **`size`·`layout`은 `TabsList`에 있어요**: 모양만 바꾸는 값이라 그리는 부품에 두고, Root는 선택 상태만 가져요(Montage와 같음). 탭에는 CSS 변수로 내려서 context 없이 `TabsTrigger`가 서버 컴포넌트로 남아요(RadioGroup과 같은 방식)
  - `size`는 `small`·`medium`, 기본 `medium`이에요. Figma·SEED 기본은 Small이지만 우리 컴포넌트는 모두 `medium`이 기본이고, Medium 44px가 Foundation 조작 영역과 맞아요
  - `layout`은 `fill`·`hug`, 기본 `fill`이에요. 이름은 Figma 문서 제목을 따랐어요(SEED `triggerLayout`, Montage `resize`)
- **선택선은 탭 사이를 미끄러져요(D1)**: Figma가 `duration/normal`과 시연 프레임으로 정했어요. Radix에 선택선이 없어서 `TabsList`가 선택한 탭의 위치·너비를 재요. 모션 줄이기에서는 바로 옮겨요
  - `"use client"`는 `TabsList.tsx`에만 있어요. Radix 선택 상태를 따로 갖지 않으려고 탭의 `data-state`를 MutationObserver로 보고, 탭 너비 변화는 ResizeObserver로 봐요
  - 선택선 측정(`useIndicatorRect`)과 자동 스크롤(`useScrollToActiveTab`)은 hook을 나눴어요. 측정은 크기가 바뀔 때마다, 스크롤은 선택이 바뀔 때만 움직여서 정책이 따로 바뀌어요(FF P3·R3, 2026-11-15)
  - 위치는 CSS 변수가 아니라 인라인 `width`·`transform`으로 넣어요. 변수로 넘기려면 `@vanilla-extract/dynamic` 의존성이 더 필요해요
  - 재기 전(하이드레이션 전)에는 선택선을 `hidden`으로 두고, 선택한 탭이 CSS로 자기 밑줄을 그려요
  - 쓰는 쪽 `ref`와 합치지 않으려고 선택선의 부모로 목록을 찾아요
- **Figma의 24px 여백(`layout/gutter`)은 넣지 않아요(D2)**: 레거시 변수라 토큰에서 빠졌고, 탭이 페이지 여백을 알 수 없어요. Hug 목록 좌우 여백은 0이고 필요하면 `TabsList`의 `className`으로 줘요. Fill 선택선은 탭 너비 그대로예요
- **선택이 바뀌면 그 탭이 보이게 목록만 가로로 스크롤해요**: Figma 웹 계약이고 Montage도 기본으로 켜요. `scrollIntoView`는 페이지까지 움직여서 `scrollLeft`만 바꿔요. 처음 그릴 때는 바로, 그 뒤에는 CSS `scroll-behavior`로 부드럽게 옮겨요. prop으로 끄지 않아요
- **"선택한 탭"은 목록 안 `[role="tab"]` 자손으로 찾아요**: 탭을 Tooltip 같은 것으로 감싸도 선택선과 비활성 색이 함께 따라와요. JS(`TabsList.tsx`)와 CSS(`Tabs.css.ts`)가 같은 범위여야 해서 서로를 가리키는 주석을 달았어요(FF C2, 2026-11-15)
- **`value`는 공백 없이 써요**: Radix가 `value`로 탭·패널 `id`를 만들어서 공백이 있으면 `aria-controls`가 깨져요. `TabsTrigger` JSDoc에 적었어요
- **탭 포커스 링은 안쪽에 그려요**: 목록이 스크롤 상자라 바깥 링은 위아래가 잘리고 옆 탭과 겹쳐요. `_internal/focusRing.css.ts`에 `focusRingInset`을 더했어요(Figma도 안쪽 2px)
- **패널은 Radix 기본대로 Tab 키로 들러요**: 그래서 패널에 바깥 링(`focusRing`)을 그려요. Figma에는 패널 포커스 모양이 없어서 웹 메모로 적었어요
- **터치에서는 Small도 44px 높이예요**: 목록이 스크롤 상자라 바깥으로 넓힌 조작 영역이 잘려서 높이 자체를 바꿔요(Figma "터치 환경의 Small은 44px 조작 영역")
- **스크롤바는 터치(`pointer: coarse`)에서만 숨겨요**: SEED는 늘 숨기지만, 마우스만 있는 데스크톱에서는 스크롤바가 가로로 넘길 수 있다는 유일한 표시예요
- **눌리면 색만 바꿔요**: Figma Pressed가 색만 바뀌고 Foundation Motion에도 "색상만 변경 · 축소 없음"이 있어요. 눌림 배경은 `bg/neutral-weak-pressed`예요(Figma `-hover`를 고침)
- **선택한 탭이 비활성이면 선택선도 `fg/disabled`예요**: Figma Selected=True·Disabled 그대로예요. 선택한 탭을 막으려면 먼저 다른 탭으로 선택을 옮겨야 해서 `disabled` JSDoc에 적었어요
- **구분선은 목록의 안쪽 그림자(`inset 0 -1px`)예요**: Figma Base divider가 탭보다 아래 층이라 hover 배경이 덮어요. 스크롤해도 보이는 폭 전체에 남아요
- **최소 높이(40·44px)와 선택선(2px)·구분선(1px) 두께는 숫자예요**: Figma에도 변수가 없어요

## 뺀 것

- **`orientation`·`dir`·`loop`**: Figma가 가로 탭만 그렸어요. `loop`는 Radix 기본(끝에서 처음으로 돎)이 Figma 키보드 표와 같아요. RadioGroup과 같은 이유이고, 나중에 더해도 깨지지 않아요
- **`forceMount`**: Figma가 고른 패널만 그렸어요. 숨은 패널은 내용 없이 `hidden`으로 남아요
- **`asChild`**: 네 부품 모두 뺐어요. Figma가 버튼 탭만 그렸고, 나중에 더해도 깨지지 않아요
- **알림 점(`notification`)**: Figma TabItem에 있지만 Notification Badge가 아직 구현 전이에요. 생기면 SEED처럼 `TabsTrigger`의 `notification` boolean으로 더해요
- **Chip 타입 탭**: Figma Line 타입만 만들었어요. SEED의 Carousel·swipe·`stickyList`도 모바일 앱 전용이라 뺐어요

## 열린 질문

- **알림 점**: Notification Badge를 만들 때 `notification` prop 이름과 읽어 줄 문구를 정해요
- **최소 높이 토큰**: Button·TextField처럼 맞추려면 Figma에 `tabs/min-height-*`를 만들고 `/sync-tokens`를 돌려요
