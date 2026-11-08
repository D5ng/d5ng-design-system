# C3. 폼의 응집도 생각하기

- 기준: 응집도
- 원문: [폼의 응집도 생각하기](https://frontend-fundamentals.com/code-quality/code/examples/form-fields.html)

## 묻는 질문

요구사항이 바뀌는 단위는 독립된 필드인가요, 서로 연결된 폼 전체인가요?

## 원문 요지

독립 검증·비동기 검증·필드 재사용은 필드 단위로 묶기 좋아요. 결제·배송·단계별 입력·필드 간 비교는 폼 전체로 묶기 좋아요. 원문은 두 방식 모두 제시하며, 폼 전체 응집이 필드 간 결합을 높일 수 있다고 설명해요.

## Before·After 요약 코드

원문에는 일방적인 Before·After가 없어요. 아래는 필드별 검증에서 **상호 의존하는 규칙이 생겼을 때** 폼 검증으로 옮기는 재구성이에요. `validEmail`은 생략한 검증 함수예요.

```ts
// Before: 독립 필드라면 이 방식도 적절해요.
const fieldChecks = {
  email: (value: string) => validEmail(value),
  confirmEmail: (value: string) => validEmail(value),
};
```

```ts
// After: 확인 이메일의 일치 여부가 필요해지면 폼 값들을 함께 검증해요.
function checkSignup(values: { email: string; confirmEmail: string }) {
  return {
    email: validEmail(values.email),
    confirmEmail:
      validEmail(values.confirmEmail) && values.email === values.confirmEmail,
  };
}
```

## 적용하지 않는 경우

**원문의 선택 기준**: 필드마다 독립적으로 재사용한다면 폼 스키마 하나로 몰지 않아요. 반대로 비밀번호 확인처럼 상호 의존하면 무조건 필드별로 분리하지 않아요. 폼이 없는 버튼 자체에는 검증 구조를 적용할 대상이 없어요.

## 다른 항목과의 상충

[K1](k1-limit-responsibility.md)처럼 영향 범위를 줄이려다 연관 검증을 흩뜨릴 수 있어요. [R3](r3-split-by-responsibility.md)의 분리 단위도 필드 개수가 아니라 책임이에요. 이 경우에는 한 폼의 완결된 검증이 하나의 책임일 수 있어요.

## React 컴포넌트 props API에 적용

범용 입력 UI는 값·변경 이벤트·오류 표시를 받고, 업무상 검증은 필드 래퍼나 폼이 소유하도록 선택할 수 있어요.

```tsx
<TextField
  value={email}
  onValueChange={setEmail}
  invalid={Boolean(emailError)}
  errorMessage={emailError}
/>
```

범용 입력에 `otherFieldValue`나 `signupStep`을 계속 추가하기 전에 검증을 어느 단위가 책임지는지 정해요. 폼 라이브러리 어댑터와 기본 입력을 나누는 것도 선택지예요.
