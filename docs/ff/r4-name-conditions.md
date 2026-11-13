# R4. 복잡한 조건에 이름 붙이기

- 기준: 가독성
- 원문: [복잡한 조건에 이름 붙이기](https://frontend-fundamentals.com/code-quality/code/examples/condition-name.html)

## 묻는 질문

조건이 뜻하는 판단을 알기 위해 중첩된 비교식을 매번 해석하나요?

## 원문 요지

카테고리와 가격을 여러 `some` 안에서 비교하면 판단의 목적이 묻혀요. 부분 조건에 이름을 붙여서 최종 판단을 읽게 해요. 원문은 복잡성·재사용·독립 테스트를 분리의 근거로 들고, 단순한 일회성 식은 그대로 두어도 된다고 설명해요.

## Before·After 요약 코드

원문의 상품 필터링 구조를 재구성했어요.

```ts
// Before
const matches = products.filter(
  (p) =>
    p.categories.some((c) => c.id === selectedId) &&
    p.prices.some((price) => lower <= price && price <= upper),
);
```

```ts
// After
const matches = products.filter((p) => {
  const belongsToCategory = p.categories.some((c) => c.id === selectedId);
  const hasPriceInRange = p.prices.some(
    (price) => lower <= price && price <= upper,
  );
  return belongsToCategory && hasPriceInRange;
});
```

## 적용하지 않는 경우

**원문이 명시한 예외**: 간단한 식이나 복잡하지 않은 일회성 로직은 익명 함수 안에 두어도 돼요. `!disabled`를 `isNotDisabled`로 다시 쓰는 것처럼 이름이 표현을 반복하기만 한다면 이득이 작아요.

## 다른 항목과의 상충

의미 있는 이름은 [R7](r7-simplify-ternaries.md)의 분기 구조도 읽기 쉽게 해요. 하지만 모든 조건을 멀리 있는 함수로 빼면 [R6](r6-reduce-context-switching.md)의 시점 이동이 늘어요. 지역 변수만으로도 충분할 수 있어요.

## React 컴포넌트 props API에 적용

props에는 구현 조건의 조각보다 컴포넌트가 받는 의미를 전달해요.

```tsx
const canSubmit = hasChanges && isValid && !saving;
<Button disabled={!canSubmit} loading={saving}>
  저장
</Button>;
```

`canSubmit`은 사용처의 업무 판단이고, 버튼은 `disabled`·`loading`의 동작을 책임져요. 부정이 겹치는 `disablePreventClick` 같은 옵션은 의미가 바로 읽히는지 다시 검토해요.
