import * as React from "react"

import { cn } from "@/lib/utils"

export type MicrophoneStatus = "idle" | "requesting" | "live" | "denied" | "unsupported"

/**
 * The microphone's loudness, split into `bands` bars between 0 and 1, read from a Web Audio
 * analyser on every frame while it is live. Nothing is recorded or sent anywhere.
 */
export function useMicrophoneLevels({ bands = 24, smoothing = 0.75 }: { bands?: number; smoothing?: number } = {}) {
  const [status, setStatus] = React.useState<MicrophoneStatus>("idle")
  const [levels, setLevels] = React.useState<number[]>(() => Array(bands).fill(0))
  const parts = React.useRef<{ stream?: MediaStream; context?: AudioContext; frame?: number }>({})

  const stop = React.useCallback(() => {
    const { stream, context, frame } = parts.current
    if (frame) cancelAnimationFrame(frame)
    stream?.getTracks().forEach((track) => track.stop())
    void context?.close().catch(() => {})
    parts.current = {}
    setLevels(Array(bands).fill(0))
    setStatus((current) => (current === "live" || current === "requesting" ? "idle" : current))
  }, [bands])

  const start = React.useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia || typeof AudioContext === "undefined") {
      setStatus("unsupported")
      return false
    }
    setStatus("requesting")
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } })
      const context = new AudioContext()
      const analyser = context.createAnalyser()
      analyser.fftSize = 256
      analyser.smoothingTimeConstant = smoothing
      context.createMediaStreamSource(stream).connect(analyser)
      const data = new Uint8Array(analyser.frequencyBinCount)
      // Voices live in the lower half of the spectrum: spread the bars over that.
      const usable = Math.floor(data.length * 0.6)
      const tick = () => {
        analyser.getByteFrequencyData(data)
        const next: number[] = []
        for (let i = 0; i < bands; i++) {
          const from = Math.floor((i / bands) * usable)
          const to = Math.max(from + 1, Math.floor(((i + 1) / bands) * usable))
          let sum = 0
          for (let j = from; j < to; j++) sum += data[j]
          next.push(Math.min(1, sum / (to - from) / 200))
        }
        setLevels(next)
        parts.current.frame = requestAnimationFrame(tick)
      }
      parts.current = { stream, context }
      setStatus("live")
      tick()
      return true
    } catch {
      setStatus("denied")
      return false
    }
  }, [bands, smoothing])

  React.useEffect(() => stop, [stop])
  const level = levels.reduce((a, b) => a + b, 0) / (levels.length || 1)
  return { status, levels, level, start, stop }
}

/** Believable speech-like levels for previews and for when there is no microphone. */
export function useSimulatedLevels(active: boolean, bands = 24) {
  const [levels, setLevels] = React.useState<number[]>(() => Array(bands).fill(0))
  React.useEffect(() => {
    if (!active) {
      setLevels(Array(bands).fill(0))
      return
    }
    let frame = 0
    const begin = performance.now()
    const tick = (now: number) => {
      const t = (now - begin) / 1000
      // A syllable envelope over a slowly moving spectrum.
      const syllable = Math.max(0, Math.sin(t * 7.3) * 0.5 + Math.sin(t * 3.1 + 1) * 0.5)
      setLevels(
        Array.from({ length: bands }, (_, i) => {
          const shape = Math.exp(-((i / bands - 0.32 - Math.sin(t) * 0.08) ** 2) / 0.05)
          return Math.min(1, shape * syllable * (0.75 + Math.random() * 0.35))
        })
      )
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, bands])
  return levels
}

export type AudioWaveformProps = React.ComponentProps<"div"> & {
  /** One value per bar, 0 to 1. */
  levels: number[]
  /** `bars` grow from the middle; `line` draws a smooth wave. */
  variant?: "bars" | "line"
  /** Height in pixels. */
  height?: number
}

/** Bars (or a line) that move with a voice. Colour comes from `currentColor`. */
export function AudioWaveform({ levels, variant = "bars", height = 40, className, style, ...props }: AudioWaveformProps) {
  if (variant === "line") {
    const w = 200
    const points = levels.map((v, i) => {
      const x = (i / Math.max(1, levels.length - 1)) * w
      const y = 20 - (i % 2 ? -1 : 1) * Math.max(0.6, v * 18)
      return [x, y] as const
    })
    const d = points.reduce((path, [x, y], i) => {
      if (!i) return `M${x},${y}`
      const [px, py] = points[i - 1]
      const cx = (px + x) / 2
      return `${path} C${cx},${py} ${cx},${y} ${x},${y}`
    }, "")
    return (
      <div data-slot="audio-waveform" data-variant="line" aria-hidden className={cn("text-primary", className)} style={{ height, ...style }} {...props}>
        <svg viewBox={`0 0 ${w} 40`} preserveAspectRatio="none" className="size-full overflow-visible">
          <path d={d} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
    )
  }
  return (
    <div
      data-slot="audio-waveform"
      data-variant="bars"
      aria-hidden
      className={cn("flex items-center justify-center gap-[3px] text-primary", className)}
      style={{ height, ...style }}
      {...props}
    >
      {levels.map((v, i) => (
        <span
          key={i}
          className="w-[3px] shrink-0 rounded-full bg-current transition-[height] duration-75 ease-out"
          style={{ height: `${Math.max(8, v * 100)}%`, opacity: 0.45 + v * 0.55 }}
        />
      ))}
    </div>
  )
}
