import * as React from "react"

import { cn } from "@/lib/utils"

export type VoiceOrbState = "idle" | "listening" | "thinking" | "speaking"

export type VoiceOrbProps = React.ComponentProps<"div"> & {
  state?: VoiceOrbState
  /** Loudness, 0 to 1: the orb swells with it while listening or speaking. */
  level?: number
  /** Diameter in pixels. */
  size?: number
}

const css = `
[data-slot=voice-orb]{--orb-a:var(--primary);--orb-b:color-mix(in oklch,var(--primary),#22d3ee 55%);--orb-c:color-mix(in oklch,var(--primary),#f472b6 55%);position:relative;display:grid;place-items:center;border-radius:50%;isolation:isolate}
[data-slot=voice-orb] .vo-glow{position:absolute;inset:-18%;border-radius:50%;background:radial-gradient(circle,color-mix(in oklch,var(--orb-a) 45%,transparent),transparent 65%);filter:blur(14px);opacity:.55;transform:scale(calc(.9 + var(--vo-level,0)*.5));transition:transform .12s ease-out,opacity .4s}
[data-slot=voice-orb] .vo-body{position:absolute;inset:0;border-radius:50%;overflow:hidden;transform:scale(calc(1 + var(--vo-level,0)*.14));transition:transform .1s ease-out;box-shadow:inset 0 1px 1px #ffffff80,inset 0 -10px 24px -8px #0005,0 10px 30px -12px color-mix(in oklch,var(--orb-a) 70%,transparent)}
[data-slot=voice-orb] .vo-swirl{position:absolute;inset:-25%;background:conic-gradient(from 0deg,var(--orb-a),var(--orb-b),var(--orb-c),var(--orb-a));filter:blur(10px);animation:vo-spin 9s linear infinite}
[data-slot=voice-orb] .vo-swirl+.vo-swirl{inset:-10%;opacity:.7;mix-blend-mode:overlay;animation-duration:6s;animation-direction:reverse}
[data-slot=voice-orb] .vo-shine{position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle at 32% 26%,#ffffffd0,#ffffff00 38%),radial-gradient(circle at 70% 85%,#ffffff40,#fff0 40%)}
[data-slot=voice-orb][data-state=idle] .vo-body{animation:vo-breathe 4s ease-in-out infinite}
[data-slot=voice-orb][data-state=idle] .vo-swirl{animation-duration:16s}
[data-slot=voice-orb][data-state=thinking] .vo-swirl{animation-duration:1.6s}
[data-slot=voice-orb][data-state=thinking] .vo-body{animation:vo-think 1.4s ease-in-out infinite}
[data-slot=voice-orb][data-state=speaking] .vo-glow{opacity:.85}
[data-slot=voice-orb][data-state=listening] .vo-ring{position:absolute;inset:0;border-radius:50%;border:1.5px solid color-mix(in oklch,var(--orb-a) 60%,transparent);animation:vo-ring 1.8s ease-out infinite}
[data-slot=voice-orb][data-state=listening] .vo-ring+.vo-ring{animation-delay:.9s}
@keyframes vo-spin{to{transform:rotate(360deg)}}
@keyframes vo-breathe{0%,100%{transform:scale(.97)}50%{transform:scale(1.02)}}
@keyframes vo-think{0%,100%{transform:scale(.94)}50%{transform:scale(1.03)}}
@keyframes vo-ring{from{transform:scale(1);opacity:.8}to{transform:scale(1.55);opacity:0}}
@media (prefers-reduced-motion:reduce){[data-slot=voice-orb] *{animation:none!important}}
`

/** A living orb for a voice assistant: it breathes when idle, swells with your voice, swirls while thinking. */
export function VoiceOrb({ state = "idle", level = 0, size = 120, className, style, ...props }: VoiceOrbProps) {
  return (
    <div
      data-slot="voice-orb"
      data-state={state}
      role="img"
      aria-label={`Voice assistant ${state}`}
      className={cn("shrink-0", className)}
      style={{ width: size, height: size, "--vo-level": Math.max(0, Math.min(1, level)), ...style } as React.CSSProperties}
      {...props}
    >
      <style href="voice-orb" precedence="default">{css}</style>
      <span className="vo-glow" />
      {state === "listening" && (
        <>
          <span className="vo-ring" />
          <span className="vo-ring" />
        </>
      )}
      <span className="vo-body">
        <span className="vo-swirl" />
        <span className="vo-swirl" />
        <span className="vo-shine" />
      </span>
    </div>
  )
}
