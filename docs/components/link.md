# Link

문장 안에서 다른 페이지나 문서 안의 위치로 이동해요. 이 문서는 Link의 **결정과 이유**만 남겨요.

- **동작 계약**: `packages/react/src/components/Link/Link.test.tsx`의 테스트 이름이 정본이에요
- **사용 가이드**: Figma `Link` 페이지
- **비교한 자료**(2026-11-09)
  - SEED: https://seed-design.io/react/llms.txt, https://seed-design.io/components/llms.txt (Link 없음)
  - Montage: https://montage.wanted.co.kr/docs/components/actions/text-button/web, `/design` (TextButton은 버튼이라 대응이 아님)

## 정한 것

- **문장 안의 링크(Inline) 하나만 둬요**: 따로 떨어진 이동(메뉴, 이전 글·다음 글)은 `Button variant="ghost" asChild`로 만들어요. 44px 클릭 영역이 이미 있어서 Standalone Link를 따로 두면 역할이 겹쳐요. Figma도 Standalone을 Archive로 보류했어요
- **`size`, `color`, `variant`가 없어요**: 크기·행간·굵기는 `font: inherit`로 주변 문장을 따르고, 색은 `fg/brand` 하나예요. 문장 안에서 링크만 크기가 다르면 읽기 흐름이 깨져요
- **`disabled`가 없어요**: 링크는 이동만 해요. 갈 곳이 없으면 링크 대신 안내 글자를 보여 줘요(Figma Guidelines)
- **`display: inline`이에요**: Button처럼 `inline-flex`로 만들면 긴 링크가 줄바꿈되지 않고 한 덩어리로 다음 줄에 넘어가요
- **이름은 `Link`예요**: 라우터의 `Link`와 이름이 같지만, `href`만 넘기면 브라우저가 페이지를 새로 불러와요. 이름을 바꾸는 대신 컴포넌트 JSDoc에 "앱 안 이동은 라우터의 링크를 `asChild`로 감싸요"라고 적었어요(FF P1). MUI·Chakra·Radix Themes도 `Link`예요
- **아이콘은 `suffixIcon` prop 하나예요**: 이름과 방식은 Button의 `suffixIcon`과 같아요. 앞 아이콘은 Figma에 없어요. 크기 `0.875em`과 간격 `0.25em`은 16px 문장에서 Figma 값(14px, 4px)이고, 둘 다 문장 크기를 따라가요. 간격만 `spacing[4]`로 고정하면 큰 문장에서 아이콘이 글자에 붙어요(FF C2)
- **새 탭 안내를 자동으로 넣지 않아요**: `target="_blank"`일 때 숨은 문구를 덧붙이면, 넘긴 props에 없는 글자가 생기는 숨은 동작이 돼요(FF P3). 한국어 문구도 패키지에 박혀요. 안내는 쓰는 쪽이 문구나 옆 글자로 붙이고, 컴포넌트 JSDoc에 한 줄로 알려요
- **밑줄은 모든 상태에서 보여요**: 1px, 오프셋 3px, skip-ink예요. Figma에도 토큰이 없어서 숫자로 써요
- **포커스 링 두께는 `spacing[2]`를 바로 써요**: Button·TextField는 컴포넌트 토큰(`button-focus-width`, `text-field-focus-width`)을 쓰지만 값이 모두 2px예요. Link용 토큰을 하나 더 만드는 대신, 공통 `focus-width`로 합치는 일을 따로 다뤄요
- **`asChild`**: 라우터의 링크 컴포넌트에 스타일만 입혀요. `Primitive.a`로 렌더해요
- **아이콘 크기 규칙은 Button과 공유하지 않아요**: `svg`를 자리에 맞추는 규칙만 같고, 표시 방식·크기·간격이 달라요(FF K2)

## 뺀 것

- **visited 색**: Figma가 1차에서는 방문 전후 색을 같게 정했어요
- **현재 위치(`aria-current`) 표현**: 메뉴 같은 탐색 패턴이 맡아요
- **앞 아이콘(`prefixIcon`)**: Figma에 없어요. 필요해지면 더해도 깨지지 않아요
- **`href` 필수 타입**: `asChild`가 아닐 때만 필수로 하는 유니온 타입은, 쓰는 쪽이 `LinkProps`에 `Omit`을 씌워 감싸면 풀려요. 대신 `cursor: pointer`를 두지 않아요. 브라우저는 `href`가 있는 a에만 pointer를 보여 주니, `href` 없는 a는 눌릴 것처럼 보이지 않아요

## 열린 질문

- **줄 끝에서 아이콘만 다음 줄로 떨어질 수 있어요**: 마지막 단어와 아이콘을 묶으려면 문구를 쪼개야 해요. 블로그에서 실제로 거슬리면 다뤄요
- **공통 포커스 링 두께 토큰**: Button·TextField·Link가 같은 2px를 각자 정해요
