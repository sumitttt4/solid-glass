import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

/**
 * Text to speech with the browser's own voices (Web Speech API). Returns what is needed to build
 * any control around it; `SpeakButton` is the ready-made one.
 */
export function useSpeech({ rate = 1, pitch = 1, lang }: { rate?: number; pitch?: number; lang?: string } = {}) {
  const supported = typeof window !== "undefined" && "speechSynthesis" in window
  const [speaking, setSpeaking] = React.useState(false)
  const [voices, setVoices] = React.useState<SpeechSynthesisVoice[]>([])

  React.useEffect(() => {
    if (!supported) return
    const load = () => setVoices(speechSynthesis.getVoices())
    load()
    speechSynthesis.addEventListener("voiceschanged", load)
    return () => {
      speechSynthesis.removeEventListener("voiceschanged", load)
      speechSynthesis.cancel()
    }
  }, [supported])

  const speak = React.useCallback(
    (text: string, voice?: SpeechSynthesisVoice) => {
      if (!supported || !text.trim()) return
      speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = rate
      utterance.pitch = pitch
      if (lang) utterance.lang = lang
      if (voice) utterance.voice = voice
      utterance.onstart = () => setSpeaking(true)
      utterance.onend = utterance.onerror = () => setSpeaking(false)
      speechSynthesis.speak(utterance)
    },
    [supported, rate, pitch, lang]
  )
  const stop = React.useCallback(() => {
    if (supported) speechSynthesis.cancel()
    setSpeaking(false)
  }, [supported])

  return { supported, speaking, voices, speak, stop }
}

const css = `@keyframes sb-bar{0%,100%{transform:scaleY(.35)}50%{transform:scaleY(1)}}[data-speak-button] [data-bar]{transform-origin:center;transform:scaleY(.35);transition:transform .2s}[data-speak-button][data-speaking] [data-bar]{animation:sb-bar .9s ease-in-out infinite}@media (prefers-reduced-motion:reduce){[data-speak-button] [data-bar]{animation:none!important}}`

/** Reads `text` aloud; press again to stop. Bars dance while it talks. */
export function SpeakButton({
  text,
  voice,
  rate,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "onClick"> & { text: string; voice?: SpeechSynthesisVoice; rate?: number }) {
  const { supported, speaking, speak, stop } = useSpeech({ rate })
  return (
    <Button
      data-speak-button=""
      data-speaking={speaking ? "" : undefined}
      variant="outline"
      disabled={!supported}
      aria-pressed={speaking}
      title={supported ? undefined : "This browser can't speak text"}
      onClick={() => (speaking ? stop() : speak(text, voice))}
      className={cn(className)}
      {...props}
    >
      <style href="speak-button" precedence="default">{css}</style>
      <span aria-hidden className="flex h-3.5 items-center gap-[2px]">
        {[0, 0.2, 0.4, 0.1].map((delay, i) => (
          <span key={i} data-bar className="h-full w-[2px] rounded-full bg-current" style={{ animationDelay: `${delay}s` }} />
        ))}
      </span>
      {children ?? (speaking ? "Stop" : "Listen")}
    </Button>
  )
}
