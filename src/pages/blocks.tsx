import * as React from "react"
import { CheckIcon, ExternalLinkIcon, MonitorIcon, RotateCwIcon, SmartphoneIcon, TabletIcon, TerminalIcon } from "lucide-react"
import { Link, useParams } from "react-router-dom"

import { cn } from "@/lib/utils"
import { blocks, type Block } from "@/blocks"
import { Button, buttonVariants } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { StatusGlyph } from "@/components/ui/status-glyph"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { CodeBlock } from "@/site/code"
import { PageActions, PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/site/page-header"
import { useTheme } from "@/site/theme"

const base = import.meta.env.BASE_URL.replace(/\/$/, "")

const WIDTHS = [
  { name: "Desktop", icon: MonitorIcon, width: "100%" },
  { name: "Tablet", icon: TabletIcon, width: "768px" },
  { name: "Mobile", icon: SmartphoneIcon, width: "390px" },
]

/** One block: a bar to switch between looking at it and reading it, then the block in a frame of its own. */
function BlockViewer({ block }: { block: Block }) {
  const { theme } = useTheme()
  const [view, setView] = React.useState<"preview" | "code">("preview")
  const [width, setWidth] = React.useState(WIDTHS[0].width)
  const [round, setRound] = React.useState(0)
  const { isCopied, copyToClipboard } = useCopyToClipboard()
  const [file, setFile] = React.useState(0)
  // The frame is kept out of sight until what is in it has been drawn: a window that is still
  // loading is white for a moment, and on a dark page that is a flash.
  const frame = `${theme}-${round}`
  const [drawn, setDrawn] = React.useState("")
  // Solid Glass's own come from its registry; shadcn/ui's from shadcn/ui, and take the material from the stylesheet.
  const command = block.own ? `npx shadcn@latest add deeplethe/solid-glass/${block.name}` : `npx shadcn@latest add ${block.name}`
  // The frame is a window of its own: it is told the theme, and loaded again when the theme changes.
  const address = `${base}/view/${block.name}?theme=${theme}`

  return (
    <section id={block.name} className="scroll-mt-24">
      <div className="flex flex-wrap items-center gap-2 pb-3">
        <div className="glass-panel flex gap-0.5 rounded-lg p-0.5 text-sm">
          {(["preview", "code"] as const).map((name) => (
            <button
              key={name}
              type="button"
              aria-pressed={view === name}
              onClick={() => setView(name)}
              className={cn("rounded-md px-2.5 py-1 text-muted-foreground capitalize outline-none hover:text-foreground", view === name && "glass-chosen text-foreground")}
            >
              {name}
            </button>
          ))}
        </div>
        <span className="hidden h-4 w-px bg-border sm:block" />
        <p className="min-w-0 flex-1 truncate text-sm font-medium">{block.description}</p>
        <div className="glass-panel hidden gap-0.5 rounded-lg p-0.5 md:flex">
          {WIDTHS.map((entry) => (
            <button
              key={entry.name}
              type="button"
              title={entry.name}
              aria-pressed={width === entry.width}
              onClick={() => {
                setView("preview")
                setWidth(entry.width)
              }}
              className={cn("flex size-7 items-center justify-center rounded-md text-muted-foreground outline-none hover:text-foreground", width === entry.width && "glass-chosen text-foreground")}
            >
              <entry.icon className="size-4" />
            </button>
          ))}
          <a href={address} target="_blank" rel="noreferrer" title="Open in a new tab" className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground">
            <ExternalLinkIcon className="size-4" />
          </a>
          <button type="button" title="Load it again" onClick={() => setRound((value) => value + 1)} className="flex size-7 items-center justify-center rounded-md text-muted-foreground outline-none hover:text-foreground">
            <RotateCwIcon className="size-4" />
          </button>
        </div>
        <Button variant="outline" size="sm" className="max-w-full font-mono text-xs" onClick={() => copyToClipboard(command)}>
          {isCopied ? <CheckIcon /> : <TerminalIcon />}
          <span className="truncate">npx shadcn add {block.name}</span>
        </Button>
      </div>

      {view === "preview" ? (
        <div style={{ height: block.height ?? 720 }} className="relative overflow-hidden rounded-xl border bg-transparent p-0">
          {drawn !== frame && (
            <div className="absolute inset-0 flex items-center justify-center">
              <StatusGlyph activity="running" />
            </div>
          )}
          <iframe
            key={frame}
            src={address}
            aria-label={block.title}
            loading="lazy"
            onLoad={() => window.setTimeout(() => setDrawn(frame), 120)}
            style={{ width }}
            className={cn("relative mx-auto block h-full max-w-full transition-[width,opacity] duration-200", drawn !== frame && "opacity-0")}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-3 md:flex-row md:flex-wrap">
          {block.note && <p className="w-full text-sm text-muted-foreground">{block.note}</p>}
          {block.files.length > 1 && (
            <div className="glass-panel flex shrink-0 gap-px overflow-x-auto rounded-xl p-1.5 md:w-56 md:flex-col md:self-start">
              {block.files.map((entry, index) => (
                <button
                  key={entry.path}
                  type="button"
                  aria-pressed={index === file}
                  onClick={() => setFile(index)}
                  className={cn("shrink-0 truncate rounded-sm px-2 py-1 text-left font-mono text-xs text-muted-foreground outline-none hover:text-foreground", index === file && "glass-chosen text-foreground")}
                >
                  {entry.path}
                </button>
              ))}
            </div>
          )}
          <CodeBlock
            className="my-0 min-w-0 flex-1 [&_pre]:max-h-[720px]"
            title={block.files[file].path}
            lang={block.files[file].path.endsWith(".json") ? "json" : "tsx"}
            code={block.files[file].source}
          />
        </div>
      )}
    </section>
  )
}

/** Blocks: whole screens made of the components, to look at, to read, and to install with one command. */
const CATEGORIES = ["Featured", "Agents", "Dashboard", "Sidebar", "Login"] as const

export function Blocks() {
  const [category, setCategory] = React.useState<(typeof CATEGORIES)[number]>("Featured")
  const shown = blocks.filter((block) => (category === "Featured" ? block.featured : block.category === category))
  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col px-4 sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6 pt-16 pb-10 sm:pt-20">
        <div className="max-w-2xl">
          <h1 className="font-display text-[2.25rem] leading-[1.08] sm:text-[3.25rem] sm:leading-[1.04]">Blocks</h1>
          <p className="text-muted-foreground mt-4 text-base leading-[1.6] text-pretty sm:text-[17px]">
            Whole screens built from the components, with made-up data: dashboards, sign-in pages, sidebars and an agent workspace. Open one, read the code, copy it in.
          </p>
        </div>
        <Link to="/components" data-slot="button" data-variant="outline" className={cn(buttonVariants({ variant: "outline" }), "h-9 rounded-[10px] px-3.5")}>
          All components
        </Link>
      </header>
      <div id="blocks" className="flex scroll-mt-20 flex-col gap-14 pb-24">
        <div role="group" aria-label="Category" className="bg-muted inline-flex w-fit max-w-full gap-0.5 overflow-x-auto rounded-full p-1">
          {CATEGORIES.map((name) => (
            <button
              key={name}
              type="button"
              aria-pressed={category === name}
              onClick={() => setCategory(name)}
              className={cn(
                "h-8 shrink-0 cursor-pointer rounded-full px-3.5 text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
                category === name && "bg-card text-foreground shadow-[0_1px_2px_#0000001f,0_0_0_1px_var(--border)]"
              )}
            >
              {name}
            </button>
          ))}
        </div>
        {shown.map((block) => (
          <BlockViewer key={block.name} block={block} />
        ))}
      </div>
    </div>
  )
}

/** A block by itself, filling the window: what the frame on the Blocks page shows. */
export function BlockView() {
  const { name } = useParams()
  const block = blocks.find((entry) => entry.name === name)
  if (!block) return null
  return (
    // shadcn/ui's blocks ask for their pictures from the root of the site ("/placeholder.svg"). Where
    // the site lives under a path, one that was not found there is asked for again under that path.
    <div
      className="contents"
      onErrorCapture={(event) => {
        const image = event.target
        if (!(image instanceof HTMLImageElement) || image.dataset.retried) return
        image.dataset.retried = "1"
        image.src = `${base}/placeholder.svg`
      }}
    >
      <React.Suspense fallback={null}>
        <block.component />
      </React.Suspense>
      <Toaster />
    </div>
  )
}
