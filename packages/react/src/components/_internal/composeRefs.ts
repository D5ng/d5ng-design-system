import { type Ref, type RefCallback, useMemo } from "react";

type PossibleRef<T> = Ref<T> | undefined;

/**
 * 여러 ref에 같은 요소를 넣는 ref 하나를 만들어요. 쓰는 쪽 ref와 우리가 요소를 읽을 ref를 함께 붙일 때 써요.
 *
 * React 19처럼 ref 함수가 정리 함수를 돌려주면, 떨어질 때 그것을 부르고 나머지 ref는 `null`로 비워요.
 * @see https://github.com/radix-ui/primitives/blob/main/packages/react/compose-refs/src/compose-refs.tsx
 */
export function composeRefs<T>(...refs: PossibleRef<T>[]): RefCallback<T> {
  return (node) => {
    const cleanups = refs.map((ref) => setRef(ref, node));
    if (!cleanups.some((cleanup) => typeof cleanup === "function")) {
      return;
    }

    // 정리 함수를 하나라도 돌려주면 React가 null로 다시 부르지 않아서, 나머지도 여기서 비워요.
    return () => {
      cleanups.forEach((cleanup, index) => {
        if (typeof cleanup === "function") {
          cleanup();
        } else {
          setRef(refs[index], null);
        }
      });
    };
  };
}

/**
 * 쓰는 쪽 ref와 우리 ref를 합친 `composeRefs`를 기억해요. 렌더마다 새 ref면 React가 매번 떼었다가 다시 붙여요.
 *
 * Radix는 ref를 몇 개든 받지만, 의존성 목록을 lint가 읽을 수 있게 두 개로 정했어요.
 */
export function useComposedRefs<T>(
  theirRef: PossibleRef<T>,
  ourRef: PossibleRef<T>,
) {
  return useMemo(() => composeRefs(theirRef, ourRef), [theirRef, ourRef]);
}

function setRef<T>(ref: PossibleRef<T>, value: T | null) {
  if (typeof ref === "function") {
    return ref(value);
  }
  if (ref !== null && ref !== undefined) {
    ref.current = value;
  }
  return undefined;
}
