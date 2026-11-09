import { Slot } from "radix-ui";
import { Primitive } from "radix-ui/internal";
import type { ComponentProps, MouseEvent, ReactNode } from "react";

import * as styles from "./Button.css";

const SPINNER_RADIUS = 9;
const SPINNER_CIRCUMFERENCE = 2 * Math.PI * SPINNER_RADIUS;
// 원의 3/4만 그려서 도는 게 보이게 해요.
const SPINNER_ARC = SPINNER_CIRCUMFERENCE * 0.75;

// 문서에 보일 props는 여기서 직접 선언해요. recipe 기본값과 HTML 속성은 문서 표에 안 잡혀요.
export type ButtonProps = Omit<
  ComponentProps<"button">,
  "children" | "disabled"
> & {
  /** 버튼 문구예요. 버튼 이름으로 읽혀요. */
  children: ReactNode;
  /**
   * 강조 정도예요. `critical`은 위험한 동작에만 써요.
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
 * 한 영역에 `primary`나 `critical`은 하나만 두고, 나머지는 `secondary`·`ghost`로 해요.
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
  // disabled 속성은 <button>에만 있고 포커스까지 빼요. 그 밖에는 aria-disabled로 알려요.
  const nativeDisabled = !asChild && disabled && !loading;
  const ariaDisabled = (disabled || loading) && !nativeDisabled;

  // 쓰는 쪽 핸들러보다 먼저 막아야 해서 composeEventHandlers를 쓰지 않아요. 그건 쓰는 쪽을 먼저 불러요.
  const handleClickCapture = (event: MouseEvent<HTMLButtonElement>) => {
    if (ariaDisabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onClickCapture?.(event);
  };

  return (
    <Primitive.button
      // asChild면 자식 요소의 type을 건드리지 않아요. 폼 안에서 실수로 제출되지 않게 기본은 "button"이에요.
      type={asChild ? undefined : "button"}
      // 스타일은 이 속성을 봐요. 누를 수 없으면(disabled나 loading) data-disabled가 붙어요.
      data-disabled={disabled || loading ? "" : undefined}
      data-loading={loading ? "" : undefined}
      {...buttonProps}
      asChild={asChild}
      className={[styles.button({ variant, size, fullWidth }), className]
        .filter(Boolean)
        .join(" ")}
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
    </Primitive.button>
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
