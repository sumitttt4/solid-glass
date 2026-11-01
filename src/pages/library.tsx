import * as React from "react"
import { Link } from "react-router-dom"
import { HugeiconsIcon } from "@hugeicons/react"
import { AiChat02Icon, DashboardSquare01Icon, LayoutGridIcon, MagicWand01Icon } from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"
import {
  animatedIcons,
  ArrowRightIcon,
  BellIcon,
  LockIcon,
  MailIcon,
  SparklesIcon,
  type AnimatedIconName,
} from "@/components/ui/animated-icons"
import { AudioWaveform, useSimulatedLevels } from "@/components/ui/audio-waveform"
import { Button } from "@/components/ui/button"
import { ChatWindow } from "@/components/ui/chat-window"
import { CopySnippet } from "@/components/ui/copy-snippet"
import { Input } from "@/components/ui/input"
import { MaterialPicker, MATERIALS, type Material } from "@/components/ui/material-picker"
import { ModelPicker } from "@/components/ui/model-picker"
import { PalettePicker } from "@/components/ui/palette-picker"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { TokenCounter } from "@/components/ui/token-counter"
import { VoiceOrb } from "@/components/ui/voice-orb"
import { DEMO_MODELS, demoRespond } from "@/lib/demo-ai"
import { ACCENT_KEY, applyAccent } from "@/site/accent"
import catalog from "@/site/catalog.generated.json"
import { useMaterial } from "@/site/material"
import { ShaderStage } from "@/site/shader-stage"
import { GitHubButton } from "@/site/github"
import "./home.css"

const count = (category: string) => catalog.filter((e) => e.category === category).length

function SectionHead({ title, body, aside }: { title: React.ReactNode; body?: string; aside?: React.ReactNode }) {
  return (
    <div className="mb-12 flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
      <div className="max-w-[38rem]">
        <h2 className="font-display text-[1.75rem] leading-[1.15] text-balance sm:text-[2.5rem] sm:leading-[1.1]">{title}</h2>
        {body && <p className="text-muted-foreground mt-4 text-base leading-[1.6] sm:text-[17px] text-pretty">{body}</p>}
      </div>
      {aside}
    </div>
  )
}

/* ---- Hero showcase: real components on a glass stage ---------------------------------- */

function VoiceCard() {
  const levels = useSimulatedLevels(true, 28)
  const level = levels.reduce((a, b) => a + b, 0) / levels.length
  return (
    <div className="bg-card flex flex-1 flex-col items-center justify-center gap-5 rounded-2xl p-6">
      <VoiceOrb state="listening" level={level * 1.6} size={72} />
      <AudioWaveform levels={levels} height={28} className="w-full" />
      <p className="text-muted-foreground text-center text-xs leading-relaxed">
        “Book a table for two<span className="text-foreground"> at eight tonight…</span>”
      </p>
    </div>
  )
}

function SettingsCard() {
  const [on, setOn] = React.useState({ mail: true, push: false, secure: true })
  const rows: { key: keyof typeof on; label: string; Icon: (typeof animatedIcons)[AnimatedIconName] }[] = [
    { key: "mail", label: "Email digest", Icon: MailIcon },
    { key: "push", label: "Push alerts", Icon: BellIcon },
    { key: "secure", label: "Two-step sign in", Icon: LockIcon },
  ]
  return (
    <div className="bg-card flex flex-col gap-1 rounded-2xl p-2">
      {rows.map(({ key, label, Icon }) => (
        <label key={key} className="hover:bg-accent flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors">
          <span className="bg-muted text-muted-foreground grid size-8 place-items-center rounded-lg">
            <Icon size={17} />
          </span>
          <span className="flex-1">{label}</span>
          <Switch checked={on[key]} onCheckedChange={(v) => setOn((s) => ({ ...s, [key]: v }))} />
        </label>
      ))}
    </div>
  )
}

function SignInCard() {
  return (
    <form className="bg-card flex flex-col gap-3 rounded-2xl p-5" onSubmit={(e) => e.preventDefault()}>
      <div>
        <p className="text-sm font-semibold">Create your workspace</p>
        <p className="text-muted-foreground mt-1 text-xs">Free forever. No card needed.</p>
      </div>
      <Input placeholder="you@company.com" aria-label="Work email" />
      <Button type="submit" className="w-full">
        Continue
      </Button>
    </form>
  )
}

function UsageCard() {
  const [model, setModel] = React.useState("aurora-pro")
  const bars = [38, 52, 44, 68, 57, 80, 72, 90, 64, 76, 85, 70]
  return (
    <div className="bg-card flex flex-1 flex-col justify-between gap-4 rounded-2xl p-4">
      <div className="flex items-center justify-between gap-2">
        <ModelPicker models={DEMO_MODELS} value={model} onValueChange={setModel} className="-ml-1" />
        <TokenCounter used={142_000} limit={200_000} costPerMillion={3} parts={[{ label: "Files", tokens: 60_000 }, { label: "Conversation", tokens: 82_000 }]} />
      </div>
      <div className="flex h-24 items-end gap-1.5">
        {bars.map((h, i) => (
          <span key={i} className="hero-bar bg-primary dark:bg-[var(--celadon)] flex-1 rounded-t-[4px]" style={{ height: `${h}%`, animationDelay: `${i * 40}ms`, opacity: 0.35 + (h / 100) * 0.65 }} />
        ))}
      </div>
      <div className="text-muted-foreground flex justify-between text-[11px]">
        <span>Requests this week</span>
        <span className="text-foreground font-medium">+18.2%</span>
      </div>
    </div>
  )
}

function HeroShowcase() {
  const { material } = useMaterial()
  const [stage, setStage] = React.useState<Material>(material === "solid" ? "aurora" : material)
  return (
    <div className="relative">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted-foreground text-sm">Live components. Try a finish.</p>
        <MaterialPicker value={stage} onValueChange={setStage} />
      </div>
      <ShaderStage material={stage} palette="hero" animate className="hero-stage rounded-[28px] p-3 sm:p-5">
        <div className="grid gap-3 sm:gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <ChatWindow
            respond={demoRespond}
            className="h-[500px] max-w-none"
            greeting="What are we building?"
            suggestions={[
              { title: "Explain glass materials", icon: MagicWand01Icon },
              { title: "Write a follow-up email", icon: AiChat02Icon },
            ]}
          />
          <div className="flex flex-col gap-3 sm:gap-4">
            <VoiceCard />
            <SettingsCard />
          </div>
          <div className="flex flex-col gap-3 sm:gap-4 max-lg:hidden">
            <SignInCard />
            <UsageCard />
          </div>
        </div>
      </ShaderStage>
    </div>
  )
}

/* ---- Sections --------------------------------------------------------------------------- */

function MaterialsSection() {
  const { material, setMaterial } = useMaterial()
  const [accent, setAccent] = React.useState(() => {
    try {
      return localStorage.getItem(ACCENT_KEY) ?? ""
    } catch {
      return ""
    }
  })
  function changeAccent(value: string) {
    setAccent(value)
    applyAccent(value)
    try {
      localStorage.setItem(ACCENT_KEY, value)
    } catch {
      /* this visit only */
    }
  }
  return (
    <section className="home-section" aria-labelledby="materials-title">
      <SectionHead
        title={<span id="materials-title">One component, four finishes</span>}
        body="Every component ships in four finishes. Switch the whole site, or set one attribute on any element and only that part changes."
        aside={
          <Popover>
            <PopoverTrigger render={<Button variant="outline" />}>
              <span className="size-3.5 rounded-full ring-1 ring-black/10" style={{ background: accent || "var(--primary)" }} />
              Accent colour
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[min(92vw,460px)] p-0">
              <PalettePicker label="Accent colour" value={accent} onValueChange={changeAccent} />
            </PopoverContent>
          </Popover>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {MATERIALS.map((m) => (
          <figure key={m.value} className="flex min-w-0 flex-col gap-3">
            <ShaderStage material={m.value} shader={m.value !== "solid"} className={cn("grid min-h-72 place-items-center rounded-[20px] p-6 ring-1 ring-border", m.value === material && "ring-2 ring-primary")}>
              <div className="bg-card flex w-full max-w-[240px] flex-col gap-3 rounded-xl p-4">
                <div className="flex items-center gap-2.5">
                  <span className="bg-primary text-primary-foreground grid size-8 place-items-center rounded-lg">
                    <SparklesIcon size={16} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">Join the beta</p>
                    <p className="text-muted-foreground text-xs">Early access</p>
                  </div>
                </div>
                <Input aria-label={`Email, ${m.label}`} placeholder="you@example.com" className="h-8 text-xs" />
                <Button size="sm">Request access</Button>
              </div>
            </ShaderStage>
            <figcaption className="flex items-center justify-between gap-3">
              <span>
                <span className="block text-sm font-semibold">{m.label}</span>
                <span className="text-muted-foreground text-xs">{m.note}</span>
              </span>
              <Button size="sm" variant={m.value === material ? "default" : "outline"} aria-pressed={m.value === material} onClick={() => setMaterial(m.value)}>
                {m.value === material ? "In use" : "Use"}
              </Button>
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="text-muted-foreground mt-8 text-sm">
        In code: <code className="bg-muted text-foreground rounded-md px-1.5 py-0.5 font-mono text-[13px]">{`<html data-material="${material}">`}</code>, or the same attribute on any element.
      </p>
    </section>
  )
}

const CATEGORIES = [
  { title: "UI components", note: "Buttons, forms, overlays, data, navigation: the full shadcn/ui set, refined.", href: "/components", n: count("Components"), icon: LayoutGridIcon },
  { title: "AI & voice", note: "Chat window, model picker, token counter, live transcription, voice orb and more.", href: "/components?filter=AI+%26+Voice&component=chat-window", n: count("AI & Voice"), icon: AiChat02Icon },
  { title: "Animated icons", note: "Hugeicons that move like what they stand for. Animate any of 4,000+.", href: "/components?filter=Icons&component=animated-icons", n: Object.keys(animatedIcons).length, icon: MagicWand01Icon },
  { title: "Blocks", note: "Dashboards, sign-in pages and sidebars, ready to drop in.", href: "/blocks", n: 12, icon: DashboardSquare01Icon },
]

function CategoriesSection() {
  return (
    <section className="home-section" aria-labelledby="everything-title">
      <SectionHead title={<span id="everything-title">Stop collecting libraries</span>} body="Interface, AI and motion, designed together: one spacing scale, one type system, one set of colours and materials." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map((c) => (
          <Link key={c.title} to={c.href} data-press="" className="group bg-card relative flex flex-col gap-5 rounded-[20px] p-6 shadow-[0_0_0_1px_var(--border)] transition-[box-shadow,transform] [@media(hover:hover)]:hover:shadow-[0_0_0_1px_var(--border),0_12px_32px_-16px_#15171c40]">
            <span className="bg-primary/10 text-primary grid size-11 place-items-center rounded-xl">
              <HugeiconsIcon icon={c.icon} size={22} />
            </span>
            <div>
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-lg font-semibold tracking-[-0.02em]">{c.title}</h3>
                <span className="text-muted-foreground text-sm tabular-nums">{c.n}</span>
              </div>
              <p className="text-muted-foreground mt-2 text-[15px] leading-[1.55]">{c.note}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

function IconsSection() {
  const [loop, setLoop] = React.useState(true)
  return (
    <section className="home-section" aria-labelledby="icons-title">
      <SectionHead
        title={<span id="icons-title">Icons that move like the thing they show</span>}
        body="Built on Hugeicons. Bells ring, bins open, rockets launch. Hover one, or pass any of the 4,000+ Hugeicons and a motion preset."
        aside={
          <label className="flex items-center gap-2.5 text-sm font-medium">
            <Switch checked={loop} onCheckedChange={setLoop} /> Play on loop
          </label>
        }
      />
      <div className="grid grid-cols-[repeat(auto-fill,minmax(64px,1fr))] gap-2.5">
        {(Object.keys(animatedIcons) as AnimatedIconName[]).map((name) => {
          const Icon = animatedIcons[name]
          return (
            <Link
              key={name}
              to="/components?filter=Icons&component=animated-icons"
              aria-label={`${name} icon`}
              title={name}
              className="bg-card hover:text-primary grid aspect-square place-items-center rounded-xl transition-colors"
            >
              <Icon size={24} animate={loop} />
            </Link>
          )
        })}
      </div>
    </section>
  )
}

function InstallSection() {
  return (
    <section className="home-section grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]" aria-labelledby="install-title">
      <div>
        <h2 id="install-title" className="font-display text-[1.75rem] leading-[1.15] text-balance sm:text-[2.5rem] sm:leading-[1.1]">
          Free, all of it. Install once and stop looking.
        </h2>
        <p className="text-muted-foreground mt-4 max-w-md text-base leading-[1.6] sm:text-[17px]">
          No pro tier and no paywall. Copy one component, add it with one command, or hand the registry to your coding agent.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button size="lg" nativeButton={false} render={<Link to="/docs/installation" />}>
            Read the setup guide
          </Button>
          <GitHubButton />
        </div>
      </div>
      <div className="flex min-w-0 flex-col gap-3">
        <CopySnippet label="Theme and materials" code="npx shadcn@latest add sumitttt4/solid-glass/glaze#main" />
        <CopySnippet label="Any component" code="npx shadcn@latest add sumitttt4/solid-glass/chat-window#main" />
        <CopySnippet label="Or tell your agent" code={'Use the Glaze registry (github.com/sumitttt4/solid-glass) for UI.\nAdd components with: npx shadcn@latest add sumitttt4/solid-glass/<name>#main\nUse data-material="glass" on <html> for the glass finish.'} />
      </div>
    </section>
  )
}

export default function Library() {
  return (
    <div className="home">
      <section className="mx-auto max-w-[1400px] px-4 pt-16 sm:px-6 sm:pt-24 lg:px-8">
        <div className="grid items-end gap-x-16 gap-y-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
          <h1 className="font-display text-[2.25rem] leading-[1.08] text-balance sm:text-[clamp(3rem,6vw,5.25rem)] sm:leading-[1.02] sm:tracking-[-0.045em]">
            Beautiful components, solid or glass
          </h1>
          <div className="lg:pb-3">
            <p className="text-muted-foreground max-w-md text-base leading-[1.6] sm:text-[17px] text-pretty">
              {catalog.length} free React components for interfaces, AI and voice, plus animated icons. Each comes in four finishes. Copy the code, install it with one command, or hand it to your agent.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button size="lg" nativeButton={false} render={<Link to="/components" />}>
                Browse components
              </Button>
              <GitHubButton />
            </div>
          </div>
        </div>
        <div className="mt-16 sm:mt-20">
          <HeroShowcase />
        </div>
      </section>
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <MaterialsSection />
        <CategoriesSection />
        <IconsSection />
        <InstallSection />
      </div>
    </div>
  )
}
