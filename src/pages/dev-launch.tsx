import * as React from "react"
import { flushSync } from "react-dom"
import { MeshGradient } from "@paper-design/shaders-react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  AiMagicIcon,
  ArrowDown01Icon,
  Copy01Icon,
  Delete02Icon,
  Download04Icon,
  FavouriteIcon,
  Mic01Icon,
  Notification03Icon,
  RefreshIcon,
  Rocket01Icon,
  Search01Icon,
  SentIcon,
  Settings02Icon,
  Sun03Icon,
  ThumbsUpIcon,
  Tick02Icon,
  VolumeHighIcon,
  ArrowUp02Icon,
  Attachment01Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

/*
 * Development only (/dev/launch): the Glaze launch video, drawn frame by frame.
 *
 * Every pixel is a function of the frame number, so a frame renders the same every time.
 * video/render.mjs steps window.__setFrame(n) through 0…839, screenshots each frame and pipes
 * them into ffmpeg; video/music.py writes the soundtrack. 1920×1080, 30 fps, 28 s.
 */

export const FPS = 30
export const TOTAL = 28 * FPS
const W = 1920
const H = 1080

const C = {
  porcelain: "#F3F5F7",
  ink: "#15171C",
  muted: "#5B6270",
  cobalt: "#2445E6",
  celadon: "#8FC9B6",
  border: "#DFE3E9",
  white: "#FFFFFF",
}

/* ---- Timing ------------------------------------------------------------------------------ */

function bezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by
  const x = (t: number) => ((ax * t + bx) * t + cx) * t
  const dx = (t: number) => (3 * ax * t + 2 * bx) * t + cx
  return (p: number) => {
    if (p <= 0) return 0
    if (p >= 1) return 1
    let t = p
    for (let i = 0; i < 8; i++) {
      const d = dx(t)
      if (Math.abs(d) < 1e-6) break
      t -= (x(t) - p) / d
    }
    t = Math.min(1, Math.max(0, t))
    return ((ay * t + by) * t + cy) * t
  }
}
const easeOut = bezier(0.23, 1, 0.32, 1)
const easeInOut = bezier(0.77, 0, 0.175, 1)
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const prog = (f: number, start: number, dur: number) => clamp((f - start) / dur)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/** A damped spring from 0 to 1 that starts at `start`; slight overshoot, settles fast. */
function spring(f: number, start: number, stiffness = 170, damping = 20) {
  const t = (f - start) / FPS
  if (t <= 0) return 0
  const w0 = Math.sqrt(stiffness)
  const z = damping / (2 * w0)
  const wd = w0 * Math.sqrt(1 - z * z)
  return 1 - Math.exp(-z * w0 * t) * (Math.cos(wd * t) + ((z * w0) / wd) * Math.sin(wd * t))
}

/** Entrance: up from below, unblurring. Emil's rule: never from nothing, ease-out. */
function enter(f: number, at: number, dur = 14, dist = 28): React.CSSProperties {
  const p = easeOut(prog(f, at, dur))
  return { opacity: p, transform: `translateY(${(1 - p) * dist}px) scale(${0.96 + 0.04 * p})`, filter: `blur(${(1 - p) * 10}px)` }
}

/* ---- Scenes ------------------------------------------------------------------------------ */

function Scene({ f, from, to, children, exit = 7 }: { f: number; from: number; to: number; exit?: number; children: (lf: number) => React.ReactNode }) {
  if (f < from || f >= to) return null
  const lf = f - from
  const out = easeOut(prog(f, to - exit, exit))
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out, transform: `translateY(${-out * 18}px)`, filter: `blur(${out * 6}px)` }}>
      {children(lf)}
    </div>
  )
}

const center: React.CSSProperties = { position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }

function Caption({ lf, children, top = 190 }: { lf: number; children: React.ReactNode; top?: number }) {
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, textAlign: "center", fontSize: 84, fontWeight: 600, letterSpacing: "-0.045em", color: C.ink, ...enter(lf, 0, 14) }}>
      {children}
    </div>
  )
}

function Mark({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} style={{ display: "block", filter: "drop-shadow(0 18px 30px rgba(36,69,230,.35))" }}>
      <defs>
        <linearGradient id="lv-fill" x1="4" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8b7cff" />
          <stop offset=".55" stopColor="#3b4cf0" />
          <stop offset="1" stopColor="#2433c4" />
        </linearGradient>
        <linearGradient id="lv-shine" x1="16" y1="3" x2="16" y2="17" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" stopOpacity=".75" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="28" height="28" rx="9" fill="url(#lv-fill)" />
      <path d="M7 12.5C7 7.5 10 5 16 5s9 2.5 9 7.5c-3-1.6-6-2.3-9-2.3s-6 .7-9 2.3Z" fill="url(#lv-shine)" />
      <circle cx="21.5" cy="21.5" r="3.2" fill="#fff" fillOpacity=".92" />
      <rect x="2.5" y="2.5" width="27" height="27" rx="8.5" fill="none" stroke="#fff" strokeOpacity=".22" />
    </svg>
  )
}

/** The mark lands, light runs across it, the wordmark slides out from behind it. */
function Logo({ lf, color, size = 190 }: { lf: number; color: string; size?: number }) {
  const s = spring(lf, 0)
  const shine = prog(lf, 14, 16)
  const reveal = easeInOut(prog(lf, 24, 18))
  const textW = size * 2.45
  return (
    <div style={{ display: "flex", alignItems: "center", transform: `translateX(${(1 - reveal) * (textW / 2 + size * 0.1)}px)` }}>
      <div style={{ position: "relative", opacity: clamp(s * 1.6), transform: `scale(${0.82 + 0.18 * s})` }}>
        <Mark size={size} />
        <div style={{ position: "absolute", inset: size * 0.06, borderRadius: size * 0.27, overflow: "hidden", pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: -size, bottom: -size, width: size * 0.35, left: lerp(-size * 0.6, size * 1.3, shine), transform: "rotate(20deg)", background: "linear-gradient(90deg, transparent, rgba(255,255,255,.55), transparent)", opacity: shine > 0 && shine < 1 ? 1 : 0 }} />
        </div>
      </div>
      <div style={{ width: textW * reveal, overflow: "hidden", marginLeft: size * 0.16 * reveal }}>
        <div style={{ fontSize: size * 0.86, fontWeight: 700, letterSpacing: "-0.055em", color, lineHeight: 1, whiteSpace: "nowrap", transform: `translateX(${(1 - reveal) * -40}px)`, opacity: reveal }}>Glaze</div>
      </div>
    </div>
  )
}

/* 0:00 */
function Intro({ lf }: { lf: number }) {
  return (
    <div style={center}>
      <Logo lf={lf} color={C.ink} />
    </div>
  )
}

/* 0:02 */
function SolidOrGlass({ lf }: { lf: number }) {
  const word = (text: string, at: number) => (
    <span style={{ display: "inline-block", marginRight: 26, ...enter(lf, at, 14, 34) }}>{text}</span>
  )
  const solidIn = spring(lf, 32)
  const glassIn = spring(lf, 58)
  const t = lf / FPS
  return (
    <div style={{ ...center, fontSize: 124, fontWeight: 600, letterSpacing: "-0.05em", color: C.ink, lineHeight: 1.06 }}>
      <div>
        {word("Beautiful", 4)}
        {word("components,", 14)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 30, marginTop: 26 }}>
        <span style={{ display: "inline-flex", alignItems: "center", height: 150, padding: "0 56px", borderRadius: 999, background: C.cobalt, color: "#fff", boxShadow: "inset 0 2px 0 rgba(255,255,255,.25), 0 24px 50px -20px rgba(36,69,230,.7)", opacity: clamp(solidIn * 1.5), transform: `scale(${0.8 + 0.2 * solidIn})` }}>
          Solid
        </span>
        <span style={{ display: "inline-block", ...enter(lf, 46, 14, 34) }}>or</span>
        <span style={{ position: "relative", display: "inline-flex", alignItems: "center", height: 150, padding: "0 56px", borderRadius: 999, overflow: "hidden", opacity: clamp(glassIn * 1.5), transform: `scale(${0.8 + 0.2 * glassIn})` }}>
          <span style={{ position: "absolute", inset: -40, background: `radial-gradient(40% 70% at ${30 + 18 * Math.sin(t * 1.6)}% ${45 + 20 * Math.cos(t * 1.3)}%, #2445E6, transparent 70%), radial-gradient(45% 80% at ${72 - 15 * Math.sin(t * 1.2)}% ${55 + 15 * Math.sin(t * 1.7)}%, #8FC9B6, transparent 70%), radial-gradient(40% 70% at 50% 100%, #b8b0ff, transparent 70%)` }} />
          <span style={{ position: "absolute", inset: 0, borderRadius: 999, background: "rgba(255,255,255,.42)", backdropFilter: "blur(22px) saturate(160%)", boxShadow: "inset 0 2px 0 rgba(255,255,255,.95), inset 0 0 0 2px rgba(255,255,255,.55), 0 24px 50px -24px rgba(36,69,230,.5)" }} />
          <span style={{ position: "relative" }}>Glass</span>
        </span>
      </div>
    </div>
  )
}

/* 0:06 */
function Buttons({ lf }: { lf: number }) {
  const move = easeInOut(prog(lf, 8, 22))
  const press = lf >= 32 && lf < 38
  const release = spring(lf, 38, 300, 22)
  const scale = lf < 32 ? 1 : press ? 0.97 : 0.97 + 0.03 * release
  const cx = lerp(1320, 648, move)
  const cy = lerp(880, 572, move)
  const toast = easeOut(prog(lf, 38, 14))
  return (
    <>
      <Caption lf={lf}>Buttons that feel right</Caption>
      <div style={{ position: "absolute", left: 0, right: 0, top: 520, display: "flex", justifyContent: "center", ...enter(lf, 4) }}>
        <div data-buttons="" style={{ display: "flex", gap: 14, transform: "scale(2.5)", transformOrigin: "center top" }}>
          <Button size="lg" data-primary="" style={{ transform: `scale(${scale})` }}>Get started</Button>
          <Button size="lg" variant="outline">
            <HugeiconsIcon icon={Download04Icon} size={16} /> Download
          </Button>
          <Button size="lg" variant="destructive">
            <HugeiconsIcon icon={Delete02Icon} size={16} /> Delete
          </Button>
        </div>
      </div>
      <svg width="44" height="44" viewBox="0 0 24 24" style={{ position: "absolute", left: cx, top: cy, transform: `scale(${press ? 0.88 : 1})`, transformOrigin: "4px 4px", filter: "drop-shadow(0 4px 6px rgba(0,0,0,.25))", opacity: clamp(lf / 6) }}>
        <path d="M4 3l16 7.2-6.8 2.1L10.9 20z" fill="#15171C" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
      <div style={{ position: "absolute", left: "50%", bottom: 90, transform: `translate(-50%, ${(1 - toast) * 140}%)`, opacity: toast, display: "flex", alignItems: "center", gap: 18, background: "#fff", borderRadius: 22, padding: "22px 30px", boxShadow: "0 0 0 1px #15171c14, 0 24px 48px -16px #15171c40", fontSize: 30, fontWeight: 500, color: C.ink }}>
        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={34} color="#17795e" />
        Workspace created
      </div>
    </>
  )
}

/** Speech-like loudness, the same every render. */
function level(t: number) {
  const syll = Math.max(0, Math.sin(t * 8.3) * 0.55 + Math.sin(t * 3.7 + 1) * 0.45)
  return clamp(syll * (0.7 + 0.3 * Math.sin(t * 13.1)))
}

function Orb({ size, t, lv }: { size: number; t: number; lv: number }) {
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <div style={{ position: "absolute", inset: -size * 0.25, borderRadius: "50%", background: "radial-gradient(circle, rgba(36,69,230,.35), transparent 65%)", filter: "blur(20px)", transform: `scale(${0.9 + lv * 0.4})` }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden", transform: `scale(${1 + lv * 0.1})`, boxShadow: "inset 0 2px 2px rgba(255,255,255,.5), inset 0 -30px 60px -20px rgba(0,0,0,.35), 0 30px 70px -30px rgba(36,69,230,.8)" }}>
        <div style={{ position: "absolute", inset: "-25%", background: "conic-gradient(from 0deg, #2445E6, #34c3d6, #b8a4ff, #2445E6)", filter: "blur(18px)", transform: `rotate(${t * 70}deg)` }} />
        <div style={{ position: "absolute", inset: "-10%", background: "conic-gradient(from 90deg, #8FC9B6, #2445E6, #f0a3d8, #8FC9B6)", filter: "blur(22px)", opacity: 0.6, mixBlendMode: "overlay", transform: `rotate(${-t * 110}deg)` }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 32% 26%, rgba(255,255,255,.85), transparent 38%), radial-gradient(circle at 70% 85%, rgba(255,255,255,.25), transparent 40%)" }} />
      </div>
    </div>
  )
}

/* 0:08 */
function Listens({ lf }: { lf: number }) {
  const t = lf / FPS
  const lv = lf > 14 ? level(t) : 0
  const text = "Book a table for two at eight tonight"
  const typed = Math.floor(clamp((lf - 22) / 70) * text.length)
  const caret = Math.floor(lf / 8) % 2 === 0
  const ring = (offset: number) => {
    const p = ((lf + offset) % 48) / 48
    return { opacity: lf > 10 ? 0.55 * (1 - p) : 0, transform: `scale(${1 + p * 0.6})` }
  }
  return (
    <>
      <Caption lf={lf} top={150}>AI that listens</Caption>
      <div style={{ position: "absolute", left: 0, right: 0, top: 330, display: "flex", justifyContent: "center", ...enter(lf, 4) }}>
        <div style={{ position: "relative" }}>
          {[0, 24].map((o) => (
            <div key={o} style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "3px solid rgba(36,69,230,.45)", ...ring(o) }} />
          ))}
          <Orb size={280} t={t} lv={lv} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 700, display: "flex", justifyContent: "center", gap: 8, height: 80, alignItems: "center", ...enter(lf, 8) }}>
        {Array.from({ length: 40 }, (_, i) => {
          const shape = Math.exp(-((i / 40 - 0.5) ** 2) / 0.06)
          const v = lf > 14 ? clamp(shape * (0.25 + 0.75 * level(t + i * 0.035)) * (0.8 + 0.2 * Math.sin(i * 1.7 + t * 9))) : 0.06
          return <span key={i} style={{ width: 8, height: `${Math.max(10, v * 100)}%`, borderRadius: 8, background: C.cobalt, opacity: 0.35 + v * 0.65 }} />
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 830, textAlign: "center", fontSize: 40, fontWeight: 500, letterSpacing: "-0.02em", color: C.ink, ...enter(lf, 14) }}>
        “{text.slice(0, typed)}
        <span style={{ display: "inline-block", width: 3, height: 44, background: C.cobalt, verticalAlign: "-8px", marginLeft: 3, opacity: typed < text.length || caret ? 1 : 0 }} />”
      </div>
    </>
  )
}

/* 0:12 */
function Streams({ lf }: { lf: number }) {
  const t = lf / FPS
  const answer = "Monday, polish every component. Tuesday, record the launch video. Wednesday, ship glazeui.xyz."
  const words = answer.split(" ")
  const shown = Math.floor(clamp((lf - 42) / 50) * words.length)
  const thinking = lf >= 22 && lf < 42
  const icons = easeOut(prog(lf, 94, 10))
  return (
    <>
      <Caption lf={lf} top={110}>Chats that stream</Caption>
      <div style={{ position: "absolute", left: "50%", top: 250, width: 1120, height: 680, marginLeft: -560, background: "#fff", borderRadius: 32, boxShadow: "0 0 0 1.5px #DFE3E9, 0 40px 80px -40px rgba(21,23,28,.35)", overflow: "hidden", fontSize: 34, color: C.ink, ...enter(lf, 4) }}>
        <div style={{ height: 86, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", borderBottom: "1.5px solid #DFE3E9", fontWeight: 600 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ width: 34, height: 34, borderRadius: 9, background: C.cobalt, color: "#fff", display: "grid", placeItems: "center", fontSize: 18 }}>G</span>
            Aurora Pro
            <HugeiconsIcon icon={ArrowDown01Icon} size={24} color={C.muted} />
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-mono)", fontSize: 22, color: C.muted }}>
            <svg width="30" height="30" viewBox="0 0 18 18" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="9" cy="9" r="7" fill="none" stroke="#15171c" strokeOpacity=".15" strokeWidth="2.2" />
              <circle cx="9" cy="9" r="7" fill="none" stroke={C.cobalt} strokeWidth="2.2" strokeLinecap="round" strokeDasharray={44} strokeDashoffset={44 * (1 - 0.06 - 0.06 * prog(lf, 42, 50))} />
            </svg>
            {Math.round(6 + 6 * prog(lf, 42, 50))}%
          </span>
        </div>
        <div style={{ padding: "40px 48px", display: "flex", flexDirection: "column", gap: 34 }}>
          <div style={{ alignSelf: "flex-end", background: "#E9EDF2", padding: "20px 28px", borderRadius: "28px 28px 10px 28px", fontWeight: 500, ...enter(lf, 10, 12, 20) }}>Plan our launch week</div>
          <div style={{ display: "flex", gap: 22, alignItems: "flex-start", opacity: lf >= 22 ? 1 : 0 }}>
            <div style={{ marginTop: 2 }}>
              <Orb size={40} t={t} lv={thinking ? 0.3 : 0} />
            </div>
            {thinking ? (
              <span style={{ fontWeight: 500, background: `linear-gradient(90deg, #5B6270 35%, #15171C 50%, #5B6270 65%)`, backgroundSize: "200% 100%", backgroundPosition: `${200 - ((lf - 22) / 20) * 200}% 0`, WebkitBackgroundClip: "text", color: "transparent" }}>Thinking…</span>
            ) : (
              <div style={{ maxWidth: 900, lineHeight: 1.5 }}>
                {words.map((w, i) => (
                  <span key={i} style={{ opacity: i < shown ? 1 : 0, filter: `blur(${i < shown ? 0 : 4}px)` }}>{w} </span>
                ))}
                <div style={{ display: "flex", gap: 26, marginTop: 22, color: C.muted, opacity: icons, transform: `translateY(${(1 - icons) * 8}px)` }}>
                  {[Copy01Icon, RefreshIcon, VolumeHighIcon, ThumbsUpIcon].map((ic, i) => (
                    <HugeiconsIcon key={i} icon={ic} size={30} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div style={{ position: "absolute", left: 28, right: 28, bottom: 28, height: 112, borderRadius: 28, border: "1.5px solid #DFE3E9", background: C.porcelain, display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: 18, color: C.muted }}>
          <span style={{ position: "absolute", top: 20, left: 26, fontSize: 26 }}>Message…</span>
          <span style={{ display: "flex", gap: 18 }}>
            <HugeiconsIcon icon={Attachment01Icon} size={30} />
            <HugeiconsIcon icon={Mic01Icon} size={30} />
          </span>
          <span style={{ width: 48, height: 48, borderRadius: 999, background: C.cobalt, display: "grid", placeItems: "center", opacity: 0.4 }}>
            <HugeiconsIcon icon={ArrowUp02Icon} size={26} color="#fff" strokeWidth={2} />
          </span>
        </div>
      </div>
    </>
  )
}

/* 0:16 */
const ICONS = [
  { icon: Notification03Icon, m: "swing" },
  { icon: FavouriteIcon, m: "beat" },
  { icon: Rocket01Icon, m: "launch" },
  { icon: Settings02Icon, m: "spin" },
  { icon: SentIcon, m: "fly" },
  { icon: Delete02Icon, m: "tilt" },
  { icon: Download04Icon, m: "drop" },
  { icon: AiMagicIcon, m: "twinkle" },
  { icon: Search01Icon, m: "scan" },
  { icon: Sun03Icon, m: "spin" },
  { icon: Mic01Icon, m: "beat" },
  { icon: Tick02Icon, m: "pop" },
] as const

function motion(m: string, p: number) {
  const s = Math.sin(p * Math.PI * 2)
  switch (m) {
    case "swing": return `rotate(${Math.sin(p * Math.PI * 4) * 16 * (1 - p)}deg)`
    case "beat": return `scale(${1 + 0.18 * Math.max(0, Math.sin(p * Math.PI * 3))})`
    case "launch": return p < 0.5 ? `translate(${p * 24}px, ${-p * 24}px)` : `translate(${(1 - p) * 12}px, ${-(1 - p) * 12}px)`
    case "spin": return `rotate(${easeInOut(p) * 180}deg)`
    case "fly": return `translate(${s * 10}px, ${-s * 10}px)`
    case "tilt": return `rotate(${-12 * Math.sin(p * Math.PI)}deg)`
    case "drop": return `translateY(${Math.abs(s) * 10}px)`
    case "twinkle": return `rotate(${s * 18}deg) scale(${1 - 0.15 * Math.abs(s)})`
    case "scan": return `translate(${s * 6}px, ${Math.cos(p * Math.PI * 2) * 6 - 6}px)`
    default: return `scale(${1 + 0.12 * Math.sin(p * Math.PI)})`
  }
}

function Icons({ lf }: { lf: number }) {
  return (
    <>
      <Caption lf={lf} top={210}>Icons that move</Caption>
      <div style={{ position: "absolute", left: 0, right: 0, top: 420, display: "grid", gridTemplateColumns: "repeat(6, 150px)", gap: 24, justifyContent: "center" }}>
        {ICONS.map(({ icon, m }, i) => {
          const at = 4 + i * 2
          const p = prog(lf, at + 10, 34)
          return (
            <div key={i} style={{ width: 150, height: 150, borderRadius: 34, background: "#fff", boxShadow: "0 0 0 1.5px #DFE3E9, 0 16px 30px -18px rgba(21,23,28,.25)", display: "grid", placeItems: "center", color: m === "beat" && i === 1 && p > 0.3 ? C.cobalt : C.ink, ...enter(lf, at, 12, 24) }}>
              <div style={{ transform: motion(m, p) }}>
                <HugeiconsIcon icon={icon} size={64} strokeWidth={1.5} />
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

/* 0:18 */
const MATS = ["solid", "glass", "frost", "aurora"] as const
const MAT_LABEL = { solid: "Normal", glass: "Glass", frost: "Frost", aurora: "Aurora" }

function Materials({ lf, f }: { lf: number; f: number }) {
  const idx = Math.min(3, Math.floor(Math.max(0, lf - 6) / 27))
  const switchAt = 6 + idx * 27
  const x = easeInOut(prog(lf, switchAt, 9))
  const prev = Math.max(0, idx - 1)
  const card = (m: (typeof MATS)[number]) => (
    <div data-material={m} style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", background: "transparent" }}>
      <div style={{ transform: "scale(1.75)" }}>
        <div className="bg-card" style={{ width: 300, display: "flex", flexDirection: "column", gap: 12, padding: 18, borderRadius: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 32, height: 32, borderRadius: 9, background: "var(--primary)", display: "grid", placeItems: "center" }}>
              <HugeiconsIcon icon={AiMagicIcon} size={17} color="#fff" />
            </span>
            <div style={{ lineHeight: 1.25 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--foreground)" }}>Join the beta</div>
              <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>Early access</div>
            </div>
          </div>
          <Input placeholder="you@example.com" readOnly className="h-9" />
          <Button>Request access</Button>
        </div>
      </div>
    </div>
  )
  const glassy = (i: number) => (MATS[i] === "solid" ? 0 : 1)
  const bgOpacity = lerp(glassy(prev), glassy(idx), idx === 0 ? 1 : x)
  return (
    <>
      <Caption lf={lf} top={90}>Four finishes. One attribute.</Caption>
      <div style={{ position: "absolute", left: "50%", top: 230, width: 1180, height: 560, marginLeft: -590, borderRadius: 44, overflow: "hidden", background: C.porcelain, boxShadow: "0 0 0 1.5px #DFE3E9, 0 50px 90px -50px rgba(36,69,230,.55)", ...enter(lf, 2) }}>
        <div style={{ position: "absolute", inset: 0, opacity: bgOpacity }}>
          <MeshGradient colors={["#2445e6", "#8fd3bf", "#eef1f6", "#a9b8ff"]} distortion={0.85} swirl={0.25} grainOverlay={0.05} speed={0} frame={6000 + f * 40} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
        </div>
        {idx > 0 && x < 1 && <div style={{ position: "absolute", inset: 0, opacity: 1 - x, filter: `blur(${x * 3}px)` }}>{card(MATS[prev])}</div>}
        <div style={{ position: "absolute", inset: 0, opacity: idx === 0 ? 1 : x, filter: `blur(${(idx === 0 ? 0 : 1 - x) * 3}px)` }}>{card(MATS[idx])}</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 830, display: "flex", justifyContent: "center", ...enter(lf, 8) }}>
        <div style={{ position: "relative", display: "flex", gap: 4, padding: 6, borderRadius: 999, background: "#E9EDF2", fontSize: 28, fontWeight: 500 }}>
          <span style={{ position: "absolute", top: 6, bottom: 6, width: 168, left: 6 + lerp(prev, idx, idx === 0 ? 1 : x) * 172, borderRadius: 999, background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,.12)" }} />
          {MATS.map((m, i) => (
            <span key={m} style={{ position: "relative", width: 168, height: 58, display: "grid", placeItems: "center", color: i === idx ? C.ink : C.muted }}>{MAT_LABEL[m]}</span>
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 930, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 30, color: C.muted, ...enter(lf, 12) }}>
        {"<html data-material=\""}
        <span style={{ color: C.cobalt }}>{MATS[idx]}</span>
        {"\">"}
      </div>
    </>
  )
}

/* 0:22 */
function Install({ lf }: { lf: number }) {
  const cmd = "npx shadcn add glaze"
  const typed = Math.floor(clamp((lf - 6) / 20) * cmd.length)
  const done = easeOut(prog(lf, 30, 10))
  return (
    <div style={center}>
      <div style={{ display: "flex", alignItems: "center", gap: 26, height: 128, padding: "0 50px", borderRadius: 32, background: C.ink, color: "#fff", fontFamily: "var(--font-mono)", fontSize: 50, boxShadow: "0 40px 80px -40px rgba(21,23,28,.6)", ...enter(lf, 0) }}>
        <span style={{ opacity: 0.5 }}>$</span>
        <span>
          {cmd.slice(0, typed)}
          <span style={{ display: "inline-block", width: 26, height: 54, verticalAlign: "-10px", marginLeft: 4, background: "#fff", opacity: typed < cmd.length || Math.floor(lf / 8) % 2 ? 0.85 : 0 }} />
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 12, color: C.celadon, fontFamily: "var(--font-sans)", fontSize: 34, fontWeight: 600, width: 200 * done, overflow: "hidden", opacity: done, whiteSpace: "nowrap" }}>
          <HugeiconsIcon icon={Tick02Icon} size={38} strokeWidth={2.2} /> Done
        </span>
      </div>
      <div style={{ marginTop: 56, fontSize: 76, fontWeight: 600, letterSpacing: "-0.045em", color: C.ink, ...enter(lf, 32) }}>Free and open source</div>
    </div>
  )
}

/* 0:24 */
function End({ lf, f }: { lf: number; f: number }) {
  const glow = easeOut(prog(lf, 0, 30))
  return (
    <div style={{ position: "absolute", inset: 0, background: "#000" }}>
      <div style={{ position: "absolute", inset: 0, opacity: glow, WebkitMaskImage: "radial-gradient(70% 75% at 50% 105%, #000 25%, transparent 75%)", maskImage: "radial-gradient(70% 75% at 50% 105%, #000 25%, transparent 75%)" }}>
        <MeshGradient colors={["#1431c4", "#14614f", "#000000", "#3b2fb0"]} distortion={0.9} swirl={0.3} grainOverlay={0.06} speed={0} frame={2000 + f * 45} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
      </div>
      <div style={{ ...center, top: -60 }}>
        <Logo lf={lf} color="#EDEDED" size={170} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center", fontSize: 44, fontWeight: 500, letterSpacing: "-0.03em", color: "#A1A1A1", ...enter(lf, 42) }}>Beautiful components, solid or glass.</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 740, display: "flex", justifyContent: "center", ...enter(lf, 54) }}>
        <span style={{ padding: "18px 40px", borderRadius: 999, fontSize: 42, fontWeight: 600, letterSpacing: "-0.02em", color: "#fff", background: "rgba(255,255,255,.08)", backdropFilter: "blur(16px)", boxShadow: "inset 0 1.5px 0 rgba(255,255,255,.25), 0 0 0 1.5px rgba(255,255,255,.14)" }}>glazeui.xyz</span>
      </div>
    </div>
  )
}

/* ---- The film ------------------------------------------------------------------------------ */

function Film({ f }: { f: number }) {
  const t = f / FPS
  return (
    <div className="launch" style={{ position: "relative", width: W, height: H, overflow: "hidden", background: C.porcelain, fontFamily: "var(--font-sans)" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(60% 50% at ${50 + 12 * Math.sin(t * 0.4)}% -10%, rgba(36,69,230,.10), transparent 70%), radial-gradient(50% 40% at ${80 - 10 * Math.sin(t * 0.3)}% 110%, rgba(143,201,182,.14), transparent 70%)` }} />
      <Scene f={f} from={0} to={60}>{(lf) => <Intro lf={lf} />}</Scene>
      <Scene f={f} from={60} to={180}>{(lf) => <SolidOrGlass lf={lf} />}</Scene>
      <Scene f={f} from={180} to={240}>{(lf) => <Buttons lf={lf} />}</Scene>
      <Scene f={f} from={240} to={360}>{(lf) => <Listens lf={lf} />}</Scene>
      <Scene f={f} from={360} to={480}>{(lf) => <Streams lf={lf} />}</Scene>
      <Scene f={f} from={480} to={540}>{(lf) => <Icons lf={lf} />}</Scene>
      <Scene f={f} from={540} to={660}>{(lf) => <Materials lf={lf} f={f} />}</Scene>
      <Scene f={f} from={660} to={720}>{(lf) => <Install lf={lf} />}</Scene>
      <Scene f={f} from={720} to={TOTAL + 1} exit={1}>{(lf) => <End lf={lf} f={f} />}</Scene>
    </div>
  )
}

declare global {
  interface Window {
    __setFrame?: (n: number) => Promise<void>
    __launchReady?: boolean
  }
}

export default function DevLaunch() {
  const [f, setF] = React.useState(() => Number(new URLSearchParams(location.search).get("f") ?? 0))
  React.useEffect(() => {
    document.documentElement.classList.remove("dark")
    document.documentElement.dataset.material = "solid"
    window.__setFrame = (n: number) =>
      new Promise((resolve) => {
        flushSync(() => setF(n))
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
      })
    void document.fonts.ready.then(() => (window.__launchReady = true))
  }, [])
  return (
    <div style={{ width: W, height: H, overflow: "hidden" }}>
      <style>{`.launch *, .launch *::before, .launch *::after { animation: none !important; transition: none !important; }`}</style>
      <Film f={f} />
    </div>
  )
}
