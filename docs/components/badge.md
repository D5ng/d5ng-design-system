# Badge

항목의 상태나 속성을 짧게 표시해요. 이 문서는 Badge의 **결정과 이유**만 남겨요.

- **동작 계약**: `packages/react/src/components/Badge/Badge.test.tsx`의 테스트 이름이 정본이에요
- **사용 가이드**: Figma `Badge` 페이지
- **비교한 자료**(2026-11-14)
  - SEED: https://seed-design.io/llms/components/badge.txt, https://seed-design.io/llms/react/components/badge.txt, `daangn/seed-design`의 `recipes/badge.ts`·`rootage/components/badge.yaml`·`Badge.tsx`
  - Montage: https://montage.wanted.co.kr/docs/components/contents/content-badge/web, `/design`

## 정한 것

- **`<span>` 하나로 그리는 서버 컴포넌트예요(`"use client"` 없음)**: 상태가 없고 누를 수 없어서 Radix 부품도 hook도 필요 없어요. `prefixIcon`은 요소로 받아서 서버 컴포넌트가 그대로 넘길 수 있어요. SEED 소스는 Root·Prefix·Label을 context로 잇지만, 부품으로 나누면 context 때문에 `"use client"`가 돼요. Button·Link처럼 prop 하나로 받아요
- **축은 `variant`·`tone`·`size` 세 개예요**: 이름과 값은 SEED·Figma와 같아요
  - `variant`는 `weak`·`solid`·`outline`, 기본 `weak`예요. SEED 기본은 `solid`지만 Figma가 "Weak가 기본, 반복 목록에는 Weak부터"라고 정했어요
  - `tone`은 `neutral`·`brand`·`informative`·`positive`·`warning`·`critical`, 기본 `neutral`이에요. 중요도와 따로 색 역할만 고르는 축이라 Checkbox·Radio·Switch의 `tone`과 같은 이름이고, 값 목록은 컴포넌트마다 타입으로 드러나요(FF P1). 이 뜻으로 `/design-refs` 이름 규칙을 넓혔어요
  - `size`는 `medium`·`large`, 기본 `medium`이에요. 글자는 둘 다 12/16이고 높이·여백·모서리·아이콘만 달라요. SEED medium 글자는 11px이지만 Figma를 따라요
- **Solid·Outline 굵기는 SemiBold예요**: Figma Spec 표는 Bold였지만 72개 변형은 모두 `font/weight/semibold`(텍스트 스타일 `Badge/Label/SemiBold`)에 묶여 있었어요. SEED(`bold`)를 옮겨 적은 흔적으로 보고 변형을 따랐고, Spec 표를 고쳤어요. Button도 semibold라 굵기 단계가 늘지 않아요. Weak는 Medium이에요
- **색은 tone이 값 다섯 개를 채우고 variant가 골라 써요**: tone마다 weak 배경·solid 배경·글자·solid 위 글자·outline 테두리를 `createVar`로 채우고, variant는 그중 무엇을 배경·테두리·글자에 쓸지 정해요. Figma 바인딩이 tone마다 같은 규칙이라, 조합 18개를 `compoundVariants`로 늘어놓으면 규칙 하나를 바꿀 때 여섯 곳을 고쳐요(FF C2). 한 조합의 색을 보려면 같은 파일 안에서 두 번 따라가야 하는 건 감수했어요(FF R6). 규칙에서 벗어나는 조합이 생기면 그것만 `compoundVariants`로 덮어요
  - Outline 테두리는 글자색 토큰이에요(`fg/<tone>`, neutral만 `stroke/neutral-muted`). Figma가 그렇게 묶었고, stroke 토큰에는 tone별 색이 없어요
  - 아이콘은 `currentColor`로 글자색을 따라요. Figma는 글자와 같은 변수로 칠한 막을 씌웠는데 결과가 같아요
- **모든 variant에 1px 테두리를 두고 여백에서 1px을 빼요**: weak·solid는 투명한 테두리라, forced-colors(Windows 고대비)에서 배경이 사라져도 상자가 보여요. SEED의 inset box-shadow는 forced-colors에서 지워져요. Figma 테두리는 안쪽(INSIDE)이라 여백에 안 잡혀서, CSS 여백에서 1px을 빼야 높이가 20·24px로 맞아요. `_internal/inputBox.css.ts`와 같은 방식이에요
- **높이는 최소 높이예요**: 글자를 키우면 배지도 커지고 아이콘은 그대로예요(Figma Examples "글자 확대 200%")
- **토큰 없는 값은 숫자로 써요**: 높이 20·24px, 아이콘 12·14px, 테두리 1px은 Figma도 변수에 묶지 않았어요. 12/16 글자 묶음은 `textStyles`에 없어서 Button처럼 글자 토큰을 직접 써요. 한 줄 말줄임이라 `keep-all`은 필요 없어요
- **좁으면 한 줄로 말줄임해요**: 라벨을 `<span>`으로 감싸 `nowrap`·`ellipsis`를 주고, 루트는 `min-width: 0`·`max-width: 100%`라 부모를 따라 줄어요. flex의 글자 조각에는 스타일을 줄 수 없어서 감싼 요소가 필요해요. 기본 최대 너비는 없어요(Figma도 없음)
- **접근성**
  - 역할과 `tabIndex`가 없어요. 문구가 주변 글과 함께 읽혀요
  - `prefixIcon`은 `aria-hidden` span으로 감싸요. Button·Link와 같고, Figma 규칙 "라벨과 같은 뜻을 반복하는 Prefix는 장식"을 따라요. 그래서 뜻은 문구에 담으라고 컴포넌트 JSDoc에 적었어요
  - 말줄임은 보이는 글자만 잘라서 스크린리더는 전체를 읽어요. `title`은 자동으로 붙이지 않아요. 마우스에서만 보여서 원문을 확인할 경로가 되지 못해요
  - 라이브 영역(`role="status"`)을 붙이지 않아요. 바뀐 걸 알려야 하면 쓰는 쪽이 알려요(Figma 규칙)
  - 글자 대비는 Light·Dark 36개 조합 모두 4.5:1 이상이에요. 가장 낮은 건 Light Solid·Brand 4.52:1이라 `bg/brand-solid`를 바꾸면 다시 봐요
- **Figma 세트는 3개 그대로 두고 아래 표로 이어요**: 세트를 하나로 합치면 이름이 1:1이 되지만, Figma가 "세트 이름으로 고른다"고 정했고 Menu Item이 `Badge/Weak` 인스턴스 16개를 써서 모두 다시 이어야 해요. Checkbox와 같은 방식이에요

| Figma                                                      | 코드                                        |
| ---------------------------------------------------------- | ------------------------------------------- |
| 세트 `Badge/Weak`·`Badge/Solid`·`Badge/Outline`            | `variant` `weak`·`solid`·`outline`          |
| `Size` Medium·Large                                        | `size` `medium`·`large`                     |
| `Tone` Neutral·Brand·Informative·Positive·Warning·Critical | `tone` 같은 값의 소문자                     |
| `Layout` Text·Prefix                                       | prop 없음. `prefixIcon`을 넘기면 Prefix예요 |
| `Prefix icon`(인스턴스 교체)                               | `prefixIcon`                                |
| `Label` 텍스트                                             | `children`                                  |

## 뺀 것

- **`asChild`**: 누를 수 없는 표시라 링크·버튼으로 바꿀 일이 없어요. 필요해지면 더해도 깨지지 않아요
- **`layout` prop**: `prefixIcon`과 함께 두면 `layout="text"`인데 아이콘을 넘긴 조합이 생겨요
- **Action(설명을 여는 버튼)**: Figma가 "Help Bubble과 함께 후속 확장"으로 미뤘어요. 말줄임된 원문을 볼 경로도 그때 다뤄요
- **`suffixIcon`**: Figma에 없어요
- **`maxWidth` prop**: 쓰는 쪽이 `className`이나 부모 너비로 줄여요. SEED 예시도 style로 줄여요
- **Montage의 임의 색(`accentColor`)·반응형 size·`trailingContent`**: 임의 색은 tone이 주는 "뜻이 있는 색"을 허물어요
- **숫자 배지**: Notification Badge가 따로 있어요

## 열린 질문

- **Outline·Neutral 테두리가 거의 안 보여요**: `stroke/neutral-muted`가 배경과 1.23:1이에요. 뜻은 글자가 전해서 WCAG 1.4.11 위반은 아니지만, 디자인으로 괜찮은지는 정하지 않았어요
