# Alert Dialog

중요한 안내와 경고를 확인받는 모달이에요. 이 문서는 Alert Dialog의 **결정과 이유**만 남겨요. 어디에 무엇을 두는지는 CLAUDE.md "정책을 둘 곳"을 따라요.

- **동작 계약**: `packages/react/src/components/AlertDialog/AlertDialog.test.tsx`의 테스트 이름이 정본이에요
- **사용 가이드**: Figma `Alert Dialog` 페이지
- **비교한 자료**(2026-11-09)
  - SEED: https://seed-design.io/llms/components/alert-dialog.txt, https://seed-design.io/llms/react/components/alert-dialog.txt, https://seed-design.io/rootage/components/alert-dialog.json
  - Montage: https://montage.wanted.co.kr/docs/components/feedback/alert/web, `/design`
  - Radix: `@radix-ui/react-alert-dialog` 1.2.1 소스

## 정한 것

- **Radix처럼 부분으로 나눠요**: `Root`, `Trigger`, `Content`, `Title`, `Description`, `ErrorMessage`, `Actions`, `Cancel`, `Action`. `AlertDialog.Content`처럼 이름공간으로 내보내요
- **`Content`가 Backdrop과 Portal을 함께 그려요**: SEED와 같아요. 쓰는 쪽이 Overlay를 빠뜨려 배경 차단이 안 되는 일이 없어요
- **Tone은 `Action`의 `variant`로 골라요**(`neutral` 기본, `primary`, `critical`): Figma의 Tone은 실행 버튼 색만 바꿔요. SEED·Montage도 대화상자가 아니라 버튼에서 색을 골라요. `Content tone`을 두면 `tone="brand"`와 `variant="primary"`처럼 같은 뜻에 이름이 둘 생기고, 버튼 색을 알려면 Content까지 올라가 읽어야 해요(FF R6)
- **버튼 크기와 너비는 고정이에요**: Figma 규격("기존 Small Button", 꽉 찬 너비)이라 `size`, `fullWidth`, `asChild`를 받지 않아요
- **`Cancel`은 `secondary` 기본에 `ghost`만 더 받아요**: Figma 가이드 "보조 행동 강조를 낮추는 경우"가 `ghost`를 써요. 취소가 빨갛거나 실행보다 강해지지 않게 두 값만 열어요
- **가로·세로 배치는 prop 없이 CSS가 정해요**: 두 라벨이 반 폭에 들어가면 가로, 하나라도 넘치면 세로예요. SEED `ResponsivePair`도 자동이에요. `layout` prop은 쓰는 쪽이 라벨 길이를 짐작해야 하고 200% 확대·좁은 화면에서 깨져요. Figma의 `Layout`은 미리보기용이에요
- **바깥 클릭·Escape·처음 포커스는 Radix 기본값이에요**: 바깥 클릭으로 닫지 않고, Escape는 실행하지 않고 닫고, 처음 포커스는 `Cancel`에 가요
- **버튼이 하나면 그 버튼에 처음 포커스를 줘요**: Radix는 `Cancel`이 없으면 포커스를 옮기지 않아서 배경에 남아요. 이 부분만 더했어요
- **`Content`에 `aria-modal="true"`를 붙여요**: Figma 접근성 계약이에요. Radix는 배경을 `aria-hidden`으로만 가리고 이 속성은 붙이지 않아요
- **닫힌 뒤 포커스는 Trigger로 돌아가요**: Trigger 없이 열었거나 실행 뒤 연 요소가 사라지면 Radix는 `body`로 보내요. Figma의 "논리적인 다음 위치"는 화면마다 달라서 컴포넌트가 정하지 않고, 쓰는 쪽이 `onCloseAutoFocus`에서 정해요
- **요청 중 닫기는 쓰는 쪽이 막아요**: `Cancel disabled`와 `onEscapeKeyDown`의 `preventDefault()`를 함께 써요(`Async` 스토리). 요청을 취소할 수 있는지는 화면마다 달라요
- **`Action`은 누르면 닫혀요**: Radix·SEED·Montage와 같아요. 요청이 끝날 때까지 열어 두려면 `onClick`에서 `event.preventDefault()`를 부르고 `open`을 제어해요. `loading`이면 Button처럼 다시 눌리지 않아요
- **`ErrorMessage`는 `role="alert"`예요**: 실패를 보조 기술에도 바로 알려요. 실패해도 닫지 않고 다시 시도하게 하는 건 쓰는 쪽이 `open`으로 정해요
- **제목을 숨길 땐 `Title visuallyHidden`**: Figma `Show title`을 끄더라도 웹은 이름이 있어야 해요. 요소를 남기고 눈에만 숨겨요
- **모션은 페이드만이에요**: 열기 `duration.slow`(250ms), 닫기 `duration.normal`(150ms). 위치가 움직이지 않아 움직임 줄이기에서도 그대로 둬요. 닫힐 때는 Presence가 기다리도록 keyframes를 써요
- **z-index는 쓰지 않아요**: Portal이 `body` 끝에 붙어 DOM 순서로 위에 와요. 중첩되면 나중에 연 것이 위예요

## 뺀 것

- **`Content tone`**: 위 "Tone은 Action의 variant로" 참고
- **`layout` prop**: 위 "가로·세로 배치" 참고
- **`closeOnInteractOutside`**(SEED), **`disableOutsideClickClose`**(Montage): Figma가 바깥 클릭 닫기를 막아요
- **`layerIndex`**(SEED): z-index를 쓰지 않아요
- **본문 슬롯**: Figma가 폼·이미지 같은 임의 내용을 막아요. 그런 내용은 Dialog를 써요
- **부분 테마**: `data-theme`은 `html`에만 붙여요. 영역에 붙인 테마는 Portal 내용이 받지 못해요

## 열린 질문

- **한 줄보다 긴 라벨**: 세로 배치에서도 Button이 `nowrap`이라 232px를 넘는 라벨은 넘쳐요. CSS만으로 가로·세로 판단과 줄바꿈을 같이 하기 어려워요
- **Backdrop을 Dialog와 나누기**: Figma는 Dialog Backdrop을 다시 써요. Dialog를 만들 때 `_internal`로 옮겨요
- **편집 Dialog 위 중첩**: Figma "변경사항 보호" 흐름은 Dialog가 생기면 스토리와 테스트로 확인해요
