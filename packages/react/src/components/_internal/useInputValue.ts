import { type ChangeEvent, type ComponentProps, useState } from "react";

type TextControl = HTMLInputElement | HTMLTextAreaElement;

type UseInputValueParams<T extends TextControl> = {
  value: ComponentProps<"input">["value"];
  defaultValue: ComponentProps<"input">["defaultValue"];
  onChange: ((event: ChangeEvent<T>) => void) | undefined;
};

/**
 * 입력에 들어 있는 값을 글자로 돌려줘요. 값은 입력(비제어)이나 쓰는 쪽(제어)이 가지고, 여기서는 따라 읽기만 해요.
 * 돌려준 `handleChange`를 입력의 `onChange`에 붙여요.
 */
export function useInputValue<T extends TextControl>({
  value,
  defaultValue,
  onChange,
}: UseInputValueParams<T>) {
  // value가 없으면 입력이 값을 가져서, 바뀔 때마다 따라 적어요.
  const [typedValue, setTypedValue] = useState(defaultValue);

  // composeEventHandlers를 쓰면 쓰는 쪽이 preventDefault()할 때 건너뛰는데, 입력은 그래도 바뀌어서 값이 어긋나요.
  const handleChange = (event: ChangeEvent<T>) => {
    setTypedValue(event.currentTarget.value);
    onChange?.(event);
  };

  return {
    currentValue: String(value ?? typedValue ?? ""),
    handleChange,
  };
}
