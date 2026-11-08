# R8. 왼쪽에서 오른쪽으로 읽히게 하기

- 기준: 가독성
- 원문: [왼쪽에서 오른쪽으로 읽히게 하기](https://frontend-fundamentals.com/code-quality/code/examples/comparison-order.html)

## 묻는 질문

하한부터 값과 상한까지, 범위를 수학적 순서대로 읽을 수 있나요?

## 원문 요지

`value >= min`과 `value <= max`를 이어도 동작은 맞아요. 원문은 하한·값·상한 순서가 드러나는 배치를 권해요. 버그 수정이 아니라 범위 조건을 해석하는 수고를 줄이는 선택이에요.

## Before·After 요약 코드

```ts
// Before: 같은 값에서 비교 방향이 갈라져요.
const inRange = amount >= floor && amount <= ceiling;
```

```ts
// After: floor ≤ amount ≤ ceiling 순서로 읽어요.
const inRange = floor <= amount && amount <= ceiling;
```

JavaScript에서 `floor <= amount <= ceiling`로 합치면 다른 식이 돼요. `&&`를 유지해야 해요.

## 적용하지 않는 경우

서로 다른 값의 독립적인 비교에는 억지로 적용하지 않아요. 프로젝트 린트나 팀이 다른 순서를 정했다면 스타일 규약과 비교해서 선택해요. 한쪽 경계만 검사하는 조건에도 형식만 맞추려고 비교를 추가하지 않아요.

## 다른 항목과의 상충

범위가 업무상 중요한 개념이면 [R4](r4-name-conditions.md)처럼 `isAllowedAmount`라는 이름을 붙일 수 있어요. 반대로 단순한 비교를 여러 함수로 나누면 [R6](r6-reduce-context-switching.md) 관점에서 읽는 거리가 늘어요.

## React 컴포넌트 props API에 적용

숫자 입력의 `min`·`value`·`max`를 검증하는 구현에서 사용할 수 있어요.

```ts
const isWithinBounds = min <= value && value <= max;
```

이건 prop 철자나 JSX 속성 순서를 정하는 기준이 아니에요. 상한 포함 여부, `min > max`, 빈 값 처리 같은 동작 계약은 별도로 정해야 해요. JSX에 `min`, `value`, `max` 순서로 적었다고 검증이 생기지는 않아요.
