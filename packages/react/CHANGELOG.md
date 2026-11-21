# @d5ng/react

## 0.1.1

### Patch Changes

- 38e4db4: `Badge`를 더했어요. 항목의 상태나 속성을 `variant`(weak·solid·outline)와 `tone`(neutral·brand·informative·positive·warning·critical)으로 짧게 표시해요.
- 332043d: `TextField`에 지우기 버튼(`showClearButton`)과 글자 수(`maxCharacterCount`)를 더했어요.
- 9c27085: `Callout`·`ActionableCallout`·`DismissibleCallout`을 더했어요. 화면 안에 머무는 짧은 안내를 읽기만 하거나, 눌러서 이동하거나, 닫을 수 있게 보여 줘요.
- 37f0342: `CheckboxGroup`을 더했어요. `Checkbox`·`Switch`·`RadioGroupItem`은 비활성 `<fieldset>` 안에서도 비활성 모양으로 보여요.
- 6096b69: `ChipRadioGroup`·`ChipRadioGroupItem`·`ChipToggleGroup`을 더했어요.
- 0769025: `ChipButton`과 `ChipToggle`을 더했어요.
- 189447e: `Dialog`와 부품 `DialogTrigger`·`DialogContent`·`DialogHeader`·`DialogTitle`·`DialogDescription`·`DialogBody`·`DialogFooter`·`DialogCancel`·`DialogSubmit`·`DialogCloseButton`을 더했어요. 지금 화면을 떠나지 않고 정보를 보거나 입력·설정을 바꾸는 모달이에요.
- 3847faa: `Divider`를 더했어요.
- d801c63: 다크 모드의 `fg/neutral-subtle`·`fg/placeholder` 색을 gray-500으로 바꿔 Figma와 맞췄어요. 테마마다 `color-scheme`을 선언해서 다크에서는 스크롤바와 폼 기본 UI도 어둡게 나와요.
- 70c2160: `Field`에 `group`을 더했어요. 켜면 라벨이 라디오 묶음 같은 그룹의 이름이 돼요(`aria-labelledby`).
- 6bbc565: `Checkbox`를 더했어요. 항목 하나를 고르거나 풀고, 일부만 골랐으면 `checked="indeterminate"`로 보여요.
- f12559e: `TextField`를 더했어요. `Field`의 라벨·안내·오류에 입력 상자를 붙인 컴포넌트예요.
- 8a9bd3f: `RadioGroup`·`RadioGroupItem`을 더했어요.
- 0954eb7: `Tabs`·`TabsList`·`TabsTrigger`·`TabsContent`를 더했어요.
- 66dd816: `TextareaField`를 더했어요. 여러 줄 입력이 내용에 맞춰 늘어나고(`heightMode`, `maxRows`), 글자 수(`maxCharacterCount`)를 보여 줘요.
- 1f2c501: `Switch`와 `SwitchRow`를 더했어요.

## 0.1.0

### Minor Changes

- cf74453: 첫 공개 배포예요. Button, IconButton, Link, AlertDialog, Field와 `styles.css`를 담았어요.
