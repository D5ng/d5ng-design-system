# 컴포넌트 대응표

우리 Figma의 컴포넌트 페이지를 기준으로 SEED와 Montage에서 같은 역할을 하는 문서를 짝지었다. 이름만 보고 짝지은 것은 "추정"으로 두고, 처음 비교할 때 원본을 읽어 확인한 뒤 표시를 지운다.

- SEED: `https://seed-design.io/llms/components/<slug>.txt`
- Montage: `https://montage.wanted.co.kr/docs/components/<경로>/{design,web}`

| 우리               | SEED                                 | Montage                            | 메모                                                           |
| ------------------ | ------------------------------------ | ---------------------------------- | -------------------------------------------------------------- |
| Button             | `action-button`                      | `actions/button`                   | 확인함(2026-11-09)                                             |
| IconButton         | `action-button`(`layout="iconOnly"`) | `actions/icon-button`              | SEED는 Button에 합쳐 둠                                        |
| Field              | `field`                              | `selection-and-input/form-control` | 추정                                                           |
| TextField          | `text-input`                         | `selection-and-input/text-field`   |                                                                |
| Textarea           | `text-input`(Textarea)               | `selection-and-input/text-area`    | SEED는 한 문서                                                 |
| Checkbox           | `checkbox`                           | `selection-and-input/checkbox`     | Montage는 `check-mark`도 있음                                  |
| Radio              | `radio`                              | `selection-and-input/radio`        |                                                                |
| Switch             | `switch`                             | `selection-and-input/switch`       |                                                                |
| Select             | `select`                             | `selection-and-input/select`       |                                                                |
| Select Box         | `select-box`                         | `selection-and-input/framed-style` | 추정                                                           |
| Dialog             | `dialog`                             | `presentation/popup`               | 추정                                                           |
| Alert Dialog       | `alert-dialog`                       | `feedback/alert`                   | 확인함(2026-11-09)                                             |
| Snackbar           | `snackbar`                           | `feedback/snackbar`                | Montage는 `feedback/toast`도 있음                              |
| Tabs               | `tabs`                               | `navigations/tab`                  |                                                                |
| Badge              | `badge`                              | `contents/content-badge`           | 추정                                                           |
| Notification Badge | `notification-badge`                 | `feedback/push-badge`              | 추정                                                           |
| Chip               | `chip`                               | `actions/chip`                     | Montage는 `selection-and-input/filter-button`도 있음           |
| Link               | 없음                                 | 없음                               | 확인함(2026-11-09). Montage `text-button`은 버튼이라 대응 아님 |
| Image Frame        | `image-frame`                        | `contents/thumbnail`               | 추정                                                           |
| Content Card       | 없음                                 | `contents/card`                    | 추정                                                           |
| Article Body       | React `article`                      | 없음                               | SEED는 React 문서에만 있음                                     |
| Divider            | `divider`                            | 없음                               |                                                                |
| Callout            | `callout`                            | `feedback/section-message`         | 추정                                                           |
| Skeleton           | `skeleton`                           | `loading/skeleton`                 |                                                                |
| Result Section     | `result-section`                     | `feedback/fallback-view`           | 추정                                                           |
| Search Bar         | `search-bar`                         | `selection-and-input/search-field` |                                                                |
| Menu               | `menu`                               | `presentation/menu`                |                                                                |
| Help Bubble        | `help-bubble`                        | `presentation/tooltip`             | 추정. Montage는 `presentation/popover`도 있음                  |
