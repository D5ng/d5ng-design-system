# Chip

짧은 글자 하나로 실행하거나 고르는 알약 모양 버튼이에요. 이 문서는 Chip 부품들의 **결정과 이유**만 남겨요.

- **동작 계약**: `packages/react/src/components/Chip/Chip.test.tsx`의 테스트 이름이 정본이에요
- **사용 가이드**: Figma `Chip` 페이지
- **비교한 자료**(2026-11-14)
  - SEED: https://seed-design.io/llms/components/chip.txt, https://seed-design.io/llms/react/components/chip.txt, https://raw.githubusercontent.com/daangn/seed-design/dev/packages/react/src/components/Chip/Chip.tsx, https://raw.githubusercontent.com/daangn/seed-design/dev/packages/rootage/components/chip.yaml
  - Montage: https://montage.wanted.co.kr/docs/components/actions/chip/web, https://montage.wanted.co.kr/docs/components/selection-and-input/filter-button/web, 각각 `/design`
  - Radix: `@radix-ui/react-toggle` 1.2.1, `@radix-ui/react-radio-group` 1.5.1, `@radix-ui/react-toggle-group` 1.2.1 빌드 파일(`radix-ui` 1.8.1)

## 정한 것

- **역할마다 부품을 나누고 `Chip` 하나로 묶지 않아요**: 실행(`ChipButton`), 켜고 끄기(`ChipToggle`), 하나 고르기(`ChipRadioGroup`·`ChipRadioGroupItem`, PR 2)는 스크린리더가 읽는 역할과 키보드 동작, 필요한 상태가 서로 달라요(FF R1). 하나로 합치면 "버튼인데 선택됨" 같은 조합이 생기고, 필터를 만들며 토글 설정을 빠뜨리면 선택 상태가 읽히지 않아요. SEED(`Chip.Button`·`Chip.Toggle`·`Chip.RadioRoot`)와 같은 나눔이고, 점 표기 대신 이름을 붙여요. 대가는 export가 늘어나는 것이라 부품 JSDoc 첫 줄에 언제 쓰는지와 다른 부품으로 갈 때를 적어요
- **`ChipToggle`은 Radix Toggle이에요**: `<button type="button" aria-pressed>`라서 "눌림"으로 읽혀요. Figma Accessibility가 정한 방식이에요. SEED Toggle은 숨은 checkbox라 "체크박스, 선택됨"으로 읽혀요. 둘 다 WAI APG에 맞아서 Figma를 따라요
  - Radix ToggleGroup은 쓰지 않아요. `single`은 고른 항목을 다시 누르면 풀리고 방향키가 포커스만 옮겨요. `multiple`은 `role="toolbar"`라 Figma의 Tab 이동과 달라요
- **서버 컴포넌트예요(`"use client"` 없음)**: `ChipButton`은 핸들러를 만들지 않는 `<button>`이고, `ChipToggle`은 Radix Toggle에 값만 넘겨요. `loading`이 없어서 Button처럼 클릭을 막는 핸들러도 없어요
- **누르는 영역과 보이는 겉면을 나눠요**: 버튼은 최소 44×44px(`chip/min-target-height`)이고 투명해요. 그 안의 겉면(`surface`)이 32·36·40px 알약을 그려요. 포커스 링은 버튼에 있어서 44px 영역을 둘러요(Figma Focus ring과 같아요)
- **눌림은 Button 규칙이에요**: 겉면만 `scale(1 − press.maxReduction)`(0.96)으로 줄고, 누를 때 spring-rapid, 뗄 때 spring-quick이에요. 움직임 줄이기에서는 축소를 끄고 색만 바꿔요. Figma Prototype의 100ms는 Button을 정하기 전 문구라 Figma를 고쳤어요
- **모든 variant에 1px 테두리를 둬요**: `solid`는 투명 테두리예요. 크기가 variant마다 같고, forced-colors에서 테두리가 보여서 칩 모양이 남아요. Figma 테두리는 안쪽(INSIDE)이라 여백에서 1px을 빼요
- **선택 2px 테두리는 1px border에 안쪽 그림자 1px을 더해 그려요**: border를 2px로 바꾸면 선택할 때 너비가 1px씩 늘어 옆 칩이 밀려요. TextField 강조 테두리와 같은 방식이에요. Figma에 Chip 테두리 두께 변수가 없어서 1px 숫자예요
- **체크 자리는 선택 전에도 남겨요**: `ChipToggle`은 체크를 `visibility`로만 숨겨서 눌러도 너비가 그대로예요. 선택을 색만으로 구분하지 않으려고 Figma가 체크를 둬요. forced-colors에서는 그림자가 사라져서 체크가 선택을 알려요. `ChipButton`은 선택이 없어서 체크 자리도 없어요
- **긴 글자는 칩 안에서 줄바꿈돼요**: 버튼은 `flex-shrink: 0`, `max-width: 100%`예요. 가로 스크롤 줄에서는 줄지 않고, 좁은 부모에서는 줄바꿈돼요(`keep-all`). Button은 nowrap이지만 Figma 긴 라벨 예시가 줄바꿈이라 달라요
- **prop 이름**
  - `variant`는 `solid`·`outlineStrong`·`outlineWeak`, 기본 `outlineWeak`예요. 이름은 SEED·Figma 세트와 같고 기본은 Figma를 따라요(SEED 기본은 `solid`)
  - `size`는 `small`·`medium`·`large`, 기본 `medium`이에요. 겉면만 바뀌고 누르는 영역은 그대로예요. large만 글자가 16/22예요(`textStyles.labelDefault`가 14/19뿐이라 글자 토큰을 직접 써요)
  - `prefixIcon`은 Button과 같은 이름이고 스크린리더가 읽지 않아요
  - `ChipToggle`의 선택은 Radix 이름 그대로 `pressed`·`defaultPressed`·`onPressedChange`예요. 스타일 파일의 pressed는 누르는 중(`:active`)이라 파일 위에 주석으로 구분해요
- **색은 Figma 그대로예요**: 미선택 hover·눌림은 variant와 상관없이 `bg/neutral-weak-hover`·`-pressed`예요. 선택하면 `solid`는 `bg/brand-solid`, outline은 `bg/brand-weak` + `stroke/brand-solid`예요. 비활성은 `bg/disabled`·`fg/disabled`이고 선택 표시(체크·2px)는 남아요
- **크기는 chip 변수예요**: Figma Component 컬렉션에 `chip/min-height/{sm,md,lg}`, `chip/min-target-height`, `chip/icon-size/{sm,md,lg}`를 더하고 72개 변형에 묶었어요
- **Figma 속성과의 대응**
  - 세트(`Chip/Solid`·`Chip/OutlineStrong`·`Chip/OutlineWeak`)는 `variant`, `size`는 `size`, `prefixIcon`은 `prefixIcon`, `Label`은 `children`이에요
  - `Selected`는 `ChipToggle`의 `pressed`예요. `ChipButton`에는 없어요
  - `Show indicator`는 prop이 아니라 부품 고르기예요. 켜짐은 `ChipToggle`(PR 2부터 `ChipRadioGroupItem`도), 꺼짐은 `ChipButton`이에요
  - `State=Disabled`는 `disabled`예요. `State`의 Hover·Pressed와 `Focus visible`은 브라우저 상태예요(Figma 표시용)

## 뺀 것

- **`asChild`와 링크 칩**: Figma에 화면을 옮기는 칩이 없어요. 나중에 더해도 깨지지 않아요
- **뒤 아이콘·지우기, 아바타, 아이콘만(SEED `layout="iconOnly"`)**: Figma 범위 밖이에요("입력값 삭제형은 후속 확장")
- **`loading`**: Figma에 없어요. 그래서 `ChipButton`은 Button과 달리 서버 컴포넌트예요
- **가로 스크롤 배치 prop**: 쓰는 쪽이 `overflow-x: auto` 줄에 넣으면 돼요. 필요해지면 그룹에 더해요
- **`ChipToggle`의 form 제출**: Radix Toggle은 숨은 input이 없어서 값을 내지 않아요. 하나 고르기는 PR 2의 Radix RadioGroup이 form 안에서 숨은 input을 더해요

## 열린 질문

- **outline 비활성 테두리 색**: Figma가 글자 토큰 `fg/disabled`를 써요. Checkbox 비활성 테두리는 `stroke/neutral-weak`예요. 지금은 Figma를 따르고, 바꾸면 색이 달라져서 눈으로 보고 정해요
- **눌림 모션 공통화**: 눌림 transition, `linear()` `@supports`, 축소, 움직임 줄이기 묶음을 Button·Switch·Checkbox·Radio에 이어 Chip도 복사해 써요. 공통화 PR 목록에 Chip을 더해요
- **그룹 간격(PR 2)**: Figma 그룹 예시는 제목과 칩 사이가 12px이고 Field는 8px이에요. 그룹이 Field를 품으면 Figma 예시를 Field로 바꿀지 PR 2에서 정해요
- **링크로 고르는 칩**: 블로그 태그 필터가 URL 검색 파라미터로 상태를 가지면 `<a>` 칩이 더 맞을 수 있어요. 블로그에서 칩을 어디에 쓸지 정해지면 다시 봐요
