"use client";

import {
  type ComponentProps,
  type PointerEvent,
  type ReactNode,
  useId,
} from "react";

import { joinIds } from "../_internal/joinIds";
import { Field, type FieldProps } from "../Field";
import * as styles from "./TextField.css";

// Field에 그대로 넘기는 props예요. 타입과 JSDoc을 Field에서 가져와요.
type TextFieldFieldProps = Pick<
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

export type TextFieldProps = Omit<
  ComponentProps<"input">,
  keyof TextFieldFieldProps | "children" | "size" | "type" | "readOnly"
> &
  TextFieldFieldProps & {
    /**
     * 값을 보여 주기만 하고 고칠 수 없어요. 포커스는 받아서 읽고 복사할 수 있어요.
     * @default false
     */
    readOnly?: boolean;
    /**
     * 높이와 글자 크기예요.
     * @default medium
     */
    size?: styles.BoxVariants["size"];
    /** 값 앞에 두는 아이콘이에요. 스크린리더는 읽지 않아요. */
    prefixIcon?: ReactNode;
    /** 값 앞에 붙는 글자(`https://`)예요. 값에 섞이지 않고 입력의 설명으로 읽혀요. */
    prefixText?: ReactNode;
    /** 값 뒤에 붙는 글자(단위 `원`)예요. 값에 섞이지 않고 입력의 설명으로 읽혀요. */
    suffixText?: ReactNode;
    /**
     * 입력 종류예요. 숫자는 `inputMode="numeric"`으로 받아요.
     * @default text
     */
    type?: "text" | "email" | "password" | "search" | "tel" | "url";
  };

/**
 * 한 줄 입력에 라벨·안내·오류를 붙여요. `className`·`style`은 바깥 묶음에, 나머지 속성과 `ref`는 입력에 가요.
 *
 * Figma의 `State`는 `invalid`·`disabled`·`readOnly`로 나눠 받고, `hover`·`focused`는 CSS가 맡아요.
 */
export function TextField({
  label,
  hideLabel,
  labelWeight,
  required,
  requirementIndicator,
  headerAction,
  description,
  errorMessage,
  showMessageIcon,
  invalid = false,
  disabled = false,
  id,
  className,
  style,
  readOnly = false,
  size,
  prefixIcon,
  prefixText,
  suffixText,
  type = "text",
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  ...inputProps
}: TextFieldProps) {
  const affixId = useId();
  const prefixTextId = prefixText ? `${affixId}-prefix` : undefined;
  const suffixTextId = suffixText ? `${affixId}-suffix` : undefined;

  // 여백·아이콘·앞뒤 글자를 눌러도 입력에 포커스가 가요. 앞뒤 글자는 길이가 달라서 CSS로 자리를 메울 수 없어요.
  const focusInput = (event: PointerEvent<HTMLDivElement>) => {
    const inputElement = event.currentTarget.querySelector("input");
    if (
      !inputElement ||
      inputElement.disabled ||
      event.target === inputElement
    ) {
      return;
    }
    // 막지 않으면 누른 자리로 포커스가 옮겨 가서 입력이 바로 포커스를 잃어요.
    event.preventDefault();
    inputElement.focus();
  };

  return (
    <Field
      label={label}
      hideLabel={hideLabel}
      labelWeight={labelWeight}
      required={required}
      requirementIndicator={requirementIndicator}
      headerAction={headerAction}
      description={description}
      errorMessage={errorMessage}
      showMessageIcon={showMessageIcon}
      invalid={invalid}
      disabled={disabled}
      id={id}
      className={className}
      style={style}
    >
      {(control) => (
        <div
          className={styles.box({ size })}
          data-invalid={invalid ? "" : undefined}
          data-disabled={disabled ? "" : undefined}
          data-readonly={readOnly ? "" : undefined}
          onPointerDown={focusInput}
        >
          {prefixIcon ? (
            <span className={styles.icon} aria-hidden>
              {prefixIcon}
            </span>
          ) : null}
          {prefixText ? (
            <span id={prefixTextId} className={styles.affix}>
              {prefixText}
            </span>
          ) : null}
          <input
            type={type}
            {...inputProps}
            {...control}
            // Field는 group이 아니면 aria-labelledby를 undefined로 넘겨서, 쓰는 쪽 값을 그 뒤에 다시 붙여요.
            aria-labelledby={ariaLabelledBy}
            // 쓰는 쪽 값을 덮으면 안내 연결이 말없이 끊겨서 합쳐요.
            aria-describedby={joinIds(
              prefixTextId,
              suffixTextId,
              control["aria-describedby"],
              ariaDescribedBy,
            )}
            readOnly={readOnly}
            className={styles.input}
          />
          {suffixText ? (
            <span id={suffixTextId} className={styles.affix}>
              {suffixText}
            </span>
          ) : null}
        </div>
      )}
    </Field>
  );
}
