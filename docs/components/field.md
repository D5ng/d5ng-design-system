# Field

입력 하나에 라벨·안내·오류·글자 수를 붙이고, 입력과 접근성 속성으로 이어요. 이 문서는 Field의 **결정과 이유**만 남겨요.

- **동작 계약**: `packages/react/src/components/Field/Field.test.tsx`의 테스트 이름이 정본이에요
- **사용 가이드**: Figma `Field` 페이지
- **비교한 자료**(2026-11-10)
  - SEED: https://seed-design.io/llms/components/field.txt, https://seed-design.io/llms/react/components/text-field-input.txt, https://seed-design.io/rootage/components/field.json, https://seed-design.io/rootage/components/field-label.json (React 문서에는 `field` 페이지가 없고 TextField가 `label`·`description`·`errorMessage`를 받아요)
  - Montage: https://montage.wanted.co.kr/docs/components/selection-and-input/form-control/web, `/design`
  - shadcn: https://ui.shadcn.com/docs/components/field
  - Radix: `@radix-ui/react-label` 2.1.17, `@radix-ui/react-form` 0.3.0 빌드 파일

## 정한 것

- **props를 받는 컴포넌트 하나예요**: shadcn `FieldLabel`·`FieldError`나 Montage `FormControlLabel` 같은 부품 조합은 두지 않아요. Field의 일은 같은 배치와 접근성 연결을 매번 똑같이 하는 거예요. 부품으로 나누면 안내와 오류를 함께 띄우거나 순서를 바꿀 수 있고, 막으려면 부품끼리 서로 알아야 해요(FF P3). 부품이 필요해지면 named export로 더해도 지금 쓰는 쪽은 깨지지 않아요
- **입력은 children 함수로 받아요**: `children(control)`에 `id`·`aria-labelledby`·`aria-describedby`·`aria-invalid`·`required`·`disabled`를 넘겨요. 어느 요소에 무엇이 가는지 호출부에서 보여요(FF R6)
  - Slot으로 자식에 합치면, TextField처럼 진짜 `<input>`이 틀 안에 있을 때 id가 틀에 붙어요. Radix Slot은 자식의 `id`·`aria-describedby`가 우리 값을 말없이 덮어요
  - context로 넘기면 native `<input>`이 읽지 못해서 hook을 하나 더 공개해야 하고, Field 밖에 둔 입력은 조용히 연결이 빠져요
- **서버 컴포넌트예요(`"use client"` 없음)**: 함수는 서버에서 클라이언트로 넘길 수 없어서, Field가 클라이언트 컴포넌트면 서버 컴포넌트에서 children 함수를 쓸 수 없어요. Field 안의 hook은 `useId`뿐이고, 클라이언트 동작은 이미 `"use client"`인 Radix `Label`·`VisuallyHidden`이 맡아요. 기준은 `.claude/rules/components.md`의 "서버 컴포넌트"를 따라요(#106)
- **묶음에는 boolean `group`으로 라벨을 이어요**: `<label for>`는 input·button 같은 요소만 가리켜서 `div role="radiogroup"`에는 이름이 붙지 않아요. `group`을 켜면 라벨을 id 붙은 `span`으로 그리고 `aria-labelledby`로 넘겨요. 끄면 지금과 같아서 쓰는 쪽이 깨지지 않아요([Radio 계획](https://claude.ai/artifact/VP8D7Gqe87r4rpGReM677S) D1, 2026-11-12)
  - 항상 `aria-labelledby`를 더하는 안은 버렸어요. 묶음에서 `<label for>`가 div를 가리키는 HTML 오류가 남아요
  - `fieldset`·`legend`는 버렸어요. radiogroup 밖에 group이 하나 더 생겨 이름이 두 번 읽혀요
  - 라벨을 눌러도 포커스가 가지 않아요. 묶음 자체엔 포커스 자리가 없어요
  - `role="group"`(CheckboxGroup)은 `aria-required`·`aria-invalid`를 지원하지 않아요. CheckboxGroup은 둘을 붙이지 않고 안내·오류 문구로 알려요([checkbox-group.md](checkbox-group.md))
- **`id`는 입력의 id예요**: 라벨과 입력을 잇는 값이라 입력으로 가고, root `div`의 `id`는 받지 않아요. 안내·글자 수의 id는 쓰는 쪽 id와 겹치지 않게 `useId`로 만든 값에서 이어 붙여요
- **필수 표시는 `required`와 boolean `requirementIndicator` 둘로 받아요**: 켜면 `required`일 때 `*`, 아닐 때 `선택`을 붙여요. 표시가 실제 필수 여부와 어긋날 수 없어요(FF C2). SEED의 "필수가 2/3 이상이면 선택만 표시" 규칙 때문에 "필수지만 표시 없음"이 필요해서 prop이 하나로 합쳐지지 않아요
  - `requirementIndicator="required" | "optional"`은 버렸어요. `required`를 끄고 표시를 잊으면 선택 칸에 `*`가 남아요
  - `*`는 라벨과 같은 글꼴의 키보드 글자예요. 조사한 MUI·Mantine·Ant Design·Montage·SEED가 모두 글자를 써요. lucide `Asterisk`는 선 아이콘이라 6px에서 선이 흐려져요. Figma `Required mark`도 글자로 바꿨어요(2026-11-11)
  - `*`와 `선택`은 둘 다 `aria-hidden`이에요. 필수 여부는 입력의 `required`가 알려요(Figma Accessibility). `선택`을 이름에 넣으면 "이름선택"처럼 붙어 읽혀요
- **`required`는 입력의 `required` 속성으로 가요**: `aria-required`만 넘기면 Radix Checkbox 같은 컨트롤의 숨은 input에 `required`가 붙지 않아요. 브라우저 기본 검증 말풍선은 `form`의 `noValidate`로 끄는 HTML 기본 동작 그대로예요
- **`labelWeight`는 `medium`·`semibold`예요**: Figma `Label weight=Bold` variant는 처음부터 `font/weight/semibold`(600)에 묶여 있었어요. 값 이름을 토큰과 같게 해서 `"bold"`가 600을 쓰는 혼동을 없앴어요(FF P1). 700으로 올리면 16px 라벨이 섹션 제목(20px 600)보다 무겁게 보여요. Figma 옵션 이름도 `Semibold`로 바꿨어요
- **`hideLabel`은 라벨만 화면에서 숨겨요**: Figma `Show label=false`는 Header 전체를 숨겨서 보조 액션도 사라져요. 코드는 포커스되는 버튼을 모양만 숨길 수 없어서 보조 액션을 남겨요. 숨긴 라벨은 header 밖에 둬서, 보조 액션이 없을 때 빈 header가 간격을 만들지 않아요
- **boolean prop은 모두 기본이 `false`예요**: 그래서 Figma `Show label`(기본 켜짐)은 `hideLabel`, `Show message icon`(기본 꺼짐)은 `showMessageIcon`이에요
- **오류는 `invalid`이고 `errorMessage`가 있을 때만 안내를 대신해요**: `invalid`여도 `errorMessage`가 없으면 안내를 안내 색 그대로 남겨요. SEED·Montage와 같아요
- **글자 수는 숫자만 보여 줘요**: 값을 세는 일(한글·이모지 글자 단위)은 값을 아는 TextField가 맡아요. Field는 Select·Checkbox도 쓸 수 있어서 값을 모르게 둬요(FF K1). `max`를 넘겨도 자동으로 `invalid`가 되지 않아요. 넘긴 props에 없는 상태 변화라서요(FF P3). Figma Guidelines도 "검증 규칙은 폼에서"예요
- **글자 수는 안내가 없어도 오른쪽 끝에 둬요**: 안내가 생기고 사라질 때 글자 수가 옮겨 다니지 않아요. Figma Footer 정렬도 오른쪽으로 바꿨어요(2026-11-10)
- **`Show footer`·`Show message`는 prop이 없어요**: `description`·`errorMessage`·`characterCount`를 넘겼을 때만 그려요. Figma 표시용이라고 Figma Properties에 적었어요
- **`invalid`와 `disabled`가 함께면 비활성 색이 이겨요**: Figma가 정하지 않은 조합이에요. CSS는 invalid 규칙에서 `:not([data-disabled])`로 빼서 규칙 순서에 기대지 않아요
- **`disabled`는 보조 액션을 막지 않아요**: 막으려면 Button이 Field를 알아야 하고(FF K1), 보조 액션이 링크일 수도 있어요. `headerAction` JSDoc에 "`disabled`는 액션에도 따로 넘겨요"라고 적었어요
- **라벨 글자는 토큰을 직접 써요**: `textStyles`에 16/22 묶음이 없어서(`bodyDefault`는 16/24, `labelDefault`는 14/19) 글자 토큰과 한글 줄바꿈 규칙을 직접 붙여요. `선택`(14/22)은 라벨 줄 윗변에 맞춰요. 기준선에 맞추면 글자 크기가 달라 줄이 24px로 커져요
- **Radix는 공개 `Label`과 `VisuallyHidden`만 써요**: `Label`은 더블클릭 때 글자 선택만 막는 `<label>`이에요. `Form`은 `Form.Field`가 `Form.Root` 없이는 에러를 내고 검증을 브라우저 validity로 직접 가져서, Figma Guidelines의 "검증 규칙과 제출은 폼에서 결정"과 어긋나요

## 뺀 것

- **`readOnly`, `size`**: Field 모양은 바뀌지 않고 입력이 정해요. TextField에서 다뤄요
- **옆으로 놓인 라벨, 성공 메시지(Positive)**: Figma에 없어요
- **오류 자동 알림(`aria-live`)**: 제출 때 첫 오류로 포커스를 옮기는 건 폼의 일이에요. 칸마다 알리면 여러 개가 한꺼번에 읽혀요
- **`선택` 문구 바꾸기**: Figma도 고정 문구예요. 다른 언어가 필요해지면 prop을 더해도 깨지지 않아요

## 열린 질문

- **Figma `Show label` 이름**: 코드는 `hideLabel`이지만 Figma는 그대로 `Show label`이에요. boolean 속성은 레이어를 보일 때만 `true`로 묶을 수 있어서 `Hide label`로 뒤집을 수 없어요. 다른 컴포넌트에서도 같은 일이 생기면 Figma 쪽 규칙으로 정해요
