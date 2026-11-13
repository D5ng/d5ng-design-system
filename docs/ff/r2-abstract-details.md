# R2. 구현 상세 추상화하기

- 기준: 가독성
- 원문: [구현 상세 추상화하기](https://frontend-fundamentals.com/code-quality/code/examples/login-start-page.html)

## 묻는 질문

이 컴포넌트의 목적을 이해하려고 인증 확인이나 확인창 조립 절차까지 읽어야 하나요?

## 원문 요지

로그인 시작 페이지에서 이미 로그인한 사용자를 이동시키는 절차를 Wrapper나 HOC로 옮겨요. 초대 페이지의 확인창과 클릭 처리도 전용 버튼에 모아요. 페이지가 다루는 맥락을 줄이면서 트리거와 동작을 가깝게 두는 방식이에요.

## Before·After 요약 코드

원문의 초대 사례를 축약했어요. 확인창 자체의 구성은 `askInvitation`으로 생략했어요.

```tsx
// Before: 페이지가 초대 확인과 실행 절차까지 알아요.
function PeoplePage({ person }) {
  const handleInvite = async () => {
    if (await askInvitation(person.name)) await deliverInvite(person.id);
  };
  return <button onClick={handleInvite}>초대</button>;
}
```

```tsx
// After: 페이지에서는 필요한 행동만 읽어요.
function PeoplePage({ person }) {
  return <InviteAction person={person} />;
}

function InviteAction({ person }) {
  const handleInvite = async () => {
    if (await askInvitation(person.name)) await deliverInvite(person.id);
  };
  return <button onClick={handleInvite}>초대</button>;
}
```

## 적용하지 않는 경우

한두 줄의 핵심 동작을 뜻이 모호한 `process()` 뒤로 숨기는 건 도움이 되지 않아요. 원문의 맥락 개수 설명도 자동 분리 임계값으로 사용하지 않아요. 분리한 이름만 보고 목적이 전달되는지 확인해요.

## 다른 항목과의 상충

추상화를 늘리면 [R6](r6-reduce-context-switching.md)의 시점 이동이 늘어요. 또 `InviteAction`이라는 이름에서는 초대를 예상할 수 있지만, 평범한 `Button`이 몰래 초대를 전송하면 [P3](p3-expose-hidden-logic.md) 문제가 돼요. 역할과 이름을 함께 정해요.

## React 컴포넌트 props API에 적용

범용 버튼의 공개 API는 `onClick`, `loading`, `children`처럼 버튼의 계약에 집중해요. 초대 대상, 확인창, 전송 API는 `InviteAction`이 소유할 수 있어요.

```tsx
<InviteAction person={person} />;
// InviteAction 내부에서 사용하는 범용 버튼
<Button loading={sending} onClick={handleInvite}>
  초대
</Button>;
```

구현 상세를 감추되, 요청 실패·완료를 누가 처리하는지는 업무 컴포넌트의 계약에 남겨요.
