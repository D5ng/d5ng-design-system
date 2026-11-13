"use client";

import { clsx } from "clsx";
import { Slot } from "radix-ui";
import type { ComponentProps, ReactNode } from "react";

import * as buttonBase from "../_internal/buttonBase.css";
import { buttonStateProps } from "../_internal/buttonState";
import { Spinner } from "../_internal/Spinner";
import * as styles from "./IconButton.css";

// 문서에 보일 props는 여기서 직접 선언해요. recipe 기본값과 HTML 속성은 문서 표에 안 잡혀요.
export type IconButtonProps = Omit<
  ComponentProps<"button">,
  "children" | "disabled" | "aria-label"
> & {
  /** 아이콘이에요. `asChild`면 아이콘을 담은 요소(예: `<a>`)예요. 스크린리더는 읽지 않아요. */
  children: ReactNode;
  /** 버튼 이름이에요. 아이콘 모양이 아니라 하는 일을 써요(예: `창 닫기`). */
  "aria-label": string;
  /**
   * 강조 정도예요. `neutral`은 `primary`만큼 강하되 브랜드 색을 빼야 할 때, `critical`은 위험한 동작에만 써요.
   * @default primary
   */
  variant?: styles.IconButtonVariants["variant"];
  /**
   * 정사각형 크기와 아이콘 크기예요.
   * @default medium
   */
  size?: styles.IconButtonVariants["size"];
  /** 누를 수 없어요. `asChild`나 `loading`과 함께면 포커스를 남기고 `aria-disabled`로 알려요. */
  disabled?: boolean;
  /** 처리 중이에요. 클릭을 막고 포커스는 남기며 aria-busy로 알려요. */
  loading?: boolean;
  /** 자식 요소(예: `<a>`)에 버튼 스타일과 동작을 입혀요. */
  asChild?: boolean;
};

/**
 * 아이콘만으로 실행하는 동작이에요. 검색·닫기처럼 아이콘 뜻이 분명할 때만 쓰고, 핵심 동작은 `Button`으로 해요.
 *
 * 이름은 `aria-label`로만 읽혀요. 툴팁은 이름을 대신하지 않아요.
 */
export function IconButton({
  variant,
  size,
  loading = false,
  disabled = false,
  asChild = false,
  className,
  onClickCapture,
  children,
  ...buttonProps
}: IconButtonProps) {
  const { overridableProps, enforcedProps } = buttonStateProps({
    disabled,
    loading,
    asChild,
    onClickCapture,
  });
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      {...overridableProps}
      {...buttonProps}
      className={clsx(styles.iconButton({ variant, size }), className)}
      {...enforcedProps}
    >
      <Slot.Slottable child={children}>
        {(child) => (
          <>
            <span
              className={clsx(buttonBase.content, buttonBase.icon)}
              aria-hidden
            >
              {child}
            </span>
            {loading ? <Spinner /> : null}
          </>
        )}
      </Slot.Slottable>
    </Comp>
  );
}
