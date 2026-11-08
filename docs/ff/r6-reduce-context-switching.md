# R6. 시점 이동 줄이기

- 기준: 가독성
- 원문: [시점 이동 줄이기](https://frontend-fundamentals.com/code-quality/code/examples/user-policy.html)

## 묻는 질문

이 버튼이 비활성화되는 이유 하나를 알려고 몇 개의 정의를 따라가야 하나요?

## 원문 요지

단순한 권한 규칙이 정책표·해석 함수·컴포넌트로 나뉘어 있으면 읽는 흐름이 끊겨요. 역할별 UI를 펼치거나 컴포넌트 안의 작은 객체로 조건을 모아요. 원문도 권한 체계가 복잡하다면 정책 추상화가 유용하다고 인정해요.

## Before·After 요약 코드

원문의 초대·조회 권한 중 초대 조건만 축약했어요.

```tsx
// Before: 사용처 → 해석 함수 → 정책표를 찾아가요.
const permissions = resolvePermissions(role);
<button disabled={!permissions.invite}>초대</button>;
// resolvePermissions는 다른 곳의 ROLE_ACTIONS를 해석해요.
```

```tsx
// After: 작은 정책은 읽는 곳에 드러내요.
const permissions = {
  admin: { invite: true },
  viewer: { invite: false },
}[role];
<button disabled={!permissions.invite}>초대</button>;
```

## 적용하지 않는 경우

**원문이 명시한 예외**: 권한 체계가 복잡하면 공통 정책표가 도움이 돼요. 여러 화면에서 같은 정책을 보장해야 한다면 화면마다 펼쳐 쓰지 않아요. 이동 횟수 자체보다, 이동한 정의가 새 맥락을 얼마나 요구하는지가 중요해요.

## 다른 항목과의 상충

[R2](r2-abstract-details.md)는 상세를 숨겨 맥락을 줄여요. 반면 여기서는 단순한 규칙을 펼쳐 읽는 거리를 줄여요. 이름만으로 충분한 상세는 숨기고, 지금 확인해야 하는 정책은 가까이 둬요. 반복된 정책을 따로 고치면 [C2](c2-couple-related-values.md) 위험이 생겨요.

## React 컴포넌트 props API에 적용

`config.behavior.interaction.blocked`처럼 여러 계층을 알아야 하는 입력보다, 버튼의 상태를 직접 나타내는 prop이 읽기 쉬울 수 있어요.

```tsx
<Button disabled={readOnly} loading={saving}>
  저장
</Button>
```

이유를 UI 근처에서 파악하되, `readOnly`를 결정하는 복잡한 권한 정책까지 버튼에 복제하지 않아요. 원문이 객체 prop 자체를 금지하는 건 아니에요.
