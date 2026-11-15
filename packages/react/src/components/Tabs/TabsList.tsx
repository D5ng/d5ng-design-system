"use client";

import { clsx } from "clsx";
import { Tabs as TabsPrimitive } from "radix-ui";
import {
  type ComponentProps,
  type RefObject,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import * as styles from "./Tabs.css";

// Radix 선택 상태를 따로 갖지 않으려고 탭 버튼의 속성을 읽어요.
// Tabs.css.ts의 activeTabSelector와 같은 범위(목록 안 어디든)예요. 한쪽을 바꾸면 같이 바꿔요.
const ACTIVE_TAB_SELECTOR = '[role="tab"][data-state="active"]';
const TAB_SELECTOR = '[role="tab"]';

// loop는 받지 않아요. Radix 기본값(끝에서 처음으로 돎)이 Figma 키보드 표와 같아요.
type TabsListRootProps = Omit<
  ComponentProps<typeof TabsPrimitive.List>,
  "asChild" | "loop" | "aria-label" | "aria-labelledby"
>;

// Radix는 목록에 이름을 붙여 주지 않아서 둘 중 하나를 받아요.
type TabsListLabelProps =
  | {
      /** 목록의 이름이에요. 보이는 제목이 없을 때 써요(예: `주문 정보`). */
      "aria-label": string;
      "aria-labelledby"?: never;
    }
  | {
      /** 목록의 이름이 될 보이는 제목의 `id`예요. */
      "aria-labelledby": string;
      "aria-label"?: never;
    };

export type TabsListProps = TabsListRootProps &
  TabsListLabelProps & {
    /**
     * 탭 높이와 라벨 크기예요. 터치에서는 `small`도 44px까지 높아져요.
     * @default medium
     */
    size?: styles.ListVariants["size"];
    /**
     * `fill`은 탭이 목록 너비를 똑같이 나누고, `hug`는 라벨 너비만큼 차지하고 넘치면 가로로 스크롤돼요. 목록에는 좌우 여백이 없어서 필요하면 `className`으로 줘요.
     * @default fill
     */
    layout?: styles.ListVariants["layout"];
  };

type IndicatorRect = { left: number; width: number };

// ---- TabsList

/**
 * `TabsTrigger`를 담는 목록이에요. 선택한 탭 아래로 선택선이 미끄러지고, 선택이 바뀌면 그 탭이 보이게 가로로 스크롤해요.
 *
 * 이름은 `aria-label`이나 `aria-labelledby` 중 하나로 꼭 줘요. `className`과 `ref`는 `role="tablist"` 요소에 가요.
 */
export function TabsList({
  size,
  layout,
  className,
  children,
  ...listProps
}: TabsListProps) {
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const indicatorRect = useIndicatorRect(indicatorRef);
  useScrollToActiveTab(indicatorRef);

  return (
    <TabsPrimitive.List
      {...listProps}
      className={clsx(styles.list({ size, layout }), className)}
    >
      {children}
      {/* 재기 전(하이드레이션 전)에는 숨겨서, 선택한 탭이 CSS로 자기 밑줄을 그려요. */}
      <span
        ref={indicatorRef}
        className={styles.indicator}
        hidden={indicatorRect === null}
        style={
          indicatorRect
            ? {
                width: indicatorRect.width,
                transform: `translateX(${String(indicatorRect.left)}px)`,
              }
            : undefined
        }
        aria-hidden
      />
    </TabsPrimitive.List>
  );
}

// 두 hook은 쓰는 쪽 ref와 합치지 않으려고 선택선의 부모로 목록을 찾아요.
// 선택선은 크기가 바뀔 때마다, 스크롤은 선택이 바뀔 때만 움직여서 따로 지켜봐요.

// 선택한 탭의 위치·너비를 재요.
function useIndicatorRect(indicatorRef: RefObject<HTMLSpanElement | null>) {
  const [rect, setRect] = useState<IndicatorRect | null>(null);

  // 그리기 전에 재서 처음 선택선이 엉뚱한 자리에서 날아오지 않아요.
  useLayoutEffect(() => {
    const list = indicatorRef.current?.parentElement;
    if (!list) {
      return;
    }

    const measure = () => {
      const tab = list.querySelector<HTMLElement>(ACTIVE_TAB_SELECTOR);
      if (!tab) {
        setRect(null);
        return;
      }
      const { left, width } = tabBoxInList(list, tab);
      setRect((prev) =>
        prev?.left === left && prev.width === width ? prev : { left, width },
      );
    };

    // 라벨이 바뀌거나 글꼴이 늦게 들어와 탭 너비가 바뀌어도 선택선이 따라가요.
    const resizeObserver = new ResizeObserver(() => {
      measure();
    });
    const observeTabs = () => {
      resizeObserver.disconnect();
      resizeObserver.observe(list);
      for (const tab of list.querySelectorAll(TAB_SELECTOR)) {
        resizeObserver.observe(tab);
      }
    };

    const mutationObserver = new MutationObserver((records) => {
      if (records.some((record) => record.type === "childList")) {
        observeTabs();
      }
      measure();
    });

    measure();
    observeTabs();
    mutationObserver.observe(list, {
      subtree: true,
      childList: true,
      attributeFilter: ["data-state"],
    });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [indicatorRef]);

  return rect;
}

// 선택이 바뀌면 그 탭이 보이게 목록만 가로로 스크롤해요.
// scrollIntoView는 페이지까지 움직여서 목록의 scrollLeft만 바꿔요.
function useScrollToActiveTab(indicatorRef: RefObject<HTMLSpanElement | null>) {
  useLayoutEffect(() => {
    const list = indicatorRef.current?.parentElement;
    if (!list) {
      return;
    }

    const scrollToTab = (tab: HTMLElement, behavior?: ScrollBehavior) => {
      const { left, width } = tabBoxInList(list, tab);
      const viewStart = list.scrollLeft;
      const viewEnd = viewStart + list.clientWidth;
      if (left < viewStart) {
        list.scrollTo({ left, behavior });
      } else if (left + width > viewEnd) {
        list.scrollTo({ left: left + width - list.clientWidth, behavior });
      }
    };

    let activeTab = list.querySelector<HTMLElement>(ACTIVE_TAB_SELECTOR);
    // 처음에는 바로 옮겨요. 화면을 열자마자 목록이 움직이면 어지러워요.
    if (activeTab) {
      scrollToTab(activeTab, "instant");
    }

    const mutationObserver = new MutationObserver(() => {
      const tab = list.querySelector<HTMLElement>(ACTIVE_TAB_SELECTOR);
      // 크기만 바뀔 때 옮기면 사용자가 넘겨 둔 스크롤을 되돌려서 선택이 바뀔 때만 옮겨요.
      // 움직임은 목록 CSS의 scroll-behavior가 정해서 모션 줄이기에서는 바로 옮겨요.
      if (tab && tab !== activeTab) {
        scrollToTab(tab);
      }
      activeTab = tab;
    });
    mutationObserver.observe(list, {
      subtree: true,
      childList: true,
      attributeFilter: ["data-state"],
    });

    return () => {
      mutationObserver.disconnect();
    };
  }, [indicatorRef]);
}

// 목록 안 좌표예요. 스크롤해도 바뀌지 않아서 선택선 위치와 스크롤 목표에 같이 써요.
function tabBoxInList(list: HTMLElement, tab: HTMLElement) {
  const listBox = list.getBoundingClientRect();
  const tabBox = tab.getBoundingClientRect();
  return {
    left: tabBox.left - listBox.left - list.clientLeft + list.scrollLeft,
    width: tabBox.width,
  };
}
