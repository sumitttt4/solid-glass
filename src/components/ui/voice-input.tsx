import * as React from "react"

import { cn } from "@/lib/utils"
import { MicIcon } from "@/components/ui/animated-icons"
import { AudioWaveform, useMicrophoneLevels, useSimulatedLevels } from "@/components/ui/audio-waveform"
import { useSpeechRecognition } from "@/components/ui/live-transcript"

export type VoiceInputProps = Omit<React.ComponentProps<"div">, "onChange"> & {
  /** Called with the full transcript when recording stops. */
  onTranscript?: (text: string) => void
  lang?: string
  /** Without a microphone (or permission), show believable levels instead of nothing. */
  simulateWithoutMic?: boolean
}

const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`

/**
 * Press to talk: a microphone button that opens into a live waveform, a timer and what has
 * been heard so far. On stop it hands back the transcript. Speech recognition runs in the
 * browser where supported; levels come from the microphone itself.
 */
export function VoiceInput({ onTranscript, lang, simulateWithoutMic = true, className, ...props }: VoiceInputProps) {
  const mic = useMicrophoneLevels({ bands: 28 })
  const speech = useSpeechRecognition({ lang })
  const [recording, setRecording] = React.useState(false)
  const [seconds, setSeconds] = React.useState(0)
  const simulated = useSimulatedLevels(recording && mic.status !== "live" && simulateWithoutMic, 28)
  const levels = mic.status === "live" ? mic.levels : simulated

  React.useEffect(() => {
    if (!recording) return
    setSeconds(0)
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(timer)
  }, [recording])

  async function begin() {
    speech.reset()
    setRecording(true)
    speech.start()
    await mic.start()
  }
  // The recognizer delivers its last phrase after it is told to stop: hand the transcript
  // back once it has actually finished.
  const flush = React.useRef(false)
  function end() {
    setRecording(false)
    mic.stop()
    speech.stop()
    flush.current = true
  }
  React.useEffect(() => {
    if (!flush.current || speech.listening) return
    flush.current = false
    onTranscript?.(speech.text.trim())
  }, [speech.listening, speech.text, onTranscript])

  const heard = [speech.text, speech.interim].filter(Boolean).join(" ")
  const note =
    mic.status === "denied"
      ? "Microphone blocked. Showing a preview of the levels."
      : mic.status === "unsupported"
        ? "No microphone here. Showing a preview of the levels."
        : !speech.supported
          ? "This browser can't transcribe; levels only."
          : speech.error
            ? `Transcription stopped: ${speech.error}`
            : null

  return (
    <div
      data-slot="voice-input"
      data-recording={recording ? "" : undefined}
      className={cn("bg-card text-card-foreground flex w-full max-w-md flex-col gap-3 rounded-2xl p-3", className)}
      {...props}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={recording ? end : begin}
          aria-pressed={recording}
          aria-label={recording ? "Stop recording" : "Start recording"}
          className={cn(
            "grid size-11 shrink-0 cursor-pointer place-items-center rounded-full transition-[background-color,box-shadow,transform] active:scale-95",
            recording ? "bg-destructive text-white shadow-[0_0_0_6px_color-mix(in_oklch,var(--destructive)_18%,transparent)]" : "bg-primary text-primary-foreground"
          )}
        >
          <MicIcon size={20} active={recording} />
        </button>
        <AudioWaveform levels={levels} height={36} className={cn("min-w-0 flex-1", !recording && "opacity-40")} />
        <span className="text-muted-foreground w-10 text-right font-mono text-xs tabular-nums" aria-label="Recording time">
          {clock(seconds)}
        </span>
      </div>
      {(recording || heard) && (
        <p aria-live="polite" className={cn("px-1 text-sm leading-relaxed", !heard && "text-muted-foreground")}>
          {heard || "Listening…"}
        </p>
      )}
      {note && recording && <p className="text-muted-foreground px-1 text-xs">{note}</p>}
    </div>
  )
}
