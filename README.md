# d5ng-design-system

Radix UI 위에 만든 React 디자인 시스템이에요. 쓰는 방법은 [`packages/react`](packages/react/README.md)에 있어요.

## 개발

```bash
pnpm install
# 테스트용 Chromium을 처음 한 번 받아요
pnpm --filter @d5ng/react exec playwright install chromium
```

| 명령                           | 하는 일                                                            |
| ------------------------------ | ------------------------------------------------------------------ |
| `pnpm storybook`               | Storybook을 띄워요                                                 |
| `pnpm test`                    | 컴포넌트 테스트와 스토리 테스트(접근성 포함)를 Chromium에서 돌려요 |
| `pnpm build`                   | 패키지를 빌드해요                                                  |
| `pnpm lint` · `pnpm typecheck` | 코드를 검사해요                                                    |
