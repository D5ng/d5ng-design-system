import { clsx } from "clsx";
import { X } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import type { ComponentProps } from "react";

import { Button, type ButtonProps } from "../Button";
import { IconButton, type IconButtonProps } from "../IconButton";
import * as styles from "./Dialog.css";

// Figma 규격("Small Button, 꽉 찬 너비")이에요. Cancel과 Submit이 같이 써요.
const fixedButtonProps = { size: "small", fullWidth: true } as const;

// 고정한 값은 쓰는 쪽이 바꾸지 못하게 해요.
type FixedButtonProps = Omit<
  ButtonProps,
  "variant" | "asChild" | keyof typeof fixedButtonProps
>;

// ---- Root

export type DialogProps = ComponentProps<typeof DialogPrimitive.Root>;

/**
 * 지금 화면을 떠나지 않고 정보를 보거나 입력·설정을 바꾸는 모달이에요.
 *
 * 되돌릴 수 없는 일의 확인과 경고는 `AlertDialog`로 해요.
 */
function Dialog({ ...rootProps }: DialogProps) {
  return <DialogPrimitive.Root {...rootProps} />;
}

// ---- Trigger

export type DialogTriggerProps = ComponentProps<typeof DialogPrimitive.Trigger>;

/** 대화상자를 여는 요소예요. 보통 `asChild`로 `Button`을 감싸요. */
function DialogTrigger({ ...triggerProps }: DialogTriggerProps) {
  return <DialogPrimitive.Trigger {...triggerProps} />;
}

// ---- Content

export type DialogContentProps = ComponentProps<
  typeof DialogPrimitive.Content
> & {
  /**
   * 표면의 최대 너비예요. 항목이 많거나 넓은 설정에만 `large`를 써요.
   * @default medium
   */
  size?: styles.DialogContentVariants["size"];
};

/**
 * 배경(scrim)과 표면을 함께 그려요. `body`에 Portal로 붙어요.
 *
 * 배경을 누르면 닫혀요. 입력·설정 변경처럼 실수로 닫히면 안 되면 `onInteractOutside`에서 `event.preventDefault()`를 불러요. 이때는 `DialogCancel`을 둬요. 터치에서는 Escape가 없어요.
 *
 * 열리면 첫 번째 조작 요소에, 닫히면 Trigger로 포커스가 가요. 넘치는 `DialogBody`도 조작 요소라서, 닫기 버튼 없는 긴 글은 본문에 가요. 다른 곳으로 보내려면 `onOpenAutoFocus`·`onCloseAutoFocus`에서 정해요.
 */
function DialogContent({
  size,
  className,
  ...contentProps
}: DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className={styles.overlay} />
      {/* Radix는 배경을 aria-hidden으로만 가려요. 모달임을 직접 알려요. */}
      <DialogPrimitive.Content
        aria-modal="true"
        {...contentProps}
        className={clsx(styles.content({ size }), className)}
      />
    </DialogPrimitive.Portal>
  );
}

// ---- Header

export type DialogHeaderProps = ComponentProps<"div">;

/** 제목·설명·닫기 버튼을 담아요. 본문을 내려도 위에 남아요. */
function DialogHeader({ className, ...headerProps }: DialogHeaderProps) {
  return <div {...headerProps} className={clsx(styles.header, className)} />;
}

// ---- Title

export type DialogTitleProps = ComponentProps<typeof DialogPrimitive.Title>;

/** 대화상자가 하는 일이에요. 대화상자 이름으로 읽혀요. */
function DialogTitle({ className, ...titleProps }: DialogTitleProps) {
  return (
    <DialogPrimitive.Title
      {...titleProps}
      className={clsx(styles.title, className)}
    />
  );
}

// ---- Description

export type DialogDescriptionProps = ComponentProps<
  typeof DialogPrimitive.Description
>;

/** 제목을 보충하는 짧은 설명이에요. 대화상자 설명으로 읽혀요. 긴 안내는 `DialogBody`에 써요. */
function DialogDescription({
  className,
  ...descriptionProps
}: DialogDescriptionProps) {
  return (
    <DialogPrimitive.Description
      {...descriptionProps}
      className={clsx(styles.description, className)}
    />
  );
}

// ---- CloseButton

export type DialogCloseButtonProps = Omit<
  IconButtonProps,
  "children" | "variant" | "size" | "asChild" | "loading" | "aria-label"
> & {
  /**
   * 버튼 이름이에요.
   * @default 닫기
   */
  "aria-label"?: string;
};

/** Header 오른쪽 위의 닫기 버튼이에요. Footer가 없는 정보 조회에 두고, `DialogCancel`과 같이 두지 않아요. */
function DialogCloseButton({
  "aria-label": ariaLabel = "닫기",
  className,
  ...closeButtonProps
}: DialogCloseButtonProps) {
  return (
    <DialogPrimitive.Close asChild>
      <IconButton
        {...closeButtonProps}
        aria-label={ariaLabel}
        variant="ghost"
        size="small"
        className={clsx(styles.closeButton, className)}
      >
        <X />
      </IconButton>
    </DialogPrimitive.Close>
  );
}

// ---- Footer

export type DialogFooterProps = ComponentProps<"div">;

/**
 * Cancel과 Submit을 담아요. 읽기 순서대로 Cancel을 먼저 둬요. 본문을 내려도 아래에 남아요.
 *
 * 두 라벨이 반 폭에 들어가면 가로로, 하나라도 넘치면 세로로 쌓여요.
 */
function DialogFooter({ className, ...footerProps }: DialogFooterProps) {
  return <div {...footerProps} className={clsx(styles.footer, className)} />;
}

// ---- Cancel

export type DialogCancelProps = Omit<FixedButtonProps, "loading">;

/** 바꾼 내용을 버리고 닫아요. */
function DialogCancel({ className, ...cancelProps }: DialogCancelProps) {
  return (
    <DialogPrimitive.Close asChild>
      <Button
        {...cancelProps}
        variant="secondary"
        {...fixedButtonProps}
        className={clsx(styles.footerButton, className)}
      />
    </DialogPrimitive.Close>
  );
}

// ---- Submit

export type DialogSubmitProps = FixedButtonProps;

/**
 * 저장·적용이에요. 폼을 제출하고, 누르기만 해서는 닫히지 않아요. 끝나면 `open`을 직접 바꿔 닫아요.
 *
 * Footer는 폼 밖이라 `form`에 `DialogBody` 안 `<form>`의 `id`를 넘겨요. `loading`이면 다시 눌리지 않아요.
 */
function DialogSubmit({ className, ...submitProps }: DialogSubmitProps) {
  return (
    <Button
      type="submit"
      {...submitProps}
      variant="primary"
      {...fixedButtonProps}
      className={clsx(styles.footerButton, className)}
    />
  );
}

export {
  Dialog,
  DialogCancel,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogSubmit,
  DialogTitle,
  DialogTrigger,
};
