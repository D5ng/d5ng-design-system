import { clsx } from "clsx";
import { CircleAlert, Info } from "lucide-react";
import { Label, VisuallyHidden } from "radix-ui";
import { type ComponentProps, type ReactNode, useId } from "react";

import * as styles from "./Field.css";

/** `Field`가 `children`에 넘기는 속성이에요. 입력 요소에 그대로 펼쳐요. */
export type FieldControlProps = {
  id: string;
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
  /** 입력의 id예요. 없으면 만들어서 라벨과 이어요. */
  id?: string;
  /** 입력을 그려요. 받은 `control`을 입력 요소에 펼쳐야 라벨·안내와 이어져요. */
  children: (control: FieldControlProps) => ReactNode;
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
  id: idProp,
  className,
  children,
  ...rootProps
}: FieldProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  // 쓰는 쪽이 준 id와 겹치지 않게 만든 id에서 이어 붙여요.
  const messageId = `${generatedId}-message`;
  const countId = `${generatedId}-count`;

  const showError = invalid && Boolean(errorMessage);
  const message = showError ? errorMessage : description;
  const MessageIcon = showError ? CircleAlert : Info;

  // 없는 부분의 id는 빼요. 빈 요소를 가리키면 스크린리더가 아무것도 읽지 않아요.
  const describedBy =
    [message ? messageId : null, characterCount ? countId : null]
      .filter(Boolean)
      .join(" ") || undefined;

  const control: FieldControlProps = {
    id,
    "aria-describedby": describedBy,
    "aria-invalid": invalid || undefined,
    required,
    disabled,
  };

  const labelElement = (
    <Label.Root htmlFor={id} className={styles.label({ weight: labelWeight })}>
      {label}
      {requirementIndicator ? (
        required ? (
          <RequiredMark />
        ) : (
          <span className={styles.optional} aria-hidden>
            선택
          </span>
        )
      ) : null}
    </Label.Root>
  );

  return (
    <div
      data-invalid={invalid ? "" : undefined}
      data-disabled={disabled ? "" : undefined}
      {...rootProps}
      className={clsx(styles.root, className)}
    >
      {/* header 밖에 둬요. 숨긴 라벨만 있을 때 빈 header가 간격을 차지하지 않아요. */}
      {hideLabel ? (
        <VisuallyHidden.Root>{labelElement}</VisuallyHidden.Root>
      ) : null}
      {!hideLabel || headerAction ? (
        <div className={styles.header}>
          {hideLabel ? null : labelElement}
          {headerAction ? (
            <span className={styles.headerAction}>{headerAction}</span>
          ) : null}
        </div>
      ) : null}
      {children(control)}
      {message || characterCount ? (
        <div className={styles.footer}>
          {message ? (
            <div
              id={messageId}
              className={showError ? styles.errorMessage : styles.description}
            >
              {showMessageIcon ? (
                <MessageIcon className={styles.messageIcon} aria-hidden />
              ) : null}
              <span>{message}</span>
            </div>
          ) : null}
          {characterCount ? (
            <div id={countId} className={styles.count}>
              <span
                className={styles.countCurrent}
                data-empty={characterCount.current === 0 ? "" : undefined}
              >
                {characterCount.current}
              </span>
              /{characterCount.max}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

// Figma `Required mark`(6×6) 모양 그대로예요. 색은 currentColor로 받아요.
function RequiredMark() {
  return (
    <svg
      className={styles.requiredMark}
      viewBox="0 0 6 6"
      fill="currentColor"
      aria-hidden
    >
      <path d="M3.75008 1.55859L4.41324 1.09468C4.75249 0.857361 5.21988 0.939865 5.45738 1.27899C5.69505 1.61836 5.61249 2.08615 5.27301 2.32366L4.30769 2.99902L5.27378 3.67612C5.61291 3.91381 5.69523 4.38137 5.45767 4.72059C5.22005 5.0599 4.75236 5.14233 4.41305 4.90471L3.75008 4.44043V5.25C3.75008 5.66421 3.41429 6 3.00008 6C2.58586 6 2.25008 5.66421 2.25008 5.25V4.44043L1.5871 4.90471C1.24779 5.14233 0.780102 5.0599 0.542479 4.72059C0.304917 4.38137 0.387237 3.91381 0.72637 3.67612L1.69246 2.99902L0.72714 2.32366C0.387664 2.08615 0.305104 1.61836 0.542768 1.27899C0.780267 0.939865 1.24766 0.857361 1.58691 1.09468L2.25008 1.55859V0.75C2.25008 0.335786 2.58586 0 3.00008 0C3.41429 0 3.75008 0.335786 3.75008 0.75V1.55859Z" />
    </svg>
  );
}
