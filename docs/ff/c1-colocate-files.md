# C1. 함께 수정되는 파일을 같은 디렉토리에 두기

- 기준: 응집도
- 원문: [함께 수정되는 파일을 같은 디렉토리에 두기](https://frontend-fundamentals.com/code-quality/code/examples/code-directory.html)

## 묻는 질문

한 기능을 바꾸거나 지울 때 따라가야 할 파일이 같은 경계 안에 있나요?

## 원문 요지

프로젝트 전체를 hooks·utils·components 같은 기술 종류로만 나누면 기능 간 의존성을 개발자가 추적해야 해요. 공용 코드는 유지하되 도메인 전용 파일을 모으면 참조 경계와 삭제 범위가 보이기 쉬워져요.

## Before·After 요약 코드

원문의 폴더 구조 사례를 작은 검색 기능으로 재구성했어요.

```text
# Before: 같은 기능이 종류별 폴더에 흩어져요.
src/components/SearchPanel.tsx
src/hooks/useSearchFilters.ts
src/utils/serializeSearchFilters.ts
```

```text
# After: 검색 전용 파일을 모아요.
src/features/search/SearchPanel.tsx
src/features/search/useSearchFilters.ts
src/features/search/serializeSearchFilters.ts
```

## 적용하지 않는 경우

**원문도 남겨 두는 공용 영역**: 여러 도메인에서 실제로 사용하는 코드는 공용 폴더에 둘 수 있어요. 사용처를 확인하지 않고 전부 한 기능 안으로 옮기지 않아요. 폴더를 모으는 것만으로 import 경계가 강제되지는 않으므로 공개 진입점과 규약도 필요할 수 있어요.

## 다른 항목과의 상충

[K1](k1-limit-responsibility.md)처럼 책임 경계가 먼저여야 해요. 거대한 `shared` 폴더로 다시 모으면 물리적 위치만 가까워져요. [K2](k2-allow-duplication.md) 관점에서는 닮았다는 이유만으로 서로 다른 도메인의 코드를 공용 영역으로 끌어내지 않아요.

## React 컴포넌트 props API에 적용

prop 이름을 바꾸면 타입·구현·스타일·스토리·테스트를 같이 확인해요. 이 파일을 컴포넌트 디렉토리에 모으면 수정 대상을 찾기 쉬워요.

```text
components/Button/
  Button.tsx
  Button.css.ts
  Button.stories.tsx
  Button.test.tsx
  index.ts
```

내부 스타일 타입과 유틸을 사용처가 깊은 경로로 가져가면 공개 API처럼 묶여 버릴 수 있어요. 외부에 노출할 항목은 진입점에서 선택해요. 같이 둬도 누락이 자동 방지되는 건 아니므로 타입 검사와 사용처 검색을 함께 해요.
