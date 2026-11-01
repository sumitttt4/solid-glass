import * as React from "react"

import { useSimulatedLevels } from "@/components/ui/audio-waveform"
import { Button } from "@/components/ui/button"
import { LiveTranscript, type TranscriptSegment } from "@/components/ui/live-transcript"
import { SpeakButton } from "@/components/ui/speak-button"
import { ShimmerText, StreamingText } from "@/components/ui/streaming-text"
import { VoiceOrb, type VoiceOrbState } from "@/components/ui/voice-orb"

const question = "Can you plan a three day trip to Lisbon for me?"
const answer =
  "Of course. Day one: Alfama and the castle at sunset. Day two: Belém in the morning, LX Factory after lunch. Day three: a train to Sintra, back for dinner in Bairro Alto."

/** A whole voice turn, simulated: you speak, it listens, thinks, then answers aloud. */
export default function VoiceAgentDemo() {
  const [state, setState] = React.useState<VoiceOrbState>("idle")
  const [segments, setSegments] = React.useState<TranscriptSegment[]>([])
  const [interim, setInterim] = React.useState("")
  const [reply, setReply] = React.useState("")
  const levels = useSimulatedLevels(state === "listening" || state === "speaking", 8)
  const level = levels.reduce((a, b) => a + b, 0) / 8
  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([])
  React.useEffect(() => () => timers.current.forEach(clearTimeout), [])

  function run() {
    timers.current.forEach(clearTimeout)
    setSegments([])
    setReply("")
    setState("listening")
    const words = question.split(" ")
    words.forEach((_, i) => timers.current.push(setTimeout(() => setInterim(words.slice(0, i + 1).join(" ")), 180 * i + 300)))
    const heard = 180 * words.length + 500
    timers.current.push(
      setTimeout(() => {
        setInterim("")
        setSegments([{ id: "q", text: question, at: 1, speaker: "You" }])
        setState("thinking")
      }, heard),
      setTimeout(() => {
        setState("speaking")
        setReply(answer)
      }, heard + 1600)
    )
  }

  return (
    <div className="grid w-full max-w-3xl items-center gap-8 md:grid-cols-[auto_1fr]">
      <div className="flex flex-col items-center gap-4">
        <VoiceOrb state={state} level={level} size={128} />
        <Button onClick={run} disabled={state === "listening" || state === "thinking"}>
          {state === "idle" ? "Start a voice turn" : "Run again"}
        </Button>
      </div>
      <div className="flex min-w-0 flex-col gap-3">
        <LiveTranscript segments={segments} interim={interim} listening={state === "listening"} placeholder="Press start: the transcript, the thinking and the answer play out here." />
        <div className="bg-card min-h-24 rounded-xl p-4 text-sm">
          {state === "thinking" && <ShimmerText>Thinking about your trip…</ShimmerText>}
          {reply && <StreamingText text={reply} onDone={() => setState("idle")} />}
          {!reply && state !== "thinking" && <span className="text-muted-foreground">The assistant's answer streams here.</span>}
        </div>
        {reply && <SpeakButton text={reply} size="sm" className="self-start" />}
      </div>
    </div>
  )
}
