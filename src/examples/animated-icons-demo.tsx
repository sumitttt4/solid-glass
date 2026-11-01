import * as React from "react"

import { animatedIcons, TWO_STATE_ICONS, type AnimatedIconName } from "@/components/ui/animated-icons"
import { Switch } from "@/components/ui/switch"

export default function AnimatedIconsDemo() {
  const [loop, setLoop] = React.useState(false)
  const [active, setActive] = React.useState<Partial<Record<AnimatedIconName, boolean>>>({})
  return (
    <div className="flex w-full max-w-3xl flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted-foreground text-sm">Hover to play. Two-state icons switch on click.</p>
        <label className="flex items-center gap-2 text-sm font-medium">
          <Switch checked={loop} onCheckedChange={setLoop} />
          Loop all
        </label>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(88px,1fr))] gap-2">
        {(Object.keys(animatedIcons) as AnimatedIconName[]).map((name) => {
          const Icon = animatedIcons[name]
          const twoState = TWO_STATE_ICONS.includes(name)
          const on = !!active[name]
          return (
            <button
              key={name}
              type="button"
              aria-pressed={twoState ? on : undefined}
              onClick={() => twoState && setActive((all) => ({ ...all, [name]: !all[name] }))}
              className="bg-card text-foreground hover:text-primary group flex aspect-square cursor-pointer flex-col items-center justify-center gap-2.5 rounded-xl transition-colors"
            >
              <Icon size={26} animate={loop} active={on} />
              <span className="text-muted-foreground text-[11px] font-medium">
                {name}
                {twoState && <span className="text-primary ml-1">•</span>}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
