/**
 * 쓰는 쪽 핸들러와 우리 핸들러를 하나로 합쳐요. 쓰는 쪽을 먼저 부르고, 쓰는 쪽이 `preventDefault()`하면 우리 것은 건너뛰어요.
 *
 * 쓰는 쪽보다 먼저 막아야 하는 동작(Button의 `loading`)에는 쓰지 않아요.
 * @see https://github.com/radix-ui/primitives/blob/main/packages/core/primitive/src/primitive.tsx
 */
export function composeEventHandlers<E extends { defaultPrevented: boolean }>(
  theirHandler: ((event: E) => void) | undefined,
  ourHandler: (event: E) => void,
) {
  return (event: E) => {
    theirHandler?.(event);
    if (!event.defaultPrevented) {
      ourHandler(event);
    }
  };
}
