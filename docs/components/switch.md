# Switch

누르면 바로 반영되는 켜기·끄기예요. 이 문서는 Switch·SwitchRow의 **결정과 이유**만 남겨요.

- **동작 계약**: `packages/react/src/components/Switch/Switch.test.tsx`의 테스트 이름이 정본이에요
- **사용 가이드**: Figma `Switch` 페이지
- **비교한 자료**(2026-11-11)
  - SEED: https://seed-design.io/llms/components/switch.txt, https://seed-design.io/llms/react/components/switch.txt, https://seed-design.io/llms/components/list.txt(ListSwitchItem), https://seed-design.io/rootage/components/switch.json, https://seed-design.io/rootage/components/switchmark.json
  - Montage: https://montage.wanted.co.kr/docs/components/selection-and-input/switch/web, `/design`
  - Radix: `@radix-ui/react-switch` 1.4.1 빌드 파일

## 정한 것

- **Switch와 SwitchRow 두 컴포넌트예요**: Switch는 표시 + 라벨, SwitchRow는 라벨·설명 + 오른쪽 표시예요. Switch 하나에 `description`과 배치 prop을 두면 Figma에 없는 모양(설명 + 왼쪽 표시)이 생겨요. 표시만(SEED Switchmark)은 내보내지 않아요. 라벨 없는 스위치를 쓰게 돼서 이름을 빠뜨리기 쉽고, 나중에 더해도 깨지지 않아요
- **SwitchRow는 Field를 쓰지 않아요**: 겹치는 건 라벨·설명이라는 낱말과 id를 잇는 방식뿐이고 배치·글자 크기·클릭 영역이 달라요. Field에 가로 배치를 더하면 Field가 두 모양을 갖고(FF K1) 오류·글자 수 prop이 뜻을 잃어요. id를 잇는 코드가 Field와 비슷한 건 허용해요(FF K2)
- **Radix Switch 버튼 위에 만들어요**: `<button role="switch" aria-checked>`이고 폼 안에서만 숨은 checkbox를 더해요. 폼·키보드·aria를 Radix가 이미 하고 Checkbox·Radio도 Radix예요. Figma Accessibility의 "네이티브 입력 기반" 문구는 이에 맞게 고쳤어요
- **루트는 `<label>`이고 `htmlFor` 없이 감싸요**: 라벨 글자와 줄 여백을 눌러도 바뀌어요. 라벨은 안의 첫 라벨 가능 요소인 버튼에 이어져요. 폼 안에서 Radix가 숨은 input으로 click을 한 번 더 보내도 `MouseEvent`가 아니라서 라벨이 다시 반응하지 않아요
- **`className`·`style`은 바깥 `<label>`에, 나머지 props와 `ref`는 버튼에 가요**: `id`·`aria-*`·`name`·`focus()`는 버튼이 받아야 해요. Checkbox와 같아요
- **SwitchRow의 이름은 라벨만이에요**: 감싼 `<label>`의 글자가 이름이 되면 설명까지 붙어 읽혀서 `aria-labelledby`로 라벨만 잇고 설명은 `aria-describedby`로 이어요. 쓰는 쪽 `aria-describedby`는 설명 뒤에 합쳐요. 저장 상태 문구를 행 밖에 두고 이어도 설명이 빠지지 않아요
- **`loading`은 Button과 같은 계약이에요**: 쓰는 쪽 핸들러보다 먼저 클릭을 막고, 포커스는 남기고, `aria-busy`·`aria-disabled`로 알려요. Button과 달리 모양은 그대로이고 hover·눌림 반응만 꺼요. Figma의 저장 중 상태가 "새 값을 보이고 반복 입력만 잠금"이에요. 핸들러를 만들어 넘겨서 `"use client"`가 붙어요
  - `disabled`와 함께면 loading처럼 포커스를 남기고 모양은 disabled를 따라요. Radix는 자기 `disabled`일 때만 `data-disabled`를 붙여서 직접 붙여요
- **색 축은 `tone: "neutral" | "brand"`, 기본 `neutral`이에요**: SEED·Figma, Checkbox·Radio와 같아요. 중요도가 아니라 강조 색만 고르는 축이라 `/design-refs` 이름 규칙에 예외로 적었어요
- **size는 `"16" | "24" | "32"`, 기본 `"24"`예요**: SEED도 small·medium을 버리고 숫자로 옮겼어요. Figma 값과 글자까지 같아요. 기본은 SEED(32) 대신 Figma(24)를 따라요
- **눌림은 Button 규칙이에요**: 트랙만 `scale(1 − press.maxReduction)`(0.96)으로 줄고, 누를 때 spring-rapid, 뗄 때 spring-quick이에요. 포커스 링은 버튼에 있어서 제자리에 남아요(Motion Foundation). Figma Specification의 2%와 Pressed 그림(98%)은 변수 값(0.04)과 달라서 Figma를 고쳤어요
- **hover·눌림은 줄 전체를 봐요**: 라벨 글자를 눌러도 트랙이 반응해요. 마우스로 누르면 줄이, 키보드 Space로 누르면 버튼만 `:active`가 돼서 둘 다 봐요
- **thumb 안쪽 여백은 계산해요**: Figma는 32에만 `switch/inset-32`를 묶었고, 세 크기 모두 (트랙 높이 − 켜진 thumb) ÷ 2와 같아요. 토큰을 더하지 않고 두 토큰에서 구해서 값이 따로 놀지 않아요(FF C2)
- **thumb는 가운데를 기준으로 커져요**: 꺼짐은 켜짐의 80%(`switch/thumb-off-*`)이고, 크기가 바뀌어도 트랙 세로 가운데에 남아요. 움직임 줄이기에서는 바로 옮겨요
- **비활성 테두리는 안쪽 그림자로 그려요**: 테두리로 그리면 thumb 자리가 상태마다 1px 달라져요. Figma가 두께를 변수로 묶지 않아서 1px 숫자예요
- **숨은 input이 버튼 위에 겹치게 표시 칸을 인라인으로 둬요**: Radix는 input을 버튼 바로 뒤에 붙이고 버튼 너비만큼 왼쪽으로 옮겨요. 표시 칸을 flex나 block 버튼으로 두면 input이 버튼 왼쪽에 놓여 required 안내 말풍선이 엉뚱한 곳을 가리켜요
- **줄 스타일은 Checkbox와 같은 정책이에요**: 44px 최소 높이, 여백 8px, 첫 줄 맞춤, 눌림·커서 규칙이 같아요. 공통 부분은 `_internal/selectionRow.css.ts`에 있어요. 최소 높이는 Figma 변수가 컴포넌트마다 따로라 `switch.minTargetHeight`로 정하고, loading 커서(`progress`)도 Switch에만 있어요
  - 비활성은 `data-disabled`와 `:disabled`를 함께 봐서 비활성 fieldset 안에서도 비활성으로 보여요([checkbox-group.md](checkbox-group.md))
- **Figma `Selection`은 `checked`예요**: Figma 속성 이름은 Checkbox(값 3개)·Radio와 같은 `Selection`으로 두고 여기에 대응만 적어요. `Show description`은 `description`을 넘겼는지, `State`의 Hover·Pressed와 `Focus visible`은 브라우저 상태예요(Figma 표시용)

## 뺀 것

- **`hideLabel`**: Figma에 라벨을 숨기는 속성이 없고 쓸 화면도 아직 없어요. Checkbox와 같아요. 선택 prop은 나중에 더해도 깨지지 않아요
- **SEED의 눌림 끄기 CSS 변수, `inputProps`**
- **부모 행에 눌림이 있으면 표시 눌림을 빼는 규칙(Figma Motion)**: 쓸 화면이 생기면 더해요
- **저장 상태 문구와 다시 시도 버튼**: Figma 저장 흐름 시연처럼 컴포넌트 밖, 쓰는 쪽 화면의 일이에요
