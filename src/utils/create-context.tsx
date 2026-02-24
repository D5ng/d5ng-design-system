import React from "react"

export function createContext<ContextValuesType extends object | null>(
  contextName: string,
  defaultContextValues?: ContextValuesType,
) {
  const Context = React.createContext<ContextValuesType | undefined>(defaultContextValues)

  function Provider({ children, ...contextValues }: ContextValuesType & { children: React.ReactNode }) {
    const value = React.useMemo(
      () => contextValues,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      Object.values(contextValues),
    ) as ContextValuesType

    return <Context.Provider value={value}>{children}</Context.Provider>
  }

  function useContext() {
    const context = React.useContext(Context)

    if (context !== undefined) {
      return context
    }

    throw new Error(`${contextName}Context는 ${contextName}Provider 내부에서만 사용할 수 있어요.`)
  }

  return [Provider, useContext] as const
}
