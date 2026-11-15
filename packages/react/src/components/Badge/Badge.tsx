import { clsx } from "clsx";
import type { ComponentProps, ReactNode } from "react";

import * as styles from "./Badge.css";

// 문서에 보일 props는 여기서 직접 선언해요. recipe 기본값과 HTML 속성은 문서 표에 안 잡혀요.
export type BadgeProps = Omit<ComponentProps<"span">, "children"> & {
  /** 상태나 속성을 짧게 쓴 문구예요. 부모가 좁으면 한 줄로 말줄임되고, 스크린리더는 전체를 읽어요. */
  children: ReactNode;
  /**
   * 강조 정도예요. `solid`가 가장 강하고, `outline`은 배경 없이 테두리로 구분해요.
   * @default weak
   */
  variant?: styles.BadgeVariants["variant"];
  /**
   * 의미 색이에요. 완료는 `positive`, 확인이 필요하면 `warning`, 실패는 `critical`처럼 뜻에 맞춰 골라요.
   * @default neutral
   */
  tone?: styles.BadgeVariants["tone"];
  /**
   * 높이와 여백이에요. 글자 크기는 둘 다 같아요.
   * @default medium
   */
  size?: styles.BadgeVariants["size"];
  /** 문구 앞에 두는 아이콘이에요. 스크린리더는 읽지 않아요. */
  prefixIcon?: ReactNode;
};

/**
 * 항목의 상태나 속성을 짧게 표시해요. 누를 수 없어요. 누르는 동작은 `Button`을 써요.
 *
 * 뜻은 문구에 담아요. 색과 아이콘만으로 구분하지 않아요.
 *
 * Figma의 세트 이름(`Badge/Weak` 등)이 `variant`예요. `Layout`은 prop이 아니에요. `prefixIcon`을 넘기면 Prefix예요.
 */
export function Badge({
  variant,
  tone,
  size,
  prefixIcon,
  className,
  children,
  ...spanProps
}: BadgeProps) {
  return (
    <span
      {...spanProps}
      className={clsx(styles.badge({ variant, tone, size }), className)}
    >
      {prefixIcon ? (
        <span className={styles.prefix} aria-hidden>
          {prefixIcon}
        </span>
      ) : null}
      <span className={styles.label}>{children}</span>
    </span>
  );
}
