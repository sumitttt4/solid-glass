import * as React from "react"
import { MenuIcon, SearchIcon } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Kbd } from "@/components/ui/kbd"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { SolidGlassMark } from "@/site/logo"
import { agents, components, docs, urlOf } from "@/site/pages"
import { useTheme } from "@/site/theme"
import { useMaterial } from "@/site/material"
import { MaterialPicker } from "@/components/ui/material-picker"
import { GithubIcon, ThemeIcon } from "@/components/ui/animated-icons"
import catalog from "@/site/catalog.generated.json"

const NAV = [
  { href: "/components", label: "Components" },
  { href: "/components?filter=AI+%26+Voice&component=chat-window", label: "AI" },
  { href: "/components?filter=Icons&component=animated-icons", label: "Icons" },
  { href: "/blocks", label: "Blocks" },
  { href: "/docs", label: "Docs" },
]

/**
 * Which tab the page belongs to: the one whose address it is, or is under. Where two are (a
 * component's page is under Docs and under Components), the nearer one, which is the longer address.
 */
function tabOf(pathname: string, search: string) {
  if (pathname === "/components") {
    const filter = new URLSearchParams(search).get("filter")
    return filter === "AI & Voice" ? NAV[1].href : filter === "Icons" ? NAV[2].href : NAV[0].href
  }
  return NAV.filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`)).sort((a, b) => b.href.length - a.href.length)[0]?.href
}

function MainNav({ className }: { className?: string }) {
  const { pathname, search } = useLocation()
  const tab = tabOf(pathname, search)
  return (
    <nav className={cn("items-center gap-0", className)}>
      {/* the mark stands still: one that never stops moving reads as a page that shakes */}
      <Link to="/" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mr-1 -ml-3 h-8 gap-2 px-2.5 text-sm")}>
        <SolidGlassMark className="size-5 -translate-y-px" />
        <span className="text-[15px] font-semibold tracking-tight">Glaze</span>
      </Link>
      {NAV.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          data-active={tab === item.href}
          aria-current={tab === item.href ? "page" : undefined}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            // the tab you are on wears the one state, like the chosen row of any list
            "hidden h-8 px-2.5 text-sm font-medium text-muted-foreground hover:text-foreground lg:inline-flex",
            tab === item.href && "text-foreground"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}

/**
 * A result's title with the letters that matched the search picked out. A run of letters that
 * appears as typed is marked whole; failing that, the letters are found in order, the way the list
 * itself matches ("intro" finds "Input Group"). What matched keeps the full ink and the rest steps
 * back — by colour alone, so no title changes width as it is typed towards.
 */
function Matched({ text, query }: { text: string; query: string }) {
  const needle = query.trim().toLowerCase().replace(/\s+/g, "")
  if (!needle) return <>{text}</>
  const lower = text.toLowerCase()
  const hits = new Set<number>()
  const run = lower.indexOf(needle)
  if (run >= 0) {
    for (let i = 0; i < needle.length; i++) hits.add(run + i)
  } else {
    let from = 0
    for (const letter of needle) {
      const at = lower.indexOf(letter, from)
      if (at < 0) return <>{text}</>
      hits.add(at)
      from = at + 1
    }
  }
  // neighbouring letters of the same kind go in one span
  const parts: { text: string; hit: boolean }[] = []
  for (let i = 0; i < text.length; i++) {
    const hit = hits.has(i)
    const last = parts[parts.length - 1]
    if (last && last.hit === hit) last.text += text[i]
    else parts.push({ text: text[i], hit })
  }
  return (
    <span className="text-muted-foreground">
      {parts.map((part, index) =>
        part.hit ? (
          <mark key={index} className="bg-transparent text-foreground underline decoration-foreground/40 decoration-1 underline-offset-4">
            {part.text}
          </mark>
        ) : (
          part.text
        )
      )}
    </span>
  )
}

/** Search across every page, opened from the bar or with ⌘K. */
function CommandMenu() {
  // ?search=tabs opens the page with the search already made, so a search can be linked to.
  const linked = React.useMemo(() => new URLSearchParams(window.location.search).get("search") ?? "", [])
  const [open, setOpen] = React.useState(linked !== "")
  const [query, setQuery] = React.useState("")
  // typed in once the list is up, so the list picks its first result as it does for a keystroke
  React.useEffect(() => {
    if (!linked) return
    const timer = window.setTimeout(() => setQuery(linked), 120)
    return () => window.clearTimeout(timer)
  }, [linked])
  const navigate = useNavigate()

  React.useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if ((event.key === "k" && (event.metaKey || event.ctrlKey)) || event.key === "/") {
        const target = event.target as HTMLElement | null
        if (target?.isContentEditable || target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return
        event.preventDefault()
        setOpen((value) => !value)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const go = (url: string) => {
    setOpen(false)
    setQuery("")
    navigate(url)
  }

  return (
    <>
      <Button
        variant="secondary"
        onClick={() => setOpen(true)}
        className="relative h-8 w-full justify-start rounded-md pl-2.5 font-normal text-muted-foreground shadow-none sm:pr-12 md:w-48 lg:w-56 xl:w-64"
      >
        <span className="hidden lg:inline-flex">Search components…</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <span className="absolute top-1.5 right-1.5 hidden gap-1 sm:flex">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </span>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          if (!next) setQuery("")
        }}
        title="Search documentation" description="Search for a page or a component.">
        <Command>
          <CommandInput placeholder="Search documentation..." value={query} onValueChange={setQuery} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Sections">
              {docs.map((page) => (
                <CommandItem key={page.slug} value={`docs ${page.title}`} onSelect={() => go(urlOf(page))}>
                  <SearchIcon />
                  <Matched text={page.title} query={query} />
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Library">
              {catalog.map((entry) => (
                <CommandItem key={entry.slug} value={`library ${entry.title} ${entry.category}`} onSelect={() => go(`/components?component=${entry.slug}`)}>
                  <span className="flex size-4 items-center justify-center">
                    <span className="size-1.5 rounded-full bg-primary" />
                  </span>
                  <Matched text={entry.title} query={query} />
                  <span className="ml-auto text-xs text-muted-foreground">{entry.category}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Component docs">
              {components.map((page) => (
                <CommandItem key={page.slug} value={`component ${page.title}`} onSelect={() => go(urlOf(page))}>
                  <span className="flex size-4 items-center justify-center">
                    <span className="size-2 rounded-full border border-dashed border-current" />
                  </span>
                  <Matched text={page.title} query={query} />
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Agents">
              {agents.map((page) => (
                <CommandItem key={page.slug} value={`agent ${page.title}`} onSelect={() => go(urlOf(page))}>
                  <span className="flex size-4 items-center justify-center">
                    <span className="size-2 rounded-full border border-dashed border-current" />
                  </span>
                  <Matched text={page.title} query={query} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}

/** The same places, for a window too narrow for the bar and the sidebar. */
function MobileNav() {
  const [open, setOpen] = React.useState(false)
  const link = "flex h-9 items-center rounded-md px-2 text-[15px] font-medium outline-none hover:bg-accent focus-visible:bg-accent"
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={<Button variant="ghost" size="icon" className="glass-held size-8 lg:hidden" />}>
        <MenuIcon />
        <span className="sr-only">Menu</span>
      </PopoverTrigger>
      <PopoverContent align="end" className="no-scrollbar max-h-[70svh] w-64 gap-0 overflow-y-auto p-2">
        {[...NAV, ...docs.slice(1).map((page) => ({ href: urlOf(page), label: page.title }))]
          .filter((item, index, all) => all.findIndex((entry) => entry.href === item.href) === index)
          .map((item) => (
            <Link key={item.href} to={item.href} className={link} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
        <p className="px-2 pt-3 pb-1 text-xs font-medium text-muted-foreground">Agents</p>
        {agents.map((page) => (
          <Link key={page.slug} to={urlOf(page)} className={link} onClick={() => setOpen(false)}>
            {page.title}
          </Link>
        ))}
      </PopoverContent>
    </Popover>
  )
}

/** To the source. The mark is GitHub's own, which the icon set no longer carries. */
function GitHubLink() {
  return (
    <a
      href="https://github.com/sumitttt4/solid-glass"
      target="_blank"
      rel="noreferrer"
      title="GitHub"
      className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "size-8")}
    >
      <GithubIcon size={18} />
      <span className="sr-only">GitHub</span>
    </a>
  )
}

function ModeSwitcher() {
  const { theme, setTheme } = useTheme()
  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-8"
      title="Toggle theme"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <ThemeIcon size={18} active={theme === "dark"} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

function HeaderMaterial() {
  const { material, setMaterial } = useMaterial()
  return <MaterialPicker compact value={material} onValueChange={setMaterial} className="hidden xl:inline-flex" />
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/80 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-(--header-height) items-center **:data-[slot=separator]:h-4! **:data-[slot=separator]:self-center!">
          <MainNav className="flex" />
          <div className="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
            <div className="hidden w-full flex-1 md:flex md:w-auto md:flex-none">
              <CommandMenu />
            </div>
            <HeaderMaterial />
            <Separator orientation="vertical" className="ml-1 hidden lg:block" />
            <GitHubLink />
            <ModeSwitcher />
            <MobileNav />
            <Separator orientation="vertical" className="hidden lg:block" />
            <Link to="/docs/installation" className={cn(buttonVariants({ size: "sm" }), "hidden h-8 rounded-md px-3 text-sm lg:inline-flex")}>
              Get started
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
