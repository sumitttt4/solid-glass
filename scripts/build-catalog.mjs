import { readFileSync, readdirSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
const root=join(dirname(fileURLToPath(import.meta.url)),"..")
const pages=JSON.parse(readFileSync(join(root,"src/docs/generated.json"),"utf8"))
const original=new Set(["tone-badge","color-surface","palette-picker","option-card","status-callout","copy-snippet"])
const solid=new Set(["ask-card","composer","context-ring","diff-view","dot-loader","panel","reasoning","status-glyph","tag","task-notice","tool-steps","turn-status"])
const exampleFiles=new Set(readdirSync(join(root,"src/examples")).filter(file=>file.endsWith(".tsx")).map(file=>file.slice(0,-4)))
const entries=readdirSync(join(root,"src/components/ui")).filter(file=>file.endsWith(".tsx")).map(file=>{
 const slug=file.slice(0,-4),page=pages.find(p=>p.section!=="docs"&&p.slug===slug)
 const linked=page?.blocks.filter(b=>b.type==="preview").map(b=>b.name)??[]
 const related=[...exampleFiles].filter(name=>name===`${slug}-demo`||name.startsWith(`${slug}-`))
 const examples=[...new Set([...linked,...related])].filter(name=>exampleFiles.has(name))
 return {slug,title:page?.title??slug.split("-").map(s=>s[0].toUpperCase()+s.slice(1)).join(" "),description:page?.description??`Editable ${slug.replaceAll("-"," ")} component source.`,origin:original.has(slug)?"Colorwork":slug==="button"?"Adapted":solid.has(slug)?"Solid Glass":"shadcn/ui",examples,hasDocs:!!page}
}).sort((a,b)=>a.title.localeCompare(b.title))
writeFileSync(join(root,"src/site/catalog.generated.json"),JSON.stringify(entries,null,2)+"\n")
console.log(`catalog: ${entries.length} UI components (${entries.filter(e=>e.origin==="Colorwork").length} original Colorwork), all local source files included`)
