# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
pnpm run dev          # Start Vite dev server
pnpm run storybook    # Launch Storybook on port 6006

# Build
pnpm run build        # TypeScript compile + Vite build
pnpm run build-storybook  # Build static Storybook

# Test
pnpm test             # Run all tests (single-run)
pnpm run test:watch   # Watch mode
pnpm run test:ui      # Vitest UI dashboard

# Quality
pnpm run lint         # ESLint
pnpm run format       # Prettier
```

To run a single test file:
```bash
pnpm vitest run src/ui/button/button.spec.tsx
```

## Architecture

Single-package React component library (not a monorepo).

- `src/ui/` — UI components; each component has its own directory with `*.tsx`, `*.stories.tsx`, and `*.spec.tsx`
- `src/utils/` — Composition primitives: `slot.tsx`, `slottable.tsx`, `compose-refs.tsx`, `merge-props.tsx`, `create-context.tsx`
- `src/lib/cn.ts` — `cn()` utility combining `clsx` + `tailwind-merge` (extended for custom font sizes)
- `src/index.css` — Design tokens (colors, typography), Tailwind base, and CSS animations

## Component Patterns

Every component follows this pattern:

1. **CVA variants** — Use `class-variance-authority` for type-safe variant management
2. **`asChild` prop** — Slot composition for polymorphic rendering (Radix UI pattern)
3. **`forwardRef`** — All interactive/DOM components expose refs
4. **Accessibility** — ARIA attributes included by default; JSX-A11y enforced by ESLint

Example shape:
```tsx
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "@/utils/slot"
import { cn } from "@/lib/cn"

const componentVariants = cva("base-classes", {
  variants: { variant: { primary: "...", secondary: "..." } },
  defaultVariants: { variant: "primary" },
})

interface ComponentProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof componentVariants> {
  asChild?: boolean
}

const Component = React.forwardRef<HTMLElement, ComponentProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "element"
    return <Comp ref={ref} className={cn(componentVariants({ variant }), className)} {...props} />
  }
)
```

## Design Tokens

Defined as CSS custom properties in `src/index.css`:
- **Colors:** `highlight` (brand blue), `neutral-light`, `neutral-dark`, `support-{success,warning,error}`
- **Typography:** `heading-{1-5}`, `body-{xs,sm,md,lg,xl}`, `action-{sm,md,lg}`, `caption`
- **Font:** Pretendard Variable (loaded via CDN, Korean-optimized)

## Tooling Notes

- **Path alias:** `@/` maps to `src/` (configured in tsconfig and vite-tsconfig-paths)
- **Tailwind CSS 4** via `@tailwindcss/vite` plugin — no `tailwind.config.js` file
- **React Compiler** enabled (automatic memoization via Babel plugin)
- **Commit format:** Conventional Commits enforced by commitlint; allowed types: `feat`, `fix`, `design`, `refactor`, `style`, `docs`, `test`, `chore`, `perf`, `ci`, `revert`, `merge`, `hotfix`
- **Pre-commit:** Husky + lint-staged runs lint/format on staged files
- **Storybook** integrates Vitest (tests visible in Storybook UI) and a11y addon (todo mode — violations shown but don't fail CI)
- **Visual regression:** Chromatic integration available via `build-storybook`

## Code Review Guidelines

### Naming — Intent-First
- 이름은 **무엇을 하는지(how)**가 아닌 **왜 존재하는지(why/what)**를 표현해야 한다
  - Bad: `handleClick`, `processData`, `isTrue`
  - Good: `submitPaymentForm`, `filterExpiredSessions`, `isUserEligible`
- Boolean은 `is/has/can/should` 접두사로 상태를 명확히 한다
- 이벤트 핸들러는 `on` + 도메인 맥락으로 표현한다 (`onPaymentSubmit` > `onClick`)

### Component Interface Design
- Props는 컴포넌트의 **역할 경계**를 명확히 드러내야 한다
- 내부 구현을 노출하는 prop명은 지양한다 (`isRedBackground` > `variant="error"`)
- 과도한 prop drilling은 컴포넌트 분리 또는 `asChild` 패턴을 검토한다
- 선택적 props에는 합리적인 기본값을 제공한다
