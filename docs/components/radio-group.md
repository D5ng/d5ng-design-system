# RadioGroup

여러 항목 중 하나를 골라요. 이 문서는 RadioGroup·RadioGroupItem의 **결정과 이유**만 남겨요.

- **동작 계약**: `packages/react/src/components/RadioGroup/RadioGroup.test.tsx`의 테스트 이름이 정본이에요
- **사용 가이드**: Figma `Radio` 페이지
- **계획**: [Radio 계획](https://claude.ai/artifact/VP8D7Gqe87r4rpGReM677S)(D1~D7, 2026-11-12 확정)
- **비교한 자료**(2026-11-11)
  - SEED: https://seed-design.io/llms/components/radio.txt, https://seed-design.io/llms/react/components/radio-group.txt, https://seed-design.io/rootage/components/radio.json, https://seed-design.io/rootage/components/radiomark.json, https://seed-design.io/rootage/components/radio-group.json
  - Montage: https://montage.wanted.co.kr/docs/components/selection-and-input/radio/web, `/design`
  - Radix: `@radix-ui/react-radio-group` 1.5.1 빌드 파일

## 정한 것

- **그룹 `RadioGroup`과 항목 `RadioGroupItem` 두 부품이에요**: 이름은 SEED·shadcn과 같고 components.md 이름 규칙(루트 이름을 앞에)을 따라요. 단독 Radio는 만들지 않아요. 라디오 하나는 고른 뒤 풀 수 없어서 Checkbox나 Switch가 맞아요
- **RadioGroup이 Field를 품어요**: 제목이 그룹의 이름(`aria-labelledby`)이 되고, 안내·오류가 그룹의 설명이 돼요. Field `group`(#117)을 켜서 이어요. Figma Radio Group Field와 1:1이고, 쓰는 쪽이 `group`을 빠뜨려 이름이 조용히 빠지는 일이 없어요. TextField와 같은 방식이에요(`text-field.md`)
  - Field props는 `Pick<FieldProps, …>`로 받아요. `characterCount`는 뺐어요
  - `className`·`style`은 바깥 Field에, 나머지 props와 `ref`는 `role="radiogroup"` 요소에 가요
- **쓰는 쪽 `aria-labelledby`가 있으면 그 값이 이름을 정해요**: 없으면 제목 id예요. Field control이 제목 id로 덮어서 말없이 사라지던 것을 막았어요(FF P3, 2026-11-13). TextField도 쓰는 쪽 값을 우선해요
- **`aria-describedby`는 덮지 않고 Field 안내 뒤에 더해요**: 덮으면 안내 연결이 말없이 끊겨요. `_internal/joinIds`를 써요
- **`size`·`tone`은 그룹에만 있어요**: 한 그룹 안에서 크기·색이 섞이지 않아요(Figma Radio Group도 Size 하나). 값은 context가 아니라 CSS 변수로 항목에 내려서 두 부품 모두 `"use client"` 없는 서버 컴포넌트예요
- **`size`는 `medium`·`large`, 기본 `medium`이에요**: Figma Radio Group·Radio Group Field 기본이 Large였는데 Radio·Radiomark·Checkbox와 같게 Medium으로 맞췄어요
- **색 축은 `tone: "neutral" | "brand"`, 기본 `neutral`이에요**: Figma Tone·SEED, Checkbox·Switch와 같아요. 중요도가 아니라 강조 색만 고르는 축이라 Button의 `variant`와 이름을 나눠요(FF P1)
- **값은 Radix 이름 그대로 `value`·`defaultValue`·`onValueChange`예요**: `value`는 `string | null`이고, 아무것도 고르지 않은 제어 상태가 `null`이에요. Figma `Value=None`은 `defaultValue`를 넘기지 않은 것이에요
- **항목 `label`은 필수예요**: 글자가 항목의 이름이 돼요. Checkbox·Switch와 같은 이름이에요
- **항목 `labelWeight`는 `regular`·`semibold`예요**: Figma `Weight=Bold`는 실제 굵기가 semibold라 이름을 맞췄어요. 그룹의 `labelWeight`(제목 굵기)와 이름이 같지만 둘 다 "자기 라벨의 굵기"예요
- **행 전체가 `<label>`이고 그 안의 radio 버튼이 마크예요**: 라벨 글자와 행 여백을 눌러도 골라져요. 버튼이 label 안의 첫 라벨 가능 요소라 id 없이 이름이 이어져요. 포커스 링은 버튼에 그려서 마크만 감싸요
  - 항목의 `className`·`style`은 행에, 나머지 props와 `ref`는 버튼에 가요. Checkbox·Switch와 같아요
- **마크는 버튼 안의 `surface`·`dot`이에요**: 눌리면 `surface`만 `scale(1 − press.maxReduction)`(0.96)으로 줄고 점도 함께 줄어요. 링은 버튼에 있어서 제자리에 남아요(Motion Foundation). Radix `Indicator`는 쓰지 않아요
- **눌림은 Button 규칙이에요**: 누를 때 spring-rapid, 뗄 때 spring-quick이에요. Figma의 98%와 "press/max-reduction(2%)"는 변수 값(0.04)과 달라서 Figma를 고쳤어요
- **미선택 눌림 배경은 `bg/neutral-weak-pressed`예요**: Figma가 `-hover`였는데 토큰 이름과 상태가 맞게 고쳤어요. Checkbox와 같아요
- **비활성 선택은 채우지 않고 테두리·점만 `fg/disabled`이고 점이 조금 커요**: Figma 그대로예요(`radio/dot-size-disabled-*`)
- **항목에는 invalid 모양이 없어요**: Figma Radio에 오류 상태가 없고, 오류는 그룹의 선택 조건이라 Field 문구가 알려요. `invalid`는 그룹에 `aria-invalid`만 붙여요
- **줄 스타일은 Checkbox·Switch와 같은 정책이에요**: 44px 최소 높이, 여백 8px, 첫 줄 맞춤, 눌림·커서 규칙이 같아요. Switch(#122) 다음으로 머지되는 PR이 `_internal/selectionRow.css.ts`로 옮겨요. Checkbox PR이 먼저 만들 예정이라 그 뒤 Radio가 바꿔 껴요
- **비활성 상태는 배경 변수 셋(기본·hover·눌림)을 같은 값으로 채워요**: hover·눌림 선택자에서 비활성을 빼면 줄이 줄지만 Checkbox와 방식이 달라져요. 공통 줄 파일로 옮길 때 같이 봐요(FF C2, 2026-11-13 반영 안 함)

## 뺀 것

- **`orientation`·`loop`·`dir`**: Figma가 세로 배치만 그렸고, `orientation`이 없으면 네 방향키가 모두 동작해요. 가로 배치가 필요해지면 더해도 깨지지 않아요
- **Radiomark 공개**: SEED는 따로 내보내지만 지금 단독으로 쓸 화면이 없어요. Select Box가 마크 스타일을 `_internal/radiomark.css.ts`로 옮겨 쓰고, 마크 바탕은 자기 `data-state`·`data-disabled`만 봐서 옮기기 쉬워요
- **마크 변수의 `fallbackVar` 기본값**: 항목은 늘 그룹 recipe 안에서 그려져서 지금은 쓰이지 않아요. 그룹 밖에서 마크를 쓰는 Select Box PR이 정해요
- **항목 `required`·`checked`**: Radix가 그룹 값으로 정해서 항목 props에서 뺐어요

## 열린 질문

- **가로 배치**: 쓸 화면이 생기면 `orientation`을 더할지, 배치만 바꿀지 정해요
