# @d5ng/react

Radix UI 위에 만든 d5ng 디자인 시스템의 React 컴포넌트예요.

## 설치

```bash
pnpm add @d5ng/react
```

React 19가 필요해요.

## 시작하기

앱 진입점에서 CSS를 한 번만 import해요. 토큰 값도 이 파일에 들어 있어요.

```ts
import "@d5ng/react/styles.css";
```

다크 모드는 `<html data-theme="dark">`로 켜요.

## 스타일 덮어쓰기

우리 CSS는 모두 `@layer d5ng` 안에 있어요. 레이어 밖에 쓴 CSS는 항상 우리 스타일을 이겨요.

```css
.my-button {
  background: rebeccapurple;
}
```

Tailwind처럼 레이어를 쓰는 도구와 함께 쓰면 전역 CSS 맨 위에서 레이어 순서를 정해요. `d5ng`를 `base` 뒤, `utilities` 앞에 두면 Tailwind의 초기화 CSS는 우리 스타일을 지우지 않고, 유틸리티 클래스는 우리 스타일을 덮어써요.

```css
@layer theme, base, d5ng, components, utilities;
@import "tailwindcss";
```

이 줄이 없으면 CSS를 불러온 순서에 따라 유틸리티 클래스가 지거나, 초기화 CSS가 우리 스타일을 지워요.
