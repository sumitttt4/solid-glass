import * as React from "react"
import { ArrowUp02Icon, Cancel01Icon, File01Icon, StopIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import { AttachmentIcon, CopyIcon, MicIcon, RefreshIcon, ThumbsUpIcon, VolumeIcon } from "@/components/ui/animated-icons"
import { AudioWaveform, useMicrophoneLevels, useSimulatedLevels } from "@/components/ui/audio-waveform"
import { useSpeechRecognition } from "@/components/ui/live-transcript"
import { ModelPicker, type ModelOption } from "@/components/ui/model-picker"
import { PromptSuggestions, type PromptSuggestion } from "@/components/ui/prompt-suggestions"
import { useSpeech } from "@/components/ui/speak-button"
import { ShimmerText } from "@/components/ui/streaming-text"
import { TokenCounter } from "@/components/ui/token-counter"
import { VoiceOrb } from "@/components/ui/voice-orb"

export type ChatMessage = { id: string; role: "user" | "assistant"; content: string; files?: string[] }

/** Return the whole answer, or stream it chunk by chunk. */
export type ChatResponder = (messages: ChatMessage[]) => Promise<string> | AsyncIterable<string>

const uid = () => Math.random().toString(36).slice(2, 10)
/** About four characters to a token: close enough for a meter. */
const estimateTokens = (messages: ChatMessage[]) => Math.round(messages.reduce((n, m) => n + m.content.length, 0) / 4)

async function* wordsOf(text: string) {
  for (const word of text.split(/(?<=\s)/)) {
    await new Promise((r) => setTimeout(r, 22 + Math.random() * 30))
    yield word
  }
}

const css = `@keyframes cw-msg{from{opacity:0;transform:translateY(6px)}}[data-slot=chat-window] [data-message]{animation:cw-msg .3s cubic-bezier(.2,.8,.2,1)}@keyframes cw-caret{50%{opacity:0}}@media (prefers-reduced-motion:reduce){[data-slot=chat-window] *{animation:none!important}}`

/**
 * A complete chat: model picker and context meter on top, streaming answers with copy,
 * retry, read-aloud and feedback, suggestions when empty, and a composer that takes text,
 * files or your voice (with live transcription).
 */
export function ChatWindow({
  respond,
  models,
  model,
  onModelChange,
  suggestions,
  title = "New chat",
  greeting = "How can I help today?",
  contextLimit = 200_000,
  initialMessages = [],
  className,
}: {
  respond: ChatResponder
  models?: ModelOption[]
  model?: string
  onModelChange?: (id: string) => void
  suggestions?: PromptSuggestion[]
  title?: string
  greeting?: string
  contextLimit?: number
  /** A conversation to start from. */
  initialMessages?: ChatMessage[]
  className?: string
}) {
  const [messages, setMessages] = React.useState<ChatMessage[]>(initialMessages)
  const [draft, setDraft] = React.useState("")
  const [files, setFiles] = React.useState<string[]>([])
  const [status, setStatus] = React.useState<"idle" | "thinking" | "streaming">("idle")
  const [recording, setRecording] = React.useState(false)
  const stopped = React.useRef(false)
  const scroller = React.useRef<HTMLDivElement>(null)
  const fileInput = React.useRef<HTMLInputElement>(null)
  const textarea = React.useRef<HTMLTextAreaElement>(null)

  const speech = useSpeechRecognition()
  const mic = useMicrophoneLevels({ bands: 32 })
  const simulated = useSimulatedLevels(recording && mic.status !== "live", 32)
  const levels = mic.status === "live" ? mic.levels : simulated

  React.useEffect(() => {
    const box = scroller.current
    if (box) box.scrollTo({ top: box.scrollHeight, behavior: "smooth" })
  }, [messages, status])

  React.useEffect(() => {
    const el = textarea.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`
  }, [draft])

  async function run(history: ChatMessage[]) {
    stopped.current = false
    setStatus("thinking")
    const id = uid()
    try {
      const result = respond(history)
      const stream = typeof (result as AsyncIterable<string>)[Symbol.asyncIterator] === "function" ? (result as AsyncIterable<string>) : wordsOf(await (result as Promise<string>))
      let started = false
      for await (const chunk of stream) {
        if (stopped.current) break
        if (!started) {
          started = true
          setStatus("streaming")
          setMessages((all) => [...all, { id, role: "assistant", content: chunk }])
        } else setMessages((all) => all.map((m) => (m.id === id ? { ...m, content: m.content + chunk } : m)))
      }
    } catch {
      setMessages((all) => [...all, { id, role: "assistant", content: "Something went wrong. Try again." }])
    }
    setStatus("idle")
  }

  function send(text = draft) {
    const content = text.trim()
    if ((!content && !files.length) || status !== "idle") return
    const next = [...messages, { id: uid(), role: "user" as const, content, files: files.length ? files : undefined }]
    setMessages(next)
    setDraft("")
    setFiles([])
    void run(next)
  }

  function retry(id: string) {
    const index = messages.findIndex((m) => m.id === id)
    const history = messages.slice(0, index)
    setMessages(history)
    void run(history)
  }

  async function toggleVoice() {
    if (recording) {
      setRecording(false)
      mic.stop()
      speech.stop()
      const heard = [speech.text, speech.interim].filter(Boolean).join(" ").trim()
      if (heard) setDraft((d) => (d ? `${d} ${heard}` : heard))
      textarea.current?.focus()
      return
    }
    speech.reset()
    setRecording(true)
    speech.start()
    await mic.start()
  }

  const empty = !messages.length
  const tokens = estimateTokens(messages) + 1200

  return (
    <div data-slot="chat-window" className={cn("bg-card text-card-foreground flex h-[620px] w-full max-w-2xl flex-col overflow-hidden rounded-2xl", className)}>
      <style href="chat-window" precedence="default">{css}</style>
      <header className="border-border flex h-13 shrink-0 items-center justify-between gap-2 border-b px-3">
        {models && model && onModelChange ? <ModelPicker models={models} value={model} onValueChange={onModelChange} /> : <span className="min-w-0 truncate px-2 text-sm font-semibold">{title}</span>}
        <div className="flex shrink-0 items-center gap-1">
          <TokenCounter
            used={tokens}
            limit={contextLimit}
            parts={[
              { label: "System prompt", tokens: 1200 },
              { label: "Conversation", tokens: tokens - 1200 },
            ]}
            costPerMillion={3}
          />
          {!empty && (
            <button
              type="button"
              onClick={() => {
                stopped.current = true
                setMessages([])
                setStatus("idle")
              }}
              className="text-muted-foreground hover:bg-accent hover:text-foreground h-8 cursor-pointer rounded-lg px-2.5 text-xs font-medium whitespace-nowrap"
            >
              New chat
            </button>
          )}
        </div>
      </header>

      <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-6 sm:px-6" role="log" aria-live="polite" aria-label="Conversation">
        {empty ? (
          <div className="flex h-full flex-col items-center justify-center gap-6">
            <VoiceOrb state="idle" size={56} />
            <h3 className="text-center text-xl font-semibold tracking-tight">{greeting}</h3>
            {suggestions && <PromptSuggestions suggestions={suggestions} onSelect={(p) => send(p)} className="w-full max-w-lg" />}
          </div>
        ) : (
          <div className="mx-auto flex max-w-xl flex-col gap-6">
            {messages.map((m, i) =>
              m.role === "user" ? (
                <div key={m.id} data-message className="flex flex-col items-end gap-1.5">
                  {m.files?.map((f) => (
                    <span key={f} title={f} className="bg-muted text-muted-foreground inline-flex max-w-[85%] min-w-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs">
                      <HugeiconsIcon icon={File01Icon} size={14} className="shrink-0" />
                      <MiddleTruncate text={f} />
                    </span>
                  ))}
                  {m.content && <UserBubble text={m.content} />}
                </div>
              ) : (
                <AssistantMessage key={m.id} message={m} streaming={status === "streaming" && i === messages.length - 1} onRetry={() => retry(m.id)} />
              )
            )}
            {status === "thinking" && (
              <div data-message className="flex items-center gap-3">
                <VoiceOrb state="thinking" size={24} />
                <ShimmerText className="text-sm">Thinking…</ShimmerText>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="shrink-0 p-3 pt-0">
        <div className="border-border bg-background focus-within:border-ring/60 focus-within:ring-ring/15 rounded-2xl border transition-[border-color,box-shadow] focus-within:ring-4">
          {!!files.length && (
            <div className="flex flex-wrap gap-1.5 px-3 pt-3">
              {files.map((f) => (
                <span key={f} title={f} className="bg-muted inline-flex max-w-full min-w-0 items-center gap-1.5 rounded-lg py-1 pr-1 pl-2.5 text-xs font-medium">
                  <HugeiconsIcon icon={File01Icon} size={14} className="text-muted-foreground shrink-0" />
                  <MiddleTruncate text={f} />
                  <button type="button" aria-label={`Remove ${f}`} onClick={() => setFiles((all) => all.filter((x) => x !== f))} className="hover:bg-accent grid size-5 cursor-pointer place-items-center rounded">
                    <HugeiconsIcon icon={Cancel01Icon} size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
          {recording ? (
            <div className="flex min-h-[52px] flex-col justify-center gap-1 px-4 pt-3">
              <AudioWaveform levels={levels} height={28} className="text-primary" />
              <p className="text-muted-foreground truncate text-center text-xs">{[speech.text, speech.interim].filter(Boolean).join(" ") || (speech.supported ? "Listening… press the mic to finish" : "Recording (this browser can't transcribe)")}</p>
            </div>
          ) : (
            <textarea
              ref={textarea}
              rows={1}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault()
                  send()
                }
              }}
              placeholder="Message…"
              aria-label="Message"
              className="placeholder:text-muted-foreground block max-h-[180px] min-h-[52px] w-full resize-none bg-transparent px-4 pt-3.5 pb-1 text-sm leading-relaxed outline-none"
            />
          )}
          <div className="flex items-center justify-between gap-2 p-2">
            <div className="flex items-center gap-0.5">
              <input
                ref={fileInput}
                type="file"
                multiple
                hidden
                onChange={(e) => {
                  const names = [...(e.target.files ?? [])].map((f) => f.name)
                  setFiles((all) => [...new Set([...all, ...names])])
                  e.target.value = ""
                }}
              />
              <IconButton label="Attach files" onClick={() => fileInput.current?.click()}>
                <AttachmentIcon size={18} />
              </IconButton>
              <IconButton label={recording ? "Stop voice input" : "Voice input"} onClick={toggleVoice} pressed={recording} className={cn(recording && "bg-destructive/10 text-destructive hover:bg-destructive/15 hover:text-destructive")}>
                <MicIcon size={18} active={recording} />
              </IconButton>
            </div>
            {status === "idle" ? (
              <button
                type="button"
                aria-label="Send"
                disabled={!draft.trim() && !files.length}
                onClick={() => send()}
                className="bg-primary text-primary-foreground grid size-8 cursor-pointer place-items-center rounded-full shadow-sm transition-[opacity,transform] active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <HugeiconsIcon icon={ArrowUp02Icon} size={17} strokeWidth={2} />
              </button>
            ) : (
              <button
                type="button"
                aria-label="Stop"
                onClick={() => {
                  stopped.current = true
                  setStatus("idle")
                }}
                className="bg-foreground text-background grid size-8 cursor-pointer place-items-center rounded-full"
              >
                <HugeiconsIcon icon={StopIcon} size={15} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/** Long messages fold after eight lines, with a way to read the rest. */
function UserBubble({ text }: { text: string }) {
  const long = text.length > 600 || text.split("\n").length > 10
  const [open, setOpen] = React.useState(false)
  return (
    <div className="bg-secondary text-secondary-foreground max-w-[85%] min-w-0 rounded-2xl rounded-br-md px-4 py-2.5 text-sm leading-relaxed">
      <p dir="auto" className={cn("whitespace-pre-wrap [overflow-wrap:anywhere]", long && !open && "line-clamp-8")}>{text}</p>
      {long && (
        <button type="button" onClick={() => setOpen(!open)} className="text-muted-foreground hover:text-foreground mt-1.5 cursor-pointer text-xs font-medium">
          {open ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  )
}

/** File names differ at the end (v11, v12, .pdf): keep both ends, cut the middle. */
function MiddleTruncate({ text }: { text: string }) {
  if (text.length <= 28) return <span className="truncate">{text}</span>
  return (
    <span className="flex min-w-0">
      <span className="truncate">{text.slice(0, -12)}</span>
      <span className="shrink-0">{text.slice(-12)}</span>
    </span>
  )
}

function IconButton({ label, pressed, className, children, ...props }: React.ComponentProps<"button"> & { label: string; pressed?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      className={cn("text-muted-foreground hover:bg-accent hover:text-foreground grid size-8 cursor-pointer place-items-center rounded-lg transition-colors", className)}
      {...props}
    >
      {children}
    </button>
  )
}

function AssistantMessage({ message, streaming, onRetry }: { message: ChatMessage; streaming: boolean; onRetry: () => void }) {
  const [copied, setCopied] = React.useState(false)
  const [liked, setLiked] = React.useState(false)
  const voice = useSpeech()
  React.useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(t)
  }, [copied])
  return (
    <div data-message className="group flex gap-3">
      <VoiceOrb state={streaming ? "speaking" : voice.speaking ? "speaking" : "idle"} level={streaming ? 0.4 : 0} size={24} className="mt-0.5" />
      <div className="min-w-0 flex-1">
        <p dir="auto" className="text-sm leading-relaxed whitespace-pre-wrap [overflow-wrap:anywhere]">
          {message.content}
          {streaming && <span aria-hidden className="bg-primary ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[3px] animate-[cw-caret_1s_steps(1)_infinite]" />}
        </p>
        {!streaming && (
          <div className="mt-2 -ml-1.5 flex gap-0.5 opacity-100 transition-opacity sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
            <IconButton
              label={copied ? "Copied" : "Copy"}
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(message.content)
                  setCopied(true)
                } catch {
                  /* clipboard unavailable */
                }
              }}
            >
              <CopyIcon size={16} active={copied} />
            </IconButton>
            <IconButton label="Regenerate" onClick={onRetry}>
              <RefreshIcon size={16} />
            </IconButton>
            {voice.supported && (
              <IconButton label={voice.speaking ? "Stop reading" : "Read aloud"} pressed={voice.speaking} onClick={() => (voice.speaking ? voice.stop() : voice.speak(message.content))}>
                <VolumeIcon size={16} animate={voice.speaking} />
              </IconButton>
            )}
            <IconButton label="Good response" pressed={liked} onClick={() => setLiked(!liked)} className={cn(liked && "text-primary hover:text-primary")}>
              <ThumbsUpIcon size={16} />
            </IconButton>
          </div>
        )}
      </div>
    </div>
  )
}
