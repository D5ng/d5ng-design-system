# K1. 책임을 하나씩 관리하기

- 기준: 결합도
- 원문: [책임을 하나씩 관리하기](https://frontend-fundamentals.com/code-quality/code/examples/use-page-state-coupling.html)

## 묻는 질문

하나의 기능을 수정했을 때, 그 기능을 쓰지 않는 사용처까지 다시 확인해야 하나요?

## 원문 요지

페이지의 모든 URL 상태를 한 훅이 관리하면 카드만 쓰는 컴포넌트도 큰 계약에 의존해요. 쿼리별 책임을 나누어 수정 영향 범위를 좁혀요. 가독성 항목의 같은 사례와 달리, 여기서는 사용처 간 의존과 변경 파급을 중심으로 봐요.

## Before·After 요약 코드

원문의 큰 페이지 훅을 사용하는 두 UI를 재구성했어요.

```tsx
// Before: 서로 다른 UI가 같은 큰 훅의 계약에 의존해요.
function CardPanel() {
  const { values } = usePageState();
  return <Card id={values.cardId} />;
}
function StatusPanel() {
  const { values } = usePageState();
  return <StatusList value={values.statusList} />;
}
```

```tsx
// After: 각 UI가 필요한 책임에만 의존해요.
function CardPanel() {
  const [cardId] = useSelectedCardId();
  return <Card id={cardId} />;
}
function StatusPanel() {
  const [statuses] = useStatusFilter();
  return <StatusList value={statuses} />;
}
```

## 적용하지 않는 경우

원자적으로 함께 갱신해야 하는 상태를 무조건 나누지 않아요. 조회 조건을 바꿀 때 페이지 번호도 초기화해야 한다면, 그 전환을 조합하는 책임은 남아 있어야 해요. 함수나 prop이 여러 개라는 사실만으로 책임이 여러 개라고 단정할 수는 없어요.

## 다른 항목과의 상충

[R3](r3-split-by-responsibility.md)은 같은 훅을 읽는 비용을 다뤄요. [C3](c3-form-cohesion.md)처럼 함께 바꿔야 하는 규칙을 쪼개면 영향 범위는 작아 보여도 수정 누락이 생겨요. 독립적으로 바뀌는지를 먼저 확인해요.

## React 컴포넌트 props API에 적용

디자인 시스템 버튼에 저장 요청·캐시 무효화·라우팅을 넣으면 버튼 변경이 앱 업무까지 영향을 줘요. 범용 버튼은 표시와 상호작용 계약을 맡고, 저장 흐름은 업무 컴포넌트에서 조합할 수 있어요.

```tsx
<Button loading={saving} onClick={handleSave}>
  저장
</Button>
```

이때 `loading`에 필요한 클릭 차단이나 ARIA 상태는 버튼의 책임일 수 있어요. 효과가 있다는 이유만으로 전부 밖으로 옮기는 것이 아니라, 그 효과가 이 컴포넌트의 약속에 속하는지 봐요.
