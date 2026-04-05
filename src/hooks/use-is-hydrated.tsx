import { useSyncExternalStore } from "react"

// NOTE: 외부에서 상태를 구독할 필요가 없기에, 빈 함수로 작성
const subscribe = () => () => {}

/**
 * @description 호스트(브라우저 및 서버) 환경에 따라 렌더링 결과의 일관성을 보장하기 위한 훅
 */
export function useIsHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )
}
