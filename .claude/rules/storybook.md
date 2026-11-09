---
paths:
  - "**/*.stories.tsx"
  - "apps/storybook/**"
  - "packages/react/src/components/**"
---

# Storybook

## MCP

UI 컴포넌트를 만들거나 쓸 때는 `pnpm storybook`을 띄우고 `.mcp.json`의 `d5ng-storybook` 서버(`http://localhost:6006/mcp`)를 쓴다. 작업 순서는 서버가 연결될 때 보내는 지침을 따른다.

- 문서에 없는 props는 만들어 쓰지 않고 나에게 묻는다
- 스토리는 `test-run`으로, 컴포넌트 테스트는 `pnpm test`로 확인한다

## 문서

사용 가이드(언제 쓰나, variant 고르기, 조합, Do/Don't, Anatomy)는 Figma에만 쓰고, Storybook에는 코드로 쓰는 법만 남긴다.

- 컴포넌트와 props 설명은 컴포넌트 소스의 JSDoc에 쓴다. 스토리의 `parameters.docs.description`이나 `argTypes.description`에 다시 쓰지 않는다
- 문서에 보여야 할 prop은 props 타입에 직접 선언하고 기본값은 `@default`로 적는다. recipe 기본값과 HTML 속성은 문서 표에 잡히지 않는다
- 코드에서 고르는 걸 바꾸는 규칙만 컴포넌트 JSDoc에 한 줄로 옮긴다. AI는 Figma를 읽지 못한다
- 스토리는 `Default`(args만) 하나와 prop마다 하나씩 만들고, 스토리 위 JSDoc에 언제 쓰는지 한 줄 적는다
- 조합 전체 매트릭스, hover·pressed를 흉내 내는 스토리는 만들지 않는다
- 접근성 검사를 끄는 스토리는 끄는 rule과 이유를 주석으로 남긴다
- meta의 `parameters.design`으로 Figma 컴포넌트 세트를 연결한다
