"use client";

import {
  type ChangeEvent,
  type ComponentProps,
  type CSSProperties,
  useState,
} from "react";

import { countGraphemes } from "../_internal/countGraphemes";
import type { FieldPassthroughProps } from "../_internal/fieldPassthrough";
import { joinIds } from "../_internal/joinIds";
import { Field } from "../Field";
import * as styles from "./TextareaField.css";

export type TextareaFieldProps = Omit<
  ComponentProps<"textarea">,
  keyof FieldPassthroughProps | "children" | "readOnly"
> &
  FieldPassthroughProps & {
    /**
     * 값을 보여 주기만 하고 고칠 수 없어요. 포커스는 받아서 읽고 복사할 수 있어요.
     * @default false
     */
    readOnly?: boolean;
    /**
     * `auto`면 내용에 맞춰 늘어나고 `rows`는 쓰지 않아요. `fixed`면 `rows` 높이를 지키고 넘치면 안에서 스크롤해요.
     * @default auto
     */
    heightMode?: styles.TextareaVariants["heightMode"];
    /** `auto`에서 이 줄 수까지만 늘고, 그다음은 안에서 스크롤해요. `fixed`에서는 쓰지 않아요. */
    maxRows?: number;
    /** 글자 수를 세어 `지금/최대`로 보여 줘요. 넘어도 입력을 막지 않고, `invalid`는 쓰는 쪽이 정해요. */
    maxCharacterCount?: number;
  };

/**
 * 여러 줄 입력에 라벨·안내·오류·글자 수를 붙여요. `className`·`style`은 바깥 묶음에, 나머지 속성과 `ref`는 textarea에 가요.
 *
 * Figma의 `State`는 `invalid`·`disabled`·`readOnly`로 나눠 받고, `hover`·`focused`는 CSS가 맡아요.
 */
export function TextareaField({
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
  heightMode,
  maxRows,
  maxCharacterCount,
  value,
  defaultValue,
  onChange,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  ...textareaProps
}: TextareaFieldProps) {
  // value가 없으면 textarea가 값을 가져서, 글자 수를 세려고 입력마다 따라 적어요.
  const [typedValue, setTypedValue] = useState(defaultValue);

  const characterCount =
    maxCharacterCount === undefined
      ? undefined
      : {
          current: countGraphemes(String(value ?? typedValue ?? "")),
          max: maxCharacterCount,
        };

  // composeEventHandlers를 쓰면 쓰는 쪽이 preventDefault()할 때 건너뛰는데, 입력은 그래도 바뀌어서 글자 수가 어긋나요.
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setTypedValue(event.currentTarget.value);
    onChange?.(event);
  };

  // CSSProperties 타입에 CSS 변수 키가 없어서 단언해요.
  const maxRowsStyle =
    maxRows === undefined
      ? undefined
      : ({ [styles.maxRowsProperty]: maxRows } as CSSProperties);

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
          className={styles.box}
          data-invalid={invalid ? "" : undefined}
          data-disabled={disabled ? "" : undefined}
          data-readonly={readOnly ? "" : undefined}
        >
          <textarea
            {...textareaProps}
            {...control}
            // Field는 group이 아니면 aria-labelledby를 undefined로 넘겨서, 쓰는 쪽 값을 그 뒤에 다시 붙여요.
            aria-labelledby={ariaLabelledBy}
            // 쓰는 쪽 값을 덮으면 안내 연결이 말없이 끊겨서 합쳐요.
            aria-describedby={joinIds(
              control["aria-describedby"],
              ariaDescribedBy,
            )}
            readOnly={readOnly}
            value={value}
            defaultValue={defaultValue}
            onChange={handleChange}
            style={maxRowsStyle}
            className={styles.textarea({ heightMode })}
          />
        </div>
      )}
    </Field>
  );
}
