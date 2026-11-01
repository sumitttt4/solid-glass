import * as React from "react"

import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export type TokenPart = { label: string; tokens: number; color?: string }

const DEFAULT_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"]
const fmt = (n: number) => (n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(n >= 10_000 ? 0 : 1)}K` : String(n))

function levelColor(ratio: number) {
  return ratio >= 0.9 ? "oklch(0.62 0.21 20)" : ratio >= 0.7 ? "oklch(0.75 0.16 70)" : "var(--primary)"
}

/**
 * How much of the context window a conversation uses: a small ring and count that opens into
 * a breakdown with a stacked bar and an optional cost. Turns amber at 70% and red at 90%.
 */
export function TokenCounter({
  used,
  limit,
  parts,
  costPerMillion,
  className,
}: {
  used: number
  limit: number
  parts?: TokenPart[]
  /** Price per million input tokens, to show an estimated cost. */
  costPerMillion?: number
  className?: string
}) {
  const ratio = Math.min(1, used / limit)
  const color = levelColor(ratio)
  const r = 7
  const c = 2 * Math.PI * r
  return (
    <Popover>
      <PopoverTrigger
        data-slot="token-counter"
        aria-label={`${fmt(used)} of ${fmt(limit)} tokens used`}
        className={cn(
          "text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-ring/40 inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg px-2 font-mono text-xs tabular-nums outline-none focus-visible:ring-3",
          className
        )}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden className="-rotate-90">
          <circle cx="9" cy="9" r={r} fill="none" stroke="currentColor" strokeOpacity={0.18} strokeWidth="2.25" />
          <circle cx="9" cy="9" r={r} fill="none" stroke={color} strokeWidth="2.25" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - ratio)} className="transition-[stroke-dashoffset] duration-500" />
        </svg>
        {Math.round(ratio * 100)}%
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 gap-3 p-4">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-semibold">Context window</span>
          <span className="text-muted-foreground font-mono text-xs tabular-nums">
            {fmt(used)} / {fmt(limit)}
          </span>
        </div>
        <div className="bg-muted flex h-2 overflow-hidden rounded-full" role="img" aria-label="Token breakdown">
          {(parts ?? [{ label: "Used", tokens: used, color }]).map((part, i) => (
            <span key={part.label} className="h-full transition-[width] duration-500 first:rounded-l-full" style={{ width: `${(part.tokens / limit) * 100}%`, background: part.color ?? DEFAULT_COLORS[i % 5] }} />
          ))}
        </div>
        {parts && (
          <ul className="flex flex-col gap-1.5 text-xs">
            {parts.map((part, i) => (
              <li key={part.label} className="flex items-center gap-2">
                <span className="size-2 rounded-full" style={{ background: part.color ?? DEFAULT_COLORS[i % 5] }} />
                <span className="flex-1">{part.label}</span>
                <span className="text-muted-foreground font-mono tabular-nums">{fmt(part.tokens)}</span>
              </li>
            ))}
            <li className="flex items-center gap-2">
              <span className="bg-muted size-2 rounded-full ring-1 ring-current/20" />
              <span className="text-muted-foreground flex-1">Free</span>
              <span className="text-muted-foreground font-mono tabular-nums">{fmt(Math.max(0, limit - used))}</span>
            </li>
          </ul>
        )}
        {costPerMillion !== undefined && (
          <div className="border-border flex justify-between border-t pt-3 text-xs">
            <span className="text-muted-foreground">Estimated input cost</span>
            <span className="font-mono font-medium tabular-nums">${((used / 1_000_000) * costPerMillion).toFixed(4)}</span>
          </div>
        )}
        {ratio >= 0.9 && <p className="text-xs" style={{ color }}>Almost full. Older messages will be summarized soon.</p>}
      </PopoverContent>
    </Popover>
  )
}
