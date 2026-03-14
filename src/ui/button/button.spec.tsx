import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { Button } from "./button"

describe("Button", () => {
  describe("className 병합", () => {
    it("className이 variant 클래스와 병합되어 적용된다", () => {
      render(<Button className="custom-class">버튼</Button>)
      const button = screen.getByRole("button")
      expect(button).toHaveClass("bg-highlight-darkest")
      expect(button).toHaveClass("custom-class")
    })
  })

  describe("이벤트 및 HTML 속성", () => {
    it("onClick이 호출된다", () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>버튼</Button>)
      fireEvent.click(screen.getByRole("button"))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  describe("asChild (Slot)", () => {
    it("asChild=true일 때 자식 요소가 렌더되고 버튼이 아니다", () => {
      render(
        <Button asChild>
          <a href="/go" data-testid="link">
            링크처럼 쓰기
          </a>
        </Button>,
      )
      const link = screen.getByTestId("link")
      expect(link).toBeInTheDocument()
      expect(link.tagName).toBe("A")
      expect(link).toHaveAttribute("href", "/go")
      expect(screen.queryByRole("button")).not.toBeInTheDocument()
    })

    it("asChild일 때 전달한 className이 자식에 병합된다", () => {
      render(
        <Button asChild variant="primary" className="button-variant">
          <a href="/" data-testid="link">
            링크
          </a>
        </Button>,
      )
      const link = screen.getByTestId("link")
      expect(link).toHaveClass("bg-highlight-darkest")
      expect(link).toHaveClass("button-variant")
    })

    it("asChild일 때 onClick이 자식에 전달되어 동작한다", () => {
      const handleClick = vi.fn()
      render(
        <Button asChild onClick={handleClick}>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a href="#" data-testid="link">
            클릭
          </a>
        </Button>,
      )
      fireEvent.click(screen.getByTestId("link"))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })
})
