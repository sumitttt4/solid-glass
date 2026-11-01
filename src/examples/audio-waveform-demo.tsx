import * as React from "react"

import { AudioWaveform, useMicrophoneLevels, useSimulatedLevels } from "@/components/ui/audio-waveform"
import { MicIcon } from "@/components/ui/animated-icons"
import { Button } from "@/components/ui/button"

export default function AudioWaveformDemo() {
  const mic = useMicrophoneLevels({ bands: 40 })
  const simulated = useSimulatedLevels(mic.status !== "live", 40)
  const levels = mic.status === "live" ? mic.levels : simulated
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6">
      <AudioWaveform levels={levels} height={56} className="w-full" />
      <AudioWaveform levels={levels.slice(0, 16)} variant="line" height={40} className="w-full text-[var(--tone-solid)]" data-tone="ocean" />
      <Button variant={mic.status === "live" ? "destructive" : "outline"} onClick={() => (mic.status === "live" ? mic.stop() : mic.start())}>
        <MicIcon active={mic.status === "live"} />
        {mic.status === "live" ? "Stop" : "Use my microphone"}
      </Button>
      <p className="text-muted-foreground text-xs">
        {mic.status === "denied" ? "Microphone blocked: showing simulated levels." : mic.status === "live" ? "Live from your microphone. Nothing is recorded." : "Simulated speech levels."}
      </p>
    </div>
  )
}
