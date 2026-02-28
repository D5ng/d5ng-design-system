import type { ReactNode } from "react"

export function Slottable({ children }: { children: ReactNode }) {
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>
}
