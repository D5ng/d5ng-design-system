# R3. 로직 종류에 따라 합쳐진 함수 쪼개기

- 기준: 가독성
- 원문: [로직 종류에 따라 합쳐진 함수 쪼개기](https://frontend-fundamentals.com/code-quality/code/examples/use-page-state-readability.html)

## 묻는 질문

같은 기술로 구현했다는 이유로, 함께 이해할 필요 없는 상태를 한 함수에 모았나요?

## 원문 요지

카드·명세서·기간·상태 필터를 모두 관리하는 `usePageState`는 새 쿼리 파라미터가 생길 때마다 커질 수 있어요. 필요한 쿼리별 훅으로 나누면 이름과 읽어야 할 구현이 구체적이 돼요. 원문은 넓은 상태 구독에 따른 재렌더링도 설명해요.

## Before·After 요약 코드

원문의 URL 상태 사례를 축약했어요. 훅의 실제 라이브러리 문법은 생략했어요.

```tsx
// Before: 카드 선택을 읽으려 해도 페이지 전체 계약을 만나게 돼요.
const page = usePageState();
const selectedCard = page.values.cardId;
page.controls.setCardId(nextCardId);
```

```tsx
// After: 카드 선택이라는 책임에 이름을 붙여요.
function useSelectedCardId() {
  return useQueryParam("cardId", NumberParam);
}

const [selectedCard, setSelectedCard] = useSelectedCardId();
setSelectedCard(nextCardId);
```

## 적용하지 않는 경우

기간의 시작·종료처럼 함께 검증하고 갱신해야 하는 값은 하나의 책임일 수 있어요. 파라미터 하나당 훅 하나를 기계적으로 만들지 않아요. 훅을 나눴다고 렌더링이 반드시 줄어들지도 않아요. 실제 구독 방식과 부모 렌더링을 봐야 해요.

## 다른 항목과의 상충

[K1](k1-limit-responsibility.md)은 같은 사례의 변경 영향 범위를 봐요. 이 항목은 읽는 맥락을 봐요. 분리로 함께 갱신할 규칙이 흩어지면 [C3](c3-form-cohesion.md)의 변경 단위와 충돌할 수 있어요.

## React 컴포넌트 props API에 적용

`<Toolbar pageState={page} />`처럼 큰 객체를 통째로 넘기면 실제 필요한 값이 가려져요. 카드 선택 UI라면 사용하는 값과 변경 요청만 드러낼 수 있어요.

```tsx
<CardPicker selectedId={selectedCard} onSelectionChange={setSelectedCard} />
```

다만 props 개수가 적다는 이유만으로 항상 좋은 API는 아니에요. `state`와 `actions` 두 객체에 모든 책임을 숨겼다면 읽을 맥락은 그대로예요.
