import { Slot } from "radix-ui";
import type { ComponentProps, MouseEvent, ReactNode } from "react";

import * as styles from "./Button.css";

// 아이콘은 앞이나 뒤 한쪽에만 둘 수 있어요(Figma Layout 속성).
type IconProps =
  | { leadingIcon?: ReactNode; trailingIcon?: never }
  | { leadingIcon?: never; trailingIcon?: ReactNode };

export type ButtonProps = Omit<ComponentProps<"button">, "children"> &
  styles.ButtonVariants &
  IconProps & {
    children: ReactNode;
    // 누를 수 없지만 포커스는 남아서 스크린리더가 처리 중임을 읽어요.
    loading?: boolean;
    // 자식 요소(예: <a>)에 버튼 스타일과 동작을 입혀요.
    asChild?: boolean;
  };

export function Button({
  variant,
  size,
  width,
  leadingIcon,
  trailingIcon,
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

  function blockClick(event: MouseEvent<HTMLButtonElement>) {
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
      className={[styles.button({ variant, size, width }), className]
        .filter(Boolean)
        .join(" ")}
      // asChild면 자식 요소의 type을 건드리지 않아요. 폼 안에서 실수로 제출되지 않게 기본은 "button"이에요.
      type={asChild ? type : (type ?? "button")}
      disabled={nativeDisabled || undefined}
      aria-disabled={ariaDisabled || undefined}
      aria-busy={loading || undefined}
      data-loading={loading ? "" : undefined}
      onClickCapture={blockClick}
    >
      <Slot.Slottable child={children}>
        {(child) => (
          <>
            <span className={styles.content}>
              {leadingIcon ? (
                <span className={styles.icon} aria-hidden>
                  {leadingIcon}
                </span>
              ) : null}
              {child}
              {trailingIcon ? (
                <span className={styles.icon} aria-hidden>
                  {trailingIcon}
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
        r="9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="42 57"
      />
    </svg>
  );
}
