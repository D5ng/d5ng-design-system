# P2. 같은 종류의 함수는 반환 타입 통일하기

- 기준: 예측 가능성
- 원문: [같은 종류의 함수는 반환 타입 통일하기](https://frontend-fundamentals.com/code-quality/code/examples/use-user.html)

## 묻는 질문

비슷한 함수를 사용할 때마다 결과를 해석하는 방법을 다시 확인해야 하나요?

## 원문 요지

서버 조회 훅이 어떤 것은 Query 결과, 어떤 것은 데이터만 반환하면 사용법이 달라져요. 검증 함수도 boolean과 결과 객체가 섞이면 실수하기 쉬워요. 원문은 반환 형태를 통일하고, 성공 여부로 구별하는 유니온도 소개해요.

## Before·After 요약 코드

원문의 두 검증 함수 사례를 타입 계약 중심으로 축약했어요.

```ts
// Before: 두 번째 결과 객체는 실패해도 truthy예요.
declare function validateTitle(value: string): boolean;
declare function validateQuantity(value: number): { ok: boolean };
if (validateQuantity(0)) accept();
```

```ts
// After: 같은 종류의 검증 결과를 같은 방식으로 다뤄요.
type Check = { ok: true } | { ok: false; reason: string };
declare function validateTitle(value: string): Check;
declare function validateQuantity(value: number): Check;
const result = validateQuantity(0);
if (!result.ok) showError(result.reason);
```

## 적용하지 않는 경우

`isValid(): boolean`과 `validate(): Check`처럼 목적과 이름이 구분된 API를 억지로 통일하지 않아요. 같은 종류인지가 먼저예요. 모든 함수를 객체 반환으로 만들라는 뜻도 아니에요.

## 다른 항목과의 상충

[P1](p1-distinguish-names.md)처럼 이름으로 역할 차이를 드러낼 수도 있어요. 일관성을 이유로 서로 다른 결과에 거대한 공통 타입을 강제하면 [K2](k2-allow-duplication.md)의 불필요한 결합이 생겨요.

## React 컴포넌트 props API에 적용

직접적인 적용 대상은 컴포넌트와 함께 제공하는 훅·검증 콜백이에요.

```ts
type TextFieldProps = { validate?: (text: string) => Check };
type NumberFieldProps = { validate?: (number: number) => Check };
```

형제 컴포넌트의 이벤트 인자 형태를 맞추는 것도 같은 관점의 확장이에요. 다만 원문의 초점은 **함수 반환 타입**이에요. 이 항목만으로 `loading`·`disabled`가 반드시 boolean이어야 한다거나 `state` enum이 틀렸다고 결론 내릴 수는 없어요. 상태의 독립성·배타성은 별도 설계 판단이에요.
