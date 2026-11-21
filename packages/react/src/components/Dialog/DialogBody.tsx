"use client";

import { clsx } from "clsx";
import { type ComponentProps, useCallback, useState } from "react";

import { useComposedRefs } from "../_internal/composeRefs";
import * as styles from "./Dialog.css";

export type DialogBodyProps = ComponentProps<"div">;

/**
 * 내용이 들어가는 곳이에요. 넘치면 여기만 스크롤되고 Header와 Footer는 남아요.
 *
 * 위로 가려진 내용이 있으면 위에 구분선이, 아래로 남은 내용이 있으면 아래에 흐림이 보여요. 넘치는 동안은 Tab으로 들어와 방향키로 스크롤할 수 있어요.
 *
 * `className`과 나머지 props, `ref`는 스크롤 영역에 가요.
 */
function DialogBody({ className, ref, ...bodyProps }: DialogBodyProps) {
  const { overflowTop, overflowBottom, viewportRef } = useScrollOverflow();
  const composedRef = useComposedRefs(ref, viewportRef);
  const overflowing = overflowTop || overflowBottom;

  // 구분선·흐림은 스크롤되지 않는 바깥 요소가, 아래 여백은 스크롤 영역이 그려서 둘 다 붙여요.
  const overflowProps = {
    "data-overflow-top": overflowTop ? "" : undefined,
    "data-overflow-bottom": overflowBottom ? "" : undefined,
  };

  return (
    <div className={styles.body} {...overflowProps}>
      <div
        // Safari는 스크롤 영역에 포커스를 주지 않아서, 조작 요소가 없는 긴 글을 키보드로 내릴 수 없어요.
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- 넘치는 동안만 스크롤용으로 받아요(axe scrollable-region-focusable).
        tabIndex={overflowing ? 0 : undefined}
        {...bodyProps}
        ref={composedRef}
        className={clsx(styles.bodyViewport, className)}
        {...overflowProps}
      />
    </div>
  );
}

// 스크롤 영역의 위·아래에 가려진 내용이 있는지 따라가요.
function useScrollOverflow() {
  const [overflowTop, setOverflowTop] = useState(false);
  const [overflowBottom, setOverflowBottom] = useState(false);

  // React 19 ref는 정리 함수를 돌려줄 수 있어서, 붙을 때 감시를 걸고 떨어질 때 풀어요.
  const viewportRef = useCallback((viewport: HTMLDivElement | null) => {
    if (viewport === null) {
      return;
    }

    const measure = () => {
      const { scrollTop, scrollHeight, clientHeight } = viewport;
      setOverflowTop(scrollTop > 0);
      // 확대하면 scrollTop이 소수라서 끝까지 내려도 1px 안쪽이 남을 수 있어요.
      setOverflowBottom(scrollHeight - clientHeight - scrollTop > 1);
    };

    // 영역 크기는 그대로인데 내용만 늘어날 때도 있어서 자식 크기도 봐요.
    const resizeObserver = new ResizeObserver(measure);
    const observeChildren = () => {
      resizeObserver.disconnect();
      resizeObserver.observe(viewport);
      for (const child of viewport.children) {
        resizeObserver.observe(child);
      }
    };
    const mutationObserver = new MutationObserver(observeChildren);

    // ResizeObserver의 첫 알림은 다음 프레임이라, 열자마자 흐림·tabIndex가 빠진 화면이 한 번 보여요. 붙을 때 바로 재요.
    measure();
    observeChildren();
    mutationObserver.observe(viewport, { childList: true });
    viewport.addEventListener("scroll", measure, { passive: true });

    return () => {
      viewport.removeEventListener("scroll", measure);
      mutationObserver.disconnect();
      resizeObserver.disconnect();
    };
  }, []);

  return { overflowTop, overflowBottom, viewportRef };
}

export { DialogBody };
