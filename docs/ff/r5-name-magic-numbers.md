# R5. 매직 넘버에 이름 붙이기

- 기준: 가독성
- 원문: [매직 넘버에 이름 붙이기](https://frontend-fundamentals.com/code-quality/code/examples/magic-number-readability.html)

## 묻는 질문

이 숫자의 목적과 단위를 작성자 외의 사람도 알 수 있나요?

## 원문 요지

좋아요 요청 뒤의 대기 시간만 보면 애니메이션을 기다리는지 서버 반영을 기다리는지 알 수 없어요. 용도와 단위를 나타내는 상수로 의도를 드러내요. 같은 예시의 연동 위험은 별도의 응집도 글에서 다뤄요.

## Before·After 요약 코드

원문은 좋아요 갱신 사례예요. 아래는 같은 문제를 알림 표시 시간으로 바꾼 예시예요.

```ts
// Before
showNotice();
await pause(250);
refreshSummary();
```

```ts
// After
const NOTICE_ENTER_DURATION_MS = 250;
showNotice();
await pause(NOTICE_ENTER_DURATION_MS);
refreshSummary();
```

이름을 붙이는 건 대기 이유를 드러낼 뿐이에요. 실제로 애니메이션 완료를 정확히 기다리는지는 따로 확인해야 해요.

## 적용하지 않는 경우

모든 숫자에 상수가 필요한 건 아니에요. `index + 1`이나 `slice(0, 1)`은 주변 코드만으로 뜻이 분명할 수 있어요. 객체 키가 이미 의미를 설명하는 값까지 멀리 있는 상수로 옮기면 읽기 어려워져요.

## 다른 항목과의 상충

[C2](c2-couple-related-values.md)는 같은 시간이 여러 곳에서 함께 바뀌는지 확인해요. 이 항목은 숫자 하나의 의미를 확인해요. 이름을 붙여도 CSS와 JS의 별도 숫자가 자동으로 동기화되지는 않아요. 반대로 무관한 같은 숫자를 공통화하면 [K2](k2-allow-duplication.md)의 결합도가 늘어요.

## React 컴포넌트 props API에 적용

단위가 중요한 숫자 prop은 단위를 계약에 담아요.

```tsx
// 모호한 API → 단위가 드러나는 API 예시
<Toast duration={2500} />;
<Toast durationMs={2500} />;
```

`size={2}`보다 `size="medium"`이 의도를 드러낼 수 있어요. 다만 픽셀이나 초가 표준 계약으로 확립된 라이브러리라면 그 관례도 고려해요. 이 기준이 특정 철자를 강제하지는 않아요.
