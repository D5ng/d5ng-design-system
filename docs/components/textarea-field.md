# TextareaField

여러 줄 입력에 라벨·안내·오류·글자 수를 붙여요. 이 문서는 TextareaField의 **결정과 이유**만 남겨요. TextField와 같은 결정은 `text-field.md`를 가리키기만 해요.

- **동작 계약**: `packages/react/src/components/TextareaField/TextareaField.test.tsx`의 테스트 이름이 정본이에요
- **사용 가이드**: Figma `Textarea` 페이지
- **비교한 자료**(2026-11-11)
  - SEED: https://seed-design.io/llms/react/components/text-field-textarea.txt, https://seed-design.io/llms/components/text-input.txt
  - Montage: https://montage.wanted.co.kr/docs/components/selection-and-input/text-area/web, `/design`

## 정한 것

- **Field를 품은 컴포넌트 하나예요**: 이름은 Figma 조합 컴포넌트와 같은 `TextareaField`예요. textarea만 공개하지 않아서 `Textarea` 이름이 비어 있고, 나중에 컨트롤만 필요해지면 깨지지 않고 더해요. 이유는 TextField와 같아요(`text-field.md`)
- **상자 틀 안을 textarea가 꽉 채워요**: 여백을 textarea가 가져서 상자 어디를 눌러도 포커스가 가고, TextField 같은 `pointerdown` 핸들러가 없어요. 대신 스크롤하면 글이 여백 밑을 지나 테두리에서 잘려요. Figma Fixed도 틀에서 자르게 맞췄어요
- **상자 스타일은 TextField와 같이 써요**: `_internal/inputBox.css.ts`에 있어요. 상태 우선순위, 2px 그리기, invalid 링 색, placeholder·hover 토큰은 `text-field.md`를 따라요. 포커스는 `:has(<control 클래스>:focus-visible)`이라 input과 textarea 둘 다 봐요
- **자동 높이는 CSS `field-sizing: content`예요**: 서버에서 그린 첫 화면부터 높이가 맞고, 입력마다 높이를 재지 않아요. Baseline 2026(Chrome·Edge 123, Firefox 152, Safari 26.2)이고, 못 하는 브라우저는 최소 높이 100px에 고정되고 안에서 스크롤해요. 입력은 돼요
  - JS로 `scrollHeight`를 재는 안(SEED·React Spectrum)은 모든 브라우저에서 늘지만 layout effect, 브라우저별 우회 코드, 테스트가 늘어요. 나중에 바꿔도 API는 그대로예요
- **높이는 `heightMode`(`auto`·`fixed`, 기본 `auto`)와 `maxRows`로 정해요**: Figma Properties `Height mode`와 이름이 같고, 기본값이 Figma·SEED·Montage와 같아요. SEED의 `autoResize`는 기본 `true`인 boolean이라 끄는 모양이 되고, Field의 "boolean은 기본 `false`"와 어긋나요
  - `auto`에서 `rows`, `fixed`에서 `maxRows`는 쓰지 않아요. 타입으로 막으려면 props를 두 갈래로 나눠야 해서 TextField와 모양이 달라지고, 잘못 넘겨도 깨지는 게 없어요. JSDoc과 테스트로 드러내요(FF 리뷰 2026-11-13)
  - `maxRows`는 줄 수 × 줄 높이 토큰 + 위아래 여백으로 계산해요. 토큰이 바뀌어도 맞아요(FF C2). 쓰는 쪽 숫자라 CSS 변수(`--d5ng-textarea-field-max-rows`)로 넘기고 계산은 `.css.ts`가 해요. 변수 이름은 `@vanilla-extract/dynamic`을 들이지 않으려고 고정 문자열로 둬요
- **크기 조절 손잡이는 없어요(`resize: none`)**: Figma에 없고, 늘린 높이가 `maxRows`·`rows`보다 앞서서 규칙이 하나 늘어요. 필요해지면 prop을 더해도 깨지지 않아요
- **글자 수는 `maxCharacterCount`로 받아요**: 화면에 보이는 글자(grapheme)를 `Intl.Segmenter`로 세서(`_internal/countGraphemes`) Field에 `지금/최대`로 넘겨요. 넘어도 입력을 막지 않고 `invalid`는 쓰는 쪽이 정해요(`field.md`). TextField 글자 수도 같은 이름과 함수를 써요(2026-11-13)
  - native `maxLength`는 쓰지 않아요. UTF-16 단위로 세서 이모지 하나가 2 이상이 되고, 넘는 입력을 막아서 한글 조합 중에 끊겨요
  - `value`가 없으면 `onChange`마다 값을 따라 적어서 세요. `composeEventHandlers`는 쓰는 쪽이 `preventDefault()`하면 우리 것을 건너뛰는데, 입력은 그래도 바뀌어서 직접 합쳐요
- **`"use client"`예요**: 글자 수를 세는 상태와 `onChange` 핸들러 때문이에요. 자동 높이는 CSS라 상관없어요
- **여백은 Figma 16px에서 테두리 두께를 뺀 15px를 사방에 둬요**: Figma 테두리는 안쪽(INSIDE)이에요. TextField는 높이가 `min-height`라 가로만 빼지만, Textarea는 세로 여백이 높이에 들어가요. 8줄이 22 × 8 + 15 × 2 + 테두리 2 = 208px로 Figma 예시와 같아요. 최소 높이 100px은 테두리를 포함한 상자에 둬요
- **값 글자는 16/22 토큰을 직접 쓰고 어절 단위로 줄을 바꿔요**: `textStyles`에 16/22 묶음이 없어요. 다른 본문 글자처럼 `keep-all`·`break-word`예요
- **props가 가는 곳과 aria는 TextField와 같아요**: `className`·`style`은 바깥, 나머지와 `ref`는 textarea, `aria-describedby`는 더하고 `aria-labelledby`는 다시 붙여요(`text-field.md`). Field에 넘기는 props 타입은 `_internal/fieldPassthrough`를 같이 써요
  - 구조 분해와 Field에 넘기는 코드는 컴포넌트마다 둬요. 한 화면에서 읽히는 쪽을 골랐고(FF 리뷰 2026-11-13), RadioGroup·CheckboxGroup에서 다시 보고도 그대로 뒀어요([checkbox-group.md](checkbox-group.md))

## 뺀 것

모두 나중에 더해도 지금 쓰는 쪽이 깨지지 않아요.

- **`size`**: Figma Textarea에 크기가 없어요
- **`minRows`(Montage)**: 최소 높이는 Figma 100px 하나예요
- **지우기 버튼, 성공 상태**: Figma에 없어요
- **textarea만 공개(`Textarea`)**: Field 없이 쓸 화면이 아직 없어요
- **Field가 받는 props의 스토리**: Field 스토리가 보여 줘요(`text-field.md`와 같은 이유)

## 열린 질문

- **form reset**: `value` 없이 쓰다가 form을 reset하거나 `ref`로 값을 바꾸면 `onChange`가 불리지 않아서 글자 수가 이전 값에 남아요
- **`field-sizing`이 없는 브라우저**: Safari 26.2·Firefox 152 전에서 100px 고정 + 스크롤로 보이는지 실제 브라우저로는 못 봤어요. 테스트와 Storybook은 Chromium이에요
- **`maxRows`가 3 이하**: 줄 높이로 계산한 최대 높이가 최소 높이 100px보다 작아서, 스크롤 영역이 상자보다 몇 px 짧아요. 배경이 투명해서 보이지는 않아요
