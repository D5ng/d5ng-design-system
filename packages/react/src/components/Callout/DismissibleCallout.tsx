"use client";

import { clsx } from "clsx";
import { X } from "lucide-react";
import type { ComponentProps } from "react";

import { useControllableState } from "../_internal/useControllableState";
import { IconButton } from "../IconButton";
import { type CalloutBaseProps, CalloutContent } from "./Callout";
import * as styles from "./Callout.css";

// 화면마다 이름이 달라지면 같은 버튼을 다르게 읽어서 고정해요(TextField "입력 내용 지우기"와 같은 방식).
const CLOSE_LABEL = "안내 닫기";

export type DismissibleCalloutProps = Omit<
  ComponentProps<"div">,
  keyof CalloutBaseProps
> &
  Omit<CalloutBaseProps, "tone"> & {
    /**
     * 배경과 앞 아이콘의 색이에요. 주의·오류는 닫지 않아서 `warning`·`critical`이 없어요.
     * @default neutral
     */
    tone?: "neutral" | "informative" | "positive";
    /** 보임 상태예요. 넘기면 `onOpenChange`로 직접 바꿔야 해요. */
    open?: boolean;
    /**
     * 처음 보임 상태예요. `open` 없이 쓸 때 넘겨요.
     * @default true
     */
    defaultOpen?: boolean;
    /** 닫기를 누르면 `false`로 불려요. 닫기 버튼이 사라지기 전에 불려서 여기서 포커스를 옮겨요. */
    onOpenChange?: (open: boolean) => void;
  };

// ---- DismissibleCallout

/**
 * 한 번 읽으면 닫아도 되는 안내예요.
 *
 * 닫히면 DOM에서 빠져요. 포커스는 옮기지 않아서 닫은 뒤 갈 곳은 `onOpenChange`에서 정해요.
 */
export function DismissibleCallout({
  open: openProp,
  defaultOpen = true,
  onOpenChange,
  tone = "neutral",
  title,
  prefixIcon,
  hidePrefixIcon = false,
  className,
  children,
  ...divProps
}: DismissibleCalloutProps) {
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });

  const handleClose = () => {
    setOpen(false);
  };

  if (!open) {
    return null;
  }

  return (
    <div {...divProps} className={clsx(styles.root({ tone }), className)}>
      <CalloutContent
        tone={tone}
        title={title}
        prefixIcon={prefixIcon}
        hidePrefixIcon={hidePrefixIcon}
      >
        {children}
      </CalloutContent>
      <IconButton
        variant="ghost"
        size="small"
        aria-label={CLOSE_LABEL}
        onClick={handleClose}
      >
        <X />
      </IconButton>
    </div>
  );
}
