"use client";

import { clsx } from "clsx";
import { AlertDialog as AlertDialogPrimitive, VisuallyHidden } from "radix-ui";
import type { ComponentProps } from "react";

import { composeEventHandlers } from "../_internal/composeEventHandlers";
import { Button, type ButtonProps } from "../Button";
import * as styles from "./AlertDialog.css";

// Content가 처음 포커스를 정할 때 찾는 표시예요. Cancel·Action이 스스로 붙여요.
const cancelSelector = "[data-alert-dialog-cancel]";
const actionSelector = "[data-alert-dialog-action]";

// Figma 규격("기존 Small Button")이에요. Cancel과 Action이 같이 써요.
const fixedButtonProps = { size: "small", fullWidth: true } as const;

// 고정한 값은 쓰는 쪽이 바꾸지 못하게 해요.
type FixedButtonProps = Omit<
  ButtonProps,
  "variant" | "asChild" | keyof typeof fixedButtonProps
>;

// ---- Root

export type AlertDialogProps = ComponentProps<typeof AlertDialogPrimitive.Root>;

/**
 * 중요한 확인과 경고를 받는 모달이에요. 바깥을 눌러도 닫히지 않고, 버튼이나 Escape로만 닫혀요.
 *
 * 입력이나 긴 내용은 Dialog, 흐름을 멈출 필요가 없는 결과 안내는 Snackbar로 해요.
 */
function AlertDialog({ ...rootProps }: AlertDialogProps) {
  return <AlertDialogPrimitive.Root {...rootProps} />;
}

// ---- Trigger

export type AlertDialogTriggerProps = ComponentProps<
  typeof AlertDialogPrimitive.Trigger
>;

/** 대화상자를 여는 요소예요. 보통 `asChild`로 `Button`을 감싸요. */
function AlertDialogTrigger({ ...triggerProps }: AlertDialogTriggerProps) {
  return <AlertDialogPrimitive.Trigger {...triggerProps} />;
}

// ---- Content

export type AlertDialogContentProps = ComponentProps<
  typeof AlertDialogPrimitive.Content
>;

/**
 * 배경(scrim)과 표면을 함께 그려요. `body`에 Portal로 붙어요.
 *
 * 열리면 Cancel에, Cancel이 없으면 하나뿐인 Action에 포커스가 가요. 닫히면 Trigger로 돌아가요.
 *
 * Trigger 없이 열었거나 실행 뒤 연 요소가 사라지면 `onCloseAutoFocus`에서 `event.preventDefault()`를 부르고 다음 위치로 포커스를 옮겨요.
 */
function AlertDialogContent({
  className,
  onOpenAutoFocus,
  ...contentProps
}: AlertDialogContentProps) {
  // Radix는 Cancel에만 포커스를 줘요. Cancel이 없으면 포커스가 배경에 남아서, 하나뿐인 Action으로 옮겨요.
  const focusActionWithoutCancel = (event: Event) => {
    // FocusScope가 Content 요소에서 이 이벤트를 보내요.
    const contentElement = event.currentTarget;
    if (!(contentElement instanceof HTMLElement)) {
      return;
    }
    if (contentElement.querySelector(cancelSelector) !== null) {
      return;
    }

    const action = contentElement.querySelector<HTMLElement>(actionSelector);
    if (action === null) {
      return;
    }

    // 막지 않으면 Radix가 이어서 없는 Cancel로 포커스를 옮기려 해요.
    event.preventDefault();
    action.focus({ preventScroll: true });
  };

  return (
    <AlertDialogPrimitive.Portal>
      <AlertDialogPrimitive.Overlay className={styles.overlay} />
      {/* Radix는 배경을 aria-hidden으로만 가려요. 모달임을 직접 알려요. */}
      <AlertDialogPrimitive.Content
        aria-modal="true"
        {...contentProps}
        className={clsx(styles.content, className)}
        onOpenAutoFocus={composeEventHandlers(
          onOpenAutoFocus,
          focusActionWithoutCancel,
        )}
      />
    </AlertDialogPrimitive.Portal>
  );
}

// ---- Title

export type AlertDialogTitleProps = ComponentProps<
  typeof AlertDialogPrimitive.Title
> & {
  /**
   * 눈에는 숨기고 스크린리더만 읽어요. 메시지만으로 뜻이 충분해 제목을 보이지 않을 때(Figma `Show title` 끔) 써요.
   * @default false
   */
  visuallyHidden?: boolean;
};

/** 결정할 내용이에요. 대화상자 이름으로 읽혀요. */
function AlertDialogTitle({
  visuallyHidden = false,
  className,
  ...titleProps
}: AlertDialogTitleProps) {
  const titleElement = (
    <AlertDialogPrimitive.Title
      {...titleProps}
      className={clsx(styles.title, className)}
    />
  );

  // 제목을 빼면 이름이 없어져서, 숨겨도 요소는 남겨요.
  if (visuallyHidden) {
    return <VisuallyHidden.Root asChild>{titleElement}</VisuallyHidden.Root>;
  }
  return titleElement;
}

// ---- Description

export type AlertDialogDescriptionProps = ComponentProps<
  typeof AlertDialogPrimitive.Description
>;

/** 실행 결과와 주의할 점이에요. 대화상자 설명으로 읽혀요. */
function AlertDialogDescription({
  className,
  ...descriptionProps
}: AlertDialogDescriptionProps) {
  return (
    <AlertDialogPrimitive.Description
      {...descriptionProps}
      className={clsx(styles.description, className)}
    />
  );
}

// ---- ErrorMessage

export type AlertDialogErrorMessageProps = ComponentProps<"p">;

/** 실행이 실패했을 때 보여요. 나타나면 스크린리더가 바로 읽어요. 대화상자는 닫지 않고 다시 시도하게 해요. */
function AlertDialogErrorMessage({
  className,
  ...errorMessageProps
}: AlertDialogErrorMessageProps) {
  return (
    <p
      role="alert"
      {...errorMessageProps}
      className={clsx(styles.errorMessage, className)}
    />
  );
}

// ---- Actions

export type AlertDialogActionsProps = ComponentProps<"div">;

/**
 * Cancel과 Action을 담아요. 읽기 순서대로 Cancel을 먼저 둬요.
 *
 * 두 라벨이 반 폭에 들어가면 가로로, 하나라도 넘치면 세로로 쌓여요.
 */
function AlertDialogActions({
  className,
  ...actionsProps
}: AlertDialogActionsProps) {
  return <div {...actionsProps} className={clsx(styles.actions, className)} />;
}

// ---- Cancel

export type AlertDialogCancelProps = Omit<FixedButtonProps, "loading"> & {
  /**
   * 취소 버튼 색이에요. 취소를 더 눈에 띄지 않게 해야 할 때만 `ghost`를 써요.
   * @default secondary
   */
  variant?: Extract<ButtonProps["variant"], "secondary" | "ghost">;
};

/** 안전한 취소예요. 누르거나 Escape를 누르면 닫혀요. 처음 포커스가 여기에 가요. */
function AlertDialogCancel({
  variant = "secondary",
  className,
  ...cancelProps
}: AlertDialogCancelProps) {
  return (
    <AlertDialogPrimitive.Cancel asChild>
      <Button
        {...cancelProps}
        variant={variant}
        {...fixedButtonProps}
        className={clsx(styles.actionButton, className)}
        data-alert-dialog-cancel=""
      />
    </AlertDialogPrimitive.Cancel>
  );
}

// ---- Action

export type AlertDialogActionProps = FixedButtonProps & {
  /**
   * 실행 버튼 색이에요. 삭제·초기화·변경사항 폐기에는 `critical`, 브랜드 맥락에서만 `primary`를 써요.
   * @default neutral
   */
  variant?: Extract<ButtonProps["variant"], "neutral" | "primary" | "critical">;
};

/**
 * 경고 대상 행동이에요. 누르면 닫혀요.
 *
 * 실행 중이나 실패 뒤에도 열어 두려면 `onClick`에서 `event.preventDefault()`를 부르고 `open`을 직접 제어해요. `loading`이면 다시 눌리지 않아요.
 */
function AlertDialogAction({
  variant = "neutral",
  className,
  ...actionProps
}: AlertDialogActionProps) {
  return (
    <AlertDialogPrimitive.Action asChild>
      <Button
        {...actionProps}
        variant={variant}
        {...fixedButtonProps}
        className={clsx(styles.actionButton, className)}
        data-alert-dialog-action=""
      />
    </AlertDialogPrimitive.Action>
  );
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogActions,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogErrorMessage,
  AlertDialogTitle,
  AlertDialogTrigger,
};
