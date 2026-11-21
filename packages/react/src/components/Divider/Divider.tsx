import { clsx } from "clsx";
import { Separator } from "radix-ui";
import type { ComponentProps } from "react";

import * as styles from "./Divider.css";

export type DividerProps = Omit<ComponentProps<"div">, "children"> & {
  /**
   * 선의 방향이에요. `vertical`은 flex 부모 안에서 부모 높이를 따라요.
   * @default horizontal
   */
  orientation?: styles.DividerVariants["orientation"];
  /**
   * 구분 강도예요. 반복 항목 사이는 `subtle`, 의미 단위·섹션 경계는 더 진한 `muted`를 써요.
   * @default subtle
   */
  tone?: styles.DividerVariants["tone"];
  /**
   * 선 양 끝을 안쪽으로 옮기는 여백(px)이에요. 목록 글자의 시작 위치에 맞출 때 써요.
   * @default none
   */
  inset?: styles.DividerVariants["inset"];
  /**
   * 꾸미기만 하는 선이면 켜요. 보조기술이 구분선으로 읽지 않아요.
   * @default false
   */
  decorative?: boolean;
};

/**
 * 콘텐츠 사이의 경계를 나누는 1px 선이에요. 여백과 제목만으로 나뉘면 쓰지 않아요.
 *
 * 앞뒤 간격은 부모의 `gap`으로 띄우고, 마지막 항목 아래에는 두지 않아요.
 *
 * 목록(`<ul>`) 항목 사이에 두지 않아요. 목록 안에는 항목만 둘 수 있어서, 구분이 필요하면 항목 안에 `decorative`로 넣어요.
 */
export function Divider({
  orientation = "horizontal",
  tone = "subtle",
  inset = "none",
  className,
  ...separatorProps
}: DividerProps) {
  return (
    <Separator.Root
      orientation={orientation}
      {...separatorProps}
      className={clsx(styles.divider({ orientation, tone, inset }), className)}
    />
  );
}
