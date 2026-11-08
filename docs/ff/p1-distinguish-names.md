# P1. 이름 겹치지 않게 관리하기

- 기준: 예측 가능성
- 원문: [이름 겹치지 않게 관리하기](https://frontend-fundamentals.com/code-quality/code/examples/http.html)

## 묻는 질문

익숙한 API와 이름이 같은데, 그 이름으로 예상하지 못한 동작이 더해졌나요?

## 원문 요지

HTTP 라이브러리를 감싼 모듈이 원래 이름을 유지한 채 토큰 조회를 추가해요. 호출자는 일반 조회로 생각할 수 있어요. 원문은 서비스용 모듈과 인증된 요청임을 구분하는 이름으로 추가 동작을 드러내요.

## Before·After 요약 코드

원문의 인증 래퍼 구조를 재구성했어요.

```ts
// Before: 이름만으로는 인증 준비가 보이지 않아요.
const request = {
  read: async (path) => transport.read(path, await createAuthHeaders()),
};
```

```ts
// After: 추가된 계약이 이름에 나타나요.
const authenticatedRequest = {
  readWithCredentials: async (path) =>
    transport.read(path, await createAuthHeaders()),
};
```

## 적용하지 않는 경우

같은 동작을 그대로 재노출한다면 이름을 바꿀 필요는 없어요. 서로 다른 영역에서 같은 일반 명사를 쓰는 것도 자동으로 잘못은 아니에요. 실제 사용자에게 기존 API와 혼동할 맥락이 있는지 확인해요.

## 다른 항목과의 상충

[P3](p3-expose-hidden-logic.md)는 이름에 없는 동작 자체를 분리할지도 물어요. 추가 동작이 핵심 책임이면 이름으로 드러낼 수 있지만, 이름을 길게 늘여 독립된 책임을 모두 묶는 건 [K1](k1-limit-responsibility.md)과 충돌해요.

## React 컴포넌트 props API에 적용

`disabled`로 네이티브 버튼을 감싼다면 클릭과 포커스에 대한 플랫폼 기대를 검토해요. 색만 흐리게 바꾸는 동작을 같은 이름으로 제공하면 오해하기 쉬워요.

반대로 `state`라는 이름이 React의 상태와 같다는 이유만으로 나쁜 API라고 단정할 수는 없어요. 의미와 값, 상태 소유자를 문서화하면 유효한 설계가 될 수 있어요.

```ts
type ButtonProps = {
  /** 기본은 button이며, 폼 제출에는 submit을 지정해요. */
  type?: "button" | "submit" | "reset";
};
```

플랫폼과 다른 기본값을 선택한다면 이름을 새로 만들기 전에 차이를 문서와 예제로 드러내는 방법도 있어요.
