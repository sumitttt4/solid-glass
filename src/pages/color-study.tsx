import * as React from "react"
import { Moon, Sun } from "lucide-react"
import AgentWorkspace from "@/blocks/agent-workspace"
import { Button } from "@/components/ui/button"
import "./color-study.css"

const directions = [
  { id: "garden", name: "Garden", note: "Leaf green actions, lilac structure. Warm surfaces keep research feeling human." },
  { id: "ink", name: "Ink", note: "Cobalt actions, cool mineral surfaces, warm file panels. Precise and technical." },
  { id: "clay", name: "Clay", note: "Terracotta actions, oat surfaces, sage structure. Tactile without the glass." },
] as const

export default function ColorStudy() {
  const [direction, setDirection] = React.useState(() => directions.find(d => d.id === new URLSearchParams(location.search).get("direction"))?.id ?? "garden")
  const [dark, setDark] = React.useState(() => document.documentElement.classList.contains("dark"))
  const [error, setError] = React.useState(false)
  React.useLayoutEffect(() => {
    const root = document.documentElement
    const previous = root.classList.contains("dark")
    const title = document.title
    root.dataset.colorStudy = ""
    document.title = "Color language — Workspace study"
    return () => {
      delete root.dataset.colorStudy
      delete root.dataset.direction
      root.classList.toggle("dark", previous)
      document.title = title
    }
  }, [])
  React.useLayoutEffect(() => {
    document.documentElement.dataset.direction = direction
    document.documentElement.classList.toggle("dark", dark)
    const url = new URL(location.href)
    url.searchParams.set("direction", direction)
    url.searchParams.set("theme", dark ? "dark" : "light")
    history.replaceState(null, "", url)
  }, [direction, dark])
  const selected = directions.find(d => d.id === direction)!
  return (
    <div className="study-shell">
      <header className="study-header">
        <div className="study-title"><span className="study-mark" aria-hidden="true">✳</span><div><h1>Color language</h1><p>01 / Workspace study</p></div></div>
        <div className="study-directions" role="group" aria-label="Color direction">
          {directions.map(d => <Button key={d.id} variant="ghost" aria-pressed={d.id === direction} onClick={() => setDirection(d.id)}><span className={`study-swatch study-swatch-${d.id}`} aria-hidden="true" />{d.name}</Button>)}
        </div>
        <div className="study-controls"><label><input type="checkbox" checked={error} onChange={e => setError(e.target.checked)} />Error state</label><Button variant="outline" size="icon" aria-label={dark ? "Switch to light theme" : "Switch to dark theme"} onClick={() => setDark(!dark)}>{dark ? <Sun /> : <Moon />}</Button></div>
      </header>
      <div className="study-caption"><p>{selected.note}</p><span>Interactive demo · local state</span></div>
      <div className="study-frame"><AgentWorkspace previewError={error} /></div>
      <footer className="study-legend"><span><i className="study-key-action" />Action & selection</span><span><i className="study-key-structure" />Structure & grouping</span><span><i className="study-key-status" />Status has text, too</span><p>Same components. Three directions. No palette locked.</p></footer>
    </div>
  )
}
