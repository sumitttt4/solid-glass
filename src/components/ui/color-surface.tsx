import type { ComponentProps } from "react"
import type { ColorTone } from "@/components/ui/tone-badge"
/** A tinted content group with an explicitly paired foreground and border. */
export function ColorSurface({ tone = "fern", ...props }: ComponentProps<"section"> & { tone?: ColorTone }) {
  return <section data-slot="color-surface" data-tone={tone} {...props} />
}
