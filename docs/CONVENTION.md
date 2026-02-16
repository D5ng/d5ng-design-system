# 코드 컨벤션 (ESLint + Prettier)

이 문서는 프로젝트의 `eslint.config.js`와 `.prettierrc` 기준으로 정리한 코드 컨벤션입니다.

---

## 1. 포맷팅 (Prettier)

| 항목 | 값 | 의미 |
|------|-----|------|
| **semi** | `false` | 세미콜론 사용 안 함 |
| **singleQuote** | `false` | 문자열은 큰따옴표 `"` |
| **trailingComma** | `"all"` | 가능한 곳은 모두 trailing comma |
| **printWidth** | `120` | 한 줄 최대 120자 |
| **tabWidth** | `2` | 들여쓰기 2칸 |

**무시 대상 (`.prettierignore`):** `dist`, `node_modules`, `build`, `coverage`, `dist-ssr`, `*.local`

**권장 추가:** 줄바꿈 일관성을 위해 `.prettierrc`에 `"endOfLine": "lf"` 추가를 고려할 수 있습니다.

---

## 2. 적용 범위

- **대상:** `**/*.{ts,tsx}` (TypeScript/TSX만)
- **제외:** `dist` (globalIgnores)
- **TSX 한정:** `import/no-default-export`는 TSX에서만 off (페이지/라우트용 default export 허용)

---

## 3. Import / 타입

### 타입

- **타입은 type import로 분리**  
  `@typescript-eslint/consistent-type-imports`: `type`은 `import type { X }` 형태, fix 스타일은 `separate-type-imports`.
- **타입 지정 스타일**  
  `import/consistent-type-specifier-style`: `prefer-top-level` (타입 지정은 최상위에서).

### import 순서 (`import/order`)

- 그룹 순서: `builtin` → `external` → `internal` → `type` → `index` → `unknown`
- `react`는 external 중 **맨 앞**
- `@/**`는 **internal**
- 그룹 사이에는 **빈 줄** (`newlines-between: "always"`)
- 그룹 내부는 **알파벳 오름차순** (대소문자 무시)

### 기타 import 규칙

| 규칙 | 수준 | 의미 |
|------|------|------|
| **import/no-duplicates** | error | 같은 모듈를 여러 줄로 나눠 import 금지 |
| **import/no-default-export** | error | default export 금지 (TSX는 예외) |
| **import/no-cycle** | warn | 순환 의존성 경고 |
| **import/no-dynamic-require** | warn | 동적 require 경고 |
| **import/no-nodejs-modules** | warn | Node 전용 모듈 사용 시 경고 |

---

## 4. TypeScript

| 규칙 | 수준 | 의미 |
|------|------|------|
| **@typescript-eslint/no-explicit-any** | error | `any` 사용 금지 |
| **@typescript-eslint/await-thenable** | error | thenable이 아닌 값에 await 금지 |
| **no-unused-vars** | off | 미사용 변수는 TypeScript/TS ESLint 쪽에서 처리 |

---

## 5. React / JSX

### 컴포넌트 정의

- **이름 있는 컴포넌트:** 함수 선언 (`function Foo() {}`)
- **이름 없는 컴포넌트:** 화살표 함수 (`() => {}`)

### 렌더 / 조건 / 키 / fragment

| 규칙 | 수준 | 의미 |
|------|------|------|
| **react/jsx-no-leaked-render** | error | `0 && <X />` 같은 leak 방지, `coerce` 또는 `ternary`만 허용 |
| **react/jsx-pascal-case** | error | 컴포넌트 이름 PascalCase, AllCaps 비허용 |
| **react/no-array-index-key** | error | 배열 index를 key로 사용 금지 |
| **react/jsx-no-useless-fragment** | error | 불필요한 `<></>` 금지 |

### 인라인 함수 / 바인드

- **react/jsx-no-bind:** DOM 요소는 무시, **화살표 함수만 허용**, 일반 function/bind는 warn.

### 접근성 (jsx-a11y)

| 규칙 | 수준 | 의미 |
|------|------|------|
| **jsx-a11y/alt-text** | error | 이미지 등에 대체 텍스트 필요 |
| **jsx-a11y/anchor-is-valid** | error | `<a>`의 href 등 유효한 사용 |
| **jsx-a11y/click-events-have-key-events** | warn | 클릭 가능 요소는 키보드 접근 가능하게 |
| **jsx-a11y/no-static-element-interactions** | warn | 정적 요소에 클릭 등 부여 시 주의 |

---

## 6. 기타

- **React 버전:** `settings.react.version`: `"detect"` (package.json 기준 자동).
- **Import resolver:** TypeScript(`tsconfig.json`) + Node, `moduleDirectory`: `["node_modules", "src"]`.
- **ESLint ↔ Prettier:** `eslint-config-prettier`로 포맷 충돌 규칙 비활성화.

---

## 7. 요약 체크리스트

| 구분 | 컨벤션 |
|------|--------|
| **포맷** | 세미콜론 없음, 쌍따옴표, trailing comma, 120자/2칸 |
| **import** | 그룹별 정렬 + 빈 줄, 타입 분리, default export 금지(TSX 제외), 중복·순환 금지/경고 |
| **TypeScript** | no any, await-thenable 준수 |
| **React** | named는 function 선언, key는 index 금지, fragment/leaked render/바인드 제한 |
| **접근성** | alt-text, anchor 유효성 error / 클릭·정적 요소 상호작용 warn |
