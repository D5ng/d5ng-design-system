# CheckboxGroup

여러 `Checkbox`를 세로로 묶어요. 항목은 하나씩 고르고 풀어요. 이 문서는 CheckboxGroup의 **결정과 이유**만 남겨요.

- **동작 계약**: `packages/react/src/components/CheckboxGroup/CheckboxGroup.test.tsx`의 테스트 이름이 정본이에요
- **사용 가이드**: Figma `Checkbox` 페이지의 Checkbox Group·Checkbox Group Field
- **계획**: [Checkbox 계획](https://claude.ai/artifact/AAeMHhY71nXbe1dW7q7oR1) PR 2. D1·D2는 2026-11-14 확정
- **비교한 자료**: Checkbox와 같아요([checkbox.md](checkbox.md))

## 정한 것

- **항목은 `Checkbox` 그대로예요**: `CheckboxGroupItem`을 따로 두지 않아요. 체크박스는 항목마다 고르고 풀어서 그룹이 정할 값이 없어요. Figma Checkbox Group도 Checkbox 인스턴스를 넣어요
- **그룹은 값 상태가 없어요**: 고른 값은 항목마다 `checked`로 갖고, form에는 항목의 `name`·`value`로 제출돼요. 값 배열(`value: string[]`)을 받으면 항목 등록과 context가 필요해서 `"use client"`가 돼요. SEED·Montage도 그룹이 값을 갖지 않아요
- **CheckboxGroup이 Field를 품어요(D1)**: 제목이 그룹의 이름(`aria-labelledby`)이 되고, 안내·오류가 그룹의 설명이 돼요. 원래 계획 8번은 쓰는 쪽이 Field로 감싸는 것이었는데, RadioGroup이 Field를 품는 쪽으로 정해진 뒤 다시 정했어요
  - Figma Checkbox Group Field와 1:1이고, 쓰는 쪽이 `group`을 빠뜨려 이름이 조용히 빠지는 일이 없고, 두 그룹 API가 같아요
  - 제목·안내의 정본은 여전히 Field예요. props 타입과 JSDoc을 `_internal/fieldPassthrough`에서 가져와요
  - `className`·`style`은 바깥 Field에, 나머지 props와 `ref`는 `<fieldset>`에 가요
  - `aria-labelledby`는 쓰는 쪽 값이 이기고, `aria-describedby`는 Field 안내 뒤에 더해요. RadioGroup과 같아요
- **묶음은 `<fieldset>`이고 그룹 `disabled`는 `<fieldset disabled>`예요(D2)**: 브라우저가 안의 버튼과 숨은 input을 모두 막고, 포커스에서 빼고, form 제출에서도 빼요. JS가 필요 없어서 CheckboxGroup·Checkbox 모두 서버 컴포넌트예요
  - fieldset이 곧 `role="group"`이라 group이 두 겹이 되지 않아요. Radio에서 fieldset을 버린 이유(radiogroup 밖에 group이 하나 더 생김)는 여기엔 없어요. 제목은 Field가 그리고 `legend` 대신 `aria-labelledby`로 이어요
  - context로 전하면 Checkbox까지 `"use client"`가 되고, 그룹 `disabled`를 빼면 RadioGroup과 API가 달라져요
  - fieldset의 기본 테두리·여백은 지워요
- **비활성 선택자는 `:disabled`도 봐요**: Radix는 자기 `disabled`일 때만 `data-disabled`를 붙여서, fieldset이 막은 버튼은 `:disabled`로만 보여요. `:is([data-disabled], :disabled)`를 `_internal/selectionRow.css.ts`에 두고 Checkbox·Switch·Radio가 함께 써요
  - 줄(`:has()`)과 버튼이 같은 기준을 봐야 라벨만 흐려지는 반쪽 상태가 생기지 않아요(FF C2). 그래서 Checkbox만이 아니라 셋을 함께 바꿨어요
  - 쓰는 쪽이 form 전체를 `<fieldset disabled>`로 막을 때도 셋이 비활성으로 보여요. 전에는 막혀 있는데 활성처럼 보였어요
  - fieldset 밖에서는 바꾸기 전과 같아요. Checkbox 96·Switch 72·Radio 18조합의 평소·hover·눌림 계산값과 우선순위(`:is()`는 속성 선택자 하나와 같아요)를 비교했어요
- **`required`·`invalid`는 묶음과 항목에 붙이지 않아요**: `role="group"`은 `aria-required`·`aria-invalid`를 지원하지 않아요([field.md](field.md))
  - `required`는 `requirementIndicator`와 함께일 때만 제목에 `*`를 붙여요. 항목에 `required`를 넘기면 "모두 골라야 제출"로 뜻이 바뀌어요. `*`는 스크린리더가 읽지 않아서 "하나 이상 골라 주세요" 같은 조건은 `description`에 적어요. 고른 개수 검사는 쓰는 쪽이 해요
  - `invalid`면 `errorMessage`가 그룹의 설명이 돼서 그룹에 들어갈 때 읽혀요. Checkbox에 오류 모양이 없어서 상자 색은 그대로예요
- **fieldset의 `name`·`form`은 받지 않아요**: RadioGroup의 `name`은 항목 값을 제출하지만 fieldset의 `name`은 아무것도 제출하지 않아요. 한 개 고르기를 여러 개 고르기로 바꿀 때 그룹에 남긴 `name`이 말없이 값을 빼먹지 않게 타입에서 막아요(FF P1, 2026-11-14)
- **항목 간격은 `spacing[4]`예요**: Figma Checkbox Group 4px이고 RadioGroup과 같아요
- **Field props를 펼쳐 넘기는 코드는 컴포넌트마다 둬요**: 네 번째 사용처로 다시 봤어요(FF 리뷰 2026-11-14)
  - `FieldPassthroughProps`에 키를 더하면 TextField·TextareaField·RadioGroup·CheckboxGroup을 함께 고쳐야 하고, 빠뜨려도 타입 오류 없이 그 prop이 DOM으로 새요
  - 공용 helper는 "props는 매개변수에서 구조 분해"(`.claude/rules/components.md`)와 부딪히고 읽을 곳이 하나 늘어요. 대신 키를 더할 때 여는 `_internal/fieldPassthrough.ts`에 네 곳을 적어 뒀어요
- **Figma 속성과의 대응**: Checkbox Group의 `Show select all`·`Show item 2`·`Show item 3`은 Figma 표시용이에요. 코드는 항목을 children으로 넣어요

## 뺀 것

모두 나중에 더해도 지금 쓰는 쪽이 깨지지 않아요.

- **`size`·`variant`·`tone`**: Figma Checkbox Group에 없고, Checkbox가 항목마다 받아요. 그룹에서 내리려면 RadioGroup처럼 CSS 변수 계약을 Checkbox와 새로 맺어야 해요
- **전체 선택 연동**: [checkbox.md](checkbox.md)와 같은 이유로 빼요
- **가로 배치(`orientation`)**: Figma가 세로 배치만 그렸어요. RadioGroup과 같아요

## 열린 질문

- **바깥 `<fieldset disabled>`일 때 Field 제목·안내 색**: 세 선택 컨트롤은 비활성으로 보이지만, Field는 자기 `disabled` prop(`data-disabled`)만 봐서 제목 색이 그대로예요. Field를 쓰는 다른 입력도 함께 봐야 해서 Field 쪽에서 정해요
