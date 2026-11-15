# Callout

화면 안에 머무는 짧은 안내예요. 이 문서는 Callout·ActionableCallout·DismissibleCallout의 **결정과 이유**만 남겨요.

- **동작 계약**: `packages/react/src/components/Callout/*.test.tsx`와 `_internal/useControllableState.test.ts`의 테스트 이름이 정본이에요
- **사용 가이드**: Figma `Callout` 페이지
- **비교한 자료**(2026-11-14)
  - SEED: https://seed-design.io/llms/components/callout.txt, https://seed-design.io/llms/react/components/callout.txt
  - Montage: https://montage.wanted.co.kr/docs/components/feedback/section-message/web, `/design`
  - 계획 문서: https://claude.ai/artifact/S37E2BefanM98KnnTFwuWD

## 정한 것

- **세 컴포넌트예요**: 루트 요소와 동작이 달라요(`div`, `button`, 닫기 상태가 있는 `div`). 한 컴포넌트에 `type`을 두면 type마다 되는 tone·prop이 달라 유니온이 복잡해지고, 같이 실행되지 않는 코드가 섞여요(FF R1). Figma도 세트가 셋이에요
  - 이름은 SEED와 같아요. 부품이 아니라 따로 쓰는 형제라서 루트 이름을 앞에 붙이는 규칙(`AlertDialogContent`) 대상이 아니에요
- **메시지는 `title` prop + `children`이에요**(2026-11-14 결정): Figma Message가 제목·설명·링크를 한 문단으로 이어요. 링크는 `children` 안에 `Link`로 둬요
  - SEED식 `description`·`linkProps`는 Link API를 객체로 한 벌 더 두게 되고, 부품 조합(`CalloutTitle`)은 한 문단짜리에 export만 늘어서 뺐어요
  - HTML `title`(툴팁) 속성은 이름이 겹쳐서 타입에서 빼요(FF P1)
- **제목과 설명 사이는 글자로 띄워요**: Figma의 두 칸을 NBSP와 공백으로 넣어요. CSS 여백만 두면 복사하거나 스크린리더가 읽을 때 "안내변경한"처럼 붙어요
- **제목은 SemiBold예요**: Figma Spec 문구는 "Bold / Label/Bold"였지만 그런 스타일이 없고, 메인 컴포넌트는 SemiBold였어요. 메인 컴포넌트를 따르고 Spec 문구와 Bold로 덮어쓴 인스턴스를 고쳤어요
- **`role`은 붙이지 않아요**: Figma Accessibility가 정적 안내에 `role="alert"`를 일괄로 붙이지 말라고 해요. 나중에 나타나는 중요한 안내만 쓰는 쪽이 `role="status"`·`"alert"`를 붙여요. Callout은 탭 순서에 들어가지 않아요
- **tone은 5개, 기본 `neutral`이에요**: 배경(`bg/<tone>-weak`)과 앞 아이콘 색만 바뀌고 글자는 모두 `fg/neutral`이에요
  - 톤별 기본 아이콘(Info·Info·Check·TriangleAlert·CircleAlert)은 Montage처럼 두고 `prefixIcon`으로 바꿔요. `null`이어도 기본 아이콘이고, 숨길 때는 `hidePrefixIcon`이에요
  - Badge와 tone 타입·색을 공통 파일로 옮기지 않아요. Badge는 `brand`가 더 있고 neutral 글자도 `fg/neutral-muted`라 값과 색이 달라요. 값 목록은 컴포넌트마다 타입으로 드러내요(badge.md, FF P1)
- **DismissibleCallout은 `neutral`·`informative`·`positive`만 받아요**: Figma Guidelines가 주의·오류에는 닫기를 두지 않아요. 타입이 막아요
- **닫기 상태는 `open`·`defaultOpen`(기본 `true`)·`onOpenChange`예요**(2026-11-14 결정): components.md의 제어 상태 이름이고 Montage와도 같아요. 닫히면 DOM에서 빠져요(SEED와 같아요)
  - 닫은 뒤 포커스는 옮기지 않고 쓰는 쪽이 `onOpenChange`에서 정해요. "적절한 다음 위치"가 화면마다 달라서 다음 tabbable로 옮기는 동작은 넣지 않았어요(FF P3). 다시 보기 버튼으로 옮기는 예는 `Open` 스토리에 있어요
- **`_internal/useControllableState`는 `onChange`를 그 자리에서 불러요**: 감쌀 Radix 공개 컴포넌트가 없어서 새로 만들었어요
  - Radix 비공개 훅은 비제어일 때 상태를 반영한 뒤 effect에서 불러요. 여기서는 닫기 버튼이 사라지기 전에 불러서, 쓰는 쪽이 옮긴 포커스가 body를 거치지 않아요. 함수 갱신도 받지 않아요
  - 이름이 Radix와 같아서 차이를 JSDoc과 테스트("onOpenChange는 닫기 버튼이 사라지기 전에 불려요")로 고정했어요(FF P1). effect로 바꾸면 이 테스트만 실패해요
- **닫기 버튼 이름은 "안내 닫기"로 고정해요**: TextField "입력 내용 지우기"와 같은 방식이에요. `IconButton` ghost·small에 lucide `X`예요
- **ActionableCallout은 안내 전체가 버튼 하나예요**: 기본은 `<button type="button">`이고 `asChild`로 `<a>`·라우터 링크를 감싸요. 이름은 제목과 설명이 이어진 문장이고 화살표는 읽지 않아요
  - 안에 `Link`·버튼을 넣지 않는 건 타입으로 막지 못해서 JSDoc으로 알려요
- **ActionableCallout은 `disabled`를 받지 않아요**: Figma에 비활성 상태가 없어요. 넘기면 클릭만 막히고 모양·hover가 그대로라 타입에서 뺐어요. Figma에 비활성 모양이 생기면 같이 더해요
- **hover·눌림은 `color-mix()`로 만들어요**: Figma는 톤 배경 위에 `bg/neutral-solid`를 6%·10%로 덮어요. 톤마다 hover·pressed 토큰 10개를 만드는 대신 섞어요. `@supports`로 감싸서 모르는 브라우저는 톤 배경 그대로예요
  - 눌림 축소는 없어요. Figma가 큰 안내 영역에 확대·축소 모션을 더하지 않는다고 정했어요(SEED는 줄여요)
- **최소 높이는 `button.minHeight.sm + spacing.4 × 2`(52px)예요**: 닫기·화살표 자리(44)에 위아래 여백을 더한 값이라 세 타입의 한 줄 높이가 같아요. Display는 내용이 51px이라 Figma가 52를 숫자로 뒀어요. 식으로 두면 이유가 남아요(FF C2)
- **아이콘 16px은 숫자예요**: Figma가 Callout 아이콘 크기를 변수로 묶지 않았어요
- **Callout·ActionableCallout은 서버 컴포넌트예요**: 핸들러를 만들지 않아요. DismissibleCallout만 상태 때문에 `"use client"`예요
- **Figma 속성과의 대응**
  - 세트(`Callout/Display`·`Callout/Actionable`·`Callout/Dismissible`)는 컴포넌트 고르기예요
  - `tone`은 `tone`이에요
  - `Show prefix`는 `hidePrefixIcon`, `Show arrow`는 `hideArrow`의 반대예요. Figma boolean은 레이어를 보일 때만 `true`로 묶을 수 있어서 이름을 뒤집지 못해요(field.md와 같아요)
  - hover·pressed·포커스는 브라우저 상태예요(Figma 표시용)

## 뺀 것

- **SEED `magic` 톤, Montage `custom`(색 직접 지정)**: Figma에 없고 쓸 화면도 없어요
- **Montage `trailingButton`·`bottomButton`**: 같은 이유예요. 나중에 더해도 깨지지 않아요
- **닫기 버튼 이름 바꾸기**: 다른 언어가 필요해지면 prop을 더해요
- **`onDismiss`만 두는 안**: 쓰는 쪽이 상태를 안 두면 닫기가 아무 일도 안 해요. 이름도 제어 상태 규칙과 달라요

## 열린 질문

- **Positive 아이콘**: 다른 톤은 원·삼각 테두리가 있는데 Positive만 테두리 없는 `check`예요. Figma 선택이라 그대로 뒀어요. `circle-check`로 맞출지는 Figma에서 정해요
- **Snackbar**: JSDoc은 "작업 결과를 잠깐 알리는 피드백에는 쓰지 않아요"까지만 써요. Snackbar가 생기면 그쪽을 가리켜요
