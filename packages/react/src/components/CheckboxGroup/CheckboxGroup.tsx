import type { ComponentProps, ReactNode } from "react";

import type { FieldPassthroughProps } from "../_internal/fieldPassthrough";
import { joinIds } from "../_internal/joinIds";
import { Field } from "../Field";
import * as styles from "./CheckboxGroup.css";

// 문서에 보일 props는 여기서 직접 선언해요. HTML 속성은 문서 표에 안 잡혀요.
// fieldset의 name·form은 항목 값을 제출하지 않아서 받지 않아요. RadioGroup의 name과 헷갈려 값이 말없이 빠져요.
// required·invalid·disabled는 Field와 뜻이 달라서 JSDoc을 다시 써요.
export type CheckboxGroupProps = Omit<
  ComponentProps<"fieldset">,
  keyof FieldPassthroughProps | "children" | "name" | "form"
> &
  Omit<FieldPassthroughProps, "required" | "invalid" | "disabled"> & {
    /** 묶을 항목이에요. `Checkbox`를 넣어요. 고른 값은 항목마다 `checked`로 갖고, form에는 항목의 `name`·`value`로 제출돼요. */
    children: ReactNode;
    /**
     * 꼭 골라야 하는 그룹이에요. `requirementIndicator`와 함께일 때만 제목에 `*`를 붙이고, 혼자서는 아무것도 바꾸지 않아요. 항목에 `required`를 넘기지 않고 고른 개수도 검사하지 않아요. 스크린리더는 `*`를 읽지 않아서 "하나 이상 골라 주세요" 같은 조건은 `description`에 적어요.
     * @default false
     */
    required?: boolean;
    /**
     * 고른 항목이 조건에 맞지 않아요. `errorMessage`가 `description` 대신 그룹의 설명이 돼요. 그룹과 항목에 `aria-invalid`는 붙이지 않아요.
     * @default false
     */
    invalid?: boolean;
    /**
     * 모든 항목을 막아요. 항목은 포커스를 받지 않고 form 제출에서도 빠져요.
     * @default false
     */
    disabled?: boolean;
  };

/**
 * 여러 `Checkbox`를 세로로 묶어요. `Field`를 품어서 제목이 그룹의 이름이 되고, 안내·오류가 그룹의 설명이 돼요.
 *
 * `className`·`style`은 바깥 Field에, 나머지 props와 `ref`는 묶음(`<fieldset>`)에 가요. 같은 `name`에 `value`를 달리 주면 고른 항목이 모두 form에 담겨요.
 */
export function CheckboxGroup({
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
}: CheckboxGroupProps) {
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
        // control의 aria-invalid·required는 넘기지 않아요. role="group"은 둘을 지원하지 않고,
        // 항목에 required를 넘기면 모두 골라야 제출돼요.
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
          className={styles.group}
        >
          {children}
        </fieldset>
      )}
    </Field>
  );
}
