# K3. Props Drilling 지우기

- 기준: 결합도
- 원문: [Props Drilling 지우기](https://frontend-fundamentals.com/code-quality/code/examples/item-edit-modal.html)

## 묻는 질문

값을 실제로 쓰지 않는 중간 컴포넌트도 그 prop의 변경을 따라가야 하나요?

## 원문 요지

아이템 편집 모달에서 추천 목록 등을 본문이 그대로 리스트로 전달해요. 추천 기능을 지우면 전달만 하는 본문까지 수정해야 해요. 원문은 먼저 `children` 조합으로 중간 의존을 줄이고, 깊고 복잡한 공유가 남으면 Context를 검토해요.

## Before·After 요약 코드

원문의 모달·본문·목록 관계를 축약했어요.

```tsx
// Before: 본문은 추천 목록을 사용하지 않아요.
function EditBody({ recommendations }) {
  return <ResultList recommendations={recommendations} />;
}
<EditBody recommendations={recommendations} />;
```

```tsx
// After: 목록에 필요한 의존은 목록을 조립하는 곳에서 전달해요.
function EditBody({ children }) {
  return <section>{children}</section>;
}
<EditBody>
  <ResultList recommendations={recommendations} />
</EditBody>;
```

## 적용하지 않는 경우

**원문이 명시한 예외**: prop이 중간 컴포넌트의 역할과 의도를 표현한다면 전달 자체가 문제는 아니에요. 모든 값을 Context로 바꾸지 않아요. Context로 옮기면 의존성과 Provider 경계가 덜 보이고, 구독 범위도 고려해야 해요.

## 다른 항목과의 상충

조합은 [R2](r2-abstract-details.md)의 불필요한 중간 추상화를 줄일 수 있지만, 호출부가 복잡해질 수도 있어요. Context는 전달을 줄여도 [P3](p3-expose-hidden-logic.md) 관점에서 감춰진 의존을 늘려요. 공개 props, 조합, Context의 비용을 비교해요.

## React 컴포넌트 props API에 적용

Dialog가 버튼에 쓸 아이콘·크기·문구 prop을 전부 대신 받아 전달하기보다, 사용처가 액션을 조합하게 만들 수 있어요.

```tsx
<Dialog>
  <DialogContent>변경 사항을 저장할까요?</DialogContent>
  <DialogActions>
    <Button onClick={handleSave}>저장</Button>
  </DialogActions>
</Dialog>
```

반면 `Dialog.open`처럼 Dialog 자체의 역할인 상태 prop은 정당해요. 한 단계 전달이나 props 개수만 세어 Context를 도입하지 않아요. 실제로 누가 값을 사용하고, 이름 변경 때 누가 영향받는지 확인해요.
