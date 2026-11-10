import { clsx } from "clsx";
import { Slot } from "radix-ui";
import type { ComponentProps, ReactNode } from "react";

import * as styles from "./Link.css";

export type LinkProps = Omit<ComponentProps<"a">, "children"> & {
  /** 링크 문구예요. 눌렀을 때 어디로 가는지 알 수 있게 써요. */
  children: ReactNode;
  /** 문구 뒤에 두는 아이콘이에요. 스크린리더는 읽지 않아요. */
  suffixIcon?: ReactNode;
  /** 자식 요소(예: 라우터의 링크)에 링크 스타일을 입혀요. */
  asChild?: boolean;
};

/**
 * 다른 페이지나 문서 안의 위치로 이동하는 문장 속 링크예요. 크기·굵기는 주변 문장을 따라요.
 *
 * 앱 안 이동은 라우터의 링크를 `asChild`로 감싸요. `href`만 넘기면 페이지를 새로 불러와요.
 *
 * 따로 떨어진 이동(메뉴, 이전 글·다음 글)은 `Button variant="ghost" asChild`로 만들어요.
 *
 * 새 탭으로 열면(`target="_blank"`) 문구나 옆 글자로 새 탭에서 열린다고 알려요. 아이콘만으로는 알리지 않아요.
 */
export function Link({
  suffixIcon,
  asChild = false,
  className,
  children,
  ...anchorProps
}: LinkProps) {
  const Comp = asChild ? Slot.Root : "a";

  return (
    <Comp {...anchorProps} className={clsx(styles.link, className)}>
      <Slot.Slottable child={children}>
        {(child) => (
          <>
            {child}
            {suffixIcon ? (
              <span className={styles.icon} aria-hidden>
                {suffixIcon}
              </span>
            ) : null}
          </>
        )}
      </Slot.Slottable>
    </Comp>
  );
}
