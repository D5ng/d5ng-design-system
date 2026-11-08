# P3. 숨은 로직 드러내기

- 기준: 예측 가능성
- 원문: [숨은 로직 드러내기](https://frontend-fundamentals.com/code-quality/code/examples/hidden-logic.html)

## 묻는 질문

이름과 입력·출력 계약으로 예상하지 못한 부수 효과가 내부에서 실행되나요?

## 원문 요지

잔액 조회 함수에 분석 로그 전송이 들어 있으면 원치 않는 곳에서도 로그가 나가요. 로그 실패가 조회 실패로 이어질 수도 있어요. 원문은 조회에는 조회만 남기고, 로그를 남길 호출부에서 두 동작을 조합해요.

## Before·After 요약 코드

원문의 조회·로깅 사례를 재구성했어요.

```ts
// Before
async function loadSummary() {
  const summary = await api.readSummary();
  analytics.record("summary_loaded");
  return summary;
}
```

```ts
// After
async function loadSummary() {
  return api.readSummary();
}

const summary = await loadSummary();
analytics.record("summary_loaded");
renderSummary(summary);
```

로그를 옮겼어도 호출부의 실패 처리 정책은 따로 필요해요. 분리는 두 작업의 책임을 드러낼 뿐이에요.

## 적용하지 않는 경우

`trackPurchase()`처럼 부수 효과가 함수의 약속 자체라면 제거할 이유가 없어요. 모든 부수 효과를 최상위 페이지로 옮기라는 뜻도 아니에요. 그 효과를 책임지는 단위와 계약을 찾는 게 목적이에요.

## 다른 항목과의 상충

[R2](r2-abstract-details.md)처럼 상세를 숨기면 읽기는 쉬워지지만, 예기치 않은 효과까지 숨겨서는 안 돼요. `InviteAction`처럼 행동을 설명하는 추상화는 둘을 만족시킬 수 있어요. 무관한 효과를 묶으면 [K1](k1-limit-responsibility.md)의 영향 범위도 커져요.

## React 컴포넌트 props API에 적용

범용 `Button`이 자동으로 분석 이벤트를 전송하거나, 성공 후 이동하면 사용처가 예상하기 어려워요. 업무용 컴포넌트나 명시적 콜백에서 조합해요.

```tsx
<Button loading={saving} onClick={handleSave}>
  저장
</Button>
```

`loading`에 클릭 차단을 포함하는 선택도 가능해요. 다만 클릭 차단·포커스 유지·콜백 호출 여부를 타입 문서, 스토리, 동작 테스트로 약속해야 해요. 이름이나 JSDoc 하나만으로 그 선택이 자동 정당화되지는 않아요.
