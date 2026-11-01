import * as React from "react"

import { cn } from "@/lib/utils"

export type Material = "solid" | "glass" | "frost" | "aurora"

export const MATERIALS: { value: Material; label: string; note: string }[] = [
  { value: "solid", label: "Normal", note: "Opaque and color-led" },
  { value: "glass", label: "Glass", note: "Thick, smoky glass" },
  { value: "frost", label: "Frost", note: "Clear glass, vivid light" },
  { value: "aurora", label: "Aurora", note: "Frost over moving light" },
]

/** Put a material on the whole page: `data-material` on <html>. */
export function applyMaterial(material: Material, root: HTMLElement = document.documentElement) {
  root.dataset.material = material
}

const swatch: Record<Material, string> = {
  solid: "bg-[var(--primary)]",
  glass: "bg-[linear-gradient(135deg,oklch(1_0_0/70%),oklch(0.6_0.02_265/40%))]",
  frost: "bg-[linear-gradient(135deg,oklch(0.8_0.15_200/80%),oklch(0.75_0.17_330/70%))]",
  aurora: "bg-[conic-gradient(from_0deg,oklch(0.72_0.17_265),oklch(0.8_0.14_200),oklch(0.78_0.15_340),oklch(0.72_0.17_265))] animate-[spin_6s_linear_infinite]",
}

/**
 * A segmented control for the four materials. Controlled: keep the value in your own state (and
 * call `applyMaterial`, or set `data-material` on any element you want finished that way).
 */
export function MaterialPicker({
  value,
  onValueChange,
  compact = false,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "onChange"> & { value: Material; onValueChange: (value: Material) => void; compact?: boolean }) {
  return (
    <div
      data-slot="material-picker"
      role="radiogroup"
      aria-label="Material"
      className={cn("bg-muted inline-flex items-center gap-0.5 rounded-full p-1", className)}
      onKeyDown={(event) => {
        const index = MATERIALS.findIndex((m) => m.value === value)
        const step = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0
        if (!step) return
        event.preventDefault()
        const next = MATERIALS[(index + step + MATERIALS.length) % MATERIALS.length]
        onValueChange(next.value)
        event.currentTarget.querySelector<HTMLElement>(`[data-value="${next.value}"]`)?.focus()
      }}
      {...props}
    >
      {MATERIALS.map((m) => {
        const checked = m.value === value
        return (
          <button
            key={m.value}
            type="button"
            role="radio"
            aria-checked={checked}
            data-value={m.value}
            tabIndex={checked ? 0 : -1}
            title={m.note}
            onClick={() => onValueChange(m.value)}
            className={cn(
              "text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-1.5 rounded-full text-xs transition-[background-color,color,box-shadow] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
              compact ? "h-7 px-2.5" : "h-8 px-3",
              checked && "bg-card text-foreground shadow-[0_1px_2px_oklch(0_0_0/12%),0_0_0_1px_var(--border)]"
            )}
          >
            <span aria-hidden className={cn("size-2.5 shrink-0 rounded-full ring-1 ring-black/10", swatch[m.value])} />
            {m.label}
          </button>
        )
      })}
    </div>
  )
}
