import { clsx } from "clsx";
import { Label, RadioGroup as RadioGroupPrimitive } from "radix-ui";
import type { ComponentProps, ReactNode } from "react";

import { Field, type FieldProps } from "../Field";
import * as styles from "./RadioGroup.css";

// 제목·안내·오류는 Field에서 받아 그대로 넘겨요. 타입과 JSDoc이 Field 한 곳에서 와요.
type RadioGroupFieldProps = Pick<
  FieldProps,
  | "label"
  | "hideLabel"
  | "labelWeight"
  | "requirementIndicator"
  | "headerAction"
  | "description"
  | "errorMessage"
  | "showMessageIcon"
  | "invalid"
  | "required"
  | "disabled"
  | "id"
>;

// 문서에 보일 props는 여기서 직접 선언해요. Radix와 HTML 속성은 문서 표에 안 잡혀요.
// orientation·loop·dir은 받지 않아요. Figma가 세로 배치만 그렸고, 없으면 네 방향키가 모두 동작해요.
export type RadioGroupProps = Omit<
  ComponentProps<typeof RadioGroupPrimitive.Root>,
  | keyof RadioGroupFieldProps
  | "asChild"
  | "children"
  | "orientation"
  | "loop"
  | "dir"
  | "value"
  | "defaultValue"
  | "onValueChange"
> &
  RadioGroupFieldProps & {
    /** 고를 항목이에요. `RadioGroupItem`을 넣어요. */
    children: ReactNode;
    /** 고른 항목의 `value`예요. 아무것도 고르지 않은 상태를 제어하려면 `null`을 넘겨요. */
    value?: string | null;
    /** 처음 고른 항목의 `value`예요. `value` 없이 쓸 때 넘기고, 없으면 아무것도 고르지 않은 채 시작해요. */
    defaultValue?: string;
    /** 다른 항목을 고르면 그 `value`로 불려요. 고른 항목을 다시 누르면 불리지 않아요. */
    onValueChange?: (value: string) => void;
    /**
     * 마크·라벨 크기예요. 모든 항목에 함께 적용돼요.
     * @default medium
     */
    size?: styles.GroupVariants["size"];
    /**
     * 골랐을 때의 색이에요. 브랜드로 강조할 때만 `brand`를 써요.
     * @default neutral
     */
    tone?: styles.GroupVariants["tone"];
  };

export type RadioGroupItemProps = Omit<
  ComponentProps<typeof RadioGroupPrimitive.Item>,
  "asChild" | "children" | "value" | "disabled" | "checked" | "required"
> & {
  /** 이 항목을 고르면 그룹의 값이 돼요. form 안이면 그룹의 `name`으로 제출돼요. */
  value: string;
  /** 항목의 이름이에요. 라벨 글자와 행 여백을 눌러도 골라져요. */
  label: ReactNode;
  /**
   * 라벨 굵기예요. 강조가 필요할 때만 `semibold`를 써요.
   * @default regular
   */
  labelWeight?: styles.LabelTextVariants["weight"];
  /**
   * 이 항목만 막아요. 고른 상태는 그대로 보이고, 방향키 이동에서 빠져요.
   * @default false
   */
  disabled?: boolean;
};

/**
 * 여러 항목 중 하나를 골라요. `Field`를 품어서 제목이 그룹의 이름이 되고, 안내·오류가 그룹의 설명이 돼요.
 *
 * `className`·`style`은 바깥 Field에, 나머지 props와 `ref`는 `role="radiogroup"` 요소에 가요. 크기와 색은 그룹에서 정하고 항목이 물려받아요.
 */
export function RadioGroup({
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
  size,
  tone,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  className,
  style,
  children,
  ...radioGroupProps
}: RadioGroupProps) {
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
        <RadioGroupPrimitive.Root
          {...radioGroupProps}
          {...control}
          // control이 제목 id로 덮어서 다시 붙여요. 쓰는 쪽이 넘기면 그 요소가 이름을 정해요.
          aria-labelledby={ariaLabelledBy ?? control["aria-labelledby"]}
          // 쓰는 쪽 값으로 덮으면 안내·오류 연결이 말없이 끊겨서 뒤에 더해요.
          aria-describedby={
            [control["aria-describedby"], ariaDescribedBy]
              .filter(Boolean)
              .join(" ") || undefined
          }
          className={styles.group({ size, tone })}
        >
          {children}
        </RadioGroupPrimitive.Root>
      )}
    </Field>
  );
}

// ---- RadioGroupItem

/**
 * `RadioGroup` 안의 항목 하나예요. 행 전체가 라벨이라 여백을 눌러도 골라져요.
 *
 * `className`·`style`은 행(`<label>`)에, 나머지 props와 `ref`는 radio 버튼에 가요.
 */
export function RadioGroupItem({
  label,
  labelWeight,
  className,
  style,
  ...itemProps
}: RadioGroupItemProps) {
  return (
    <Label.Root className={clsx(styles.item, className)} style={style}>
      <span className={styles.markSlot}>
        <RadioGroupPrimitive.Item {...itemProps} className={styles.control}>
          <span className={styles.surface}>
            <span className={styles.dot} />
          </span>
        </RadioGroupPrimitive.Item>
      </span>
      <span className={styles.labelText({ weight: labelWeight })}>{label}</span>
    </Label.Root>
  );
}
