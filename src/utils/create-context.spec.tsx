import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { createContext } from "./create-context"

describe("createContext 유틸리티", (): void => {
  describe("Provider 내부에서 Hook을 호출할 때", (): void => {
    it("상위 Provider에서 주입한 최신 컨텍스트 값을 정확히 반환해야 한다", (): void => {
      const [ThemeProvider, useTheme] = createContext<{ theme: string }>("Theme", { theme: "light" })

      function ThemeDisplayComponent() {
        const { theme } = useTheme()
        return <span data-testid="theme-value">{theme}</span>
      }

      render(
        <ThemeProvider theme="dark">
          <ThemeDisplayComponent />
        </ThemeProvider>,
      )

      expect(screen.getByTestId("theme-value")).toHaveTextContent("dark")
    })
  })

  // 2. 예외 상황 처리 및 기본값 메커니즘 검증
  describe("Provider 외부에서 Hook을 호출할 때", (): void => {
    it("기본값이 제공되었다면 에러 없이 기본값을 반환해야 한다", (): void => {
      const [, useTheme] = createContext<{ theme: string }>("Theme", { theme: "light" })

      function ThemeDisplayComponent() {
        const { theme } = useTheme()
        return <span data-testid="theme-value">{theme}</span>
      }

      render(<ThemeDisplayComponent />)

      expect(screen.getByTestId("theme-value")).toHaveTextContent("light")
    })

    it("기본값이 없고 Provider 외부라면, 명확한 가이드가 담긴 에러를 던져야 한다", (): void => {
      const [, useTheme] = createContext<{ theme: string }>("Auth")

      function AuthConsumerComponent() {
        useTheme()
        return null
      }

      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

      expect(() => render(<AuthConsumerComponent />)).toThrow("AuthContext는 AuthProvider 내부에서만 사용할 수 있어요.")

      consoleSpy.mockRestore()
    })
  })
})
