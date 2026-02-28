import type { Ref } from "react"

type PossibleRef<T> = Ref<T> | undefined

/**
 * Ref(Callback, Object)를 할당하는 유틸리티 함수
 * 이 함수는 사용자가 어떠한 Ref 형태와 상관없이 참조 값을 동기화할 수 있도록 합니다.
 *
 * @why React의 Ref는 Callback, Object 두 가지를 지원하고 있기 때문입니다.
 *
 * @param ref - 할당 대상이 되는 Ref
 * @param value - Ref에 저장할 실제 값
 * @see {@link https://ko.react.dev/learn/manipulating-the-dom-with-refs React 공식 문서: Ref로 DOM 조작하기}
 */
function setRef<T>(ref: PossibleRef<T>, value: T) {
  if (typeof ref === "function") {
    ref(value)
  } else if (ref !== null && ref !== undefined) {
    ref.current = value
  }
}

/**
 * 여러 개의 ref를 결합하는 유틸리티 함수
 * @param refs - 결합할 ref 목록
 * @returns ref를 결합하는 callback 함수
 *
 * @see {@link https://github.com/radix-ui/primitives/blob/main/packages/react/compose-refs/src/compose-refs.tsx Radix UI의 composeRefs 참조}
 */
export function composeRefs<T>(...refs: PossibleRef<T>[]) {
  return (node: T) => refs.forEach((ref) => setRef(ref, node))
}
