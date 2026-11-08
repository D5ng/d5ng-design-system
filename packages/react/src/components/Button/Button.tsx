import { Slot } from "radix-ui";
import type { ComponentProps, MouseEvent, ReactNode } from "react";

import * as styles from "./Button.css";

// Figma의 state 속성은 prop 하나가 아니에요.
// disabled·loading은 prop으로 받고, hover·pressed·focusVisible은 CSS가 맡아요.
export type ButtonProps = Omit<ComponentProps<"button">, "children"> &
  styles.ButtonVariants & {
    children: ReactNode;
    /** 문구 앞에 두는 아이콘이에요. 스크린리더는 읽지 않아요. */
    prefixIcon?: ReactNode;
    /** 문구 뒤에 두는 아이콘이에요. 스크린리더는 읽지 않아요. */
    suffixIcon?: ReactNode;
    /** 처리 중이에요. 클릭을 막고 포커스는 남기며 aria-busy로 알려요. */
    loading?: boolean;
    /** 자식 요소(예: <a>)에 버튼 스타일과 동작을 입혀요. */
    asChild?: boolean;
  };

const SPINNER_RADIUS = 9;
const SPINNER_CIRCUMFERENCE = 2 * Math.PI * SPINNER_RADIUS;
// 원의 3/4만 그려서 도는 게 보이게 해요.
const SPINNER_ARC = SPINNER_CIRCUMFERENCE * 0.75;

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
  type,
  onClickCapture,
  children,
  ...props
}: ButtonProps) {
  // disabled 속성은 <button>에만 있고 포커스까지 빼요. 그 밖에는 aria-disabled로 알려요.
  const nativeDisabled = !asChild && disabled && !loading;
  const ariaDisabled = (disabled || loading) && !nativeDisabled;

  // 막아야 할 때만 멈추고, 아니면 쓰는 쪽의 onClickCapture를 이어서 불러요.
  function handleClickCapture(event: MouseEvent<HTMLButtonElement>) {
    if (ariaDisabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onClickCapture?.(event);
  }

  const Root = asChild ? Slot.Root : "button";

  return (
    <Root
      {...props}
      className={[styles.button({ variant, size, fullWidth }), className]
        .filter(Boolean)
        .join(" ")}
      // asChild면 자식 요소의 type을 건드리지 않아요. 폼 안에서 실수로 제출되지 않게 기본은 "button"이에요.
      type={asChild ? type : (type ?? "button")}
      disabled={nativeDisabled || undefined}
      aria-disabled={ariaDisabled || undefined}
      aria-busy={loading || undefined}
      onClickCapture={handleClickCapture}
    >
      <Slot.Slottable child={children}>
        {(child) => (
          <>
            <span className={styles.content}>
              {prefixIcon ? (
                <span className={styles.icon} aria-hidden>
                  {prefixIcon}
                </span>
              ) : null}
              {child}
              {suffixIcon ? (
                <span className={styles.icon} aria-hidden>
                  {suffixIcon}
                </span>
              ) : null}
            </span>
            {loading ? <Spinner /> : null}
          </>
        )}
      </Slot.Slottable>
    </Root>
  );
}

function Spinner() {
  return (
    <svg className={styles.spinner} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle
        cx="12"
        cy="12"
        r={SPINNER_RADIUS}
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={[SPINNER_ARC, SPINNER_CIRCUMFERENCE].join(" ")}
      />
    </svg>
  );
}
