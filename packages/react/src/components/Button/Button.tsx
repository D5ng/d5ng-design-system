import { clsx } from "clsx";
import { Slot } from "radix-ui";
import { Primitive } from "radix-ui/internal";
import type { ComponentProps, ReactNode } from "react";

import * as buttonBase from "../_internal/buttonBase.css";
import { buttonStateProps } from "../_internal/buttonState";
import { Spinner } from "../_internal/Spinner";
import * as styles from "./Button.css";

// 문서에 보일 props는 여기서 직접 선언해요. recipe 기본값과 HTML 속성은 문서 표에 안 잡혀요.
export type ButtonProps = Omit<
  ComponentProps<"button">,
  "children" | "disabled"
> & {
  /** 버튼 문구예요. 버튼 이름으로 읽혀요. */
  children: ReactNode;
  /**
   * 강조 정도예요. `neutral`은 `primary`만큼 강하되 브랜드 색을 빼야 할 때, `critical`은 위험한 동작에만 써요.
   * @default primary
   */
  variant?: styles.ButtonVariants["variant"];
  /**
   * 높이와 글자 크기예요.
   * @default medium
   */
  size?: styles.ButtonVariants["size"];
  /**
   * 부모 너비를 꽉 채워요. 이때는 눌러도 작아지지 않아요.
   * @default false
   */
  fullWidth?: styles.ButtonVariants["fullWidth"];
  /** 누를 수 없어요. `asChild`나 `loading`과 함께면 포커스를 남기고 `aria-disabled`로 알려요. */
  disabled?: boolean;
  /** 문구 앞에 두는 아이콘이에요. 스크린리더는 읽지 않아요. */
  prefixIcon?: ReactNode;
  /** 문구 뒤에 두는 아이콘이에요. 스크린리더는 읽지 않아요. */
  suffixIcon?: ReactNode;
  /** 처리 중이에요. 클릭을 막고 포커스는 남기며 aria-busy로 알려요. */
  loading?: boolean;
  /** 자식 요소(예: `<a>`)에 버튼 스타일과 동작을 입혀요. */
  asChild?: boolean;
};

/**
 * 누르면 바로 실행되는 동작이에요. 화면만 옮길 때는 `asChild`로 `<a>`를 감싸요.
 *
 * 한 영역에 `primary`·`neutral`·`critical` 중 하나만 두고, 나머지는 `secondary`·`ghost`로 해요.
 *
 * Figma의 `state`는 prop 하나가 아니에요. `disabled`·`loading`은 prop으로 넘기고, `hover`·`pressed`·`focusVisible`은 CSS가 맡아요.
 */
export function Button({
  variant,
  size,
  fullWidth,
  prefixIcon,
  suffixIcon,
  loading = false,
  disabled = false,
  asChild = false,
  className,
  onClickCapture,
  children,
  ...buttonProps
}: ButtonProps) {
  const { overridableProps, enforcedProps } = buttonStateProps({
    disabled,
    loading,
    asChild,
    onClickCapture,
  });

  return (
    <Primitive.button
      {...overridableProps}
      {...buttonProps}
      asChild={asChild}
      className={clsx(styles.button({ variant, size, fullWidth }), className)}
      {...enforcedProps}
    >
      <Slot.Slottable child={children}>
        {(child) => (
          <>
            <span className={buttonBase.content}>
              {prefixIcon ? (
                <span className={buttonBase.icon} aria-hidden>
                  {prefixIcon}
                </span>
              ) : null}
              {child}
              {suffixIcon ? (
                <span className={buttonBase.icon} aria-hidden>
                  {suffixIcon}
                </span>
              ) : null}
            </span>
            {loading ? <Spinner /> : null}
          </>
        )}
      </Slot.Slottable>
    </Primitive.button>
  );
}
