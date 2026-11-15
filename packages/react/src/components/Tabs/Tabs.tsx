import { clsx } from "clsx";
import { Tabs as TabsPrimitive } from "radix-ui";
import type { ComponentProps } from "react";

import * as styles from "./Tabs.css";

// 문서에 보일 props는 여기서 직접 선언해요. Radix와 HTML 속성은 문서 표에 안 잡혀요.
// orientation·dir은 받지 않아요. Figma가 가로 탭만 그렸어요.
type TabsRootProps = Omit<
  ComponentProps<typeof TabsPrimitive.Root>,
  | "asChild"
  | "orientation"
  | "dir"
  | "value"
  | "defaultValue"
  | "onValueChange"
  | "activationMode"
>;

// Radix는 둘 다 없으면 아무 탭도 고르지 않아서 패널이 비어요. 한 탭은 늘 골라져 있게 둘 중 하나를 받아요.
type TabsSelectionProps =
  | {
      /** 선택한 탭의 `value`예요. 바깥에서 선택을 다룰 때 `onValueChange`와 같이 써요. */
      value: string;
      defaultValue?: never;
    }
  | {
      /** 처음 선택할 탭의 `value`예요. 그 뒤로는 `Tabs`가 선택을 다뤄요. */
      defaultValue: string;
      value?: never;
    };

export type TabsProps = TabsRootProps &
  TabsSelectionProps & {
    /** 다른 탭을 고르면 그 `value`로 불려요. */
    onValueChange?: (value: string) => void;
    /**
     * 방향키로 포커스를 옮길 때 바로 고를지예요. 패널을 그리는 데 시간이 걸리면 `manual`로 두고 Enter·Space로 골라요.
     * @default automatic
     */
    activationMode?: "automatic" | "manual";
  };

export type TabsTriggerProps = Omit<
  ComponentProps<typeof TabsPrimitive.Trigger>,
  "asChild" | "value" | "disabled"
> & {
  /** 이 탭의 값이에요. 같은 `value`의 `TabsContent`를 보여 줘요. 탭과 패널의 `id`에 들어가서 공백 없이 써요(예: `delivery`). */
  value: string;
  /**
   * 이 탭을 고를 수 없게 해요. 방향키 이동에서도 빠져요. 선택된 탭을 막으려면 먼저 다른 탭으로 선택을 옮겨요.
   * @default false
   */
  disabled?: boolean;
};

// forceMount는 받지 않아요. Figma가 고른 패널만 그렸고, 숨은 패널은 내용 없이 남아요.
export type TabsContentProps = Omit<
  ComponentProps<typeof TabsPrimitive.Content>,
  "asChild" | "value" | "forceMount"
> & {
  /** 이 패널을 보여 줄 탭의 `value`예요. */
  value: string;
};

// ---- Tabs

/**
 * 같은 화면 안에서 관련된 내용을 나눠 보여 줘요. 한 번에 패널 하나만 보여요.
 *
 * `TabsList` 안에 `TabsTrigger`를, 그 옆에 같은 `value`의 `TabsContent`를 둬요. `className`과 `ref`는 바깥 `div`에 가요.
 */
export function Tabs(tabsProps: TabsProps) {
  return <TabsPrimitive.Root {...tabsProps} />;
}

// ---- TabsTrigger

/**
 * 탭 하나예요. 라벨은 `children`으로 넣어요. `className`과 `ref`는 `role="tab"` 버튼에 가요.
 */
export function TabsTrigger({ className, ...triggerProps }: TabsTriggerProps) {
  return (
    <TabsPrimitive.Trigger
      {...triggerProps}
      className={clsx(styles.trigger, className)}
    />
  );
}

// ---- TabsContent

/**
 * 탭 하나의 패널이에요. 고른 탭의 패널만 보이고, Tab 키로 들를 수 있어요. `className`과 `ref`는 `role="tabpanel"` 요소에 가요.
 */
export function TabsContent({ className, ...contentProps }: TabsContentProps) {
  return (
    <TabsPrimitive.Content
      {...contentProps}
      className={clsx(styles.content, className)}
    />
  );
}
