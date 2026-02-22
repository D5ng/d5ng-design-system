import js from "@eslint/js"
import globals from "globals"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import tseslint from "typescript-eslint"
import { defineConfig, globalIgnores } from "eslint/config"
import importPlugin from "eslint-plugin-import"
import reactPlugin from "eslint-plugin-react"
import eslintConfigPrettier from "eslint-config-prettier/flat"
import jsxA11y from "eslint-plugin-jsx-a11y"
import unusedImports from "eslint-plugin-unused-imports"

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      importPlugin.flatConfigs.recommended,
      reactPlugin.configs.flat.recommended,
      reactPlugin.configs.flat["jsx-runtime"],
      eslintConfigPrettier,
      jsxA11y.flatConfigs.recommended,
    ],
    plugins: {
      "unused-imports": unusedImports,
    },
    languageOptions: {
      ...reactPlugin.configs.flat.recommended.languageOptions,
      ecmaVersion: 2020,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
      parserOptions: {
        projectService: true,
      },
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: ["./tsconfig.json"],
        },
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
          moduleDirectory: ["node_modules", "src"],
        },
      },
      react: {
        version: "detect",
      },
    },
    rules: {
      "no-unused-vars": "off",
      "import/no-dynamic-require": "warn",
      "import/no-nodejs-modules": "warn",
      "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
      "import/no-cycle": "warn",

      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "separate-type-imports" },
      ],
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "type", "index", "unknown"],
          pathGroups: [
            { pattern: "react", group: "external", position: "before" },
            { pattern: "@/**", group: "internal" },
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "import/no-duplicates": "error",
      "import/no-default-export": "error",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
          "warn",
          {
              "vars": "all",
              "varsIgnorePattern": "^_",
              "args": "after-used",
              "argsIgnorePattern": "^_",
          },
      ],
      "react/function-component-definition": [
        "error",
        {
          namedComponents: "function-declaration",
          unnamedComponents: "arrow-function",
        },
      ],
      "react/jsx-no-leaked-render": ["error", { validStrategies: ["coerce", "ternary"] }],
      "react/jsx-pascal-case": ["error", { allowAllCaps: false }],
      "react/no-array-index-key": "error",
      "react/jsx-no-useless-fragment": "error",
      "react/jsx-no-bind": [
        "warn",
        {
          ignoreDOMComponents: true,
          allowArrowFunctions: true,
          allowFunctions: false,
          allowBind: false,
        },
      ],
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/click-events-have-key-events": "warn",
      "jsx-a11y/no-static-element-interactions": "warn",
      "jsx-a11y/anchor-is-valid": "error",
    },
  },
  {
    files: ["**/*.tsx"],
    rules: {
      "import/no-default-export": "off",
    },
  },
])
