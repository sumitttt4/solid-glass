import { useCallback, useSyncExternalStore } from "react"

type Theme = "dark" | "light"
const KEY = "colorwork:theme"
const listeners = new Set<() => void>()
const read = (): Theme => (document.documentElement.classList.contains("dark") ? "dark" : "light")

/** Dark or light, kept on <html> as the `dark` class and remembered. Dark is the material as designed. */
export function useTheme() {
  const theme = useSyncExternalStore(
    (notify) => {
      listeners.add(notify)
      return () => {
        listeners.delete(notify)
      }
    },
    read,
    () => "dark" as Theme
  )
  const setTheme = useCallback((next: Theme) => {
    document.documentElement.classList.toggle("dark", next === "dark")
    try {
      localStorage.setItem(KEY, next)
    } catch {
      // private mode: the choice lasts for this visit
    }
    listeners.forEach((notify) => notify())
  }, [])
  return { theme, setTheme, resolvedTheme: theme }
}
