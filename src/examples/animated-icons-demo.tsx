import * as React from "react"

import { animatedIcons, type AnimatedIconName } from "@/components/ui/animated-icons"
import { Switch } from "@/components/ui/switch"

const twoState = new Set<AnimatedIconName>(["Copy", "Menu", "Theme", "Mic", "Heart"])

export default function AnimatedIconsDemo() {
  const [loop, setLoop] = React.useState(false)
  const [active, setActive] = React.useState<Partial<Record<AnimatedIconName, boolean>>>({})
  return (
    <div className="flex w-full max-w-2xl flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <p className="text-muted-foreground">Hover an icon to play it. Two-state icons switch on click.</p>
        <label className="flex items-center gap-2">
          <Switch checked={loop} onCheckedChange={setLoop} aria-label="Play all on a loop" />
          Loop all
        </label>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-7">
        {(Object.keys(animatedIcons) as AnimatedIconName[]).map((name) => {
          const Icon = animatedIcons[name]
          const on = !!active[name]
          return (
            <button
              key={name}
              type="button"
              aria-pressed={twoState.has(name) ? on : undefined}
              onClick={() => twoState.has(name) && setActive((all) => ({ ...all, [name]: !all[name] }))}
              className="bg-card hover:text-primary flex cursor-pointer flex-col items-center gap-2 rounded-xl px-2 py-4 text-xs transition-colors"
            >
              <Icon size={24} animate={loop} active={on} />
              <span className="text-muted-foreground">{name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
