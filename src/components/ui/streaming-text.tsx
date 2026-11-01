import * as React from "react"

import { cn } from "@/lib/utils"

const css = `
@keyframes st-caret{50%{opacity:0}}
@keyframes st-word{from{opacity:0;filter:blur(4px)}to{opacity:1;filter:blur(0)}}
@keyframes st-shimmer{from{background-position:200% 0}to{background-position:-200% 0}}
[data-slot=streaming-text] [data-word]{animation:st-word .35s ease-out both}
[data-slot=shimmer-text]{background:linear-gradient(90deg,var(--muted-foreground) 35%,var(--foreground) 50%,var(--muted-foreground) 65%);background-size:200% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:st-shimmer 2.2s linear infinite}
@media (prefers-reduced-motion:reduce){[data-slot=streaming-text] *,[data-slot=shimmer-text]{animation:none!important;color:inherit}}
`

/**
 * Text that arrives a word at a time, as a model's answer does. Give it the whole text and it
 * plays it out; give it a growing `text` from a real stream with `speed={0}` and it shows each
 * new word as it lands.
 */
export function StreamingText({
  text,
  speed = 28,
  caret = true,
  onDone,
  className,
  ...props
}: React.ComponentProps<"p"> & {
  text: string
  /** Words per second; 0 shows the text as it is given. */
  speed?: number
  caret?: boolean
  onDone?: () => void
}) {
  const words = React.useMemo(() => text.split(/(\s+)/).filter(Boolean), [text])
  const [shown, setShown] = React.useState(speed ? 0 : words.length)
  const done = React.useRef(onDone)
  done.current = onDone

  React.useEffect(() => {
    if (!speed) {
      setShown(words.length)
      return
    }
    setShown((n) => Math.min(n, words.length))
    const timer = setInterval(() => {
      setShown((n) => {
        if (n >= words.length) {
          clearInterval(timer)
          return n
        }
        return n + 2 // a word and the space after it
      })
    }, 1000 / speed)
    return () => clearInterval(timer)
  }, [words, speed])

  const finished = shown >= words.length
  React.useEffect(() => {
    if (finished && words.length) done.current?.()
  }, [finished, words.length])

  return (
    <p data-slot="streaming-text" aria-live="polite" className={cn("leading-relaxed", className)} {...props}>
      <style href="streaming-text" precedence="default">{css}</style>
      {words.slice(0, shown).map((word, i) => (/^\s+$/.test(word) ? word : <span key={i} data-word>{word}</span>))}
      {caret && !finished && (
        <span aria-hidden className="bg-primary ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[3px] animate-[st-caret_1s_steps(1)_infinite]" />
      )}
    </p>
  )
}

/** A line that shimmers while the model is working: "Thinking…", "Searching the web…". */
export function ShimmerText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <>
      <style href="streaming-text" precedence="default">{css}</style>
      <span data-slot="shimmer-text" className={cn("inline-block", className)} {...props} />
    </>
  )
}
