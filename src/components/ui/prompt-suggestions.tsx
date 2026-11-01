import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"

export type PromptSuggestion = {
  /** What is shown. */
  title: string
  /** A second, quieter line (cards only). */
  description?: string
  /** What is sent; defaults to the title. */
  prompt?: string
  /** A Hugeicon's data. */
  icon?: React.ComponentProps<typeof HugeiconsIcon>["icon"]
}

const css = `@keyframes ps-in{from{opacity:0;transform:translateY(6px)}}[data-slot=prompt-suggestions]>*{animation:ps-in .4s cubic-bezier(.2,.8,.2,1) both}@media (prefers-reduced-motion:reduce){[data-slot=prompt-suggestions]>*{animation:none}}`

/** Starting points for an empty chat: pills in a row, or cards in a grid. */
export function PromptSuggestions({
  suggestions,
  onSelect,
  variant = "cards",
  className,
}: {
  suggestions: PromptSuggestion[]
  onSelect: (prompt: string) => void
  variant?: "cards" | "pills"
  className?: string
}) {
  return (
    <div
      data-slot="prompt-suggestions"
      data-variant={variant}
      className={cn(variant === "cards" ? "grid gap-2 sm:grid-cols-2" : "flex flex-wrap justify-center gap-2", className)}
    >
      <style href="prompt-suggestions" precedence="default">{css}</style>
      {suggestions.map((s, i) => (
        <button
          key={s.title}
          type="button"
          onClick={() => onSelect(s.prompt ?? s.title)}
          title={variant === "pills" ? s.title : undefined}
          style={{ animationDelay: `${i * 50}ms` }}
          className={cn(
            "group text-foreground hover:bg-accent focus-visible:ring-ring/40 cursor-pointer text-left transition-[background-color,border-color,transform] outline-none focus-visible:ring-3 active:scale-[.98]",
            variant === "cards"
              ? "bg-card flex min-h-14 items-center gap-3 rounded-xl px-3.5 py-3"
              : "border-border bg-card inline-flex h-8 max-w-full min-w-0 items-center gap-1.5 rounded-full border px-3 text-sm"
          )}
        >
          {s.icon && (
            <span className={cn("text-muted-foreground group-hover:text-primary shrink-0 transition-colors", variant === "cards" && "bg-muted grid size-8 place-items-center rounded-lg")}>
              <HugeiconsIcon icon={s.icon} size={variant === "cards" ? 17 : 15} className="block" />
            </span>
          )}
          {variant === "cards" ? (
            <span className="flex min-w-0 flex-col justify-center gap-0.5">
              <span dir="auto" className="line-clamp-2 block text-sm leading-5 font-medium [overflow-wrap:anywhere]">{s.title}</span>
              {s.description && <span dir="auto" className="text-muted-foreground line-clamp-2 block text-xs leading-4 [overflow-wrap:anywhere]">{s.description}</span>}
            </span>
          ) : (
            <span dir="auto" className="min-w-0 truncate font-medium">{s.title}</span>
          )}
        </button>
      ))}
    </div>
  )
}
