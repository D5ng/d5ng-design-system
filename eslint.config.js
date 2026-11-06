import js from "@eslint/js";
import comments from "@eslint-community/eslint-plugin-eslint-comments/configs";
import eslintReact from "@eslint-react/eslint-plugin";
import { defineConfig, globalIgnores } from "eslint/config";
import prettier from "eslint-config-prettier";
import importX from "eslint-plugin-import-x";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

// @eslint-react에도 Hooks 규칙이 들어 있어서 react-hooks와 같은 위반을 두 번 보고한다.
// 공식 플러그인인 react-hooks를 남기고, 겹치는 규칙은 @eslint-react 쪽을 끈다.
const reactHooksDuplicates = Object.fromEntries(
  Object.keys(
    eslintReact.configs["disable-conflict-eslint-plugin-react-hooks"].rules,
  ).map((rule) => [rule.replace("react-hooks/", "@eslint-react/"), "off"]),
);

export default defineConfig(
  // .claude/worktrees에는 Claude Code가 만든 다른 브랜치의 worktree가 있다.
  globalIgnores(["**/dist", ".claude/worktrees"]),
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
    // 어떤 tsconfig에도 속하지 않는 설정 파일(이 파일 등)은 타입 기반 규칙을 끈다.
    files: ["**/*.js"],
    extends: [tseslint.configs.disableTypeChecked],
    languageOptions: { globals: globals.node },
  },
  reactHooks.configs.flat.recommended,
  jsxA11y.flatConfigs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    extends: [eslintReact.configs["recommended-type-checked"]],
    // peer 범위가 React 18부터라서, forwardRef 대신 ref prop을 쓰라는 식의 19 전용 제안을 막는다.
    settings: { "react-x": { version: "18.0.0" } },
    rules: reactHooksDuplicates,
  },
  comments.recommended,
  {
    plugins: { "import-x": importX, "simple-import-sort": simpleImportSort },
    rules: {
      "@eslint-community/eslint-comments/require-description": "error",

      // 각 파일에서 가장 가까운 package.json을 기준으로 본다.
      // 배포되는 코드가 devDependencies나 선언하지 않은 패키지를 import하면 쓰는 쪽에서 깨진다.
      "import-x/no-extraneous-dependencies": [
        "error",
        { devDependencies: false, includeTypes: true },
      ],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@radix-ui/react-*"],
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
      ],

      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
  {
    // 설정 파일은 배포되지 않으므로 devDependencies를 써도 된다.
    files: ["*.{js,ts}", "**/*.config.{js,ts}"],
    rules: {
      "import-x/no-extraneous-dependencies": [
        "error",
        { devDependencies: true },
      ],
    },
  },
  // 포맷 규칙은 Prettier에 맡기므로 뒤에 둔다.
  prettier,
  // eslint-config-prettier가 curly를 끄므로 그 뒤에서 다시 켠다. "all"은 Prettier와 충돌하지 않는다.
  { rules: { curly: ["error", "all"] } },
);
