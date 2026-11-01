import * as React from "react"

import { MicIcon } from "@/components/ui/animated-icons"
import { Button } from "@/components/ui/button"
import { LiveTranscript, useSpeechRecognition } from "@/components/ui/live-transcript"

const sample = [
  "Welcome everyone, let's get started with the weekly sync.",
  "First up, the design review for the new onboarding flow.",
  "We shipped the glass material and the voice components yesterday.",
]

export default function LiveTranscriptDemo() {
  const speech = useSpeechRecognition({ speaker: "You" })
  const [playing, setPlaying] = React.useState(false)
  const [interim, setInterim] = React.useState("")

  async function playSample() {
    speech.reset()
    setPlaying(true)
    for (const [index, line] of sample.entries()) {
      const words = line.split(" ")
      for (let i = 1; i <= words.length; i++) {
        setInterim(words.slice(0, i).join(" "))
        await new Promise((r) => setTimeout(r, 140))
      }
      setInterim("")
      speech.setSegments((all) => [...all, { id: String(index), text: line, at: index * 4 + 1, speaker: index === 1 ? "Maya" : "Sam" }])
    }
    setPlaying(false)
  }

  return (
    <div className="flex w-full max-w-lg flex-col gap-3">
      <LiveTranscript segments={speech.segments} interim={speech.interim || interim} listening={speech.listening || playing} className="h-56" />
      <div className="flex flex-wrap gap-2">
        <Button disabled={!speech.supported || playing} onClick={() => (speech.listening ? speech.stop() : speech.start())} variant={speech.listening ? "destructive" : "default"}>
          <MicIcon active={speech.listening} />
          {speech.listening ? "Stop" : "Transcribe my voice"}
        </Button>
        <Button variant="outline" disabled={playing || speech.listening} onClick={playSample}>Play a sample</Button>
        <Button variant="ghost" onClick={speech.reset}>Clear</Button>
      </div>
      {!speech.supported && <p className="text-muted-foreground text-xs">This browser has no built-in speech recognition. Try Chrome, Edge or Safari, or play the sample.</p>}
      {speech.error && <p className="text-destructive text-xs">Transcription error: {speech.error}</p>}
    </div>
  )
}
