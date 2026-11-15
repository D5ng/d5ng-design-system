# Chip

짧은 글자 하나로 실행하거나 고르는 알약 모양 버튼이에요. 이 문서는 Chip 부품들의 **결정과 이유**만 남겨요.

- **동작 계약**: `packages/react/src/components/Chip/`의 `Chip.test.tsx`·`ChipRadioGroup.test.tsx`·`ChipToggleGroup.test.tsx` 테스트 이름이 정본이에요
- **사용 가이드**: Figma `Chip` 페이지
- **계획**: [Chip 계획](https://claude.ai/artifact/Wf18sSnYfEjybf9LLG2p5M)(PR 1, D1·D2), [Chip 그룹 계획](https://claude.ai/artifact/HzJCmwhtoum1CY5tirscrZ)(PR 2, D3·D4는 2026-11-15 확정)
- **비교한 자료**(2026-11-14, 선택 표시는 2026-11-15에 다시 봤어요)
  - SEED: https://seed-design.io/llms/components/chip.txt, https://seed-design.io/llms/react/components/chip.txt, https://raw.githubusercontent.com/daangn/seed-design/dev/packages/react/src/components/Chip/Chip.tsx, https://raw.githubusercontent.com/daangn/seed-design/dev/packages/rootage/components/chip.yaml
  - Montage: https://montage.wanted.co.kr/docs/components/actions/chip/web, https://montage.wanted.co.kr/docs/components/selection-and-input/filter-button/web, 각각 `/design`
  - WCAG 2.2: https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html
  - Radix: `@radix-ui/react-toggle` 1.2.1, `@radix-ui/react-radio-group` 1.5.1, `@radix-ui/react-toggle-group` 1.2.1 빌드 파일(`radix-ui` 1.8.1)

## 정한 것

- **역할마다 부품을 나누고 `Chip` 하나로 묶지 않아요**: 실행(`ChipButton`), 켜고 끄기(`ChipToggle`), 하나 고르기(`ChipRadioGroup`·`ChipRadioGroupItem`)는 스크린리더가 읽는 역할과 키보드 동작, 필요한 상태가 서로 달라요(FF R1). 하나로 합치면 "버튼인데 선택됨" 같은 조합이 생기고, 필터를 만들며 토글 설정을 빠뜨리면 선택 상태가 읽히지 않아요. SEED(`Chip.Button`·`Chip.Toggle`·`Chip.RadioRoot`)와 같은 나눔이고, 점 표기 대신 이름을 붙여요. 대가는 export가 늘어나는 것이라 부품 JSDoc 첫 줄에 언제 쓰는지와 다른 부품으로 갈 때를 적어요
- **`ChipToggle`은 Radix Toggle이에요**: `<button type="button" aria-pressed>`라서 "눌림"으로 읽혀요. Figma Accessibility가 정한 방식이에요. SEED Toggle은 숨은 checkbox라 "체크박스, 선택됨"으로 읽혀요. 둘 다 WAI APG에 맞아서 Figma를 따라요
  - Radix ToggleGroup은 쓰지 않아요. `single`은 고른 항목을 다시 누르면 풀리고 방향키가 포커스만 옮겨요. `multiple`은 `role="toolbar"`라 Figma의 Tab 이동과 달라요
- **서버 컴포넌트예요(`"use client"` 없음)**: `ChipButton`은 핸들러를 만들지 않는 `<button>`이고, `ChipToggle`은 Radix Toggle에 값만 넘겨요. `loading`이 없어서 Button처럼 클릭을 막는 핸들러도 없어요. 두 그룹도 context 없이 CSS 변수와 `<fieldset>`으로 칩에 전해서 서버 컴포넌트예요
- **누르는 영역과 보이는 겉면을 나눠요**: 버튼은 최소 44×44px(`chip/min-target-height`)이고 투명해요. 그 안의 겉면(`surface`)이 32·36·40px 알약을 그려요. 포커스 링은 버튼에 있어서 44px 영역을 둘러요(Figma Focus ring과 같아요)
- **눌림은 Button 규칙이에요**: 겉면만 `scale(1 − press.maxReduction)`(0.96)으로 줄고, 누를 때 spring-rapid, 뗄 때 spring-quick이에요. 움직임 줄이기에서는 축소를 끄고 색만 바꿔요. Figma Prototype의 100ms는 Button을 정하기 전 문구라 Figma를 고쳤어요
- **모든 variant에 1px 테두리를 둬요**: `solid`는 투명 테두리예요. 크기가 variant마다 같고, forced-colors에서 테두리가 보여서 칩 모양이 남아요. Figma 테두리는 안쪽(INSIDE)이라 여백에서 1px을 빼요
- **선택 2px 테두리는 1px border에 안쪽 그림자 1px을 더해 그려요**: border를 2px로 바꾸면 선택할 때 너비가 1px씩 늘어 옆 칩이 밀려요. TextField 강조 테두리와 같은 방식이에요. Figma에 Chip 테두리 두께 변수가 없어서 1px 숫자예요
- **선택은 체크 없이 모양으로 보여요**: `solid`·`outlineStrong`은 배경이 반전되고, `outlineWeak`는 옅은 배경에 2px 테두리가 생겨요. 체크를 두면 너비를 지키려고 선택 전에도 빈자리를 남겨야 해서, 고르지 않은 칩은 글자가 한쪽으로 20px 쏠려 보였어요. SEED도 체크 없이 반전해요
  - 반전은 미선택 배경과 명도 대비가 13:1을 넘어서 색만으로 구분하는 게 아니에요. WCAG Understanding 1.4.1은 명도 대비 3:1 이상을 추가 구분으로 봐요. 선택 상태를 직접 말하지는 않아서 이건 우리 해석이에요
  - 고대비 모드(forced-colors)는 배경과 그림자를 지워서 선택이 사라져요. 선택만 `Highlight`·`HighlightText`로 직접 그리고, 선택+비활성은 `GrayText` 2px 테두리예요
- **긴 글자는 칩 안에서 줄바꿈돼요**: 버튼은 `flex-shrink: 0`, `max-width: 100%`예요. 가로 스크롤 줄에서는 줄지 않고, 좁은 부모에서는 줄바꿈돼요(`keep-all`). Button은 nowrap이지만 Figma 긴 라벨 예시가 줄바꿈이라 달라요
- **prop 이름**
  - `variant`는 `solid`·`outlineStrong`·`outlineWeak`, 기본 `outlineWeak`예요. 이름은 SEED·Figma 세트와 같고 기본은 Figma를 따라요(SEED 기본은 `solid`)
  - `size`는 `small`·`medium`·`large`, 기본 `medium`이에요. 겉면만 바뀌고 누르는 영역은 그대로예요. large만 글자가 16/22예요(`textStyles.labelDefault`가 14/19뿐이라 글자 토큰을 직접 써요)
  - `prefixIcon`은 Button과 같은 이름이고 스크린리더가 읽지 않아요
  - `ChipToggle`의 선택은 Radix 이름 그대로 `pressed`·`defaultPressed`·`onPressedChange`예요. 스타일 파일의 pressed는 누르는 중(`:active`)이라 파일 위에 주석으로 구분해요
- **선택 색은 무채색이에요**: `solid`·`outlineStrong`은 `bg/neutral-solid` + `fg/on-neutral-solid`, `outlineWeak`는 `bg/neutral-weak` + 2px `stroke/neutral-contrast`예요. 칩은 한 화면에 여러 개가 함께 켜져서, 브랜드 색이면 화면의 주 버튼보다 눈에 띄어요. 우리 Checkbox·RadioGroup 기본(`neutral`)과도 같아요. 브랜드 색 선택이 필요한 화면이 생기면 Checkbox처럼 `tone`을 더해요. 더하는 건 깨지지 않아요
  - 미선택 hover·눌림은 variant와 상관없이 `bg/neutral-weak-hover`·`-pressed`예요
  - 비활성은 `bg/disabled`·`fg/disabled`이고, outline 테두리는 Checkbox 비활성 테두리와 같은 `stroke/neutral-weak`예요. 비활성 배경은 variant마다 같아서 선택은 2px `fg/disabled` 테두리로만 남아요. `solid`도 이때는 테두리를 그려요
- **크기는 chip 변수예요**: Figma Component 컬렉션에 `chip/min-height/{sm,md,lg}`, `chip/min-target-height`, `chip/icon-size/{sm,md,lg}`를 더하고 72개 변형에 묶었어요
- **`ChipRadioGroup`은 Radix RadioGroup이에요**: `radiogroup`·`radio`로 읽히고, 방향키로 옮기면 바로 골라지고, Tab은 고른 칩으로 한 번만 들어가요. Figma 단일 선택 예시의 키보드 계약이에요
  - 고른 칩을 다시 눌러도 풀리지 않아요. "아무것도 고르지 않음"이 필요하면 "전체" 칩을 두고 `defaultValue`로 골라요. 컴포넌트 JSDoc에도 한 줄 적었어요
  - `orientation`·`loop`·`dir`은 받지 않아요. 칩은 줄바꿈돼서 가로·세로가 섞이고, 없으면 네 방향키가 모두 동작해요
  - 값 이름은 Radix 그대로 `value`·`defaultValue`·`onValueChange`이고, `value={null}`이면 아무것도 고르지 않은 채 제어해요. RadioGroup과 같아요
- **variant·size는 `ChipRadioGroup`이 정하고 칩이 물려받아요**: 그룹이 모양 변수를 채우고 `ChipRadioGroupItem`은 버튼 스타일만 붙여요. context가 없어서 두 부품 모두 서버 컴포넌트예요. RadioGroup의 size·tone과 같은 방식이에요
  - 스타일 파일은 모양 변수(`shape` recipe)와 버튼 스타일(`button`)을 나눠요. 혼자 쓰는 칩은 둘을 버튼에 함께 붙여요. 나누기 전후로 `ChipButton`·`ChipToggle` 54개 조합의 계산값이 같은지 비교했어요
  - `ChipToggleGroup`에는 variant·size가 없어요. `ChipToggle`은 혼자서도 쓰는 부품이라 자기 모양을 가져요. 묶음이 정하게 하려면 그룹 값이 칩 prop을 이기는 규칙이 하나 더 생겨요
- **`ChipToggleGroup`은 Field와 `<fieldset>`으로 묶어요(D2)**: 이유는 [checkbox-group.md](checkbox-group.md)와 같아요. 제목이 묶음의 이름이 되고, 그룹 `disabled`는 브라우저가 안의 칩을 모두 막아요. 칩마다 Tab으로 멈추고 방향키로는 옮기지 않아요(Figma 다중 선택 예시)
  - 값 상태가 없어요. 켠 상태는 칩마다 `pressed`로 가져요. 값 배열을 받으면 칩 등록과 context가 필요해서 `"use client"`가 돼요
  - fieldset의 `name`·`form`은 받지 않아요. `ChipToggle`은 form에 값을 내지 않아서 이름을 줘도 아무것도 제출되지 않아요
  - `required`·`invalid`는 CheckboxGroup처럼 제목의 `*`와 설명 연결만 바꾸고 묶음·칩에 aria를 붙이지 않아요
- **비활성 선택자는 `:disabled`도 봐요**: `_internal/selectionRow.css.ts`의 `selectionControlDisabled`를 Chip도 써요. 비활성 `ChipToggleGroup`(fieldset)이 막은 칩은 Radix가 `data-disabled`를 붙이지 않아서 `:disabled`로만 보여요. 쓰는 쪽이 form 전체를 `<fieldset disabled>`로 막을 때도 칩이 비활성으로 보여요
- **`ChipRadioGroupItem`은 칸(`<span>`) 안에 버튼을 둬요**: form 안에서 Radix가 숨은 input을 버튼 뒤에 absolute로 두고 버튼 위로 옮겨요. 칩 줄이 flex라 칸이 없으면 input이 줄 처음으로 가서 required 말풍선이 엉뚱한 칩을 가리켜요
  - 칸 스타일은 RadioGroup과 함께 `_internal/radioInput.css.ts`에 둬요. Radix가 input 자리를 바꾸면 두 곳이 함께 바뀌어요(FF K2·C2, 2026-11-15 리뷰)
  - `className`·`style`은 칸에, 나머지 props와 `ref`는 radio 버튼에 가요. `RadioGroupItem`이 행에 주는 것과 같아요
- **칩 사이와 줄 사이는 8px, 제목과 칩 사이도 Field 그대로 8px이에요(D3)**: Figma 그룹 예시는 제목과 칩 사이가 12px이었어요. 그룹이 Field를 품어서 Field 간격을 따르고, Figma 예시를 Field로 바꿔요
- **칩이 넘치면 줄바꿈만 해요(D4)**: 가로 스크롤은 아래 "뺀 것"에 있어요
- **Figma 속성과의 대응**
  - 세트(`Chip/Solid`·`Chip/OutlineStrong`·`Chip/OutlineWeak`)는 `variant`, `size`는 `size`, `prefixIcon`은 `prefixIcon`, `Label`은 `children`이에요
  - `Selected`는 `ChipToggle`의 `pressed`예요. `ChipButton`에는 없어요
  - `State=Disabled`는 `disabled`예요. `State`의 Hover·Pressed와 `Focus visible`은 브라우저 상태예요(Figma 표시용)
  - `_Examples/Chip single selection`은 `ChipRadioGroup`, `_Examples/Chip multiple selection`은 `ChipToggleGroup`이에요. 두 예시의 `Active`·`Value` 속성은 고른 칩을 보여 주는 Figma 표시용이에요

## 뺀 것

- **`asChild`와 링크 칩**: Figma에 화면을 옮기는 칩이 없어요. 나중에 더해도 깨지지 않아요
- **뒤 아이콘·지우기, 아바타, 아이콘만(SEED `layout="iconOnly"`)**: Figma 범위 밖이에요("입력값 삭제형은 후속 확장")
- **`loading`**: Figma에 없어요. 그래서 `ChipButton`은 Button과 달리 서버 컴포넌트예요
- **가로 스크롤 배치 prop**: 쓰는 쪽이 `overflow-x: auto` 줄에 넣으면 돼요. 필요해지면 그룹에 더해요
- **`ChipToggle`의 form 제출**: Radix Toggle은 숨은 input이 없어서 값을 내지 않아요. form에 값이 필요하면 `ChipRadioGroup`의 `name`을 쓰거나, 여러 개는 쓰는 쪽이 `pressed`로 숨은 input을 그려요

## 열린 질문

- **눌림 모션 공통화**: 눌림 transition, `linear()` `@supports`, 축소, 움직임 줄이기 묶음을 Button·Switch·Checkbox·Radio에 이어 Chip도 복사해 써요. 공통화 PR 목록에 Chip을 더해요
- **링크로 고르는 칩**: 블로그 태그 필터가 URL 검색 파라미터로 상태를 가지면 `<a>` 칩이 더 맞을 수 있어요. 블로그에서 칩을 어디에 쓸지 정해지면 다시 봐요
