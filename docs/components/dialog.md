# Dialog

지금 화면을 떠나지 않고 정보를 보거나 입력·설정을 바꾸는 모달이에요. 이 문서는 Dialog의 **결정과 이유**만 남겨요. 어디에 무엇을 두는지는 CLAUDE.md "정책을 둘 곳"을 따라요.

- **동작 계약**: `packages/react/src/components/Dialog/Dialog.test.tsx`의 테스트 이름이 정본이에요
- **사용 가이드**: Figma `Dialog` 페이지
- **계획**: [Dialog 구현 계획](https://claude.ai/artifact/34NrXBj8mKLcSmzGhrMBQA). D1·D2는 2026-11-14 확정
- **비교한 자료**(2026-11-14)
  - SEED: https://seed-design.io/llms/components/dialog.txt, https://seed-design.io/llms/react/components/dialog.txt, https://seed-design.io/rootage/components/dialog.json, `daangn/seed-design`의 `Dialog.tsx`, `recipes/dialog.ts`
  - Montage: https://montage.wanted.co.kr/docs/components/presentation/popup/web, `/design`
  - Radix: `@radix-ui/react-dialog` 1.3.1 소스(radix-ui 1.8.1)

## 정한 것

- **AlertDialog와 같은 구조예요**: Radix Dialog를 감싸고 부분마다 이름으로 내보내요(`Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogCloseButton`, `DialogBody`, `DialogFooter`, `DialogCancel`, `DialogSubmit`). `DialogContent`가 Portal과 배경을 함께 그려요. 이유는 [alert-dialog.md](alert-dialog.md)와 같아요. Header·Body·Footer 구성은 SEED를 따랐어요
- **배경과 페이드는 AlertDialog와 같이 써요**: `_internal/modal.css.ts`에 배경, 페이드, 화면 여백, Portal 기본값(글꼴·글자색·`box-sizing`)을 두었어요. Figma에서도 둘이 같은 Dialog Backdrop을 써요. 옮긴 뒤 AlertDialog의 빌드 CSS 규칙이 그대로인지 비교했어요
- **모션은 페이드만이에요**: AlertDialog와 같아요. Figma Dialog Specification의 "작은 크기 변화"는 값이 없고, Foundation Motion 견본(8px 이동)은 스스로 확정안이 아니라고 적었어요
- **`size`는 `medium`(480px)·`large`(800px)이고 기본은 `medium`이에요**: SEED와 같아요. 최대 너비라서 화면이 좁으면 줄어요. 480·800에 맞는 크기 토큰은 없어요
- **너비는 768px을 경계로 달라요**: 768 미만은 안전 영역 너비의 90%(390 → 351)이고, 그 위는 화면에서 좌우 `spacing[24]`를 뺀 너비예요. 24는 Foundation Layout의 최소 여백이고 AlertDialog와 같아요
  - 768 미만에서도 `size` 최대 너비를 넘지 않아요. 그래서 600px 화면의 `medium`은 540이 아니라 480이에요. Figma는 90%라고만 해서 534~767px에서 `medium`이 480보다 넓어질지 정하지 않았어요. `size`의 뜻("이 너비까지")을 지키는 쪽으로 정하고 Figma Specification에도 적었어요
  - 768은 Foundation Layout 초안의 태블릿 경계예요. 저장소에서 처음 쓰는 너비 미디어 쿼리이고 경계 토큰은 없어요
  - 노치·홈 표시줄은 `env(safe-area-inset-*)`로 피해요. 페이지가 `viewport-fit=cover`가 아니면 0이에요
- **최대 높이는 안전 영역 높이의 80%예요**: 넘치면 Body만 스크롤되고 Header·Footer는 남아요. 확대해서 Header·Footer만으로 넘치면 표면 전체가 스크롤돼서 버튼까지 닿아요
- **푸터 버튼은 `DialogCancel`과 `DialogSubmit`이에요(D1)**: Figma가 small·꽉 찬 너비로 고정해서 `size`·`fullWidth`·`asChild`·`variant`를 받지 않아요. Radix·shadcn식 `DialogClose` + `Button`이면 쓰는 쪽이 매번 `size="small" fullWidth`를 넣어야 하고, 빠뜨리면 Button 기본(48px)이 돼요
  - `DialogCancel`은 `secondary`이고 누르면 닫혀요
  - `DialogSubmit`은 `primary`에 `type="submit"`이고 눌러도 닫히지 않아요. 저장에는 검증·저장 중·실패 흐름이 있어서, 끝나면 쓰는 쪽이 `open`을 바꿔 닫아요. Footer는 폼 밖이라 Body 안 폼의 `id`를 `form`으로 넘겨요
  - `DialogAction`이라 부르지 않아요. `AlertDialogAction`과 Radix·SEED의 Action은 누르면 닫혀서, 같은 이름이 Dialog에서만 안 닫히면 동작을 숨겨요(FF P1). 대신 폼이 아닌 실행("적용")도 Submit이라 불러요
- **푸터 버튼 규격은 AlertDialog에서 복사해 둬요**: 크기·너비 고정과 반반 줄바꿈이 `AlertDialogActions`와 같지만 `_internal`로 옮기지 않았어요(FF K2, 2026-11-14 리뷰). Figma가 두 푸터를 공유 컴포넌트로 묶지 않아서 함께 바뀐다는 근거가 없고, 한쪽만 바꿔도 다른 쪽이 깨지지 않아요. Figma가 묶으면 그때 옮겨요
- **배경을 누르면 닫혀요(D2)**: Radix·Montage 기본값이에요. 입력·설정 변경 Dialog는 `onInteractOutside`에서 `event.preventDefault()`를 불러 막아요(`DialogContent` JSDoc, `Default` 스토리). 새 prop이 없는 대신, 빠뜨리면 실수로 누른 배경에 입력이 사라져요. 계획에서는 SEED처럼 기본으로 막는 안을 추천했지만 고르지 않았어요
  - 터치에는 Escape가 없어서, 배경을 막으면 `DialogCancel`을 둬야 닫을 수 있어요. 컴포넌트가 강제하지 않고 JSDoc에 적었어요
- **닫기 버튼은 넣을 때만 보여요**: `DialogCloseButton`(IconButton ghost·small, lucide `X`, 이름 "닫기")을 Header에 넣어요. SEED는 기본으로 켜지만 Figma 기본은 꺼져 있어요. Figma 가이드대로 Footer 없는 정보 조회에 두고 `DialogCancel`과 같이 두지 않아요
- **`Content`에 `aria-modal="true"`를 붙여요**: AlertDialog와 같아요. 설명이 없으면 Radix 1.3.1이 `aria-describedby`를 붙이지 않아서 따로 짠 코드는 없어요
- **처음 포커스는 Radix 기본값이에요**: 첫 번째 조작 요소에 가요. 짧은 폼은 첫 입력이라 Figma와 같아요. Figma는 긴 본문이면 제목이라고 하지만, Header가 고정이라 제목이 화면 밖으로 밀리지 않아요. 제목으로 보낼 화면은 쓰는 쪽이 `onOpenAutoFocus`에서 정해요
  - 넘치는 Body도 조작 요소라서, 닫기 버튼 없는 긴 글은 Body에 가요. 본문 길이에 따라 처음 포커스가 달라져서 JSDoc과 테스트로 드러냈어요(FF P3, 2026-11-14 리뷰)
- **스크롤 표시는 JS로 재요**: SEED처럼 scroll 이벤트와 ResizeObserver로 위·아래에 가려진 내용이 있는지 재서 `data-overflow-top`·`data-overflow-bottom`을 붙여요. Figma의 `Show scroll divider`·`Show scroll fog`에 대응하는 prop은 없어요
  - 영역 크기는 그대로인데 내용만 늘 때가 있어서 자식 크기도 봐요. 자식이 바뀌면 MutationObserver로 다시 등록해요
  - ResizeObserver의 첫 알림은 다음 프레임이라, 붙을 때 바로 한 번 재요. 안 그러면 열자마자 흐림과 `tabIndex`가 빠진 화면이 한 번 보이고 axe가 걸려요
- **흐림은 내용 위에 얹는 그라디언트예요**: Figma와 같은 표현이라 `dialog/fog-clear` 토큰을 그대로 써요. SEED의 mask는 토큰이 필요 없지만 Figma와 표현이 달라요
  - 넘치는 동안 Body 아래 여백과 `scroll-padding-bottom`을 흐림 높이(48px)로 늘려요. 맨 아래 내용과 Tab으로 옮겨 간 요소가 흐림 밑에 멈추지 않아요. 세 값은 상수 하나로 묶었어요(FF C2)
- **Body는 div 두 겹이에요**: 바깥이 구분선·흐림·포커스 링을 그리고, 안쪽이 스크롤해요. 스크롤 영역에 그리면 내용과 같이 움직여요. `className`·나머지 props·`ref`는 쓰는 쪽이 다루는 안쪽 스크롤 영역에 가요
  - 쓰는 쪽 `ref`와 안의 ref를 합치는 `_internal/composeRefs.ts`는 Radix compose-refs와 같은 계약이에요. `radix-ui/internal`은 쓰지 않아요
- **넘치는 Body는 Tab으로 들어가요**: 넘치는 동안만 `tabIndex=0`이에요. 조작 요소 없는 긴 글을 키보드로 내리려면 필요하고, axe `scrollable-region-focusable`도 요구해요. Chromium은 스크롤 영역에 스스로 포커스를 주지만 Safari는 주지 않아요. Safari에서 직접 확인하지는 않았어요
  - 포커스 링은 안쪽(`outline-offset` −2배)에 그려요. 좌우 끝이 표면 가장자리라 바깥 링은 표면이 잘라요. styles.md "띄움은 컴포넌트에서 정하지 않는다"의 예외예요
  - 링은 바깥 div의 `::after`에, 구분선과 흐림은 `::before`에 배경 두 겹으로 그려요. 스크롤 영역의 outline은 흐림 아래에 깔려 아래 변이 가려졌어요. 모서리는 `radius.lg`라서 Footer가 없을 때 표면의 둥근 아래 모서리와 맞아요
- **`"use client"`는 `DialogBody.tsx`에만 있어요**: 스크롤 상태를 hook으로 재는 건 Body뿐이에요. 나머지 부분은 Radix 부품에 값만 넘겨서 서버 컴포넌트에서 바로 써요. `onInteractOutside`는 함수라서, 배경 클릭을 막는 Dialog는 쓰는 쪽 클라이언트 컴포넌트에서 써요
- **z-index는 쓰지 않아요**: AlertDialog와 같아요. Dialog 안에서 연 AlertDialog가 위에 오고 Escape도 그것부터 닫아요(`UnsavedChanges` 스토리)
- **Figma 속성과의 대응**: `Show description`·`Show close button`·`Show footer`는 `DialogDescription`·`DialogCloseButton`·`DialogFooter`를 넣을지예요. `Body content`는 `DialogBody`의 children이에요

## 뺀 것

모두 나중에 더해도 지금 쓰는 쪽이 깨지지 않아요.

- **`closeOnInteractOutside`**(SEED), **`disableOutsideClickClose`**(Montage): D2에서 Radix 기본을 골랐어요
- **Content의 `showCloseButton`·`title`·`description`**(SEED): 부분으로 넣어요. AlertDialog와 같아요
- **`layerIndex`**(SEED): z-index를 쓰지 않아요
- **Responsive Dialog**(SEED, 좁은 화면에서 Bottom Sheet로 바뀜): Figma가 Bottom Sheet 설계 뒤로 미뤘어요
- **`xlarge`, `resize`, Navigation 변형**(Montage): Figma에 없어요
- **`DialogTitle`의 `visuallyHidden`**: Figma Dialog에 제목 숨김이 없어요. 필요해지면 AlertDialog와 같은 이름으로 더해요
- **`DialogErrorMessage`**: Figma는 저장 실패 문구를 Body 안에 두고 Anatomy에도 없어요. `Saving` 스토리가 `role="alert"` 문단으로 보여요
- **범용 `DialogClose`**: 쓸 화면이 없어요. 닫기 버튼과 Cancel이 안에서 써요
- **Cancel·Submit의 `ghost`·`critical`**: Figma 푸터에 `secondary`·`primary`만 있어요
- **크기 변화 모션**: 위 "모션은 페이드만" 참고

## 열린 질문

- **아주 낮은 화면**: 400% 확대처럼 Header와 Footer만으로 최대 높이를 넘으면 Body가 아래 여백(48px)만큼만 남고, 넘치는 동안 그 칸을 흐림이 덮어요. 표면이 스크롤돼서 버튼은 닿지만 Body 내용은 읽기 어려워요(320×200 화면에서 확인). 낮은 화면에서 Header·Footer 고정을 풀지, Body 최소 높이를 둘지 정해야 해요
- **Body 맨 위 조작 요소의 포커스 링**: Body 위 여백이 0이라, 맨 위에 둔 버튼의 링 위쪽이 스크롤 영역에 잘려요. 라벨이 먼저 오는 입력(TextField, 제목 있는 RadioGroup)은 잘리지 않아요
- **스크롤 영역의 역할과 이름**: 넘치는 Body는 포커스를 받지만 role과 이름이 없어서, Tab으로 들어가도 무엇인지 따로 알리지 않아요. `role="region"`과 제목 연결을 둘지 정해야 해요
