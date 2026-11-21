"use client";

import { X } from "lucide-react";
import {
  type ComponentProps,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  useId,
} from "react";

import { countGraphemes } from "../_internal/countGraphemes";
import type { FieldPassthroughProps } from "../_internal/fieldPassthrough";
import { joinIds } from "../_internal/joinIds";
import { useInputValue } from "../_internal/useInputValue";
import { Field } from "../Field";
import * as styles from "./TextField.css";

export type TextFieldProps = Omit<
  ComponentProps<"input">,
  keyof FieldPassthroughProps | "children" | "size" | "type" | "readOnly"
> &
  FieldPassthroughProps & {
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
    /**
     * 값이 있으면 끝에 지우기 버튼을 보여요. 누르면 값을 비우고 `onChange`로 알려요. disabled·readOnly면 숨겨요.
     * @default false
     */
    showClearButton?: boolean;
    /** 글자 수를 세어 `지금/최대`로 보여 줘요. 넘어도 입력을 막지 않고, `invalid`는 쓰는 쪽이 정해요. */
    maxCharacterCount?: number;
  };

/**
 * 한 줄 입력에 라벨·안내·오류·글자 수를 붙여요. `className`·`style`은 바깥 묶음에, 나머지 속성과 `ref`는 입력에 가요.
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
  showClearButton = false,
  maxCharacterCount,
  value,
  defaultValue,
  onChange,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  ...inputProps
}: TextFieldProps) {
  const affixId = useId();
  const prefixTextId = prefixText ? `${affixId}-prefix` : undefined;
  const suffixTextId = suffixText ? `${affixId}-suffix` : undefined;

  const { currentValue, handleChange } = useInputValue({
    value,
    defaultValue,
    onChange,
  });

  const characterCount =
    maxCharacterCount === undefined
      ? undefined
      : { current: countGraphemes(currentValue), max: maxCharacterCount };

  // 고칠 수 없는 입력에서 지우기가 되면 안 돼요.
  const clearable =
    showClearButton && currentValue !== "" && !disabled && !readOnly;

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
      characterCount={characterCount}
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
            value={value}
            defaultValue={defaultValue}
            onChange={handleChange}
            className={styles.input}
          />
          {suffixText ? (
            <span id={suffixTextId} className={styles.affix}>
              {suffixText}
            </span>
          ) : null}
          {clearable ? <TextFieldClearButton /> : null}
        </div>
      )}
    </Field>
  );
}

// ---- TextFieldClearButton

// 마우스로 누르면 상자의 focusInput이 pointerdown을 막아서 포커스는 입력에 그대로 있어요.
function TextFieldClearButton() {
  const clearInput = (event: MouseEvent<HTMLButtonElement>) => {
    // 쓰는 쪽 ref와 합치지 않으려고 ref 없이 상자 안 입력을 찾아요.
    const inputElement =
      event.currentTarget.parentElement?.querySelector("input");
    if (!inputElement) {
      return;
    }
    emptyInput(inputElement);
    // 키보드로 누르면 포커스가 버튼에 있는데, 값이 비면 버튼이 사라져서 입력으로 돌려요.
    inputElement.focus();
  };

  return (
    <button
      type="button"
      aria-label="입력 내용 지우기"
      className={styles.clearButton}
      onClick={clearInput}
    >
      <X className={styles.clearIcon} aria-hidden />
    </button>
  );
}

// React는 value에 바로 넣은 값을 자기가 넣은 값으로 여겨서 onChange를 부르지 않아요.
// prototype의 setter로 넣고 input 이벤트를 보내야 사용자가 지운 것처럼 onChange가 불려요.
// React가 값을 바꾸는 공개 API를 내면 지워요. https://github.com/react/react/issues/11488
function emptyInput(inputElement: HTMLInputElement) {
  Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value",
  )?.set?.call(inputElement, "");
  inputElement.dispatchEvent(new Event("input", { bubbles: true }));
}
