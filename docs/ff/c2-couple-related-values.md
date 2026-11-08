# C2. 매직 넘버 없애기

- 기준: 응집도
- 원문: [매직 넘버 없애기](https://frontend-fundamentals.com/code-quality/code/examples/magic-number-cohesion.html)

## 묻는 질문

이 값을 고쳤을 때 다른 값을 함께 고치지 않으면 동작이 조용히 깨지나요?

## 원문 요지

좋아요 갱신 전에 애니메이션을 기다리는 시간이 고정돼 있으면, 애니메이션만 길어졌을 때 다음 동작이 먼저 시작될 수 있어요. 원문은 시간에 이름을 붙여 관계를 드러내요. 핵심은 함께 바뀔 코드의 수정 누락이에요.

## Before·After 요약 코드

원문의 고정 대기 사례를 재구성했어요.

```ts
// Before: 무엇을 기다리는지 알 수 없어요.
await sendReaction();
await pause(250);
await reloadReactions();
```

```ts
// After: 원문이 제안하는 수준은 대기 의도에 이름을 붙이는 것이에요.
const REACTION_ANIMATION_MS = 250;
await sendReaction();
await pause(REACTION_ANIMATION_MS);
await reloadReactions();
```

**추가 해석**: 이 변경만으로 CSS와 JS가 자동 동기화되지는 않아요. 같은 토큰을 함께 소비하거나 실제 완료 신호를 기다리면 관계를 더 강하게 묶을 수 있어요. 완료 신호를 쓴다면 취소·모션 감소·미실행 때의 처리도 필요해요.

## 적용하지 않는 경우

값이 같아도 의미가 다르면 묶지 않아요. 스피너 크기와 버튼 간격이 우연히 같은 숫자라는 이유로 한 상수를 쓰면, 독립적인 디자인 변경이 어려워져요.

## 다른 항목과의 상충

[R5](r5-name-magic-numbers.md)는 값의 의미를, 이 항목은 수정 연동을 봐요. 관계를 공유하면 응집도는 높아지지만, 무관한 관계까지 공통화하면 [K2](k2-allow-duplication.md)의 결합도가 커져요.

## React 컴포넌트 props API에 적용

수량 제한과 안내 문구가 반드시 같아야 한다면 하나의 입력에서 계산해요.

```tsx
const limit = 40;
<TextField maxLength={limit} description={`최대 ${limit}자까지 입력해요.`} />;
```

`maxLength`와 `description`은 API 설계 예시예요. 단순히 숫자가 두 번 나온다는 이유가 아니라, 둘이 같은 규칙을 나타내는지 확인해요. 타입·기본값·사용 안내에 연동된 값이 흩어져 있는지도 같은 관점으로 볼 수 있어요.
