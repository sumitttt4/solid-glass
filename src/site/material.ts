import { useCallback, useSyncExternalStore } from "react"
import { applyMaterial, MATERIALS, type Material } from "@/components/ui/material-picker"

const KEY = "colorwork:material"
const listeners = new Set<() => void>()
const read = (): Material => {
  const value = document.documentElement.dataset.material
  return MATERIALS.some((m) => m.value === value) ? (value as Material) : "solid"
}

/** The site's material, kept on <html> as data-material and remembered. */
export function useMaterial() {
  const material = useSyncExternalStore(
    (notify) => {
      listeners.add(notify)
      return () => {
        listeners.delete(notify)
      }
    },
    read,
    () => "solid" as Material
  )
  const setMaterial = useCallback((next: Material) => {
    applyMaterial(next)
    try {
      localStorage.setItem(KEY, next)
    } catch {
      // private mode: the choice lasts for this visit
    }
    listeners.forEach((notify) => notify())
  }, [])
  return { material, setMaterial }
}
