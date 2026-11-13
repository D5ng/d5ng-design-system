import type { MouseEvent, MouseEventHandler } from "react";

type ButtonStateOptions = {
  disabled: boolean;
  loading: boolean;
  asChild: boolean;
  onClickCapture: MouseEventHandler<HTMLButtonElement> | undefined;
};

/**
 * 누를 수 없는 상태(`disabled`·`loading`)를 요소에 맞는 속성으로 바꾸고 클릭을 막아요.
 *
 * `overridableProps`는 쓰는 쪽 props 앞에, `enforcedProps`는 뒤에 펼쳐요.
 */
export function buttonStateProps({
  disabled,
  loading,
  asChild,
  onClickCapture,
}: ButtonStateOptions) {
  // disabled 속성은 <button>에만 있고 포커스까지 빼요. 그 밖에는 aria-disabled로 알려요.
  const nativeDisabled = !asChild && disabled && !loading;
  const ariaDisabled = (disabled || loading) && !nativeDisabled;

  // 쓰는 쪽 핸들러보다 먼저 막아야 해서 composeEventHandlers를 쓰지 않아요. 그건 쓰는 쪽을 먼저 불러요.
  const handleClickCapture = (event: MouseEvent<HTMLButtonElement>) => {
    if (ariaDisabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onClickCapture?.(event);
  };

  return {
    overridableProps: {
      // asChild면 자식 요소의 type을 건드리지 않아요. 폼 안에서 실수로 제출되지 않게 기본은 "button"이에요.
      type: asChild ? undefined : ("button" as const),
      // 스타일은 이 속성을 봐요. 누를 수 없으면(disabled나 loading) data-disabled가 붙어요.
      "data-disabled": disabled || loading ? "" : undefined,
      "data-loading": loading ? "" : undefined,
    },
    enforcedProps: {
      disabled: nativeDisabled || undefined,
      "aria-disabled": ariaDisabled || undefined,
      "aria-busy": loading || undefined,
      onClickCapture: handleClickCapture,
    },
  };
}
