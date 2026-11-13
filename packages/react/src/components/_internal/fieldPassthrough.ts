import type { FieldProps } from "../Field";

/**
 * Field를 품은 입력 컴포넌트(TextField·TextareaField)가 Field에 그대로 넘기는 props예요. 타입과 JSDoc을 Field에서 가져와요.
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
