import * as React from "react"

import { cn } from "@/lib/utils"

export type TranscriptSegment = {
  id: string
  text: string
  /** Seconds from the start of the session. */
  at: number
  speaker?: string
}

type RecognitionResult = { isFinal: boolean; 0: { transcript: string } }
type RecognitionEvent = { resultIndex: number; results: ArrayLike<RecognitionResult> }
type Recognition = {
  lang: string
  continuous: boolean
  interimResults: boolean
  start(): void
  stop(): void
  abort(): void
  onresult: ((event: RecognitionEvent) => void) | null
  onerror: ((event: { error: string }) => void) | null
  onend: (() => void) | null
}

function recognitionClass(): (new () => Recognition) | undefined {
  if (typeof window === "undefined") return undefined
  const w = window as unknown as { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition
}

/**
 * Speech to text in the browser, with the Web Speech API. Final phrases arrive as segments;
 * what is still being heard is `interim`. Where the browser has no recognizer, `supported` is
 * false: plug in your own service (Whisper, Deepgram…) and feed `LiveTranscript` the same way.
 */
export function useSpeechRecognition({ lang = "en-US", speaker }: { lang?: string; speaker?: string } = {}) {
  const [supported] = React.useState(() => !!recognitionClass())
  const [listening, setListening] = React.useState(false)
  const [segments, setSegments] = React.useState<TranscriptSegment[]>([])
  const [interim, setInterim] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const recognition = React.useRef<Recognition | null>(null)
  const began = React.useRef(0)
  const wanted = React.useRef(false)

  const start = React.useCallback(() => {
    const Klass = recognitionClass()
    if (!Klass) return false
    recognition.current?.abort()
    const r = new Klass()
    r.lang = lang
    r.continuous = true
    r.interimResults = true
    r.onresult = (event) => {
      let pending = ""
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        const text = result[0].transcript.trim()
        if (!text) continue
        if (result.isFinal) {
          const at = (performance.now() - began.current) / 1000
          setSegments((all) => [...all, { id: `${Date.now()}-${i}`, text, at, speaker }])
        } else pending += `${text} `
      }
      setInterim(pending.trim())
    }
    r.onerror = (event) => {
      if (event.error !== "no-speech" && event.error !== "aborted") setError(event.error)
    }
    // Browsers end a session after a pause; keep going until asked to stop.
    r.onend = () => {
      if (wanted.current) {
        try {
          r.start()
          return
        } catch {
          /* fall through */
        }
      }
      setListening(false)
      setInterim("")
    }
    if (!began.current || !segments.length) began.current = performance.now()
    wanted.current = true
    setError(null)
    recognition.current = r
    r.start()
    setListening(true)
    return true
  }, [lang, speaker, segments.length])

  const stop = React.useCallback(() => {
    wanted.current = false
    recognition.current?.stop()
  }, [])

  const reset = React.useCallback(() => {
    setSegments([])
    setInterim("")
    began.current = 0
  }, [])

  React.useEffect(() => () => {
    wanted.current = false
    recognition.current?.abort()
  }, [])

  const text = segments.map((s) => s.text).join(" ")
  return { supported, listening, segments, interim, text, error, start, stop, reset, setSegments }
}

const stamp = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`

export type LiveTranscriptProps = React.ComponentProps<"div"> & {
  segments: TranscriptSegment[]
  /** Words still being heard, shown faint after the last line. */
  interim?: string
  listening?: boolean
  /** Shown while there is nothing yet. */
  placeholder?: React.ReactNode
  showTimestamps?: boolean
}

/** A running transcript that keeps its newest line in view. */
export function LiveTranscript({
  segments,
  interim,
  listening,
  placeholder = "Start speaking and your words appear here.",
  showTimestamps = true,
  className,
  ...props
}: LiveTranscriptProps) {
  const end = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    const box = end.current?.parentElement
    if (box) box.scrollTop = box.scrollHeight
  }, [segments.length, interim])
  const empty = !segments.length && !interim
  return (
    <div
      data-slot="live-transcript"
      data-listening={listening ? "" : undefined}
      role="log"
      aria-live="polite"
      aria-label="Transcript"
      className={cn("bg-card text-card-foreground max-h-72 overflow-y-auto rounded-xl p-4 text-sm leading-relaxed", className)}
      {...props}
    >
      <style href="live-transcript" precedence="default">{`@keyframes lt-caret{50%{opacity:0}}@keyframes lt-in{from{opacity:0;transform:translateY(4px)}}[data-slot=live-transcript] [data-line]{animation:lt-in .3s ease-out}@media (prefers-reduced-motion:reduce){[data-slot=live-transcript] *{animation:none!important}}`}</style>
      {empty ? (
        <p className="text-muted-foreground">{placeholder}</p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {segments.map((segment) => (
            <div key={segment.id} data-line className="flex gap-3">
              {showTimestamps && <span className="text-muted-foreground w-9 shrink-0 pt-px font-mono text-[11px] tabular-nums">{stamp(segment.at)}</span>}
              <p className="min-w-0">
                {segment.speaker && <span className="text-primary mr-1.5 font-medium">{segment.speaker}</span>}
                {segment.text}
              </p>
            </div>
          ))}
          {(interim || listening) && (
            <div data-line className="flex gap-3">
              {showTimestamps && <span className="w-9 shrink-0" />}
              <p className="text-muted-foreground min-w-0">
                {interim}
                {listening && <span aria-hidden className="bg-primary ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[3px] animate-[lt-caret_1s_steps(1)_infinite]" />}
              </p>
            </div>
          )}
        </div>
      )}
      <div ref={end} />
    </div>
  )
}
