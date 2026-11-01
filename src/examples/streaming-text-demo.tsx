import * as React from "react"

import { SparklesIcon } from "@/components/ui/animated-icons"
import { Button } from "@/components/ui/button"
import { ShimmerText, StreamingText } from "@/components/ui/streaming-text"

const answer = "Glass works best with something behind it: a soft gradient, a photo, or light that moves. Keep text on the thickest pane, and let the thin ones carry structure, not words."

export default function StreamingTextDemo() {
  const [phase, setPhase] = React.useState<"idle" | "thinking" | "answering">("idle")
  React.useEffect(() => {
    if (phase !== "thinking") return
    const t = setTimeout(() => setPhase("answering"), 1400)
    return () => clearTimeout(t)
  }, [phase])
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <div className="bg-card min-h-32 rounded-xl p-4 text-sm">
        {phase === "idle" && <span className="text-muted-foreground">Ask, and the answer streams in word by word.</span>}
        {phase === "thinking" && <ShimmerText>Thinking…</ShimmerText>}
        {phase === "answering" && <StreamingText text={answer} />}
      </div>
      <Button className="self-start" onClick={() => setPhase("thinking")} disabled={phase === "thinking"}>
        <SparklesIcon />
        {phase === "idle" ? "Ask about glass" : "Ask again"}
      </Button>
    </div>
  )
}
