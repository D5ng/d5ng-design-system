import { clsx } from "clsx";
import { CircleAlert, Info } from "lucide-react";
import { Label, VisuallyHidden } from "radix-ui";
import { type ComponentProps, type ReactNode, useId } from "react";

import { joinIds } from "../_internal/joinIds";
import * as styles from "./Field.css";

/** `Field`가 `children`에 넘기는 속성이에요. 입력 요소에 그대로 펼쳐요. */
export type FieldControlProps = {
  id: string;
  "aria-labelledby": string | undefined;
  "aria-describedby": string | undefined;
  "aria-invalid": true | undefined;
  required: boolean;
  disabled: boolean;
};

export type FieldProps = Omit<ComponentProps<"div">, "children" | "id"> & {
  /** 입력의 이름이에요. `hideLabel`이어도 스크린리더는 읽어요. */
  label: ReactNode;
  /**
   * 라벨을 화면에서만 숨겨요. 표의 열 제목처럼 주변이 이름을 보여 줄 때 써요.
   * @default false
   */
  hideLabel?: boolean;
  /**
   * 라벨 굵기예요.
   * @default medium
   */
  labelWeight?: styles.LabelVariants["weight"];
  /**
   * 꼭 입력해야 해요. 입력에 `required`를 넘겨요.
   * @default false
   */
  required?: boolean;
  /**
   * 라벨 뒤에 `required`면 `*`, 아니면 `선택`을 붙여요. 스크린리더는 표시 대신 `required`를 읽어요.
   * @default false
   */
  requirementIndicator?: boolean;
  /** 라벨 오른쪽 보조 액션(ghost `Button`, `IconButton`)이에요. `disabled`는 액션에도 따로 넘겨요. */
  headerAction?: ReactNode;
  /** 입력을 돕는 안내예요. 입력의 설명으로 읽혀요. */
  description?: ReactNode;
  /** 오류 문구예요. `invalid`일 때만 보이고 `description`을 대신해요. */
  errorMessage?: ReactNode;
  /**
   * 안내·오류 앞에 상태 아이콘을 붙여요.
   * @default false
   */
  showMessageIcon?: boolean;
  /** 길이 제한이 있을 때만 넘겨요. `max`를 넘겨도 `invalid`는 쓰는 쪽이 정해요. */
  characterCount?: { current: number; max: number };
  /**
   * 값이 올바르지 않아요. 입력에 `aria-invalid`를 넘겨요.
   * @default false
   */
  invalid?: boolean;
  /**
   * 입력을 막아요. 입력에 `disabled`를 넘겨요.
   * @default false
   */
  disabled?: boolean;
  /**
   * 입력 하나 대신 묶음(`role="radiogroup"` 등)에 라벨을 붙여요. 라벨은 `aria-labelledby`로 이어지고, 눌러도 포커스가 가지 않아요.
   * @default false
   */
  group?: boolean;
  /** 입력의 id예요. `group`이면 묶음의 id예요. 없으면 만들어요. */
  id?: string;
  /** 입력을 그려요. 받은 `control`을 입력 요소에 펼쳐야 라벨·안내와 이어져요. */
  children: (control: FieldControlProps) => ReactNode;
};

// footer에 그릴 것이에요. 없으면 null이고, aria-describedby도 같은 값을 읽어요.
type FooterMessage = { id: string; text: ReactNode; isError: boolean };
type FooterCount = { id: string; current: number; max: number };

type FieldHeaderProps = {
  labelElement: ReactNode;
  hideLabel: boolean;
  action: ReactNode;
};

type FieldFooterProps = {
  message: FooterMessage | null;
  count: FooterCount | null;
  showMessageIcon: boolean;
};

type RequirementIndicatorProps = {
  required: boolean;
};

type PickMessageParams = {
  id: string;
  description: ReactNode;
  errorMessage: ReactNode;
  invalid: boolean;
};

/**
 * 입력 하나에 라벨·안내·오류·글자 수를 붙이고, 입력과 접근성 속성으로 이어 줘요.
 *
 * Figma의 `State`는 `invalid`·`disabled` 두 prop으로 나눠 받아요.
 */
export function Field({
  label,
  hideLabel = false,
  labelWeight,
  required = false,
  requirementIndicator = false,
  headerAction,
  description,
  errorMessage,
  showMessageIcon = false,
  characterCount,
  invalid = false,
  disabled = false,
  group = false,
  id: idProp,
  className,
  children,
  ...rootProps
}: FieldProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  // 쓰는 쪽이 준 id와 겹치지 않게 만든 id에서 이어 붙여요.
  const labelId = `${generatedId}-label`;
  const message = pickMessage({
    id: `${generatedId}-message`,
    description,
    errorMessage,
    invalid,
  });
  const count = characterCount
    ? { id: `${generatedId}-count`, ...characterCount }
    : null;

  const labelContent = (
    <>
      {label}
      {requirementIndicator ? (
        <RequirementIndicator required={required} />
      ) : null}
    </>
  );
  const labelClassName = styles.label({ weight: labelWeight });

  const control: FieldControlProps = {
    id,
    "aria-labelledby": group ? labelId : undefined,
    // footer가 그리는 값과 같은 값을 읽어요. 따로 계산하면 없는 id를 가리키거나 설명이 빠져요.
    "aria-describedby": joinIds(message?.id, count?.id),
    "aria-invalid": invalid || undefined,
    required,
    disabled,
  };

  return (
    <div
      data-invalid={invalid ? "" : undefined}
      data-disabled={disabled ? "" : undefined}
      {...rootProps}
      className={clsx(styles.root, className)}
    >
      <FieldHeader
        hideLabel={hideLabel}
        action={headerAction}
        labelElement={
          group ? (
            // <label for>는 input 같은 요소만 가리켜서 묶음엔 이름이 붙지 않아요.
            <span id={labelId} className={labelClassName}>
              {labelContent}
            </span>
          ) : (
            <Label.Root htmlFor={id} className={labelClassName}>
              {labelContent}
            </Label.Root>
          )
        }
      />
      {children(control)}
      <FieldFooter
        message={message}
        count={count}
        showMessageIcon={showMessageIcon}
      />
    </div>
  );
}

// ---- FieldHeader

function FieldHeader({ labelElement, hideLabel, action }: FieldHeaderProps) {
  const actionElement = action ? (
    <span className={styles.headerAction}>{action}</span>
  ) : null;

  if (hideLabel) {
    // 숨긴 라벨은 header 밖에 둬요. 보조 액션이 없을 때 빈 header가 간격을 차지하지 않아요.
    return (
      <>
        <VisuallyHidden.Root>{labelElement}</VisuallyHidden.Root>
        {actionElement ? (
          <div className={styles.header}>{actionElement}</div>
        ) : null}
      </>
    );
  }

  return (
    <div className={styles.header}>
      {labelElement}
      {actionElement}
    </div>
  );
}

// ---- FieldFooter

function FieldFooter({ message, count, showMessageIcon }: FieldFooterProps) {
  if (!message && !count) {
    return null;
  }

  const MessageIcon = message?.isError ? CircleAlert : Info;

  return (
    <div className={styles.footer}>
      {message ? (
        <div
          id={message.id}
          className={message.isError ? styles.errorMessage : styles.description}
        >
          {showMessageIcon ? (
            <MessageIcon className={styles.messageIcon} aria-hidden />
          ) : null}
          <span>{message.text}</span>
        </div>
      ) : null}
      {count ? (
        <div id={count.id} className={styles.count}>
          <span
            className={styles.countCurrent}
            data-empty={count.current === 0 ? "" : undefined}
          >
            {count.current}
          </span>
          /{count.max}
        </div>
      ) : null}
    </div>
  );
}

// ---- RequirementIndicator

// 둘 다 이름에 섞이지 않게 숨겨요. 필수 여부는 입력의 required가 알려요.
function RequirementIndicator({ required }: RequirementIndicatorProps) {
  return required ? (
    <span className={styles.requiredMark} aria-hidden>
      *
    </span>
  ) : (
    <span className={styles.optional} aria-hidden>
      선택
    </span>
  );
}

// 오류는 invalid이고 문구가 있을 때만 안내를 대신해요.
function pickMessage({
  id,
  description,
  errorMessage,
  invalid,
}: PickMessageParams): FooterMessage | null {
  if (invalid && errorMessage) {
    return { id, text: errorMessage, isError: true };
  }
  if (description) {
    return { id, text: description, isError: false };
  }
  return null;
}
