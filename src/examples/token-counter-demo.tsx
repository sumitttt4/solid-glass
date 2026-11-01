import * as React from "react"

import { Slider } from "@/components/ui/slider"
import { TokenCounter } from "@/components/ui/token-counter"

export default function TokenCounterDemo() {
  const [used, setUsed] = React.useState(84_000)
  const limit = 200_000
  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-6">
      <div className="bg-card flex items-center gap-2 rounded-xl p-2">
        <span className="px-2 text-sm font-medium">Aurora Pro</span>
        <TokenCounter
          used={used}
          limit={limit}
          costPerMillion={3}
          parts={[
            { label: "System prompt", tokens: Math.round(used * 0.08) },
            { label: "Files", tokens: Math.round(used * 0.42) },
            { label: "Conversation", tokens: Math.round(used * 0.5) },
          ]}
        />
      </div>
      <label className="flex w-full flex-col gap-2 text-xs">
        <span className="text-muted-foreground">Simulate usage</span>
        <Slider value={[used]} min={0} max={limit} step={1000} onValueChange={(v) => setUsed(Array.isArray(v) ? v[0] : v)} aria-label="Tokens used" />
      </label>
    </div>
  )
}
