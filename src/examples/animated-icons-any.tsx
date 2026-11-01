import * as React from "react"
import {
  AiBrain01Icon, Airplane01Icon, AlarmClockIcon, BubbleChatIcon, Camera01Icon, CloudUploadIcon, CodeIcon, Coffee01Icon,
  CreditCardIcon, DashboardSquare01Icon, Database01Icon, FireIcon, GiftIcon, Globe02Icon, HeadphonesIcon, Key01Icon,
  LeafIcon, MusicNote01Icon, PaintBoardIcon, PuzzleIcon, ShoppingBag01Icon, SmileIcon, Target01Icon, UserGroupIcon,
} from "@hugeicons/core-free-icons"

import { AnimatedIcon, ICON_ANIMATIONS, type IconAnimation } from "@/components/ui/animated-icons"

const icons = {
  AiBrain01Icon, Airplane01Icon, AlarmClockIcon, BubbleChatIcon, Camera01Icon, CloudUploadIcon, CodeIcon, Coffee01Icon,
  CreditCardIcon, DashboardSquare01Icon, Database01Icon, FireIcon, GiftIcon, Globe02Icon, HeadphonesIcon, Key01Icon,
  LeafIcon, MusicNote01Icon, PaintBoardIcon, PuzzleIcon, ShoppingBag01Icon, SmileIcon, Target01Icon, UserGroupIcon,
}

/** Any Hugeicon, any preset: pick a motion and hover the grid. */
export default function AnimateAnyIcon() {
  const [animation, setAnimation] = React.useState<IconAnimation>("wiggle")
  const [replay, setReplay] = React.useState(0)
  return (
    <div className="flex w-full max-w-3xl flex-col gap-5">
      <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Animation preset">
        {ICON_ANIMATIONS.map((name) => (
          <button
            key={name}
            role="radio"
            aria-checked={animation === name}
            onClick={() => {
              setAnimation(name)
              setReplay((n) => n + 1)
            }}
            className="border-border text-muted-foreground hover:text-foreground aria-checked:bg-primary aria-checked:text-primary-foreground aria-checked:border-primary h-7 cursor-pointer rounded-full border px-3 text-xs font-medium transition-colors"
          >
            {name}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(64px,1fr))] gap-2">
        {Object.entries(icons).map(([name, icon]) => (
          <div key={`${name}-${replay}`} title={name} className="bg-card hover:text-primary grid aspect-square place-items-center rounded-xl transition-colors">
            <AnimatedIcon icon={icon} animation={animation} trigger={replay ? "mount" : "hover"} size={26} />
          </div>
        ))}
      </div>
      <code className="bg-muted text-muted-foreground rounded-lg px-3 py-2 font-mono text-xs">{`<AnimatedIcon icon={Camera01Icon} animation="${animation}" />`}</code>
    </div>
  )
}
