import type { ComponentProps } from "react"
export type ColorTone = "iris" | "fern" | "clay" | "sun" | "ocean"
/** Categorization, not a status by itself. Supply a readable label. */
export function ToneBadge({ tone = "iris", ...props }: ComponentProps<"span"> & { tone?: ColorTone }) {
  return <span data-slot="tone-badge" data-tone={tone} {...props} />
}
