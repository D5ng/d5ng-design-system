# Checkbox

항목 하나를 고르거나 풀어요. 이 문서는 Checkbox의 **결정과 이유**만 남겨요.

- **동작 계약**: `packages/react/src/components/Checkbox/Checkbox.test.tsx`의 테스트 이름이 정본이에요
- **사용 가이드**: Figma `Checkbox` 페이지
- **비교한 자료**(2026-11-11)
  - SEED: https://seed-design.io/llms/components/checkbox.txt, https://seed-design.io/llms/react/components/checkbox.txt, https://seed-design.io/rootage/components/checkbox.json
  - Montage: https://montage.wanted.co.kr/docs/components/selection-and-input/checkbox/web, https://montage.wanted.co.kr/docs/components/selection-and-input/check-mark/web, 각각 `/design`
  - Radix: `@radix-ui/react-checkbox` 1.4.1 빌드 파일(`radix-ui` 1.8.1)

## 정한 것

- **Radix Checkbox 위에 만들어요**: `<button role="checkbox">`이고 폼 안에서만 숨은 checkbox input을 더해요. `aria-checked="mixed"`, Enter 막기, form reset, 숨은 input을 Radix가 이미 해요. Field도 `required`가 숨은 input에 가는 걸 전제로 해요([field.md](field.md))
  - 네이티브 `<input type="checkbox">`는 JS 없이도 동작하지만, 일부 선택이 DOM 속성이라 ref와 effect가 필요해서 `"use client"`가 되고, input이 자식을 못 가져 아이콘을 형제로 그려야 해요
  - 대가는 하이드레이션 전에 눌러도 바뀌지 않는 거예요. 서버의 `<form>`에서 `defaultChecked`·`name`은 그대로 제출돼요. Figma Accessibility의 "네이티브 우선" 문구도 이 방식으로 고쳐요
- **서버 컴포넌트예요(`"use client"` 없음)**: hook도, 만들어 넘기는 함수도, 브라우저 API도 없어요. 클라이언트 동작은 이미 `"use client"`인 Radix `Label`·`Checkbox`가 맡아요
- **루트는 `<label>`이고 `htmlFor` 없이 감싸요**: 라벨 글자와 줄 여백까지 눌러져요. 버튼이 안의 첫 라벨 가능 요소라 라벨이 버튼의 이름이 돼요. 그래서 `useId`도 필요 없어요
- **`className`·`style`은 줄(`<label>`)에, 나머지 props와 `ref`는 버튼에 가요**: `Field`의 `control`(`id`·`aria-describedby`·`aria-invalid`·`required`·`disabled`)을 그대로 펼칠 수 있어요. SEED처럼 모두 줄에 주고 `inputProps`로 받으면 예상하기는 쉽지만 Field와 쓸 때마다 `inputProps={control}`로 감싸야 해요. Switch와 같아요
- **라벨은 필수 `label` prop이에요**: TextField·Radio·Switch와 같은 이름이에요. `children`은 Button과 같지만 입력 컴포넌트들과 갈려요
- **일부 선택은 `checked="indeterminate"`예요**: SEED·Montage는 boolean `indeterminate`를 따로 둬요. 값 하나로 받으면 선택과 일부 선택이 둘 다 켜진 조합이 생기지 않고, Radix가 이미 이 모양이라 짤 코드가 없어요. 일부 선택에서 누르면 `true`가 돼요
- **prop 이름은 `size`·`variant`·`tone`·`labelWeight`예요**
  - `variant`는 `square`·`ghost`예요. Figma는 `Shape`지만 ghost는 모양이 아니라 강조 정도라 SEED·Button처럼 `variant`예요
  - `tone`은 `neutral`·`brand`, 기본 `neutral`이에요. 중요도가 아니라 강조 색만 고르는 축이라 `/design-refs` 이름 규칙의 예외예요(Switch·Radio와 같아요)
  - `labelWeight`는 `regular`·`semibold`예요. Figma `Weight=Bold`가 600(`font/weight/semibold`)에 묶여 있어서 Field처럼 토큰 이름을 써요. Figma 옵션도 `Semibold`로 바꿔요
  - `size`는 `medium`·`large`, 기본 `medium`이에요. 라벨과 상자가 함께 커져요
- **눌림은 Button 규칙이에요**: `scale(1 − press.maxReduction)`(0.96)으로 줄고, 누를 때 `spring-rapid`(200ms), 뗄 때 `spring-quick`(350ms)이에요. 움직임 줄이기에서는 축소를 끄고 색만 바꿔요. Figma Spec의 2%·100/150ms는 Button을 정하기 전 Motion Foundation의 검토용 값이라 Figma를 고쳐요. 20px 상자에서 0.8px 차이예요
- **표면만 줄고 포커스 링은 제자리예요**: 링은 버튼의 outline이고, 버튼 안 `surface`만 줄여요. Motion Foundation의 "포커스 링은 고정 영역에 두고 보이는 표면만 축소"와 같아요. Button은 루트가 통째로 줄어서 링도 같이 줄어요. Button은 이 PR에서 건드리지 않았어요
- **hover·눌림은 줄 전체를 봐요**: Figma는 "라벨을 포함한 영역이 함께 동작"이에요. 마우스로 누르면 줄이, 키보드 Space로 누르면 버튼만 `:active`가 돼서 둘 다 봐요(`:is(:active, :has(:active))`)
- **미선택 Pressed 배경은 `bg/neutral-weak-pressed`예요**: Figma는 `bg/neutral-weak-hover`라 Hover와 한 단계만 달라서 약했어요. Button ghost·secondary의 눌림 색과 같아져요. Figma도 바꿔요
- **체크 선은 크기와 상관없이 2px예요**: Figma 그대로예요. lucide는 선을 크기에 비례해 줄여서 12px 체크가 1px로 흐려져요. lucide의 `nonScalingStroke`(`vector-effect`)로 고정해요. `absoluteStrokeWidth`는 lucide-react 1.70에서 폐기 예고라 쓰지 않아요. Button 아이콘은 비례 선이라 규칙이 달라요
  - 아이콘 크기(Square 12·14px, Ghost 14·18px)는 Figma가 변수로 묶지 않아서 숫자예요
- **체크와 빼기 아이콘을 둘 다 그리고 CSS가 하나만 보여요**: 버튼의 `data-state`로 골라요. Radix `Checkbox.Indicator`는 미선택이면 그리지 않아서 Ghost의 흐린 체크를 보일 수 없고, `forceMount`를 켜면 결국 CSS로 골라야 해요
- **숨은 input이 상자 위에 겹치게 상자 칸을 인라인으로 둬요**: Radix는 input을 버튼 바로 뒤에 붙이고 버튼 너비만큼 왼쪽으로 옮겨요. 상자 칸(`markSlot`)을 줄 높이 없는 block으로, 버튼을 inline으로 둬요. flex나 block 버튼이면 input이 상자 왼쪽 아래로 어긋나서 required 안내 말풍선이 엉뚱한 곳을 가리켜요
- **라벨 첫 줄 가운데를 상자 가운데에 맞춰요**: 라벨에 `padding-top: (상자 − 줄 높이) / 2`를 줘서 Figma의 0.5·1px과 같고, 긴 라벨이 줄바꿈돼도 상자는 첫 줄에 남아요. `textStyles` 묶음은 굵기까지 정해서 `labelWeight`와 겹쳐요. 그래서 글자 토큰과 한글 줄바꿈(`keep-all`)을 직접 붙여요
- **줄 스타일은 Radio·Switch와 같은 정책이에요**: 최소 높이 44px, 여백 8px, 상자–라벨 간격 8px, 첫 줄 맞춤, 눌림·커서 규칙이 같아요. 공통 부분(여백·정렬·커서, 눌림·hover·비활성 선택자)은 `_internal/selectionRow.css.ts`에 있어요
  - 최소 높이는 Figma가 컴포넌트마다 변수를 따로 둬서(셋 다 44px) 각자 자기 토큰을 써요. 공통 파일이 한 컴포넌트 토큰을 쓰면 다른 컴포넌트가 거기에 묶여요
  - 열 구성(열 너비·간격·`fit-content`)은 SwitchRow처럼 컴포넌트마다 달라서 각자 정해요
- **그룹 제목·안내·오류는 Field가 맡아요**: CheckboxGroup(다음 PR)은 값 상태 없이 세로로 묶기만 하고, Field `group`(#117)이 이름과 설명을 이어요. SEED는 CheckboxGroup이 Field의 일을 다시 해요. 우리 Figma도 Field + Group 조합이에요
- **Figma 속성과의 대응**: `Shape`·`Tone`(세트 이름)은 `variant`·`tone`, `Selection`은 `checked`(Unselected `false`, Selected `true`, Indeterminate `"indeterminate"`), `Weight`는 `labelWeight`, `State=Disabled`는 `disabled`예요. `State`의 Hover·Pressed와 `Focus visible`은 브라우저 상태예요(Figma 표시용)

## 뺀 것

- **상자만 쓰는 export(`Checkmark`)**: 쓸 화면이 없고, 라벨 없는 체크박스를 쓰게 돼서 이름을 빠뜨리기 쉬워요. 나중에 더해도 깨지지 않아요. Figma Checkmark 세트에는 "Checkbox 안에서만 써요"라고 적어요
- **`hideLabel`**: Figma에 라벨을 숨기는 속성이 없고 쓸 화면도 아직 없어요. Switch와 같아요
- **`invalid`**: Figma Checkbox에 오류 모양이 없어요. Field가 넘기는 `aria-invalid`는 버튼에 붙고, 오류는 Field 문구가 알려요
- **`asChild`**: 상자 안을 우리가 그리고, 버튼과 숨은 input의 짝은 Radix가 정해요
- **전체 선택 연동**: CheckboxGroup에서도 빼요. 넣으면 그룹이 값 상태와 항목 등록을 갖고 `"use client"`가 돼요. 쓸 화면이 생길 때까지는 화면마다 `checked="indeterminate"`와 "비활성 항목 제외" 규칙을 직접 지켜요. Figma Spec에도 "웹 구현 전"이라고 적어요

## 열린 질문

- **눌림 모션 공통화**: 눌림 transition, `linear()` `@supports`, 축소, 움직임 줄이기 묶음이 Button(`_internal/buttonBase.css.ts`)·Switch와 같아요. 같은 Motion Foundation 정책이라 함께 바뀌니 `_internal`로 옮겨야 해요(FF K2). Button까지 고쳐야 해서 Checkbox PR에는 넣지 않았고, Switch가 머지된 뒤 세 곳을 한 PR로 옮겨요
- **그룹 `disabled`를 항목에 전하는 방법**(CheckboxGroup): context면 Checkbox가 `"use client"`가 돼요. `<fieldset disabled>`면 브라우저가 버튼을 막지만 `data-disabled`가 없어서 스타일이 `:disabled`도 봐야 해요
