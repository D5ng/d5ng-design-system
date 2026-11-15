import { clsx } from "clsx";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import type { ComponentProps, ReactNode } from "react";

import type { FieldPassthroughProps } from "../_internal/fieldPassthrough";
import { joinIds } from "../_internal/joinIds";
import { Field } from "../Field";
import { ChipSurface } from "./Chip";
import * as styles from "./Chip.css";

// 문서에 보일 props는 여기서 직접 선언해요. Radix와 HTML 속성은 문서 표에 안 잡혀요.
// orientation·loop·dir은 받지 않아요. 칩은 줄바꿈돼서 가로·세로가 섞이고, 없으면 네 방향키가 모두 동작해요.
export type ChipRadioGroupProps = Omit<
  ComponentProps<typeof RadioGroupPrimitive.Root>,
  | keyof FieldPassthroughProps
  | "asChild"
  | "children"
  | "orientation"
  | "loop"
  | "dir"
  | "value"
  | "defaultValue"
  | "onValueChange"
> &
  FieldPassthroughProps & {
    /** 고를 칩이에요. `ChipRadioGroupItem`을 넣어요. */
    children: ReactNode;
    /** 고른 칩의 `value`예요. 아무것도 고르지 않은 상태를 제어하려면 `null`을 넘겨요. */
    value?: string | null;
    /** 처음 고른 칩의 `value`예요. `value` 없이 쓸 때 넘기고, 없으면 아무것도 고르지 않은 채 시작해요. */
    defaultValue?: string;
    /** 다른 칩을 고르면 그 `value`로 불려요. 고른 칩을 다시 누르면 불리지 않아요. */
    onValueChange?: (value: string) => void;
    /**
     * 모든 칩의 모양이에요. 선택하면 `solid`·`outlineStrong`은 배경이 반전되고, `outlineWeak`는 테두리가 굵어져요.
     * @default outlineWeak
     */
    variant?: styles.ShapeVariants["variant"];
    /**
     * 모든 칩의 겉면 높이와 글자 크기예요. 누르는 영역은 크기와 상관없이 44×44px 이상이에요.
     * @default medium
     */
    size?: styles.ShapeVariants["size"];
  };

export type ChipRadioGroupItemProps = Omit<
  ComponentProps<typeof RadioGroupPrimitive.Item>,
  "asChild" | "children" | "value" | "disabled" | "checked" | "required"
> & {
  /** 이 칩을 고르면 그룹의 값이 돼요. form 안이면 그룹의 `name`으로 제출돼요. */
  value: string;
  /** 칩 글자예요. 칩 이름으로 읽혀요. 길면 칩 안에서 줄바꿈돼요. */
  children: ReactNode;
  /** 글자 앞에 두는 아이콘이에요. 스크린리더는 읽지 않아요. */
  prefixIcon?: ReactNode;
  /**
   * 이 칩만 막아요. 고른 상태는 그대로 보이고, 방향키 이동에서 빠져요.
   * @default false
   */
  disabled?: boolean;
};

/**
 * 여러 칩 중 하나를 골라요. 상태 필터처럼 하나만 고를 때 써요. `Field`를 품어서 제목이 그룹의 이름이 되고, 안내·오류가 그룹의 설명이 돼요.
 *
 * 고른 칩을 다시 눌러도 풀리지 않아요. 처음부터 골라 둘 값이 필요하면 "전체" 같은 칩을 두고 `defaultValue`로 골라요. 여러 개를 켜고 끄려면 `ChipToggleGroup`을 써요.
 *
 * `className`·`style`은 바깥 Field에, 나머지 props와 `ref`는 `role="radiogroup"` 요소에 가요. 모양과 크기는 그룹에서 정하고 칩이 물려받아요.
 */
export function ChipRadioGroup({
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
  variant,
  size,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  className,
  style,
  children,
  ...radioGroupProps
}: ChipRadioGroupProps) {
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
          aria-describedby={joinIds(
            control["aria-describedby"],
            ariaDescribedBy,
          )}
          // 모양 변수를 묶음에서 채워서 context 없이 칩이 물려받아요. 그래서 두 부품 모두 서버 컴포넌트예요.
          className={clsx(styles.row, styles.shape({ variant, size }))}
        >
          {children}
        </RadioGroupPrimitive.Root>
      )}
    </Field>
  );
}

// ---- ChipRadioGroupItem

/**
 * `ChipRadioGroup` 안의 칩 하나예요.
 *
 * `className`·`style`은 바깥 칸(`<span>`)에, 나머지 props와 `ref`는 radio 버튼에 가요.
 */
export function ChipRadioGroupItem({
  prefixIcon,
  className,
  style,
  children,
  ...itemProps
}: ChipRadioGroupItemProps) {
  return (
    <span className={clsx(styles.radioItem, className)} style={style}>
      <RadioGroupPrimitive.Item {...itemProps} className={styles.radioButton}>
        <ChipSurface prefixIcon={prefixIcon}>{children}</ChipSurface>
      </RadioGroupPrimitive.Item>
    </span>
  );
}
