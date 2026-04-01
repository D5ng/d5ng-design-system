import { act, fireEvent, render, renderHook, screen, waitFor } from "@testing-library/react"
import { useState } from "react"
import { describe, expect, it, vi } from "vitest"

import { useControllableState } from "./use-controllable-state"

describe("useControllableState", () => {
  describe("비제어로 동작할 때", () => {
    it("defaultProp이 초기값으로 사용된다", () => {
      render(<UncontrolledComponent defaultChecked={false} />)
      expect(screen.getByRole("checkbox")).toHaveAttribute("aria-checked", "false")
    })

    it("값이 변경되면 내부 상태가 업데이트된다", () => {
      render(<UncontrolledComponent defaultChecked={false} />)
      fireEvent.click(screen.getByRole("checkbox"))
      expect(screen.getByRole("checkbox")).toHaveAttribute("aria-checked", "true")
    })

    it("값이 변경될 때 onChange가 새 값과 함께 호출된다", async () => {
      const onCheckedChange = vi.fn()
      render(<Checkbox defaultChecked={false} onCheckedChange={onCheckedChange} />)
      fireEvent.click(screen.getByRole("checkbox"))
      await waitFor(() => expect(onCheckedChange).toHaveBeenCalledWith(true))
    })

    it("onChange 없이도 에러 없이 동작한다", () => {
      render(<UncontrolledComponent defaultChecked={false} />)
      expect(() => fireEvent.click(screen.getByRole("checkbox"))).not.toThrow()
    })
  })

  describe("제어로 동작할 때", () => {
    it("prop 값이 현재 상태로 사용된다", () => {
      render(<ControlledComponent defaultChecked={true} />)
      expect(screen.getByRole("checkbox")).toHaveAttribute("aria-checked", "true")
    })

    it("setValue 호출 시 onChange가 새 값과 함께 호출된다", () => {
      const onCheckedChange = vi.fn()
      render(<Checkbox checked={false} onCheckedChange={onCheckedChange} />)
      fireEvent.click(screen.getByRole("checkbox"))
      expect(onCheckedChange).toHaveBeenCalledWith(true)
    })

    it("onChange가 상태를 업데이트하지 않으면 prop 값이 유지된다", () => {
      const onCheckedChange = vi.fn()
      render(<Checkbox checked={false} onCheckedChange={onCheckedChange} />)
      fireEvent.click(screen.getByRole("checkbox"))
      expect(screen.getByRole("checkbox")).toHaveAttribute("aria-checked", "false")
    })

    it("현재 prop과 동일한 값으로 set하면 onChange가 호출되지 않는다", () => {
      const onCheckedChange = vi.fn()
      const { result } = renderHook(() =>
        useControllableState({ prop: false, defaultProp: false, onChange: onCheckedChange }),
      )
      act(() => result.current[1](false))
      expect(onCheckedChange).not.toHaveBeenCalled()
    })

    it("prop이 변경되면 화면에 반영된다", () => {
      render(<ControlledComponent defaultChecked={false} />)
      const checkbox = screen.getByRole("checkbox")
      expect(checkbox).toHaveAttribute("aria-checked", "false")
      fireEvent.click(checkbox)
      expect(checkbox).toHaveAttribute("aria-checked", "true")
    })
  })
})

function UncontrolledComponent({ defaultChecked }: { defaultChecked?: boolean }) {
  return <Checkbox defaultChecked={defaultChecked ?? false} />
}

function ControlledComponent({ defaultChecked }: { defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked ?? false)
  return <Checkbox checked={checked} onCheckedChange={() => setChecked((prevChecked) => !prevChecked)} />
}

function Checkbox({
  checked: checkedProp,
  defaultChecked,
  onCheckedChange,
}: {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
}) {
  const [checked, setChecked] = useControllableState({
    prop: checkedProp,
    defaultProp: defaultChecked ?? false,
    onChange: onCheckedChange,
  })

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onKeyDown={(event) => event.key === "Enter"}
      onClick={() => setChecked((prevChecked) => !prevChecked)}
    />
  )
}
