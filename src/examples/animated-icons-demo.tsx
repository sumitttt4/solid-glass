import * as React from "react"

import { ICON_GROUPS, TWO_STATE_ICONS, type AnimatedIconName, type AnimatedIconProps } from "@/components/ui/animated-icons"
import { Switch } from "@/components/ui/switch"

export default function AnimatedIconsDemo() {
  const [loop, setLoop] = React.useState(false)
  const [active, setActive] = React.useState<Record<string, boolean>>({})
  return (
    <div className="flex w-full max-w-3xl flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted-foreground text-sm">Hover to play. Two-state icons switch on click.</p>
        <label className="flex items-center gap-2 text-sm font-medium">
          <Switch checked={loop} onCheckedChange={setLoop} />
          Loop all
        </label>
      </div>
      {ICON_GROUPS.map((group) => (
        <section key={group.name} className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold">
            {group.name} <span className="text-muted-foreground font-normal">{Object.keys(group.icons).length}</span>
          </h3>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(84px,1fr))] gap-2">
            {Object.entries(group.icons).map(([name, Icon]) => {
              const twoState = TWO_STATE_ICONS.includes(name as AnimatedIconName)
              const on = !!active[name]
              const Glyph = Icon as React.ComponentType<AnimatedIconProps>
              return (
                <button
                  key={name}
                  type="button"
                  aria-pressed={twoState ? on : undefined}
                  onClick={() => twoState && setActive((all) => ({ ...all, [name]: !all[name] }))}
                  className="bg-card text-foreground hover:text-primary flex aspect-square cursor-pointer flex-col items-center justify-center gap-2.5 rounded-xl transition-colors"
                >
                  <Glyph size={24} animate={loop} active={on} />
                  <span className="text-muted-foreground text-[11px] font-medium">{name}</span>
                </button>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
