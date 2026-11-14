import type { FieldProps } from "../Field";

// 키를 더하면 아래 네 컴포넌트의 구조 분해와 Field에 넘기는 코드도 함께 고쳐요.
// 빠뜨려도 타입 오류 없이 그 prop이 입력·묶음 요소로 새요.
/**
 * Field를 품은 컴포넌트(TextField·TextareaField·RadioGroup·CheckboxGroup)가 Field에 그대로 넘기는 props예요. 타입과 JSDoc을 Field에서 가져와요.
 */
export type FieldPassthroughProps = Pick<
  FieldProps,
  | "label"
  | "hideLabel"
  | "labelWeight"
  | "required"
  | "requirementIndicator"
  | "headerAction"
  | "description"
  | "errorMessage"
  | "showMessageIcon"
  | "invalid"
  | "disabled"
  | "id"
  | "className"
  | "style"
>;
