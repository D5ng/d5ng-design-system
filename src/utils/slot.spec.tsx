import type { ButtonHTMLAttributes, ReactNode } from "react"

import { fireEvent, render, screen } from "@testing-library/react"
import { createRef } from "react"
import { describe, it } from "vitest"

import { Slot } from "./slot"
import { Slottable } from "./slottable"

describe("Slot 컴포넌트 상세 검증", () => {
  describe("렌더링 제약 사항", () => {
    it("자식 요소가 하나라면, 그대로 렌더링 되어야 한다", () => {
      render(
        <Slot>
          <p data-testid="slot-text">Slot</p>
        </Slot>,
      )
      expect(screen.getByTestId("slot-text")).toBeInTheDocument()
    })

    it("자식 요소가 여러 개라면, 에러를 발생시킨다", () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

      expect(() => {
        render(
          <Button asChild>
            <p data-testid="slot-text">Slot</p>
            <p data-testid="slot-text">Slot</p>
          </Button>,
        )
      }).toThrow()

      consoleSpy.mockRestore()
    })
  })

  describe("속성 위임 및 병합", () => {
    it("Slot 컴포넌트에 전달된 속성이 올바르게 하위 컴포넌트에 전달되어야 한다.", () => {
      render(
        <Slot className="parent-class" id="parent-id">
          <button className="child-class">버튼</button>
        </Slot>,
      )

      const button = screen.getByRole("button")

      expect(button).toHaveClass("parent-class")
      expect(button).toHaveAttribute("id", "parent-id")
    })

    it("이벤트 핸들러가 하위 컴포넌트로 전달되어 동작해야 한다.", () => {
      const handleClick = vi.fn()

      render(
        <Button asChild onClick={handleClick}>
          <button>버튼</button>
        </Button>,
      )

      const button = screen.getByRole("button")
      fireEvent.click(button)
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it("Ref가 자식의 실제 DOM 요소를 올바르게 가리켜야 한다", () => {
      const ref = createRef<HTMLButtonElement>()
      render(
        <Slot ref={ref}>
          <button>ref 확인</button>
        </Slot>,
      )

      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
      expect(ref.current?.textContent).toBe("ref 확인")
    })

    it("상위의 forwardRef와 하위의 ref가 모두 동일한 DOM 요소를 가리켜야 한다.", () => {
      const parentRef = createRef<HTMLButtonElement>()
      const childRef = createRef<HTMLButtonElement>()

      render(
        <Slot ref={parentRef}>
          <button ref={childRef} data-testid="target-button">
            ref 병합
          </button>
        </Slot>,
      )

      const renderedButton = screen.getByTestId("target-button")

      expect(parentRef.current).toBe(renderedButton)
      expect(childRef.current).toBe(renderedButton)
      expect(parentRef.current).toBe(childRef.current)
    })

    it("상위의 event와 하위의 event prop이 같을 때", () => {
      const handleClick = vi.fn()
      const handleClick2 = vi.fn()

      render(
        <Button asChild onClick={handleClick}>
          <button onClick={handleClick2}>버튼</button>
        </Button>,
      )

      const button = screen.getByRole("button")
      fireEvent.click(button)
      expect(handleClick).toHaveBeenCalledTimes(1)
      expect(handleClick2).toHaveBeenCalledTimes(1)
    })

    it("style과 className이 올바르게 병합되어야 한다", () => {
      render(
        <Button asChild style={{ color: "red" }} className="parent-class">
          <button style={{ color: "blue" }} className="child-class">
            버튼
          </button>
        </Button>,
      )

      const button = screen.getByRole("button")
      expect(button.style.color).toBe("blue")
      expect(button).toHaveClass("parent-class child-class")
    })
  })

  describe("Slottable 컴포넌트 렌더링 테스트", () => {
    it("Slottable을 사용해 아이콘과 동적 자식이 올바르게 조립되어야 한다", () => {
      render(
        <Slot>
          <span data-testid="left-icon">Icon</span>
          <Slottable>
            <button data-testid="main-button">Button</button>
          </Slottable>
          <span data-testid="right-icon">Icon</span>
        </Slot>,
      )

      const button = screen.getByTestId("main-button")
      const leftIcon = screen.getByTestId("left-icon")
      const rightIcon = screen.getByTestId("right-icon")

      expect(button).toBeInTheDocument()
      expect(leftIcon).toBeInTheDocument()
      expect(rightIcon).toBeInTheDocument()
    })
  })
})

function Button({
  children,
  asChild,
  leftIcon,
  rightIcon,
  ...restProps
}: {
  asChild: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const Component = asChild ? Slot : "button"

  return (
    <Component {...restProps}>
      {leftIcon}
      <Slottable>{children}</Slottable>
      {rightIcon}
    </Component>
  )
}
