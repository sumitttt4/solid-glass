import * as React from "react"

import { useMicrophoneLevels, useSimulatedLevels } from "@/components/ui/audio-waveform"
import { Button } from "@/components/ui/button"
import { VoiceOrb, type VoiceOrbState } from "@/components/ui/voice-orb"

const states: VoiceOrbState[] = ["idle", "listening", "thinking", "speaking"]

export default function VoiceOrbDemo() {
  const [state, setState] = React.useState<VoiceOrbState>("idle")
  const mic = useMicrophoneLevels({ bands: 8 })
  const simulated = useSimulatedLevels((state === "listening" && mic.status !== "live") || state === "speaking", 8)
  const level = mic.status === "live" && state === "listening" ? mic.level * 2.2 : simulated.reduce((a, b) => a + b, 0) / 8
  return (
    <div className="flex flex-col items-center gap-8">
      <VoiceOrb state={state} level={level} size={140} />
      <div className="flex flex-wrap justify-center gap-1.5">
        {states.map((s) => (
          <Button key={s} size="sm" variant={s === state ? "default" : "outline"} onClick={() => setState(s)} className="capitalize">
            {s}
          </Button>
        ))}
      </div>
      <Button
        size="sm"
        variant="ghost"
        onClick={async () => {
          if (mic.status === "live") return mic.stop()
          setState("listening")
          await mic.start()
        }}
      >
        {mic.status === "live" ? "Stop microphone" : "React to my microphone"}
      </Button>
    </div>
  )
}
