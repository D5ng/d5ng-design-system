import { useState } from "react";

type UseControllableStateParams<T> = {
  prop: T | undefined;
  defaultProp: T;
  onChange: ((value: T) => void) | undefined;
};

/**
 * 제어(`prop`을 넘김)와 비제어(`defaultProp`만 넘김) 값을 하나로 다뤄요. 제어면 값은 그대로 두고 `onChange`로 알리기만 해요.
 *
 * Radix와 같은 계약이지만 함수 갱신을 받지 않고, `onChange`를 effect가 아니라 그 자리에서 불러요.
 * 그래서 쓰는 쪽이 `onChange`에서 옮긴 포커스가 요소가 사라지기 전에 옮겨져요.
 *
 * @see https://github.com/radix-ui/primitives/blob/main/packages/react/use-controllable-state/src/use-controllable-state.tsx
 */
export function useControllableState<T>({
  prop,
  defaultProp,
  onChange,
}: UseControllableStateParams<T>) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultProp);
  const isControlled = prop !== undefined;
  const value = isControlled ? prop : uncontrolledValue;

  const setValue = (nextValue: T) => {
    if (Object.is(nextValue, value)) {
      return;
    }
    if (!isControlled) {
      setUncontrolledValue(nextValue);
    }
    onChange?.(nextValue);
  };

  return [value, setValue] as const;
}
