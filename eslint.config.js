import js from "@eslint/js";
import comments from "@eslint-community/eslint-plugin-eslint-comments/configs";
import eslintReact from "@eslint-react/eslint-plugin";
import vitest from "@vitest/eslint-plugin";
import { defineConfig, globalIgnores } from "eslint/config";
import prettier from "eslint-config-prettier";
import importX from "eslint-plugin-import-x";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import storybook from "eslint-plugin-storybook";
import globals from "globals";
import tseslint from "typescript-eslint";

// @eslint-react에도 Hooks 규칙이 있어서 react-hooks와 같은 위반을 두 번 보고해요.
// 공식 플러그인인 react-hooks를 남기고 겹치는 @eslint-react 규칙을 꺼요.
const reactHooksDuplicates = Object.fromEntries(
  Object.keys(
    eslintReact.configs["disable-conflict-eslint-plugin-react-hooks"].rules,
  ).map((rule) => [rule.replace("react-hooks/", "@eslint-react/"), "off"]),
);

export default defineConfig(
  globalIgnores([
    "**/dist",
    "**/storybook-static",
    // .claude/worktrees에는 Claude Code가 만든 다른 브랜치의 worktree가 있어요.
    ".claude/worktrees",
    // export.figma.js는 Figma Plugin API에서 실행하는 스크립트라 최상위 return을 써요.
    "packages/tokens/figma/export.figma.js",
  ]),
  {
    linterOptions: { reportUnusedDisableDirectives: "error" },
  },
  js.configs.recommended,
  tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    // 어떤 tsconfig에도 속하지 않는 설정 파일(이 파일 등)은 타입 기반 규칙을 꺼요.
    files: ["**/*.js"],
    extends: [tseslint.configs.disableTypeChecked],
    languageOptions: { globals: globals.node },
  },
  reactHooks.configs.flat.recommended,
  jsxA11y.flatConfigs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    extends: [eslintReact.configs["recommended-type-checked"]],
    // React 19만 지원해서 forwardRef 대신 ref prop을 쓰라는 19 규칙을 켜요.
    // 설치된 react 버전이 아니라 peer 범위의 최솟값에 맞춰요.
    settings: { "react-x": { version: "19.0.0" } },
    rules: reactHooksDuplicates,
  },
  comments.recommended,
  {
    plugins: { "import-x": importX, "simple-import-sort": simpleImportSort },
    rules: {
      "@eslint-community/eslint-comments/require-description": "error",
      // 할 일은 이슈로 보내요. 머리말 뒤에 정하지 못한 일이 숨기 쉬워요.
      "no-warning-comments": [
        "error",
        {
          terms: ["todo", "fixme", "xxx", "hack", "note", "warning"],
          location: "start",
        },
      ],

      // 각 파일에서 가장 가까운 package.json을 기준으로 봐요.
      // 배포되는 코드가 devDependencies나 선언하지 않은 패키지를 import하면 쓰는 쪽에서 깨져요.
      "import-x/no-extraneous-dependencies": [
        "error",
        { devDependencies: false, includeTypes: true },
      ],
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "radix-ui/internal",
              message:
                "Radix가 비공개라고 밝힌 API예요. 공개 radix-ui나 components/_internal을 써요.",
            },
          ],
          patterns: [
            {
              group: ["@radix-ui/*"],
              message: "radix-ui 통합 패키지에서 import해요.",
            },
          ],
        },
      ],

      "no-restricted-syntax": [
        "error",
        {
          selector:
            "VariableDeclarator[id.name=/^[A-Z]/] > :matches(ArrowFunctionExpression, FunctionExpression)",
          message: "컴포넌트는 function 선언으로 작성해요.",
        },
        {
          // 객체 메서드(vite 플러그인 훅 등)는 빼고 봐요.
          selector:
            "FunctionDeclaration[id.name=/^([A-Z]|use[A-Z])/] :matches(FunctionDeclaration, FunctionExpression):not(Property[method=true] > FunctionExpression, MethodDefinition > FunctionExpression)",
          message: "컴포넌트와 hook 안의 함수는 const 화살표 함수로 써요.",
        },
        {
          selector:
            "FunctionDeclaration[id.name=/^[A-Z]/] > ObjectPattern > RestElement > Identifier[name!=/^(?!(rest|other)Props$)[a-z][a-zA-Z]*Props$/]",
          message:
            "props의 나머지는 렌더하는 부분 이름으로 받아요(예: ...buttonProps, ...triggerProps).",
        },
      ],

      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
  storybook.configs["flat/recommended"],
  {
    files: ["**/*.test.{ts,tsx}"],
    ...vitest.configs.recommended,
  },
  {
    // 배포물에 import가 남지 않는 파일은 devDependencies를 써도 돼요.
    // 설정 파일, .css.ts(빌드하면 CSS와 클래스 이름이 돼요), 스토리, 테스트, apps/가 그래요.
    files: [
      "*.{js,ts}",
      "**/*.config.{js,ts}",
      "**/*.css.ts",
      "**/*.stories.{ts,tsx}",
      "**/*.test.{ts,tsx}",
      "apps/**",
    ],
    rules: {
      "import-x/no-extraneous-dependencies": [
        "error",
        { devDependencies: true },
      ],
    },
  },
  // 포맷 규칙은 Prettier에 맡겨서 뒤에 둬요.
  prettier,
  // eslint-config-prettier가 끈 curly를 그 뒤에서 다시 켜요. "all"은 Prettier와 충돌하지 않아요.
  { rules: { curly: ["error", "all"] } },
);
