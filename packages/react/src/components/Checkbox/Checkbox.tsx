import { clsx } from "clsx";
import { Check, Minus } from "lucide-react";
import { Checkbox as CheckboxPrimitive, Label } from "radix-ui";
import type { ComponentProps, ReactNode } from "react";

import * as styles from "./Checkbox.css";

// 문서에 보일 props는 여기서 직접 선언해요. Radix와 HTML 속성은 문서 표에 안 잡혀요.
export type CheckboxProps = Omit<
  ComponentProps<typeof CheckboxPrimitive.Root>,
  | "asChild"
  | "children"
  | "checked"
  | "defaultChecked"
  | "onCheckedChange"
  | "disabled"
  | "required"
> & {
  /** 체크박스의 이름이에요. 라벨 글자와 줄 여백을 눌러도 선택이 바뀌어요. */
  label: ReactNode;
  /** 선택 상태예요. 일부만 골랐으면 `"indeterminate"`를 넘겨요. */
  checked?: CheckboxPrimitive.CheckedState;
  /**
   * 처음 선택 상태예요. `checked` 없이 쓸 때 넘겨요.
   * @default false
   */
  defaultChecked?: CheckboxPrimitive.CheckedState;
  /** 선택이 바뀌면 불려요. 일부 선택에서 누르면 `true`가 와요. */
  onCheckedChange?: (checked: CheckboxPrimitive.CheckedState) => void;
  /**
   * 상자·아이콘·라벨 크기예요.
   * @default medium
   */
  size?: styles.RootVariants["size"];
  /**
   * 상자 모양이에요. 필수 선택처럼 고를 곳임을 분명히 보여야 하면 `square`, 필수가 아닌 3개 이하의 가벼운 선택이면 `ghost`를 써요.
   * @default square
   */
  variant?: styles.ControlColorsVariants["variant"];
  /**
   * 선택했을 때의 색이에요. 브랜드로 강조할 때만 `brand`를 써요.
   * @default neutral
   */
  tone?: styles.ControlColorsVariants["tone"];
  /**
   * 라벨 굵기예요. 강조가 필요할 때만 `semibold`를 써요.
   * @default regular
   */
  labelWeight?: styles.LabelTextVariants["weight"];
  /**
   * 누를 수 없어요. 선택 상태는 그대로 보여요.
   * @default false
   */
  disabled?: boolean;
  /**
   * 꼭 선택해야 해요. form 안이면 숨은 input에도 `required`가 붙어요.
   * @default false
   */
  required?: boolean;
};

/**
 * 항목 하나를 고르거나 풀어요. 여러 항목 중 일부만 골랐으면 대표 항목을 `checked="indeterminate"`로 보여요.
 *
 * `className`·`style`은 줄(`<label>`)에, 나머지 props와 `ref`는 상자 버튼에 가요. 그래서 `Field`의 `control`을 그대로 펼쳐도 돼요.
 */
export function Checkbox({
  label,
  size,
  variant,
  tone,
  labelWeight,
  className,
  style,
  ...checkboxProps
}: CheckboxProps) {
  return (
    <Label.Root
      className={clsx(styles.root({ size }), className)}
      style={style}
    >
      <span className={styles.markSlot}>
        <CheckboxPrimitive.Root
          {...checkboxProps}
          className={clsx(
            styles.control,
            styles.controlColors({ variant, tone }),
          )}
        >
          <span className={styles.surface}>
            {/* Figma처럼 아이콘 크기와 상관없이 선을 2px로 둬요. */}
            <Check className={styles.checkIcon} nonScalingStroke aria-hidden />
            <Minus className={styles.minusIcon} nonScalingStroke aria-hidden />
          </span>
        </CheckboxPrimitive.Root>
      </span>
      <span className={styles.labelText({ weight: labelWeight })}>{label}</span>
    </Label.Root>
  );
}
