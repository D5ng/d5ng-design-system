# K2. 중복 코드 허용하기

- 기준: 결합도
- 원문: [중복 코드 허용하기](https://frontend-fundamentals.com/code-quality/code/examples/use-bottom-sheet.html)

## 묻는 질문

닮은 코드가 실제로 같은 정책인가요? 앞으로도 함께 바뀌어야 하나요?

## 원문 요지

점검 바텀시트 열기·로그·화면 닫기를 공통 훅으로 묶었어요. 화면마다 로그나 닫기 정책이 달라지면 옵션이 늘고 모든 사용처를 확인해야 해요. 원문은 동작·모양·향후 방향이 같은지 확인한 뒤 공통화하거나 중복을 허용하라고 설명해요.

## Before·After 요약 코드

원문은 완성된 After 코드 대신 선택 기준을 제시해요. 아래 After는 그 기준을 적용한 재구성이에요.

```ts
// Before: 공통 함수가 화면 종료까지 결정해요.
async function showMaintenance(info) {
  const choice = await openMaintenanceSheet(info);
  recordChoice(choice);
  closeCurrentScreen();
}
```

```ts
// After: 공유 가능한 UI만 공유하고, 흐름은 사용처가 선택해요.
// 화면 A
const answer = await openMaintenanceSheet(info);
recordChoice(answer);
closeCurrentScreen();

// 화면 B: 이 화면은 유지해요.
await openMaintenanceSheet(info);
```

## 적용하지 않는 경우

**원문이 명시한 경계**: 동작과 모양이 같고 계속 같을 예정이라면 공통화가 좋아요. 반대로 향후 요구사항을 모른다고 항상 복제할 필요도 없어요. 한쪽만 고치면 오류가 나는 동일한 규칙은 공유를 우선 검토해요.

## 다른 항목과의 상충

중복은 영향 범위를 줄이지만 [C2](c2-couple-related-values.md)의 동기화 누락을 만들 수 있어요. 공유로 줄어드는 수정 누락과 늘어나는 사용처 검증 비용을 비교해요. 미래를 단정하지 말고 현재 사용처와 예상 변경을 확인해요.

## React 컴포넌트 props API에 적용

한 화면의 예외를 지원하려고 범용 컴포넌트에 `closeAfterConfirm`, `skipTracking` 같은 옵션이 계속 붙으면 업무 래퍼를 나눌 시점일 수 있어요.

Button과 IconButton도 색이 같다는 이유만으로 내부 recipe 전체를 반드시 공유할 필요는 없어요. 공통 상태 색은 공유해도 크기·문구·접근 가능한 이름의 계약은 따로 둘 수 있어요. `variant`가 늘었다는 사실만으로 나쁜 공통화라고 판단하지는 않아요.
