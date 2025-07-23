"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface StartupContextType {
  hasShownStartup: boolean
  setHasShownStartup: (shown: boolean) => void
  shouldShowStartup: boolean
}

const StartupContext = createContext<StartupContextType | undefined>(undefined)

export function useStartup() {
  const context = useContext(StartupContext)
  if (context === undefined) {
    throw new Error("useStartup must be used within a StartupProvider")
  }
  return context
}

export function StartupProvider({ children }: { children: ReactNode }) {
  const [hasShownStartup, setHasShownStartup] = useState(false)
  const [shouldShowStartup, setShouldShowStartup] = useState(true)

  useEffect(() => {
    // セッションストレージから状態を復元
    const startupShown = sessionStorage.getItem("startup-shown")
    if (startupShown === "true") {
      setHasShownStartup(true)
      setShouldShowStartup(false)
    }
  }, [])

  const updateHasShownStartup = (shown: boolean) => {
    setHasShownStartup(shown)
    setShouldShowStartup(!shown)

    // セッションストレージに保存（ブラウザセッション中のみ有効）
    if (shown) {
      sessionStorage.setItem("startup-shown", "true")
    }
  }

  return (
    <StartupContext.Provider
      value={{
        hasShownStartup,
        setHasShownStartup: updateHasShownStartup,
        shouldShowStartup,
      }}
    >
      {children}
    </StartupContext.Provider>
  )
}
