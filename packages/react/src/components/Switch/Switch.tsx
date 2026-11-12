"use client";

import { clsx } from "clsx";
import { Label, Switch as SwitchPrimitive } from "radix-ui";
import {
  type ComponentProps,
  type MouseEvent,
  type ReactNode,
  useId,
} from "react";

import * as styles from "./Switch.css";

// 문서에 보일 props는 여기서 직접 선언해요. Radix와 HTML 속성은 문서 표에 안 잡혀요.
export type SwitchProps = Omit<
  ComponentProps<typeof SwitchPrimitive.Root>,
  | "asChild"
  | "children"
  | "checked"
  | "defaultChecked"
  | "onCheckedChange"
  | "disabled"
  | "required"
> & {
  /** 스위치의 이름이에요. 라벨 글자와 줄 여백을 눌러도 켜짐이 바뀌어요. */
  label: ReactNode;
  /**
   * 트랙·라벨 크기예요.
   * @default 24
   */
  size?: styles.RootVariants["size"];
  /**
   * 켜졌을 때의 색이에요. 브랜드로 강조할 때만 `brand`를 써요.
   * @default neutral
   */
  tone?: styles.RootVariants["tone"];
  /** 켜짐 상태예요. 넘기면 `onCheckedChange`로 직접 바꿔야 해요. */
  checked?: boolean;
  /**
   * 처음 켜짐 상태예요. `checked` 없이 쓸 때 넘겨요.
   * @default false
   */
  defaultChecked?: boolean;
  /** 켜짐이 바뀌면 불려요. */
  onCheckedChange?: (checked: boolean) => void;
  /**
   * 누를 수 없어요. 켜짐 상태는 그대로 보여요.
   * @default false
   */
  disabled?: boolean;
  /**
   * 처리 중이에요. 클릭을 막고 포커스는 남기며 `aria-busy`로 알려요. 모양은 그대로예요.
   * @default false
   */
  loading?: boolean;
  /**
   * 꼭 켜야 해요. form 안이면 숨은 input에도 `required`가 붙어요.
   * @default false
   */
  required?: boolean;
};

export type SwitchRowProps = SwitchProps & {
  /** 라벨 아래 안내예요. 스위치의 설명으로 읽혀요. */
  description?: ReactNode;
};

type SwitchMarkProps = Omit<SwitchProps, "label" | "size" | "tone">;

// ---- Switch

/**
 * 누르면 바로 반영되는 켜기·끄기예요. 제출해야 반영되는 선택이면 체크박스를 써요.
 *
 * `className`·`style`은 줄(`<label>`)에, 나머지 props와 `ref`는 스위치 버튼에 가요.
 *
 * Figma의 `Selection`은 `checked`, `State`는 `disabled`·`loading` prop이에요. hover·pressed는 CSS가 맡아요.
 */
export function Switch({
  label,
  size,
  tone,
  className,
  style,
  ...switchProps
}: SwitchProps) {
  return (
    <Label.Root
      className={clsx(styles.root({ size, tone }), className)}
      style={style}
    >
      <SwitchMark {...switchProps} />
      <span className={clsx(styles.text, styles.label)}>{label}</span>
    </Label.Root>
  );
}

// ---- SwitchRow

/**
 * 설정 목록의 한 줄이에요. 라벨·설명이 너비를 채우고 스위치가 오른쪽 끝에 와요.
 *
 * 줄 어디를 눌러도 바뀌어요. 이름은 `label`만, 설명은 `description`으로 읽혀요.
 */
export function SwitchRow({
  label,
  description,
  size,
  tone,
  className,
  style,
  "aria-describedby": describedByProp,
  ...switchProps
}: SwitchRowProps) {
  const id = useId();
  const labelId = `${id}-label`;
  const descriptionId = description ? `${id}-description` : undefined;

  return (
    <Label.Root
      className={clsx(styles.row({ size, tone }), className)}
      style={style}
    >
      <span className={clsx(styles.text, styles.stack)}>
        <span id={labelId} className={styles.label}>
          {label}
        </span>
        {description ? (
          <span id={descriptionId} className={styles.description}>
            {description}
          </span>
        ) : null}
      </span>
      {/* 줄 전체가 <label>이라 그대로 두면 설명까지 이름에 섞여서 라벨만 이름으로 이어요. */}
      <SwitchMark
        aria-labelledby={labelId}
        {...switchProps}
        aria-describedby={
          [descriptionId, describedByProp].filter(Boolean).join(" ") ||
          undefined
        }
      />
    </Label.Root>
  );
}

// ---- SwitchMark

function SwitchMark({
  disabled = false,
  loading = false,
  onClickCapture,
  ...switchProps
}: SwitchMarkProps) {
  // loading이면 disabled여도 포커스를 남겨요(Button과 같은 계약). 모양은 disabled를 따라요.
  const nativeDisabled = disabled && !loading;

  // 쓰는 쪽 핸들러보다 먼저 막아야 해서 composeEventHandlers를 쓰지 않아요. 그건 쓰는 쪽을 먼저 불러요.
  const handleClickCapture = (event: MouseEvent<HTMLButtonElement>) => {
    if (loading) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onClickCapture?.(event);
  };

  return (
    <span className={styles.markSlot}>
      <SwitchPrimitive.Root
        {...switchProps}
        className={styles.control}
        disabled={nativeDisabled}
        // Radix는 disabled일 때만 붙여서 disabled와 loading을 같이 줄 때를 위해 직접 붙여요.
        data-disabled={disabled ? "" : undefined}
        data-loading={loading ? "" : undefined}
        aria-disabled={loading || undefined}
        aria-busy={loading || undefined}
        onClickCapture={handleClickCapture}
      >
        <span className={styles.track}>
          <SwitchPrimitive.Thumb className={styles.thumb} />
        </span>
      </SwitchPrimitive.Root>
    </span>
  );
}
