# TextField

한 줄 입력에 라벨·안내·오류를 붙여요. 이 문서는 TextField의 **결정과 이유**만 남겨요.

- **동작 계약**: `packages/react/src/components/TextField/TextField.test.tsx`의 테스트 이름이 정본이에요
- **사용 가이드**: Figma `TextField` 페이지
- **비교한 자료**(2026-11-11)
  - SEED: https://seed-design.io/llms/components/text-input.txt, https://seed-design.io/llms/react/components/text-field-input.txt, https://seed-design.io/rootage/components/text-input.json
  - Montage: https://montage.wanted.co.kr/docs/components/selection-and-input/text-field/web, `/design`

## 정한 것

- **Field를 품은 컴포넌트 하나예요**: 입력 상자는 안쪽 부분이고 export하지 않아요. Figma 공개 컴포넌트와 이름이 같고, 글자 수처럼 값을 알아야 하는 일을 TextField가 맡을 수 있어요(`field.md`). Montage처럼 상자만 공개해 `<Field>`와 조합하게 하면 아래 "`className`은 바깥" 규칙은 필요 없지만, 글자 수·지우기를 쓰는 쪽이 매번 이어야 해서 값과 글자 수가 어긋날 수 있어요(FF C2)
- **`className`·`style`은 바깥 묶음에, 나머지 속성과 `ref`는 입력에 가요**: 너비·여백 같은 배치는 바깥에서 정하고, `name`·`value`·`onChange`·`autoComplete`는 입력이 받아요. 폼 라이브러리 `register`가 주는 `ref`·`onChange`가 그대로 붙어요. 컴포넌트 JSDoc에 적었어요
- **`id`는 Field와 같이 입력의 id예요**
- **Field props는 `Pick<FieldProps, …>`로 받아요**: 타입과 JSDoc이 Field 한 곳에서 와요. 구조 분해와 Field에 넘기는 곳까지 세 번 적지만, 빠진 키를 타입으로 잡는 장치는 두지 않았어요. Field prop을 일부러 늘릴 때만 생기는 비용이고 세 곳이 한 화면 안에 있어서, 막는 코드가 읽는 비용을 더 키워요(FF 리뷰 2026-11-13)
- **`"use client"`예요**: 상자의 빈 곳·아이콘·앞뒤 글자를 눌러도 입력에 포커스가 가게 `onPointerDown`을 달아요. 앞뒤 글자는 길이가 달라서 CSS로 자리를 메울 수 없어요. 글자 수·지우기 버튼 때문에 값도 상태로 따라가요. 서버 컴포넌트에서 값만 넘기는 쓰임은 그대로 돼요
  - 포커스는 ref 없이 `currentTarget` 안의 입력을 찾아서 줘요. 쓰는 쪽 `ref`와 합칠 일이 없어요
  - `pointerdown`을 막아야 누른 자리로 포커스가 옮겨 가지 않아요
- **`size`는 `small`·`medium`·`large`, 기본은 `medium`(48px)이에요**: HTML `size`(보이는 글자 수)를 덮어요. SEED·Montage도 `size`를 크기 이름으로 써요. 기본은 Button과 같고, Figma 기본값도 Medium으로 맞췄어요
- **`type`은 `text`·`email`·`password`·`search`·`tel`·`url`이에요**: `number`는 Figma에 증감 버튼이 없어서 빼요. 숫자는 `inputMode="numeric"`으로 받아요
- **앞 아이콘은 `prefixIcon`이고 스크린리더가 읽지 않아요**: 이름은 Button과 같아요. 장식이라 `aria-hidden`이고, 이름이 붙은 아이콘을 넣어도 입력의 이름과 설명에 섞이지 않아요. Figma 속성 이름도 `Prefix icon`으로 바꿨어요
- **앞뒤 글자는 `prefixText`·`suffixText`이고 입력의 설명으로 읽혀요**: 값에 섞이지 않고, "가격, 원"처럼 단위가 빠지지 않아요(Figma "중복 낭독 방지"). React DOM 타입에 `prefix`(RDFa 속성)가 이미 있어서 SEED의 `prefix` 대신 Figma `Prefix text`를 따라요(FF P1)
- **`aria-describedby`는 덮지 않고 더해요**: 덮으면 안내 연결이 말없이 끊겨요(FF P3). 순서는 앞 글자 → 뒤 글자 → Field 안내 → 쓰는 쪽 값이에요. id 잇기는 Field와 같은 `_internal/joinIds`를 써요
  - 쓰는 쪽 `aria-labelledby`는 그대로 붙여요. Field는 `group`이 아니면 `aria-labelledby`를 `undefined`로 넘겨서, 펼치는 순서만으로는 말없이 지워져요(#117 뒤, 2026-11-13). 타입에서 빼는 안은 aria-* 가운데 하나만 막는 예외가 생겨서 버렸어요
- **`readOnly`는 포커스를 받고 링만 그려요**: Tab으로 와서 읽고 복사할 수 있어야 해요(WCAG 2.4.7). 테두리는 그대로 둬서 "포커스는 있지만 편집은 안 됨"을 보여요. 배경은 `bg/neutral-weak`예요. Figma Specification에도 한 줄 더했어요
- **상태가 겹치면 disabled > invalid > focus > hover > 기본 순서로 이겨요**: 상자는 TextField가 붙인 `data-invalid`·`data-disabled`·`data-readonly`를 보고, 포커스만 `:has(input:focus-visible)`를 봐요. `:has()`는 안쪽 선택자의 우선순위를 가져와서, 규칙 순서 대신 `:not()`으로 겹치지 않게 해요
  - Disabled+Invalid는 Field처럼 비활성이 이겨서 1px이에요. Figma도 2px에서 맞췄어요
  - ReadOnly+Invalid는 `bg/neutral-weak`에 critical 2px예요
  - `:focus-within`은 쓰지 않아요. 지우기 버튼에 포커스가 가도 상자 링이 켜져요
- **상자 스타일은 TextareaField와 같이 써요**: `_internal/inputBox.css.ts`에 있어요. 상태·링 규칙을 바꾸면 두 컴포넌트가 함께 바뀌어요(2026-11-13)
- **2px 테두리는 1px border에 안쪽 그림자 1px을 더해 그려요**: border를 2px로 바꾸면 글자가 1px 밀려요. 1px을 border로 남겨야 forced-colors에서도 상자가 보여요. Figma에는 2px 변수가 없어서 Specification에 "1px + 1px"을 적었어요
- **invalid면 포커스 링도 오류 색이에요**: 테두리가 오류 색이라 링이 기본 색으로 남으면 둘이 달라져요. 공통 `focusRing`은 그대로 두고 TextField가 `outlineColor`만 덮어요(2026-11-12). 두께·띄움은 공통 값 그대로예요
- **가로 여백은 Figma 값에서 테두리 두께를 빼요**: Figma 테두리는 안쪽(INSIDE)이라 여백에 안 잡히지만 CSS border는 잡혀요. 높이는 `min-height`라 세로는 빼지 않아요
- **placeholder는 `fg/placeholder`예요**: Figma가 `fg/neutral-muted`였는데 맞췄어요. 흰 배경에서 약 5.0:1이고 값(`fg/neutral`)과 구분돼요. Firefox가 placeholder를 반투명하게 그려서 `opacity: 1`을 둬요
- **hover 테두리는 `stroke/neutral-contrast`예요**: Figma가 글자 토큰(`fg/neutral`)에 묶여 있어서 맞췄어요. 두 토큰은 값이 같아요
- **값 글자 medium·large는 16/22 토큰을 직접 써요**: `textStyles`에 16/22 묶음이 없어요(`field.md` 라벨과 같은 이유). 두 크기가 한 상수를 같이 써요
- **disabled면 아이콘·앞뒤 글자·값·placeholder가 모두 `fg/disabled`예요**: Figma에서 확인했어요. 아이콘은 `currentColor`라 상자 글자색을 따라가요
- **지우기 버튼은 `showClearButton`이에요**: Figma `Show clear button`과 이름이 같고, Field `showMessageIcon`처럼 `show*` 불리언이에요. 값이 있고 disabled·readOnly가 아닐 때만 그려요. 이름은 "입력 내용 지우기"이고 Tab으로 닿아요(Figma Guidelines·Accessibility)
- **지우기는 `onChange`로 알려요**: 입력 prototype의 `value` setter로 비우고 `input` 이벤트를 보내서, 비제어·제어·`register` 모두 고칠 것 없이 받아요. `onClear`를 따로 두면 제어로 쓸 때 값을 비우는 걸 잊기 쉽고 알림 길이 둘이 돼요. 대가로 React 내부 방식(value tracker)에 기대고, 지운 뒤 Ctrl+Z로 되돌릴 수 없어요(2026-11-13)
  - 제어로 쓰면 쓰는 쪽이 `onChange`에서 값을 비워야 비워져요. 타이핑과 같은 계약이에요
- **마우스로 지워도 포커스는 입력에 남아요**: 상자의 `onPointerDown`이 버튼도 막아서예요. 입력이 blur되지 않아 `onBlur` 검증이 빈 값으로 한 번 도는 일이 없어요. 키보드로 지우면 버튼이 사라지니 포커스를 입력으로 돌려요
- **지우기 버튼은 Figma `.TextInput/ClearButton`을 따른 안쪽 부분이에요**: IconButton xsmall은 32px라 누르는 자리 44px를 못 채우고 hover 배경이 생겨요. 누르는 자리는 `button/min-height/sm`(44px), 아이콘은 앞 아이콘과 같은 `text-field/icon-size`예요
  - 누르는 자리가 자리 너비(`text-field/clear-slot-width`)보다 넓은 만큼 `margin-inline-end`로 빼요. 그래서 테두리에서 아이콘까지가 앞 아이콘과 같아요(16/16/20px로 잼)
  - small 상자는 테두리 안쪽이 42px라, 버튼 위아래를 테두리만큼 겹쳐서 높이 44px를 지켜요
  - 링은 버튼에 그려요. 상자는 입력의 포커스만 봐서 버튼에 포커스가 가도 상자 링은 켜지지 않아요
- **`type="search"`의 브라우저 ×는 늘 숨겨요**: 지우기 버튼과 겹치고 Figma에 없어요. `::-webkit-search-cancel-button`은 `getComputedStyle`로 읽히지 않아서 테스트 대신 `ShowClearButton` 스토리 스냅샷이 봐요
- **글자 수는 `maxCharacterCount`예요**: TextareaField와 같은 이름·계약이에요(`textarea-field.md`)
- **값을 따라가는 코드는 `_internal/useInputValue`예요**: TextareaField와 같이 써요. 값은 입력이나 쓰는 쪽이 가지고 hook은 따라 읽기만 해서 `useControllableState`는 만들지 않았어요. 그래서 비제어 TextField도 글자를 칠 때마다 다시 그려요
  - 쓰는 컴포넌트가 `value`·`defaultValue`·`onChange={handleChange}`를 입력에 직접 이어요. 하나를 빠뜨리면 글자 수가 멈추지만, 묶어서 펼치게 하면 값이 어디로 가는지 JSX에서 안 보여서 그대로 뒀어요(FF 리뷰 2026-11-13)

## 뺀 것

모두 나중에 더해도 지금 쓰는 쪽이 깨지지 않아요.

- **Underline(`variant`)**: 한 화면에 입력이 하나뿐인 패턴용이에요. 쓸 화면이 생기면 더해요. Underline은 48px 하나라 `size`와 어떻게 함께 둘지, Figma 안의 어긋남(Hover가 Default와 같음, ReadOnly 값 글자 색)도 그때 정해요. Figma Underline의 지우기 버튼은 IconButton ghost xsmall(32px)이라 Outline과 다른데, 이것도 그때 맞춰요
- **지우기 버튼 이름 바꾸기**: "입력 내용 지우기"로 고정이에요. 다국어를 지원할 때 여는 방법을 정해요
- **Escape로 지우기**: Figma에 없어요. `type="search"`는 Chromium이 Escape로 지워 주고, 이때도 `onChange`가 불려요
- **상자만 공개(`TextInput`)**: Field 없이 쓸 화면이 아직 없어요
- **`suffixIcon`, 비밀번호 보기 버튼, 성공 상태, 반응형 `size`**: Figma에 없어요
- **움직임**: Figma에 없어요. SEED는 테두리를 100ms 페이드해요
- **Field가 받는 props의 스토리**: `requirementIndicator`·`headerAction` 같은 건 Field 스토리가 보여 줘요. 같은 그림을 두 번 승인하지 않게 `Description` 하나만 둬요

## 열린 질문

- **Chromium 밖의 브라우저**: 상자를 눌러 포커스를 옮기는 동작, 마우스로 지우는 흐름, `type="search"` 모양은 Chromium에서만 봤어요. Safari·Firefox에서 `pointerdown`을 막아도 포커스가 입력에 남고 버튼 `click`이 오는지 확인해야 해요
- **form reset**: `value` 없이 쓰다가 form을 reset하거나 `ref`로 값을 바꾸면 `onChange`가 불리지 않아서 지우기 버튼·글자 수가 이전 값에 남아요. TextareaField와 같은 문제예요(`textarea-field.md`)
- **자동 완성 배경**: Chrome `:autofill` 배경이 상자 안에서 따로 뜨는지 아직 못 봤어요. 헤드리스 브라우저에서는 자동 완성을 띄울 수 없어요
