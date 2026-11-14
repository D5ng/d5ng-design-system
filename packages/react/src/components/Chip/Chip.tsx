import { clsx } from "clsx";
import { Check } from "lucide-react";
import { Toggle } from "radix-ui";
import type { ComponentProps, ReactNode } from "react";

import * as styles from "./Chip.css";

// 두 부품이 같이 받는 겉모양 props예요. 문서에 보일 props는 여기서 직접 선언해요.
type ChipAppearanceProps = {
  /** 칩 글자예요. 칩 이름으로 읽혀요. 길면 칩 안에서 줄바꿈돼요. */
  children: ReactNode;
  /**
   * 모양이에요. 선택하면 `solid`는 배경이 채워지고, outline 두 가지는 테두리가 굵어져요. 미선택 테두리는 `outlineStrong`이 더 진해요.
   * @default outlineWeak
   */
  variant?: styles.RootVariants["variant"];
  /**
   * 겉면 높이와 글자 크기예요. 누르는 영역은 크기와 상관없이 44×44px 이상이에요.
   * @default medium
   */
  size?: styles.RootVariants["size"];
  /** 글자 앞에 두는 아이콘이에요. 스크린리더는 읽지 않아요. */
  prefixIcon?: ReactNode;
};

export type ChipButtonProps = Omit<
  ComponentProps<"button">,
  "children" | "disabled"
> &
  ChipAppearanceProps & {
    /**
     * 누를 수 없어요. 포커스도 받지 않아요.
     * @default false
     */
    disabled?: boolean;
  };

export type ChipToggleProps = Omit<
  ComponentProps<typeof Toggle.Root>,
  | "asChild"
  | "children"
  | "pressed"
  | "defaultPressed"
  | "onPressedChange"
  | "disabled"
> &
  ChipAppearanceProps & {
    /** 선택 상태예요. 넘기면 `onPressedChange`로 직접 바꿔야 해요. */
    pressed?: boolean;
    /**
     * 처음 선택 상태예요. `pressed` 없이 쓸 때 넘겨요.
     * @default false
     */
    defaultPressed?: boolean;
    /** 선택이 바뀌면 불려요. */
    onPressedChange?: (pressed: boolean) => void;
    /**
     * 누를 수 없어요. 포커스도 받지 않고, 선택 상태는 그대로 보여요.
     * @default false
     */
    disabled?: boolean;
  };

type ChipSurfaceProps = Pick<ChipAppearanceProps, "children" | "prefixIcon"> & {
  // Figma의 Show indicator예요. 선택이 있는 부품만 켜요.
  showIndicator: boolean;
};

// ---- ChipButton

/**
 * 누르면 바로 실행되고 선택을 남기지 않는 칩이에요. 추천 검색어처럼 고르는 즉시 동작할 때 써요.
 *
 * 선택이 남아야 하면 `ChipToggle`을 써요. Figma의 `State`에서 `disabled`만 prop이고, hover·pressed·focus는 CSS가 맡아요.
 */
export function ChipButton({
  variant,
  size,
  prefixIcon,
  disabled = false,
  className,
  children,
  ...buttonProps
}: ChipButtonProps) {
  return (
    <button
      // 폼 안에서 실수로 제출되지 않게 기본은 "button"이에요.
      type="button"
      // 스타일은 Radix Toggle과 같은 속성을 봐요.
      data-disabled={disabled ? "" : undefined}
      {...buttonProps}
      className={clsx(styles.root({ variant, size }), className)}
      disabled={disabled}
    >
      <ChipSurface prefixIcon={prefixIcon} showIndicator={false}>
        {children}
      </ChipSurface>
    </button>
  );
}

// ---- ChipToggle

/**
 * 누를 때마다 선택과 해제가 바뀌는 칩이에요. 필터처럼 항목마다 따로 켜고 끌 때 써요.
 *
 * 선택하면 끝에 체크가 보여요. 체크 자리는 늘 남아서 눌러도 너비가 그대로예요.
 *
 * Figma의 `Selected`는 `pressed`예요. `Show indicator`는 이 부품에서 늘 켜져 있어요.
 */
export function ChipToggle({
  variant,
  size,
  prefixIcon,
  className,
  children,
  ...toggleProps
}: ChipToggleProps) {
  return (
    <Toggle.Root
      {...toggleProps}
      className={clsx(styles.root({ variant, size }), className)}
    >
      <ChipSurface prefixIcon={prefixIcon} showIndicator>
        {children}
      </ChipSurface>
    </Toggle.Root>
  );
}

// ---- ChipSurface

function ChipSurface({
  prefixIcon,
  showIndicator,
  children,
}: ChipSurfaceProps) {
  return (
    <span className={styles.surface}>
      {prefixIcon ? (
        <span className={styles.icon} aria-hidden>
          {prefixIcon}
        </span>
      ) : null}
      <span className={styles.label}>{children}</span>
      {showIndicator ? (
        <span className={styles.indicator} aria-hidden>
          <Check />
        </span>
      ) : null}
    </span>
  );
}
