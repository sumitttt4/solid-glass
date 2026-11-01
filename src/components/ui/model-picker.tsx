import * as React from "react"
import { ArrowDown01Icon, Search01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export type ModelOption = {
  id: string
  name: string
  provider: string
  description?: string
  /** Short capability labels: "Fast", "Reasoning", "Vision"… */
  tags?: string[]
  /** Context window in tokens. */
  context?: number
  /** A colour for the provider's mark. */
  color?: string
  disabled?: boolean
}

const compact = (n: number) => (n >= 1_000_000 ? `${n / 1_000_000}M` : `${Math.round(n / 1000)}K`)

function Mark({ model, size = 20 }: { model: ModelOption; size?: number }) {
  return (
    <span
      aria-hidden
      className="grid shrink-0 place-items-center rounded-md text-[10px] font-semibold text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.25)]"
      style={{ width: size, height: size, background: model.color ?? "var(--primary)" }}
    >
      {model.provider.slice(0, 1).toUpperCase()}
    </span>
  )
}

/**
 * Choose a model: a compact trigger that opens a searchable list grouped by provider, with
 * capabilities and context size. Arrow keys move, Enter picks, typing filters.
 */
export function ModelPicker({
  models,
  value,
  onValueChange,
  className,
  placeholder = "Choose a model",
}: {
  models: ModelOption[]
  value: string
  onValueChange: (id: string) => void
  className?: string
  placeholder?: string
}) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [active, setActive] = React.useState(0)
  const list = React.useRef<HTMLDivElement>(null)
  const current = models.find((m) => m.id === value)
  const q = query.trim().toLowerCase()
  const shown = models.filter((m) => !q || `${m.name} ${m.provider} ${m.tags?.join(" ")} ${m.description}`.toLowerCase().includes(q))
  const groups = [...new Set(shown.map((m) => m.provider))]
  const flat = groups.flatMap((g) => shown.filter((m) => m.provider === g))

  React.useEffect(() => {
    if (open) {
      setQuery("")
      setActive(Math.max(0, models.findIndex((m) => m.id === value)))
    }
  }, [open, models, value])
  React.useEffect(() => setActive(0), [q])
  React.useEffect(() => {
    list.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" })
  }, [active])

  function pick(model?: ModelOption) {
    if (!model || model.disabled) return
    onValueChange(model.id)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        data-slot="model-picker"
        className={cn(
          "hover:bg-accent focus-visible:ring-ring/40 inline-flex h-8 cursor-pointer items-center gap-2 rounded-lg px-2 text-sm font-medium outline-none focus-visible:ring-3",
          className
        )}
      >
        {current ? <Mark model={current} size={18} /> : null}
        <span className="truncate">{current?.name ?? placeholder}</span>
        <HugeiconsIcon icon={ArrowDown01Icon} size={14} className="text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 gap-0 overflow-hidden p-0">
        <div className="border-border flex items-center gap-2 border-b px-3">
          <HugeiconsIcon icon={Search01Icon} size={15} className="text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") (e.preventDefault(), setActive((i) => Math.min(flat.length - 1, i + 1)))
              if (e.key === "ArrowUp") (e.preventDefault(), setActive((i) => Math.max(0, i - 1)))
              if (e.key === "Enter") (e.preventDefault(), pick(flat[active]))
            }}
            placeholder="Search models…"
            aria-label="Search models"
            role="combobox"
            aria-expanded
            aria-controls="model-picker-list"
            className="placeholder:text-muted-foreground h-10 w-full bg-transparent text-sm outline-none"
          />
        </div>
        <div ref={list} id="model-picker-list" role="listbox" aria-label="Models" className="max-h-80 overflow-y-auto p-1.5">
          {!flat.length && <p className="text-muted-foreground px-3 py-6 text-center text-sm">No models match “{query}”.</p>}
          {groups.map((group) => (
            <div key={group} role="group" aria-label={group}>
              <div className="text-muted-foreground px-2 pt-2 pb-1 text-[11px] font-medium tracking-wide uppercase">{group}</div>
              {shown
                .filter((m) => m.provider === group)
                .map((model) => {
                  const index = flat.indexOf(model)
                  const selected = model.id === value
                  return (
                    <div
                      key={model.id}
                      role="option"
                      aria-selected={selected}
                      aria-disabled={model.disabled}
                      data-index={index}
                      data-active={index === active ? "" : undefined}
                      onMouseEnter={() => setActive(index)}
                      onClick={() => pick(model)}
                      className="data-[active]:bg-accent flex cursor-pointer items-start gap-2.5 rounded-lg px-2 py-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
                    >
                      <Mark model={model} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-sm font-medium">{model.name}</span>
                          {model.context && <span className="text-muted-foreground font-mono text-[10px]">{compact(model.context)}</span>}
                        </div>
                        {model.description && <p className="text-muted-foreground mt-0.5 line-clamp-2 text-xs leading-snug">{model.description}</p>}
                        {!!model.tags?.length && (
                          <div className="mt-1.5 flex flex-wrap gap-1">
                            {model.tags.map((tag) => (
                              <span key={tag} className="bg-muted text-muted-foreground rounded px-1.5 py-px text-[10px] font-medium">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <HugeiconsIcon icon={Tick02Icon} size={16} className={cn("text-primary mt-0.5 shrink-0", !selected && "invisible")} />
                    </div>
                  )
                })}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
