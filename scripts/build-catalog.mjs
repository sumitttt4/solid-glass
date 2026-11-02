import { readFileSync, readdirSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
const root=join(dirname(fileURLToPath(import.meta.url)),"..")
const pages=JSON.parse(readFileSync(join(root,"src/docs/generated.json"),"utf8"))
const original=new Set(["tone-badge","color-surface","palette-picker","option-card","status-callout","copy-snippet","animated-icons","audio-waveform","live-transcript","voice-orb","voice-input","streaming-text","speak-button","material-picker","chat-window","model-picker","prompt-suggestions","token-counter"])
// What a component is for, to browse by. AI covers the new voice set and the inherited agent UI.
const ai=new Set(["chat-window","model-picker","prompt-suggestions","token-counter","audio-waveform","live-transcript","voice-orb","voice-input","streaming-text","speak-button","ask-card","composer","context-ring","diff-view","dot-loader","message","message-scroller","bubble","reasoning","status-glyph","task-notice","tool-steps","turn-status","markdown","questionnaire","attachment"])
const OVERRIDES={"animated-icons": "65 animated icons for dashboards and everyday actions: hover to play, loop them, or switch two-state icons.", "chart": "Area, bar, line, pie and radar charts built on Recharts, styled to match the theme.", "direction": "Sets left-to-right or right-to-left layout for the components inside it.", "markdown": "Renders Markdown from a model or a user, with code blocks, tables and links styled to match.", "sonner": "Toast notifications built on Sonner, styled to match the theme.", "drawer": "A panel that slides in from the edge of the screen and can be dragged to close.", "dropdown-menu": "A menu of actions or options, opened from a button.", "radio-group": "A set of options where only one can be selected at a time.", "select": "A list of options to pick from, opened from a button.", "tabs": "Layered sections of content, shown one at a time.", "composer": "The message box for a chat: attachments, text and a send button.", "panel": "A titled container for laying out the sections of a page.", "context-ring": "How full the context window is, shown as a ring. Click it for the numbers and a breakdown.", "copy-snippet": "Code you can select or copy, with feedback that reports whether the copy actually worked.", "tag": "A file or reference attached to a message. While it uploads, the tag fills up as a progress bar.", "task-notice": "A notice that a background task has finished: a status dot and a line saying what it was.", "status-glyph": "Three animated dots that show an agent is working, and what it is doing.", "turn-status": "The status line under a running reply: what it is doing, for how long and how much it has written.", "reasoning": "The model's reasoning, collapsed by default.", "tool-steps": "A run of tool calls collapsed into one line that expands to show each step.", "empty": "An empty state with an icon, a message and an action.", "skeleton": "A placeholder shape shown while content loads.", "kbd": "Shows a keyboard key or shortcut.", "streaming-text": "An AI answer that arrives word by word, plus shimmering text for while the model is working.", "sidebar": "A collapsible app sidebar with groups, menus, badges and a mobile sheet.", "table": "A responsive table for rows of data.", "item": "A row for lists: media, title, description and actions.", "input": "A text field for forms.", "native-select": "The browser's own select element, styled to match the theme.", "aspect-ratio": "Keeps content at a fixed width-to-height ratio.", "scroll-area": "A scrollable region with slim, styled scrollbars.", "collapsible": "A panel that expands and collapses."}
const DESCRIPTIONS={
 "animated-icons":"A small set of icons that move like what they stand for: hover to play, loop, or switch two-state icons.",
 "audio-waveform":"Bars or a line that move with a voice, fed live from the microphone or by simulated levels.",
 "live-transcript":"Live speech-to-text in the browser, shown as a running transcript with timestamps and speakers.",
 "voice-orb":"A living orb for a voice assistant: it breathes when idle, swells with a voice and swirls while thinking.",
 "voice-input":"Press to talk: a microphone button with a live waveform, timer and transcript that hands back text.",
 "streaming-text":"An AI answer that arrives word by word, and shimmering text for while the model is working.",
 "speak-button":"Reads text aloud with the browser's voices; bars dance while it talks.",
 "chat-window":"A complete chat: model picker, context meter, streaming answers with copy, retry and read-aloud, suggestions, files and voice input.",
 "model-picker":"A searchable model switcher grouped by provider, with capabilities and context size. Fully keyboard driven.",
 "prompt-suggestions":"Starting points for an empty chat, as cards or pills, with icons and a gentle entrance.",
 "token-counter":"Context window usage as a small ring that opens into a breakdown and estimated cost. Warns at 70% and 90%.",
 "material-picker":"Switch the whole library, or one part of a page, between Normal, Glass, Frost and Aurora.",
}
const categoryOf=slug=>slug==="animated-icons"?"Icons":slug==="material-picker"?"Materials":ai.has(slug)?"AI & Voice":"Components"
const solid=new Set(["ask-card","composer","context-ring","diff-view","dot-loader","panel","reasoning","status-glyph","tag","task-notice","tool-steps","turn-status"])
const exampleFiles=new Set(readdirSync(join(root,"src/examples")).filter(file=>file.endsWith(".tsx")).map(file=>file.slice(0,-4)))
const entries=readdirSync(join(root,"src/components/ui")).filter(file=>file.endsWith(".tsx")&&file!=="tailwind-palette.tsx").map(file=>{
 const slug=file.slice(0,-4),page=pages.find(p=>p.section!=="docs"&&p.slug===slug)
 const linked=page?.blocks.filter(b=>b.type==="preview").map(b=>b.name)??[]
 const related=[...exampleFiles].filter(name=>name===`${slug}-demo`||name.startsWith(`${slug}-`))
 const examples=[...new Set([...linked,...related])].filter(name=>exampleFiles.has(name)).sort((a,b)=>Number(b===`${slug}-demo`)-Number(a===`${slug}-demo`))
 return {slug,title:page?.title??slug.split("-").map(s=>s[0].toUpperCase()+s.slice(1)).join(" "),description:OVERRIDES[slug]??page?.description??DESCRIPTIONS[slug]??`The ${slug.replaceAll("-"," ")} component.`,origin:original.has(slug)?"Glaze":slug==="button"?"Adapted":solid.has(slug)?"Solid Glass":"shadcn/ui",examples,hasDocs:!!page,category:categoryOf(slug)}
}).sort((a,b)=>a.title.localeCompare(b.title))
writeFileSync(join(root,"src/site/catalog.generated.json"),JSON.stringify(entries,null,2)+"\n")
console.log(`catalog: ${entries.length} UI components (${entries.filter(e=>e.origin==="Glaze").length} original Glaze), all local source files included`)
