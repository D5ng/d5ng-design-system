# R7. 삼항 연산자 단순하게 하기

- 기준: 가독성
- 원문: [삼항 연산자 단순하게 하기](https://frontend-fundamentals.com/code-quality/code/examples/ternary-operator.html)

## 묻는 질문

중첩된 조건의 우선순위와 각 결과를 눈으로 쉽게 구분할 수 있나요?

## 원문 요지

두 조건의 네 가지 조합을 중첩 삼항으로 계산하면 결과를 따라가기 어려워요. 원문은 즉시 실행 함수 안의 순차적인 `if`와 반환으로 분기를 펼쳐요. 줄 수보다 판단 순서가 잘 보이는지가 핵심이에요.

## Before·After 요약 코드

원문의 두 조건 조합 사례를 글 작성 상태로 재구성했어요. 같은 조건을 여러 번 다시 계산하는 중첩이 문제예요.

```ts
// Before: hasTitle을 세 번 읽어야 네 결과가 어디서 나오는지 알 수 있어요.
const caption =
  hasTitle && hasBody
    ? "완성"
    : hasTitle || hasBody
      ? hasTitle
        ? "본문 없음"
        : "제목 없음"
      : "빈 글";
```

```ts
// After: 위에서부터 한 번씩만 판단해요.
const caption = (() => {
  if (hasTitle && hasBody) return "완성";
  if (hasTitle) return "본문 없음";
  if (hasBody) return "제목 없음";
  return "빈 글";
})();
```

## 적용하지 않는 경우

`expanded ? "접기" : "펼치기"`처럼 조건과 양쪽 결과가 짧으면 그대로 읽기 쉬워요. 단순한 삼항까지 함수로 옮기는 건 취향에 가까워요. 표현식을 바꿀 때는 기존 분기 우선순위를 보존해요.

## 다른 항목과의 상충

[R4](r4-name-conditions.md)는 복잡한 조건에 뜻을 붙이고, 이 항목은 결과를 선택하는 구조를 펼쳐요. 별도 함수로 멀리 빼면 [R6](r6-reduce-context-switching.md) 비용이 생겨요. 사용처 가까운 `if`만으로 해결할 수 있어요.

## React 컴포넌트 props API에 적용

props 조합에 따른 우선순위를 먼저 정해요. 예를 들어 `disabled`와 `loading`을 함께 받을 수 있다면 포커스·표시·클릭의 결과를 계약으로 설명해야 해요. 구현에서 삼항을 푸는 것만으로 API 모호함이 사라지지는 않아요.

모든 상태가 상호 배타적인 작업 결과라면 다음과 같은 enum도 선택지예요.

```ts
type RequestStatus = "idle" | "pending" | "failed" | "done";
```

원문이 boolean이나 enum 중 하나를 정답으로 정한 것은 아니에요.
