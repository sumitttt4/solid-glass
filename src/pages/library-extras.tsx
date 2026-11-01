import * as React from "react"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"

import { animatedIcons, type AnimatedIconName } from "@/components/ui/animated-icons"
import { Button } from "@/components/ui/button"
import { CopySnippet } from "@/components/ui/copy-snippet"
import { Input } from "@/components/ui/input"
import { MATERIALS, type Material } from "@/components/ui/material-picker"
import { Switch } from "@/components/ui/switch"
import { useMaterial } from "@/site/material"

const VoiceAgent = React.lazy(() => import("@/examples/voice-orb-agent"))

/** The same small card, finished four ways, side by side. */
export function MaterialShowcase() {
  const { material, setMaterial } = useMaterial()
  return (
    <section className="cw-materials" aria-labelledby="materials-title">
      <div className="cw-section-head">
        <div>
          <p className="cw-eyebrow">ONE COMPONENT. FOUR MATERIALS.</p>
          <h2 id="materials-title">Normal, or glass. Your call.</h2>
          <p>Every component ships in four finishes. Switch the whole page, or set one attribute on any element.</p>
        </div>
        <code className="cw-inline-code">{`<html data-material="${material}">`}</code>
      </div>
      <div className="cw-material-grid">
        {MATERIALS.map((m) => (
          <figure key={m.value} className={m.value === material ? "is-current" : undefined}>
            <div data-material={m.value} className="mat-stage cw-material-stage">
              <SampleCard material={m.value} />
            </div>
            <figcaption>
              <span>
                <strong>{m.label}</strong>
                {m.note}
              </span>
              <Button size="sm" variant={m.value === material ? "default" : "outline"} aria-pressed={m.value === material} onClick={() => setMaterial(m.value)}>
                {m.value === material ? "In use" : "Use"}
              </Button>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

function SampleCard({ material }: { material: Material }) {
  const [on, setOn] = React.useState(material !== "solid")
  return (
    <div className="bg-card flex w-full max-w-[250px] flex-col gap-3 rounded-xl p-4 text-left">
      <strong className="text-sm font-medium">Join the beta</strong>
      <Input aria-label={`Email (${material})`} placeholder="you@example.com" className="h-8 text-xs" />
      <label className="text-muted-foreground flex items-center justify-between text-xs">
        Product updates
        <Switch size="sm" checked={on} onCheckedChange={setOn} aria-label={`Product updates (${material})`} />
      </label>
      <Button size="sm">Request access</Button>
    </div>
  )
}

const AI_LINKS = [
  { slug: "voice-orb", name: "Voice Orb", note: "Idle, listening, thinking, speaking." },
  { slug: "live-transcript", name: "Live Transcript", note: "Speech to text, live in the browser." },
  { slug: "voice-input", name: "Voice Input", note: "Press to talk, get text back." },
  { slug: "audio-waveform", name: "Audio Waveform", note: "Bars that move with your voice." },
  { slug: "streaming-text", name: "Streaming Text", note: "Answers that arrive word by word." },
  { slug: "speak-button", name: "Speak Button", note: "Read any text aloud." },
]

export function AiShowcase() {
  return (
    <section className="cw-ai" aria-labelledby="ai-title">
      <div className="cw-section-head">
        <div>
          <p className="cw-eyebrow">AI &amp; VOICE</p>
          <h2 id="ai-title">Components that listen,<br />think and talk back.</h2>
          <p>Transcription, voice input, a living orb, streaming answers and text to speech, plus the full agent UI: composer, reasoning, tool steps and more.</p>
        </div>
        <Link className="cw-section-link" to="/components?filter=AI+%26+Voice&component=voice-orb">All AI components<ArrowRight size={14} /></Link>
      </div>
      <div className="mat-stage cw-ai-stage" data-material="aurora">
        <React.Suspense fallback={<div className="cw-ai-loading" />}>
          <VoiceAgent />
        </React.Suspense>
      </div>
      <div className="cw-ai-links">
        {AI_LINKS.map((item) => (
          <Link key={item.slug} to={`/components?component=${item.slug}`} data-icon-trigger="">
            <span>{item.name}</span>
            <p>{item.note}</p>
            <animatedIcons.ArrowRight size={15} />
          </Link>
        ))}
      </div>
    </section>
  )
}

export function IconsStrip() {
  const [loop, setLoop] = React.useState(true)
  return (
    <section className="cw-icons" aria-labelledby="icons-title">
      <div className="cw-section-head">
        <div>
          <p className="cw-eyebrow">ANIMATED ICONS</p>
          <h2 id="icons-title">Icons with a little life.</h2>
          <p>A hand-picked set, not a font: each one moves the way its thing moves. Same weight as Lucide, so they sit right beside it.</p>
        </div>
        <label className="cw-icons-loop">
          <Switch checked={loop} onCheckedChange={setLoop} aria-label="Play icons on a loop" />
          Loop
        </label>
      </div>
      <div className="cw-icon-row">
        {(Object.keys(animatedIcons) as AnimatedIconName[]).map((name, i) => {
          const Icon = animatedIcons[name]
          return (
            <Link key={name} to="/components?component=animated-icons" aria-label={`${name} icon`} style={{ animationDelay: `${i * 60}ms` }}>
              <Icon size={22} animate={loop} />
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export function InstallEverything() {
  return (
    <section className="cw-install" aria-labelledby="install-title">
      <div>
        <p className="cw-eyebrow">FREE. ALL OF IT.</p>
        <h2 id="install-title">Install once.<br />Never go looking again.</h2>
        <p>No pro tier, no paywall. Copy a single component, install with one command, or hand the registry to your coding agent and let it pick what it needs.</p>
      </div>
      <div className="cw-install-steps">
        <CopySnippet label="1 · The theme and its four materials" code="npx shadcn@latest add sumitttt4/solid-glass/colorwork#main" />
        <CopySnippet label="2 · Any component, by name" code="npx shadcn@latest add sumitttt4/solid-glass/voice-orb#main" />
        <CopySnippet
          label="3 · Or tell your agent"
          code={'Use the Colorwork registry (github.com/sumitttt4/solid-glass, registry.json) for UI.\nInstall components with: npx shadcn@latest add sumitttt4/solid-glass/<name>#main\nSet data-material="glass" on <html> for the glass finish.'}
        />
      </div>
    </section>
  )
}
