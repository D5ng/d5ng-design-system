import { clsx } from "clsx";
import { ChevronRight } from "lucide-react";
import { Slot } from "radix-ui";
import type { ComponentProps, ReactNode } from "react";

import { type CalloutBaseProps, CalloutContent } from "./Callout";
import * as styles from "./Callout.css";

// Figma에 비활성 상태가 없어서 disabled를 받지 않아요. 넘기면 클릭만 막히고 모양은 그대로예요.
export type ActionableCalloutProps = Omit<
  ComponentProps<"button">,
  keyof CalloutBaseProps | "disabled"
> &
  Omit<CalloutBaseProps, "children"> & {
    /** 설명이에요. `asChild`면 설명을 담은 요소(예: `<a>`)예요. 안내 전체가 버튼이라 `Link`·버튼을 넣지 않아요. */
    children: ReactNode;
    /**
     * 끝의 화살표를 그리지 않아요. 스크린리더는 화살표를 읽지 않아요.
     * @default false
     */
    hideArrow?: boolean;
    /**
     * 자식 요소(예: `<a>`, 라우터의 링크)에 Callout 스타일과 동작을 입혀요.
     * @default false
     */
    asChild?: boolean;
  };

// ---- ActionableCallout

/**
 * 눌러서 자세한 내용으로 이동하거나 동작을 실행하는 안내예요.
 *
 * 다른 페이지로 가면 `asChild`로 `<a>`나 라우터의 링크를 감싸요. 이름은 제목과 설명이 이어진 문장으로 읽혀요.
 */
export function ActionableCallout({
  tone = "neutral",
  title,
  prefixIcon,
  hidePrefixIcon = false,
  hideArrow = false,
  asChild = false,
  className,
  children,
  ...buttonProps
}: ActionableCalloutProps) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      // asChild면 자식 요소의 type을 건드리지 않아요. 폼 안에서 실수로 제출되지 않게 기본은 "button"이에요.
      type={asChild ? undefined : "button"}
      {...buttonProps}
      className={clsx(styles.root({ tone }), styles.actionable, className)}
    >
      <Slot.Slottable child={children}>
        {(child) => (
          <>
            <CalloutContent
              tone={tone}
              title={title}
              prefixIcon={prefixIcon}
              hidePrefixIcon={hidePrefixIcon}
            >
              {child}
            </CalloutContent>
            {hideArrow ? null : (
              <span className={styles.arrow} aria-hidden>
                <ChevronRight className={styles.arrowIcon} />
              </span>
            )}
          </>
        )}
      </Slot.Slottable>
    </Comp>
  );
}
