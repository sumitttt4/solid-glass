import * as React from "react"
import { Link, useSearchParams } from "react-router-dom"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon, Search01Icon } from "@hugeicons/core-free-icons"

import { CopyIcon } from "@/components/ui/animated-icons"
import { GithubIcon } from "@/components/ui/animated-icons"
import { sourceUrl } from "@/site/github"
import { Button } from "@/components/ui/button"
import { CopySnippet } from "@/components/ui/copy-snippet"
import { MaterialPicker, MATERIALS, type Material } from "@/components/ui/material-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ComponentPreview, ComponentSource } from "@/site/component-preview"
import catalog from "@/site/catalog.generated.json"
import { useMaterial } from "@/site/material"
import { ShaderStage } from "@/site/shader-stage"
import "./collection.css"

const SEARCH_ALIASES: Record<string, string[]> = {
  dialog: ["modal", "popup", "window"], switch: ["toggle"], select: ["dropdown", "picker"], "palette-picker": ["color", "theme", "swatch"],
  "option-card": ["radio", "choice", "tile"], "copy-snippet": ["code", "clipboard"], "status-callout": ["alert", "banner", "notice"],
  "animated-icons": ["icon", "animation", "lottie", "motion", "hugeicons"], "voice-orb": ["ai", "assistant", "voice", "siri", "agent"],
  "live-transcript": ["transcription", "speech", "captions", "stt", "whisper"], "voice-input": ["microphone", "record", "dictation"],
  "audio-waveform": ["audio", "visualizer", "equalizer"], "streaming-text": ["typewriter", "llm", "shimmer", "thinking"],
  "speak-button": ["tts", "text to speech", "read aloud"], "material-picker": ["glass", "frost", "aurora", "glassmorphism"],
  "chat-window": ["chat", "chatbot", "assistant", "gpt", "conversation"], "model-picker": ["llm", "model", "provider"],
  "prompt-suggestions": ["prompts", "starter", "examples"], "token-counter": ["tokens", "context", "usage", "cost"],
}
const FILTERS = ["All", "AI & Voice", "Icons", "Components", "Originals"] as const
const FILTER_LABEL: Record<(typeof FILTERS)[number], string> = { All: "All", "AI & Voice": "AI", Icons: "Icons", Components: "UI", Originals: "New" }
type Entry = (typeof catalog)[number]
function matches(entry: Entry, filter: string) {
  if (filter === "All") return true
  if (filter === "Originals") return entry.origin === "Glaze"
  if (filter === "Components") return entry.category === "Components" || entry.category === "Materials"
  return entry.category === filter
}

class PreviewBoundary extends React.Component<{ children: React.ReactNode }, { error: boolean }> {
  state = { error: false }
  static getDerivedStateFromError() {
    return { error: true }
  }
  render() {
    return this.state.error ? (
      <div role="alert" className="text-muted-foreground flex min-h-60 flex-col items-center justify-center gap-3 p-8 text-center text-sm">
        This example couldn’t render. Its source is still available.
        <Button variant="outline" size="sm" onClick={() => this.setState({ error: false })}>Retry</Button>
      </div>
    ) : (
      this.props.children
    )
  }
}

export default function Collection() {
  const [params, setParams] = useSearchParams()
  const selected = catalog.find((e) => e.slug === params.get("component")) ?? catalog.find((e) => e.slug === "chat-window")!
  const [search, setSearch] = React.useState("")
  const filter = FILTERS.includes(params.get("filter") as (typeof FILTERS)[number]) ? params.get("filter")! : "All"
  const tab = ["Preview", "Code", "Install"].includes(params.get("view") ?? "") ? params.get("view")! : "Preview"
  const { material } = useMaterial()
  const [stage, setStage] = React.useState<Material>(material)
  React.useEffect(() => setStage(material), [material])
  const [compare, setCompare] = React.useState(false)
  const list = React.useRef<HTMLElement>(null)

  const q = search.trim().toLowerCase()
  const entries = catalog.filter((e) => {
    if (!matches(e, filter)) return false
    if (!q) return true
    if (`${e.title} ${e.description} ${e.slug}`.toLowerCase().includes(q)) return true
    return (SEARCH_ALIASES[e.slug] ?? []).some((a) => a.includes(q) || q.includes(a))
  })
  const example = selected.examples.includes(params.get("example") ?? "") ? params.get("example")! : selected.examples[0]
  const glassSide: Material = stage === "solid" ? "glass" : stage

  function update(next: Record<string, string | null>) {
    setParams(
      (current) => {
        const p = new URLSearchParams(current)
        for (const [k, v] of Object.entries(next)) v === null ? p.delete(k) : p.set(k, v)
        return p
      },
      { preventScrollReset: true }
    )
  }
  function choose(slug: string) {
    update({ component: slug, example: null, view: null })
    if (window.matchMedia("(max-width: 1023px)").matches) document.getElementById("component-detail")?.scrollIntoView({ block: "start" })
    else window.scrollTo({ top: 0 })
  }

  React.useEffect(() => {
    const nav = list.current
    const active = nav?.querySelector<HTMLElement>('[aria-current="page"]')
    if (!nav || !active) return
    const n = nav.getBoundingClientRect()
    const a = active.getBoundingClientRect()
    if (a.top < n.top || a.bottom > n.bottom) nav.scrollTop += a.top - n.top - nav.clientHeight / 2
  }, [selected.slug, filter])

  return (
    <div className="collection mx-auto grid w-full max-w-[1400px] grid-cols-[minmax(0,1fr)] lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="collection-aside min-w-0" aria-label="Components">
        <label className="border-input bg-card focus-within:border-ring focus-within:ring-ring/20 flex h-9 items-center gap-2 rounded-lg border px-2.5 shadow-xs focus-within:ring-3">
          <HugeiconsIcon icon={Search01Icon} size={16} className="text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search components…" aria-label="Search components" className="placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent text-sm outline-none" />
          {search && (
            <button type="button" aria-label="Clear search" onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground cursor-pointer">
              <HugeiconsIcon icon={Cancel01Icon} size={14} />
            </button>
          )}
        </label>
        <div className="bg-muted mt-3 grid grid-cols-5 gap-0.5 rounded-full p-1" role="group" aria-label="Category">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => update({ filter: f === "All" ? null : f })}
              title={f === "Originals" ? "Original Glaze components" : f === "Components" ? "Interface components" : undefined}
              className="text-muted-foreground hover:text-foreground aria-pressed:bg-card aria-pressed:text-foreground h-7 cursor-pointer rounded-full text-xs font-medium transition-colors aria-pressed:shadow-[0_1px_2px_#0000001f,0_0_0_1px_var(--border)]"
            >
              {FILTER_LABEL[f]}
            </button>
          ))}
        </div>
        <p className="text-muted-foreground mt-4 mb-1 px-2 text-xs" role="status">
          {entries.length === 1 ? "1 component" : `${entries.length} components`}
        </p>
        <nav ref={list} className="collection-list" aria-label="Component list">
          {entries.map((e) => (
            <button
              key={e.slug}
              type="button"
              aria-current={e.slug === selected.slug ? "page" : undefined}
              onClick={() => choose(e.slug)}
              className="text-muted-foreground hover:bg-accent hover:text-foreground aria-[current=page]:bg-accent aria-[current=page]:text-foreground flex h-8 w-full cursor-pointer items-center justify-between gap-2 rounded-md px-2 text-left text-sm transition-colors aria-[current=page]:font-medium"
            >
              <span className="truncate">{e.title}</span>
              {e.origin === "Glaze" && <span className="bg-primary/10 text-primary shrink-0 rounded px-1.5 py-px text-[10px] font-medium">{e.category === "AI & Voice" ? "AI" : "New"}</span>}
            </button>
          ))}
          {!entries.length && <p className="text-muted-foreground px-2 py-6 text-sm">Nothing matches. Try another word or category.</p>}
        </nav>
      </aside>

      <main id="component-detail" className="min-w-0 px-4 py-10 sm:px-6 lg:px-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <div className="flex flex-wrap gap-1.5">
              <span className="bg-secondary text-secondary-foreground rounded-md px-2 py-0.5 text-xs font-medium">{selected.category}</span>
              {selected.origin === "Glaze" && <span className="bg-primary/10 text-primary rounded-md px-2 py-0.5 text-xs font-medium">Original</span>}
            </div>
            <h1 className="font-display mt-4 text-[1.875rem] leading-[1.12] sm:text-[2.5rem] sm:leading-[1.1]">{selected.title}</h1>
            <p className="text-muted-foreground mt-4 text-base leading-[1.6] sm:text-[17px] text-pretty">{selected.description}</p>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <InstallPill slug={selected.slug} />
          <CopyCodeButton slug={selected.slug} />
          <a href={sourceUrl(`src/components/ui/${selected.slug}.tsx`)} target="_blank" rel="noreferrer" data-press="" className="border-input bg-card hover:bg-accent inline-flex h-9 items-center gap-2 rounded-[10px] border px-3 text-[13px] font-medium shadow-[0_1px_2px_#15171c0d]">
            <GithubIcon size={16} /> Source on GitHub
          </a>
          {selected.hasDocs && (
            <Link to={`/docs/components/${selected.slug}`} data-press="" className="text-muted-foreground hover:text-foreground hover:bg-accent inline-flex h-9 items-center rounded-[10px] px-3 text-[13px] font-medium">
              Docs
            </Link>
          )}
        </div>

        <div className="border-border mt-8 flex gap-6 border-b" role="tablist" aria-label="View">
          {["Preview", "Code", "Install"].map((v) => (
            <button
              key={v}
              role="tab"
              aria-selected={tab === v}
              onClick={() => update({ view: v === "Preview" ? null : v })}
              className="text-muted-foreground hover:text-foreground aria-selected:border-foreground aria-selected:text-foreground -mb-px cursor-pointer border-b-2 border-transparent pb-3 text-sm font-medium transition-colors"
            >
              {v}
            </button>
          ))}
        </div>

        {tab === "Preview" && (
          <div className="mt-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {selected.examples.length > 1 && (
                  <Select
                    items={selected.examples.map((n) => ({ value: n, label: n.replace(`${selected.slug}-`, "").replaceAll("-", " ") }))}
                    value={example}
                    onValueChange={(v) => v && update({ example: v })}
                  >
                    <SelectTrigger aria-label="Example" className="h-8 min-w-36 capitalize">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {selected.examples.map((n) => (
                        <SelectItem key={n} value={n} className="capitalize">
                          {n.replace(`${selected.slug}-`, "").replaceAll("-", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <MaterialPicker compact value={stage} onValueChange={setStage} className="max-sm:hidden" />
              </div>
              <label className="flex items-center gap-2 text-sm font-medium">
                <Switch checked={compare} onCheckedChange={setCompare} />
                Compare with {compare ? MATERIALS.find((m) => m.value === glassSide)!.label : "glass"}
              </label>
            </div>
            {example ? (
              compare ? (
                <div className="mt-4 grid gap-4 xl:grid-cols-2">
                  {(["solid", glassSide] as Material[]).map((side) => (
                    <figure key={side} className="m-0 min-w-0">
                      <figcaption className="text-muted-foreground mb-2 text-xs font-medium">{MATERIALS.find((m) => m.value === side)!.label}</figcaption>
                      <ShaderStage material={side} shader={side !== "solid"} className="collection-stage">
                        <PreviewBoundary key={`${example}-${side}`}>
                          <ComponentPreview name={example} hideCode />
                        </PreviewBoundary>
                      </ShaderStage>
                    </figure>
                  ))}
                </div>
              ) : (
                <ShaderStage material={stage} shader={stage !== "solid"} className="collection-stage mt-4">
                  <PreviewBoundary key={example}>
                    <ComponentPreview key={example} name={example} hideCode />
                  </PreviewBoundary>
                </ShaderStage>
              )
            ) : (
              <p className="text-muted-foreground mt-6 text-sm">No standalone example. See Code or Install.</p>
            )}
            {example && (
              <details className="collection-usage mt-4">
                <summary className="text-muted-foreground hover:text-foreground cursor-pointer text-sm font-medium">Example code</summary>
                <ExampleCode name={example} />
              </details>
            )}
          </div>
        )}
        {tab === "Code" && (
          <div className="mt-6">
            <ComponentSource key={selected.slug} name={selected.slug} />
          </div>
        )}
        {tab === "Install" && (
          <div className="mt-6 flex max-w-2xl flex-col gap-4">
            <CopySnippet label={`Add ${selected.title}`} code={`npx shadcn@latest add sumitttt4/solid-glass/${selected.slug}#main`} />
            <CopySnippet label="Add the theme and its four materials (once)" code="npx shadcn@latest add sumitttt4/solid-glass/glaze#main" />
            <p className="text-muted-foreground text-sm leading-relaxed">
              Needs React 19, Tailwind CSS 4 and Base UI. Import <code className="font-mono text-xs">glaze.css</code> then <code className="font-mono text-xs">materials.css</code> after your Tailwind styles. Set <code className="font-mono text-xs">data-material</code> to <code className="font-mono text-xs">glass</code>, <code className="font-mono text-xs">frost</code> or <code className="font-mono text-xs">aurora</code> on html or any element to change the finish.
            </p>
            <Link to="/docs/installation" className="text-primary inline-flex items-center gap-1.5 text-sm font-medium" data-icon-trigger="">
              Full setup guide
            </Link>
          </div>
        )}
        <p className="text-muted-foreground border-border mt-12 border-t pt-6 text-xs">
          {selected.origin === "Glaze" ? "An original Glaze component." : "Inherited from the MIT-licensed Solid Glass foundation and shadcn/ui, restyled for Glaze."}{" "}
          <a className="underline underline-offset-2" href="https://github.com/sumitttt4/solid-glass">View on GitHub</a>
        </p>
      </main>
    </div>
  )
}

function useCopied() {
  const [copied, setCopied] = React.useState(false)
  React.useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(t)
  }, [copied])
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
    } catch {
      /* clipboard blocked: the text stays selectable */
    }
  }
  return [copied, copy] as const
}

/** The install command, readable at a glance, copied in one tap. */
function InstallPill({ slug }: { slug: string }) {
  const [copied, copy] = useCopied()
  const command = `npx shadcn@latest add sumitttt4/solid-glass/${slug}#main`
  return (
    <button
      type="button"
      data-press=""
      onClick={() => copy(command)}
      aria-label={copied ? "Install command copied" : `Copy install command: ${command}`}
      className="bg-foreground text-background inline-flex h-9 max-w-full min-w-0 cursor-pointer items-center gap-2.5 rounded-[10px] pr-2.5 pl-3 font-mono text-[12.5px]"
    >
      <span className="opacity-60">$</span>
      <span className="truncate">npx shadcn add …/{slug}</span>
      <CopyIcon size={15} active={copied} className="shrink-0 opacity-80" />
      <span role="status" className="sr-only">{copied ? "Copied" : ""}</span>
    </button>
  )
}

const uiSources = import.meta.glob<string>("/src/components/ui/*.tsx", { query: "?raw", import: "default" })
function CopyCodeButton({ slug }: { slug: string }) {
  const [copied, copy] = useCopied()
  return (
    <button
      type="button"
      data-press=""
      onClick={async () => {
        const code = await uiSources[`/src/components/ui/${slug}.tsx`]?.()
        if (code) await copy(code)
      }}
      className="border-input bg-card hover:bg-accent inline-flex h-9 cursor-pointer items-center gap-2 rounded-[10px] border px-3 text-[13px] font-medium shadow-[0_1px_2px_#15171c0d]"
    >
      <CopyIcon size={15} active={copied} />
      {copied ? "Copied" : "Copy code"}
    </button>
  )
}

const exampleSources = import.meta.glob<string>("/src/examples/*.tsx", { query: "?raw", import: "default" })
function ExampleCode({ name }: { name: string }) {
  const [code, setCode] = React.useState("")
  React.useEffect(() => {
    let live = true
    void exampleSources[`/src/examples/${name}.tsx`]?.().then((c) => live && setCode(c.replace(/^"use client"\n\n?/, "")))
    return () => {
      live = false
    }
  }, [name])
  return code ? <div className="mt-3"><CopySnippet label={`${name}.tsx`} code={code} /></div> : null
}

