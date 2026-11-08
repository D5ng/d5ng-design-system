# R1. 같이 실행되지 않는 코드 분리하기

- 기준: 가독성
- 원문: [같이 실행되지 않는 코드 분리하기](https://frontend-fundamentals.com/code-quality/code/examples/submit-button.html)

## 묻는 질문

한 실행에서는 필요 없는 다른 역할의 조건과 효과까지 함께 읽어야 하나요?

## 원문 요지

권한에 따라 버튼 모양과 애니메이션이 달라지는데, 같은 권한 검사가 effect와 JSX에 흩어져 있어요. 역할별 컴포넌트로 나누면 선택하는 곳과 각 역할의 구현을 따로 읽을 수 있어요.

## Before·After 요약 코드

원문의 권한별 버튼 사례를 재구성했어요. `canEdit`은 부모가 결정한 권한이에요.

```tsx
// Before: 편집 가능한 경우의 효과와 읽기 전용 UI가 섞여 있어요.
function SubmitAction({ canEdit }) {
  useEffect(() => {
    if (canEdit) playEntrance();
  }, [canEdit]);
  return canEdit ? <button type="submit">전송</button> : <span>읽기 전용</span>;
}
```

```tsx
// After: 분기는 경계에서, 효과는 그 역할 안에서 관리해요.
function SubmitAction({ canEdit }) {
  return canEdit ? <EditableSubmit /> : <span>읽기 전용</span>;
}

function EditableSubmit() {
  useEffect(() => {
    playEntrance();
  }, []);
  return <button type="submit">전송</button>;
}
```

## 적용하지 않는 경우

색이나 짧은 문구만 다른 두 갈래까지 컴포넌트로 나누지는 않아요. 공통 동작이 대부분이라면 분리 때문에 수정할 곳만 늘어날 수 있어요. 분리하면서 마운트·언마운트가 달라지므로 effect와 지역 상태의 생명주기도 확인해요.

## 다른 항목과의 상충

[K2](k2-allow-duplication.md)는 독립적으로 바뀔 코드의 중복을 허용하지만, 항상 함께 바뀌는 규칙까지 복제하면 [C2](c2-couple-related-values.md)에 어긋나요. 역할별 흐름은 나누고, 공통 규칙은 유지해요.

## React 컴포넌트 props API에 적용

`Button`에 `action="invite"`와 `role="viewer"`를 넣어 업무 흐름까지 처리하기보다, 업무용 `InviteAction`에서 권한을 판단하고 `Button`에는 `disabled` 등을 전달할 수 있어요.

이 기준만으로 모든 `variant`를 별도 컴포넌트로 쪼갤 필요는 없어요. `asChild`도 분기가 있다는 이유만으로 분리하지 않아요. 서로 다른 모드가 독립된 상태·효과·필수 props를 갖는지부터 확인해요.
