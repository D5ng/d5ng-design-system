import type { ComponentProps, ReactNode } from "react";

import type { FieldPassthroughProps } from "../_internal/fieldPassthrough";
import { joinIds } from "../_internal/joinIds";
import { Field } from "../Field";
import * as styles from "./Chip.css";

// 문서에 보일 props는 여기서 직접 선언해요. HTML 속성은 문서 표에 안 잡혀요.
// fieldset의 name·form은 받지 않아요. ChipToggle은 form에 값을 내지 않아서 이름을 줘도 아무것도 제출되지 않아요.
// required·invalid·disabled는 Field와 뜻이 달라서 JSDoc을 다시 써요.
export type ChipToggleGroupProps = Omit<
  ComponentProps<"fieldset">,
  keyof FieldPassthroughProps | "children" | "name" | "form"
> &
  Omit<FieldPassthroughProps, "required" | "invalid" | "disabled"> & {
    /** 묶을 칩이에요. `ChipToggle`을 넣어요. 켠 상태는 칩마다 `pressed`로 갖고, 모양도 칩마다 정해요. */
    children: ReactNode;
    /**
     * 꼭 골라야 하는 묶음이에요. `requirementIndicator`와 함께일 때만 제목에 `*`를 붙이고, 혼자서는 아무것도 바꾸지 않아요. 켠 개수도 검사하지 않아요. 스크린리더는 `*`를 읽지 않아서 "하나 이상 골라 주세요" 같은 조건은 `description`에 적어요.
     * @default false
     */
    required?: boolean;
    /**
     * 켠 칩이 조건에 맞지 않아요. `errorMessage`가 `description` 대신 묶음의 설명이 돼요. 묶음과 칩에 `aria-invalid`는 붙이지 않아요.
     * @default false
     */
    invalid?: boolean;
    /**
     * 모든 칩을 막아요. 칩은 포커스를 받지 않고, 켠 상태는 그대로 보여요.
     * @default false
     */
    disabled?: boolean;
  };

/**
 * 여러 `ChipToggle`을 묶어요. 필터처럼 여러 개를 함께 켜고 끌 때 써요. `Field`를 품어서 제목이 묶음의 이름이 되고, 안내·오류가 묶음의 설명이 돼요.
 *
 * 칩마다 Tab으로 멈추고 방향키로는 옮기지 않아요. 하나만 고르려면 `ChipRadioGroup`을 써요.
 *
 * `className`·`style`은 바깥 Field에, 나머지 props와 `ref`는 묶음(`<fieldset>`)에 가요.
 */
export function ChipToggleGroup({
  label,
  hideLabel,
  labelWeight,
  requirementIndicator,
  headerAction,
  description,
  errorMessage,
  showMessageIcon,
  invalid,
  required,
  disabled,
  id,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  className,
  style,
  children,
  ...fieldsetProps
}: ChipToggleGroupProps) {
  return (
    <Field
      label={label}
      hideLabel={hideLabel}
      labelWeight={labelWeight}
      requirementIndicator={requirementIndicator}
      headerAction={headerAction}
      description={description}
      errorMessage={errorMessage}
      showMessageIcon={showMessageIcon}
      invalid={invalid}
      required={required}
      disabled={disabled}
      id={id}
      group
      className={className}
      style={style}
    >
      {(control) => (
        // control의 aria-invalid·required는 넘기지 않아요. role="group"은 둘을 지원하지 않아요.
        <fieldset
          {...fieldsetProps}
          id={control.id}
          // 쓰는 쪽이 넘기면 그 요소가 이름을 정해요.
          aria-labelledby={ariaLabelledBy ?? control["aria-labelledby"]}
          // 쓰는 쪽 값으로 덮으면 안내·오류 연결이 말없이 끊겨서 뒤에 더해요.
          aria-describedby={joinIds(
            control["aria-describedby"],
            ariaDescribedBy,
          )}
          disabled={control.disabled}
          className={styles.toggleGroup}
        >
          {children}
        </fieldset>
      )}
    </Field>
  );
}
