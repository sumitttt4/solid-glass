import * as React from "react"
import { useSearchParams } from "react-router-dom"
import { AiIdeaIcon, CodeIcon, Mail01Icon } from "@hugeicons/core-free-icons"

import { ChatWindow, type ChatMessage } from "@/components/ui/chat-window"
import { LiveTranscript, type TranscriptSegment } from "@/components/ui/live-transcript"
import { ModelPicker, type ModelOption } from "@/components/ui/model-picker"
import { PromptSuggestions, type PromptSuggestion } from "@/components/ui/prompt-suggestions"
import { TokenCounter } from "@/components/ui/token-counter"
import { DEMO_MODELS, demoRespond } from "@/lib/demo-ai"

/*
 * Development only (/dev/worst): the AI components fed realistic worst-case data, behind a
 * Demo / Worst case / Empty / One toggle (?data=…). The fixtures are the regression test for
 * the next change to any of them.
 */

type Mode = "demo" | "worst" | "empty" | "one"

const WORST_MODELS: ModelOption[] = [
  { id: "a", name: "Konstantin-Oberhauser-Wettstein Reasoning Ultra Long Context Preview", provider: "Northwind Industries Holdings Research Laboratory", description: "Senior Product Design Engineer, Platform Infrastructure: a 2,000 token description pasted straight from the vendor's marketing site that keeps going well past two lines of text in the list.", tags: ["Reasoning", "Vision", "Audio", "Realtime", "Benachrichtigungseinstellungen", "customer-feedback-from-enterprise-onboarding", "Open"], context: 10_000_000, color: "#b45309" },
  { id: "b", name: "J", provider: "Jo", context: 1000 },
  { id: "c", name: "王秀英 模型", provider: "王秀英", description: "中文描述，没有空格的长句子会在任何地方断开吗", tags: ["中文"], context: 128_000 },
  { id: "d", name: "نور الهدى", provider: "نور الهدى عبد الرحمن", description: "نموذج عربي", context: 32_000 },
  { id: "e", name: "🦊 Fox", provider: "👩🏽‍💻 Priya Labs", tags: [], context: 0 },
  { id: "f", name: "Disabled model", provider: "Jo", description: "Not available on your plan.", disabled: true },
]

const WORST_SUGGESTIONS: PromptSuggestion[] = [
  { title: "Paramètres de confidentialité et de sécurité pour l’équipe", description: "bartholomew.fitzgerald@northwind-industries-holdings.example.com", icon: Mail01Icon },
  { title: "Benachrichtigungseinstellungen", icon: AiIdeaIcon },
  { title: "J" },
  { title: "https://example.com/workspaces/acme/projects/q3-launch/docs/9f8e7d6c5b4a?tab=comments&filter=unresolved", description: "Summarize this", icon: CodeIcon },
  { title: "<script>alert(1)</script> &amp; **bold**" },
]

const LONG_PASTE = "Here is the full contract. ".repeat(80).trim()
const WORST_MESSAGES: ChatMessage[] = [
  { id: "1", role: "user", content: "https://example.com/workspaces/acme/projects/q3-launch/docs/9f8e7d6c5b4a?tab=comments&filter=unresolved", files: ["Q3 Board Deck — FINAL (revised) v12 [approved by legal].pdf", "IMG_20250914_183022_HDR_portrait_edited_edited.HEIC"] },
  { id: "2", role: "assistant", content: "Benachrichtigungseinstellungen\n\n<script>alert(1)</script> &amp; **not bold**\n\nconst x = 0.1 + 0.2 // 0.30000000000000004" },
  { id: "3", role: "user", content: LONG_PASTE },
  { id: "4", role: "assistant", content: "👩🏽‍💻 نور الهدى عبد الرحمن — Đặng Thị Ngọc Hân — 王秀英" },
]

const WORST_SEGMENTS: TranscriptSegment[] = [
  { id: "1", text: "bartholomew.fitzgerald@northwind-industries-holdings.example.com said yes", at: 0, speaker: "Aleksandra Wiśniewska-Kowalczyk" },
  { id: "2", text: "Đặng Thị Ngọc Hân", at: 4523, speaker: "J" },
  { id: "3", text: "نور الهدى عبد الرحمن", at: 86_399, speaker: "نور" },
]

function fixtures(mode: Mode) {
  switch (mode) {
    case "worst":
      return { models: WORST_MODELS, model: "a", suggestions: WORST_SUGGESTIONS, messages: WORST_MESSAGES, segments: WORST_SEGMENTS, tokens: [0, 1, 199_999, 284_000] }
    case "empty":
      return { models: [] as ModelOption[], model: "", suggestions: [], messages: [], segments: [], tokens: [0] }
    case "one":
      return { models: DEMO_MODELS.slice(0, 1), model: DEMO_MODELS[0].id, suggestions: WORST_SUGGESTIONS.slice(2, 3), messages: WORST_MESSAGES.slice(0, 1), segments: WORST_SEGMENTS.slice(1, 2), tokens: [1] }
    default:
      return { models: DEMO_MODELS, model: "aurora-pro", suggestions: WORST_SUGGESTIONS.slice(1, 2).map((s) => ({ ...s, title: "Plan my week" })), messages: [], segments: [{ id: "x", text: "Welcome to the weekly sync.", at: 3, speaker: "Sam" }], tokens: [84_000] }
  }
}

export default function DevWorst() {
  const [params, setParams] = useSearchParams()
  const mode = (["demo", "worst", "empty", "one"].includes(params.get("data") ?? "") ? params.get("data") : "worst") as Mode
  const f = fixtures(mode)
  const [model, setModel] = React.useState(f.model)
  React.useEffect(() => setModel(f.model), [f.model])
  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-10 px-4 py-10 pb-32">
      <section className="grid grid-cols-[minmax(0,1fr)] gap-6 md:grid-cols-[280px_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-col gap-3">
          <h2 className="text-sm font-semibold">Model picker in a 280px column</h2>
          <div className="bg-card flex w-full min-w-0 items-center justify-between gap-2 rounded-xl p-2">
            <ModelPicker models={f.models} value={model} onValueChange={setModel} />
            <TokenCounter used={f.tokens[0]} limit={200_000} />
          </div>
          <h2 className="mt-4 text-sm font-semibold">Token counters</h2>
          <div className="bg-card flex flex-wrap gap-2 rounded-xl p-2">
            {f.tokens.map((t, i) => (
              <TokenCounter key={i} used={t} limit={i === 3 ? 0 : 200_000} costPerMillion={3} parts={[{ label: "Senior Product Design Engineer, Platform Infrastructure", tokens: t }]} />
            ))}
          </div>
          <h2 className="mt-4 text-sm font-semibold">Transcript</h2>
          <LiveTranscript segments={f.segments} listening={mode === "worst"} />
        </div>
        <div className="flex min-w-0 flex-col gap-3">
          <h2 className="text-sm font-semibold">Prompt suggestions</h2>
          <PromptSuggestions suggestions={f.suggestions} onSelect={() => {}} />
          <PromptSuggestions variant="pills" suggestions={f.suggestions} onSelect={() => {}} />
        </div>
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold">Chat window</h2>
        <ChatWindow key={mode} respond={demoRespond} models={f.models.length ? f.models : undefined} model={model} onModelChange={setModel} initialMessages={f.messages} suggestions={f.suggestions} className="max-w-3xl" />
      </section>
      <div role="radiogroup" aria-label="Data" className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 gap-0.5 rounded-full bg-neutral-200 p-1 font-sans text-xs text-neutral-900 shadow">
        {(["demo", "worst", "empty", "one"] as Mode[]).map((m) => (
          <button key={m} role="radio" aria-checked={mode === m} onClick={() => setParams({ data: m })} className="cursor-pointer rounded-full px-3 py-1.5 aria-checked:bg-white">
            {m === "demo" ? "Demo data" : m === "worst" ? "Worst case" : m === "empty" ? "Empty" : "One"}
          </button>
        ))}
      </div>
    </div>
  )
}
