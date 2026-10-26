import { useEffect, useRef, useState } from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
/** Success follows an actual clipboard write; errors leave selectable source visible. */
export function CopySnippet({ code, label = "Code snippet" }: { code: string; label?: string }) {
  const [state, setState] = useState<"idle" | "copying" | "copied" | "error">("idle")
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const mounted = useRef(true)
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; clearTimeout(timer.current) } }, [])
  async function copy() { clearTimeout(timer.current); setState("copying"); try { await navigator.clipboard.writeText(code); if (!mounted.current) return; setState("copied"); timer.current = setTimeout(() => setState("idle"), 2400) } catch { if (mounted.current) setState("error") } }
  return <div data-slot="copy-snippet"><div><span>{label}</span><Button variant="secondary" size="sm" disabled={state === "copying"} onClick={copy}>{state === "copied" ? <Check /> : <Copy />}{state === "copied" ? "Copied" : state === "copying" ? "Copying…" : "Copy"}</Button></div><pre tabIndex={0} aria-label={label}><code>{code}</code></pre><p role="status">{state === "error" ? "Clipboard unavailable. Select and copy the code above." : state === "copied" ? "Copied to clipboard." : ""}</p></div>
}
