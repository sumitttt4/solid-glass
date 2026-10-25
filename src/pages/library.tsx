import * as React from "react"
import { Link } from "react-router-dom"
import { ArrowDown, ArrowRight, Bell, Check, CheckCheck, ChevronDown, Code2, Copy, Folder, Heart, Layers, Menu, Moon, Plus, Search, Sparkles, Sun, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { ToneBadge, type ColorTone } from "@/components/ui/tone-badge"
import { ColorSurface } from "@/components/ui/color-surface"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ACCENT_KEY, ACCENT_COLORS, applyAccent } from "@/site/accent"
import { useTheme } from "@/site/theme"
import "./library.css"

const entries = [
  { id: "buttons", title: "Buttons", group: "Actions", note: "One clear next step.", tone: "iris" },
  { id: "badges", title: "Tone badges", group: "Display", note: "Categories with character.", tone: "fern" },
  { id: "inputs", title: "Inputs", group: "Inputs", note: "A helpful place to start.", tone: "ocean" },
  { id: "surfaces", title: "Color surfaces", group: "Display", note: "Give related things a home.", tone: "sun" },
  { id: "switches", title: "Switches", group: "Inputs", note: "Small controls. Clear decisions.", tone: "iris" },
  { id: "menus", title: "Dropdown menus", group: "Navigation", note: "Everything in its place.", tone: "clay" },
  { id: "checks", title: "Checkboxes", group: "Inputs", note: "Make a little progress.", tone: "fern" },
  { id: "sliders", title: "Sliders", group: "Inputs", note: "Find your own balance.", tone: "ocean" },
  { id: "dialogs", title: "Dialogs", group: "Feedback", note: "A moment for the details.", tone: "iris" },
  { id: "alerts", title: "Alerts", group: "Feedback", note: "Say what happened. Clearly.", tone: "clay" },
  { id: "empty", title: "Empty states", group: "Feedback", note: "An invitation to begin.", tone: "sun" },
  { id: "tabs", title: "Segmented controls", group: "Navigation", note: "Different views, same context.", tone: "fern" },
] as const
const groups = ["All components", "Actions", "Inputs", "Display", "Navigation", "Feedback"]
const code: Record<string, string> = {
  buttons: '<Button tone="iris">Start a project</Button>\n<Button tone="fern">Publish changes</Button>\n<Button tone="clay" variant="secondary">Save draft</Button>\n<Button tone="ocean" variant="outline">Preview</Button>',
  badges: '<ToneBadge tone="fern">Design</ToneBadge>\n<ToneBadge tone="iris">Engineering</ToneBadge>',
  inputs: '<label htmlFor="project">Project name</label>\n<Input id="project" placeholder="A good idea…" />',
  surfaces: '<ColorSurface tone="sun" aria-label="Project summary">\n  <h3>A space for your next idea.</h3>\n  <p>Group related content with paired colors.</p>\n</ColorSurface>',
  switches: '<label className="flex items-center gap-3">\n  <Switch checked={enabled} onCheckedChange={setEnabled} />\n  Email notifications\n</label>',
  menus: '<DropdownMenu>\n  <DropdownMenuTrigger render={<Button variant="outline" />}>\n    Project options\n  </DropdownMenuTrigger>\n  <DropdownMenuContent>\n    <DropdownMenuItem onClick={onDuplicate}>Duplicate</DropdownMenuItem>\n  </DropdownMenuContent>\n</DropdownMenu>',
  checks: '<label className="flex items-center gap-3">\n  <Checkbox checked={done} onCheckedChange={setDone} />\n  Choose a direction\n</label>',
  sliders: '<label id="volume-label">Volume</label>\n<Slider aria-labelledby="volume-label" value={[volume]}\n  onValueChange={value => setVolume(Array.isArray(value) ? value[0] : value)} />',
  dialogs: '<Dialog>\n  <DialogTrigger render={<Button />}>Open details</DialogTrigger>\n  <DialogContent>\n    <DialogHeader>\n      <DialogTitle>A little room to focus</DialogTitle>\n      <DialogDescription>Put the important details here.</DialogDescription>\n    </DialogHeader>\n  </DialogContent>\n</Dialog>',
  alerts: '<div role="alert" data-tone="clay" className="cw-tone-soft rounded-lg border p-4">\n  <strong>Something needs your attention.</strong>\n  <p>Explain the issue and give a useful next step.</p>\n</div>',
  empty: '<ColorSurface tone="sun" aria-label="Empty projects">\n  <h3>Room for something good.</h3>\n  <p>Your projects will appear here.</p>\n  <Button onClick={createProject}>Create project</Button>\n</ColorSurface>',
  tabs: '<div role="group" aria-label="Project view">\n  {["Overview", "Activity", "Files"].map(view => (\n    <Button key={view} aria-pressed={selected === view}\n      onClick={() => setSelected(view)}>{view}</Button>\n  ))}\n</div>',
}
function CopyButton({ value, label = "Copy code" }: { value: string; label?: string }) {
  const [state, setState] = React.useState<"idle" | "copied" | "error">("idle")
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  React.useEffect(() => () => clearTimeout(timer.current), [])
  async function copy() {
    clearTimeout(timer.current)
    try { await navigator.clipboard.writeText(value); setState("copied") } catch { setState("error") }
    timer.current = setTimeout(() => setState("idle"), 2500)
  }
  return <div className="cw-copy"><Button variant="ghost" size="sm" onClick={copy}>{state === "copied" ? <Check /> : <Copy />}{state === "copied" ? "Copied" : label}</Button><span role="status" className={state === "error" ? "cw-copy-error" : "sr-only"}>{state === "error" ? "Copy unavailable. Select the code manually." : state === "copied" ? "Copied to clipboard" : ""}</span></div>
}
function CodeExample({ id, title }: { id: string; title: string }) {
  return <Dialog><DialogTrigger render={<Button variant="ghost" size="sm" />}><Code2 />Code</DialogTrigger><DialogContent className="cw-code-dialog"><DialogHeader><DialogTitle>{title}</DialogTitle><DialogDescription>Copy into a React 19 + Tailwind 4 project with Colorwork styles. State variables and handlers belong to your app.</DialogDescription></DialogHeader><pre tabIndex={0} aria-label={`${title} example code`}><code>{code[id]}</code></pre><CopyButton value={code[id]} /></DialogContent></Dialog>
}
function Example({ id }: { id: string }) {
  const [liked, setLiked] = React.useState(false)
  const [enabled, setEnabled] = React.useState(true)
  const [checked, setChecked] = React.useState(true)
  const [secondChecked, setSecondChecked] = React.useState(false)
  const [volume, setVolume] = React.useState(64)
  const [view, setView] = React.useState("Overview")
  const [project, setProject] = React.useState("")
  const [submitted, setSubmitted] = React.useState(false)
  const [notice, setNotice] = React.useState("")
  if (id === "buttons") return <div className="cw-button-demo"><div className="cw-colored-buttons"><Button tone="iris" onClick={() => setLiked(!liked)}><Heart fill={liked ? "currentColor" : "none"} />{liked ? "Added to favorites" : "Make it a favorite"}</Button><Button tone="fern" onClick={() => setNotice("Published in this demo’s memory.")}><Check />Publish</Button><Button tone="clay" variant="secondary" onClick={() => setNotice("Draft saved in this demo’s memory.")}>Save draft</Button><Button tone="ocean" variant="outline" onClick={() => setNotice("Preview selected.")}>Preview<ArrowRight /></Button></div><span role="status" className="cw-demo-note">{notice || "Solid, soft, outlined. All with character."}</span></div>
  if (id === "badges") return <div className="cw-badge-demo"><ToneBadge tone="fern">Design</ToneBadge><ToneBadge tone="iris">Engineering</ToneBadge><ToneBadge tone="clay">Writing</ToneBadge><ToneBadge tone="sun"><Sparkles size={12} />New idea</ToneBadge><ToneBadge tone="ocean">Research</ToneBadge></div>
  if (id === "inputs") return <form className="cw-input-demo" onSubmit={e => { e.preventDefault(); setSubmitted(true) }} noValidate><label htmlFor="demo-project">Project name</label><div><Input id="demo-project" value={project} onChange={e => { setProject(e.target.value); setSubmitted(false) }} placeholder="A good idea…" aria-invalid={submitted && !project.trim()} aria-describedby="project-feedback" /><Button size="icon" aria-label="Check project name" type="submit"><ArrowRight /></Button></div><p id="project-feedback" role="status" className={submitted && !project.trim() ? "text-destructive" : ""}>{submitted ? project.trim() ? "Ready to use. Nothing has been uploaded." : "Give your project a name first." : "Something short. Something you."}</p></form>
  if (id === "surfaces") return <ColorSurface tone="sun" aria-label="Sample project"><span className="cw-overline">PERSONAL PROJECT</span><h3>A space for<br />your next idea.</h3><div className="cw-surface-bottom"><ToneBadge tone="sun">In progress</ToneBadge><Layers size={20} /></div></ColorSurface>
  if (id === "switches") return <div className="cw-setting"><span className="cw-demo-icon"><Bell size={20} /></span><div><strong>Email notifications</strong><p>{enabled ? "You’re in the loop." : "A little peace and quiet."}</p></div><Switch aria-label="Email notifications" checked={enabled} onCheckedChange={setEnabled} /></div>
  if (id === "menus") return <div className="cw-menu-demo"><DropdownMenu><DropdownMenuTrigger render={<Button tone="clay" variant="secondary" />}>Project options<ChevronDown /></DropdownMenuTrigger><DropdownMenuContent align="center"><DropdownMenuItem onClick={() => setNotice("A demo copy was added locally.")}><Copy />Duplicate project</DropdownMenuItem><DropdownMenuItem onClick={() => setNotice("Project moved to the demo archive.")}><Folder />Move to archive</DropdownMenuItem></DropdownMenuContent></DropdownMenu><p role="status" className="cw-demo-note">{notice || "A few things, neatly tucked away."}</p></div>
  if (id === "checks") return <div className="cw-check-demo"><span className="cw-overline">THE SMALL WINS</span><label><Checkbox checked={checked} onCheckedChange={setChecked} /><span style={{ textDecoration: checked ? "line-through" : "none" }}>Choose a direction</span></label><label><Checkbox checked={secondChecked} onCheckedChange={setSecondChecked} />Make something good</label><p>{Number(checked) + Number(secondChecked)} of 2 steps completed</p></div>
  if (id === "sliders") return <div className="cw-slider-demo"><div><label id="volume-label">A little more volume</label><output>{volume}%</output></div><Slider aria-labelledby="volume-label" value={[volume]} onValueChange={value => setVolume(Array.isArray(value) ? value[0] : value)} /><p>Adjust with the arrow keys, too.</p></div>
  if (id === "dialogs") return <Dialog><DialogTrigger render={<Button tone="iris" />}><Plus />A little room to focus</DialogTrigger><DialogContent><DialogHeader><DialogTitle>A little room to focus.</DialogTitle><DialogDescription>A dialog keeps one decision in view. Escape closes it and returns focus to the trigger. This example doesn’t save or send anything.</DialogDescription></DialogHeader><ColorSurface tone="iris"><strong>Your next good idea starts here.</strong></ColorSurface></DialogContent></Dialog>
  if (id === "alerts") return <div className="cw-alert-demo" data-tone="fern" data-semantic="success" role="status"><span className="cw-alert-icon"><CheckCheck size={20} /></span><div><strong>All changes are up to date.</strong><p>Success-state example. No server connection.</p></div></div>
  if (id === "empty") return <div className="cw-empty-demo"><span className="cw-empty-art" aria-hidden="true"><Folder size={38} /><Sparkles size={20} /></span><strong>{notice || "Room for something good."}</strong><p>{notice ? "Created in this demo’s memory." : "Your projects will live here."}</p><Button tone="sun" size="sm" onClick={() => setNotice("Untitled project")} disabled={!!notice}><Plus />{notice ? "Project created" : "Create project"}</Button></div>
  return <div className="cw-tabs-demo"><div role="group" aria-label="Project view">{["Overview", "Activity", "Files"].map(tab => <button key={tab} type="button" aria-pressed={view === tab} onClick={() => setView(tab)}>{tab}</button>)}</div><p>{view === "Overview" ? "The big picture, all in one place." : view === "Activity" ? "Nothing new. You’re all caught up." : "No files yet. There’s room to grow."}</p></div>
}
export default function Library() {
  const { theme, setTheme } = useTheme()
  const [accent, setAccent] = React.useState(() => {
    try { return localStorage.getItem(ACCENT_KEY) ?? "" } catch { return "" }
  })
  const [colorStored, setColorStored] = React.useState(true)
  React.useLayoutEffect(() => { applyAccent(accent) }, [accent])
  function changeAccent(value: string) {
    setAccent(value)
    try { localStorage.setItem(ACCENT_KEY,value); setColorStored(true) } catch { setColorStored(false) }
  }
  const [query, setQuery] = React.useState("")
  const [group, setGroup] = React.useState("All components")
  const [mobile, setMobile] = React.useState(false)
  const shown = entries.filter(item => (group === "All components" || item.group === group) && `${item.title} ${item.group} ${item.note}`.toLowerCase().includes(query.toLowerCase()))
  const choose = (value: string) => { setGroup(value); setMobile(false) }
  return <div className="cw-site">
    <a href="#catalog" className="cw-skip">Skip to components</a>
    <header className="cw-header"><Link className="cw-brand" to="/"><span className="cw-logo" aria-hidden="true"><i /><i /><i /><i /></span>colorwork<span className="cw-alpha">ALPHA</span></Link><nav aria-label="Main navigation"><a href="#catalog" aria-current="page">Components</a><Link to="/docs/color-language">Foundations</Link><Link to="/view/agent-workspace">Workspace</Link></nav><div className="cw-header-end"><a href="https://github.com/sumitttt4/solid-glass/tree/color-language" target="_blank" rel="noreferrer" className="cw-source">GitHub<ArrowRight size={14} /></a><Button variant="ghost" size="icon" aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`} onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>{theme === "dark" ? <Sun /> : <Moon />}</Button><Button className="cw-mobile-toggle" variant="ghost" size="icon" aria-label="Toggle component categories" aria-expanded={mobile} aria-controls="library-sidebar" onClick={() => setMobile(!mobile)}>{mobile ? <X /> : <Menu />}</Button></div></header>
    <div className="cw-layout"><aside id="library-sidebar" className={`cw-sidebar ${mobile ? "is-open" : ""}`}><div className="cw-sidebar-caption">THE COLLECTION</div><nav aria-label="Component categories">{groups.map((name, index) => <button key={name} aria-pressed={group === name} onClick={() => choose(name)}><span>{name}</span><span>{index === 0 ? entries.length : entries.filter(e => e.group === name).length.toString().padStart(2, "0")}</span></button>)}</nav><div className="cw-sidebar-caption cw-space-top">MAKE IT YOURS</div><Link to="/docs/installation">Getting started<ArrowRight size={13} /></Link><Link to="/docs/color-language">Color & material<ArrowRight size={13} /></Link><Link to="/color-study">Palette workbench<ArrowRight size={13} /></Link><div className="cw-sidebar-note"><span className="cw-mini-mark" aria-hidden="true">✳</span><p>Clean doesn’t<br />have to mean<br /><strong>colorless.</strong></p><span>Made by Sumit Sharma</span></div></aside>
    <main className="cw-main"><section className="cw-intro"><div><p className="cw-eyebrow"><span />A COLOR-LED COMPONENT LIBRARY</p><h1>Build your site<br />with a little<br /><span>more color.</span></h1><p className="cw-intro-copy">Explore a growing library of expressive React components. Pick a starting point, copy the code, and make it yours.</p><div className="cw-hero-actions"><a href="#catalog" data-tone="iris" data-slot="button" data-variant="default" className="cw-explore">Explore the library<ArrowDown size={15} /></a><Link data-tone="fern" data-slot="button" data-variant="secondary" className="cw-secondary-cta" to="/docs/installation">Get started<ArrowRight size={14} /></Link></div></div><div className="cw-composition" aria-hidden="true"><div className="cw-shape cw-shape-green"><span>Form.</span></div><div className="cw-shape cw-shape-blue"><Sparkles /></div><div className="cw-shape cw-shape-yellow"><span>& feeling.</span></div><span className="cw-composition-caption">A LITTLE STRUCTURE. A LOT OF POSSIBILITY.</span></div></section>
    <section className="cw-color-controls" aria-label="Global component color"><div><strong>Make it your color.</strong><p>One change. Every component.</p></div><div className="cw-color-options" role="group" aria-label="Global color presets">{ACCENT_COLORS.map(color => <button key={color} type="button" style={{ background: color }} aria-label={`Use ${color} for all components`} aria-pressed={accent === color} onClick={() => changeAccent(color)}>{accent === color && <Check size={15} color="white" />}</button>)}</div><label className="cw-color-picker"><input type="color" aria-label="Custom global component color" value={accent || "#5943af"} onChange={e => changeAccent(e.target.value)} /><span>{accent || "Custom color"}</span></label><Button variant="ghost" size="sm" onClick={() => changeAccent("")} disabled={!accent}>Reset</Button><span role="status" className="sr-only">{!colorStored ? "Color changed for this visit; browser storage is unavailable." : accent ? `Global color ${accent} selected and remembered.` : "Original multicolor palette."}</span></section>
    <section id="catalog" aria-labelledby="catalog-title"><div className="cw-catalog-bar"><div><h2 id="catalog-title">{group === "All components" ? "The building blocks" : group}<span>{shown.length.toString().padStart(2, "0")}</span></h2><p>Small details. Ready to play with.</p></div><label className="cw-search"><Search size={16} /><input aria-label="Search components" placeholder="Find a component…" value={query} onChange={e => setQuery(e.target.value)} />{query && <button type="button" aria-label="Clear search" onClick={() => setQuery("")}><X size={14} /></button>}</label></div><p className="sr-only" role="status">{shown.length} components found</p>
    <div className="cw-grid">{shown.map((entry) => <article key={entry.id} className={`cw-example cw-example-${entry.id}`} data-tone={entry.tone as ColorTone}><div className="cw-preview"><Example id={entry.id} /></div><div className="cw-example-info"><div><h3>{entry.title}</h3><p>{entry.note}</p></div><CodeExample id={entry.id} title={entry.title} /></div><span className="cw-example-index" aria-hidden="true">{String(entries.indexOf(entry) + 1).padStart(2, "0")}</span></article>)}</div>
    {!shown.length && <div className="cw-no-results"><Search /><h3>No components found.</h3><p>Try “button”, “input”, or a broader category.</p><Button variant="outline" onClick={() => { setQuery(""); setGroup("All components") }}>Reset filters</Button></div>}
    </section><section className="cw-start"><div><p className="cw-eyebrow">YOUR CODE. YOUR CALL.</p><h2>Take the good parts.<br />Make something of your own.</h2><p>React 19 · Tailwind CSS 4 · Base UI primitives</p></div><Link data-tone="iris" data-slot="button" data-variant="default" to="/docs/installation">Start building<ArrowRight size={18} /></Link></section><footer className="cw-footer"><span>Colorwork · a working name, a growing collection.</span><span>By Sumit Sharma · MIT · <a href="https://github.com/deeplethe/solid-glass">Built on Solid Glass</a> & shadcn/ui</span></footer></main></div>
  </div>
}
