import * as React from "react"
import { Link, useSearchParams } from "react-router-dom"
import { ArrowLeft, ArrowRight, Moon, Search, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CopySnippet } from "@/components/ui/copy-snippet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PalettePicker } from "@/components/ui/palette-picker"
import { ComponentPreview, ComponentSource } from "@/site/component-preview"
import { SolidGlassMark } from "@/site/logo"
import { ACCENT_KEY, applyAccent } from "@/site/accent"
import { useTheme } from "@/site/theme"
import catalog from "@/site/catalog.generated.json"
import "./library.css"
import "./collection.css"
class PreviewBoundary extends React.Component<{ children: React.ReactNode }, { error: boolean }> {
  state = { error: false }
  static getDerivedStateFromError() { return { error: true } }
  render() { return this.state.error ? <div role="alert" className="collection-preview-error">This example couldn’t render. You can still inspect its source and dependencies.<Button variant="secondary" onClick={() => this.setState({ error: false })}>Retry preview</Button></div> : this.props.children }
}
export default function Collection() {
  const [params, setParams] = useSearchParams()
  const selected = catalog.find(entry => entry.slug === params.get("component")) ?? catalog.find(entry => entry.slug === "palette-picker")!
  const [search,setSearch] = React.useState("")
  const [origin,setOrigin] = React.useState("All")
  const tab = ["Preview","Source","Install"].includes(params.get("view")??"") ? params.get("view")! : "Preview"
  const example = params.get("example") ?? ""
  const [accent,setAccent] = React.useState(() => {try{return localStorage.getItem(ACCENT_KEY)??""}catch{return ""}})
  const {theme,setTheme}=useTheme()
  const list = React.useRef<HTMLElement>(null)
  const exampleTrigger = React.useRef<HTMLButtonElement>(null)
  const [exampleOpen,setExampleOpen] = React.useState(false)
  React.useEffect(()=>{const nav=list.current,active=nav?.querySelector<HTMLElement>('[aria-current="page"]');if(nav&&active){const n=nav.getBoundingClientRect(),a=active.getBoundingClientRect();if(a.top<n.top||a.bottom>n.bottom)nav.scrollTop+=a.top-n.top-nav.clientHeight/2+active.clientHeight/2}},[selected.slug])
  const entries=catalog.filter(entry=>(origin==="All"||(origin==="Colorwork"?entry.origin==="Colorwork":entry.origin!=="Colorwork"))&&`${entry.title} ${entry.description}`.toLowerCase().includes(search.toLowerCase()))
  const currentExample=selected.examples.includes(example)?example:selected.examples[0]
  function choose(slug:string) {setParams({component:slug});if(window.matchMedia("(max-width: 900px)").matches)requestAnimationFrame(()=>document.getElementById("component-detail")?.scrollIntoView({block:"start"}))}
  function setTab(view:string){setParams(current=>{const next=new URLSearchParams(current);next.set("component",selected.slug);next.set("view",view);return next})}
  function setExample(example:string){setParams(current=>{const next=new URLSearchParams(current);next.set("component",selected.slug);next.set("example",example);return next})}
  function color(value:string) {setAccent(value);applyAccent(value);try{localStorage.setItem(ACCENT_KEY,value)}catch{/* choice lasts for this visit */}}
  return <div className="cw-site collection-site"><a href="#component-detail" className="cw-skip">Skip to selected component</a><header className="cw-header"><Link to="/" className="cw-brand"><SolidGlassMark />colorwork</Link><nav aria-label="Collection navigation"><Link to="/components" aria-current="page">All components</Link><Link to="/blocks">Blocks</Link><Link to="/docs/installation">Get started</Link></nav><div className="cw-header-end"><Link to="/" className="cw-source"><ArrowLeft size={14} />Home</Link><Button variant="ghost" size="icon" aria-label={`Switch to ${theme==="dark"?"light":"dark"} theme`} onClick={()=>setTheme(theme==="dark"?"light":"dark")}>{theme==="dark"?<Sun />:<Moon />}</Button></div></header>
  <div className="collection-heading"><div><p className="cw-eyebrow">THE FULL COLLECTION</p><h1>Every building block.<br /><span>A little more you.</span></h1><p>{catalog.length} source components · {catalog.filter(e=>e.origin==="Colorwork").length} original Colorwork additions · 75 inherited from the upstream foundation</p></div><details className="collection-color"><summary>Change all component colors</summary><PalettePicker value={accent} onValueChange={color} /></details></div>
  <div className="collection-layout"><aside className="collection-list" aria-label="All components"><label className="cw-search"><Search size={16} /><input aria-label="Search full component collection" placeholder="Search all components…" value={search} onChange={e=>setSearch(e.target.value)} /></label><div className="collection-filters" role="group" aria-label="Component source">{["All","Colorwork","Upstream"].map(value=><button key={value} aria-pressed={origin===value} onClick={()=>setOrigin(value)}>{value}</button>)}</div><p className="collection-result-count" role="status">{entries.length} components</p><nav ref={list} aria-label="Component list">{entries.map(entry=><button key={entry.slug} aria-current={entry.slug===selected.slug?"page":undefined} onClick={()=>choose(entry.slug)}><span>{entry.title}</span><small>{entry.origin}</small></button>)}</nav>{!entries.length&&<p className="collection-preview-error">Nothing matches. Try a component name or change the source filter.</p>}</aside>
  <main id="component-detail" className="collection-detail"><div className="collection-detail-title"><div><span className="collection-origin">{selected.origin==="Colorwork"?"ORIGINAL COLORWORK":selected.origin==="Adapted"?"ADAPTED FOUNDATION":`INHERITED · ${selected.origin}`}</span><h2>{selected.title}</h2><p>{selected.description}</p></div>{selected.hasDocs&&<Link to={`/docs/components/${selected.slug}`}>Documentation<ArrowRight size={14} /></Link>}</div><div className="collection-tabs" role="group" aria-label="Component detail view">{["Preview","Source","Install"].map(value=><button key={value} aria-pressed={tab===value} onClick={()=>setTab(value)}>{value}</button>)}</div>
    {tab==="Preview"&&<div className="collection-preview">{selected.examples.length>1&&<div className="collection-example-picker"><span id="example-picker-label">Example</span><Select open={exampleOpen} onOpenChange={(open,details)=>{setExampleOpen(open);if(!open&&details.reason!=="outside-press"&&details.reason!=="focus-out")requestAnimationFrame(()=>exampleTrigger.current?.focus({preventScroll:true}))}} modal={false} items={selected.examples.map(name=>({value:name,label:name.replace(`${selected.slug}-`,"").replaceAll("-"," ")}))} value={currentExample} onValueChange={value=>{if(value)setExample(value)}}><SelectTrigger ref={exampleTrigger} aria-label="Choose component example" className="collection-example-trigger"><SelectValue /></SelectTrigger>{exampleOpen && <SelectContent finalFocus={exampleTrigger} align="start" alignItemWithTrigger={false} className="collection-example-options">{selected.examples.map(name=><SelectItem key={name} value={name}>{name.replace(`${selected.slug}-`,"").replaceAll("-"," ")}</SelectItem>)}</SelectContent>}</Select></div>}{currentExample?<PreviewBoundary key={`${selected.slug}-${currentExample}`}><ComponentPreview key={currentExample} name={currentExample} /></PreviewBoundary>:<div className="collection-preview-error">No standalone example for this source file. Open Source to inspect it or Install to use it.</div>}</div>}
    {tab==="Source"&&<div className="collection-source"><p>Complete editable component source. Keep imports and install its dependencies; the Install tab includes the registry command.</p><ComponentSource key={selected.slug} name={selected.slug} />{selected.slug === "palette-picker" && <details className="collection-helper"><summary>Required Tailwind palette data</summary><ComponentSource name="tailwind-palette" title="components/ui/tailwind-palette.ts" /></details>}</div>}
    {tab==="Install"&&<div className="collection-install"><CopySnippet label={`Install ${selected.title}`} code={`npx shadcn@latest add sumitttt4/solid-glass/${selected.slug}#color-language`} /><CopySnippet label="Install paired theme files" code="npx shadcn@latest add sumitttt4/solid-glass/colorwork#color-language" /><p>Use React 19, Tailwind 4 and compatible Base UI primitives. Import colorwork.css after your app styles; it also needs solid-glass.css. Registry installation copies editable source and declared dependencies. The full collection is included; end-to-end installation of every item is not claimed tested.</p><Link to="/docs/installation">Read setup and font instructions<ArrowRight size={14}/></Link></div>}
    <footer className="collection-provenance">{selected.origin==="Colorwork"?"Original component added for Colorwork. Theme tokens are shared with the rest of the collection.":"Inherited from the MIT-licensed Solid Glass foundation and its shadcn/ui components. Colorwork applies its own shared theme; upstream authorship is retained."} <a href="https://github.com/sumitttt4/solid-glass/tree/color-language">View repository</a></footer></main></div></div>
}
