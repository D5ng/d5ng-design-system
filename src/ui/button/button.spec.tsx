import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { createRef } from "react"
import { describe, expect, it, vi } from "vitest"

import { Button } from "./button"

describe("Button", () => {
  describe("ref 동작 테스트", () => {
    it("ref가 실제 DOM 요소를 올바르게 참조한다", () => {
      const ref = createRef<HTMLButtonElement>()
      render(<Button ref={ref}>Ref Test</Button>)
      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    })

    it("asChild 속성이 있을 때, ref가 하위 컴포넌트를 참조한다", () => {
      const ref = createRef<HTMLAnchorElement>()
      render(
        <Button asChild ref={ref}>
          <a href="https://www.google.com">Google</a>
        </Button>,
      )

      expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
      expect(ref.current?.href).toMatch(/https:\/\/www\.google\.com\/?$/)
    })
  })

  describe("disabled 상태 테스트", () => {
    it("disabled 상태일 때 클릭 이벤트가 발생하지 않아야 한다", async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()

      render(
        <Button disabled onClick={handleClick}>
          차단된 버튼
        </Button>,
      )

      const button = screen.getByRole("button")
      await user.click(button)

      expect(handleClick).not.toHaveBeenCalled()
      expect(button).toBeDisabled()
    })
  })

  describe("asChild 병합 테스트", () => {
    it("상위 컴포넌트와 하위 컴포넌트의 이벤트가 모두 호출된다", async () => {
      const user = userEvent.setup()
      const parentClick = vi.fn()
      const childClick = vi.fn()

      render(
        <Button asChild onClick={parentClick}>
          <button onClick={childClick}>버튼</button>
        </Button>,
      )

      const button = screen.getByRole("button")
      await user.click(button)

      expect(parentClick).toHaveBeenCalled()
      expect(childClick).toHaveBeenCalled()
    })
  })
})
