/**
 * `aria-describedby`처럼 id 여럿을 받는 속성 값을 만들어요. 빈 id는 빼고, 남는 게 없으면 `undefined`라서 속성이 붙지 않아요.
 */
export function joinIds(...ids: (string | undefined)[]) {
  return ids.filter(Boolean).join(" ") || undefined;
}
