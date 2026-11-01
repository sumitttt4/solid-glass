import * as React from "react"

import { CopyIcon, DownloadIcon, MenuIcon, SendIcon, SparklesIcon, TrashIcon } from "@/components/ui/animated-icons"
import { Button } from "@/components/ui/button"

export default function AnimatedIconsButtons() {
  const [copied, setCopied] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  React.useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(t)
  }, [copied])
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button><SendIcon />Send</Button>
      <Button tone="fern" variant="secondary"><DownloadIcon />Download</Button>
      <Button tone="iris" variant="outline"><SparklesIcon />Generate</Button>
      <Button variant="outline" onClick={() => setCopied(true)}><CopyIcon active={copied} />{copied ? "Copied" : "Copy"}</Button>
      <Button variant="ghost" size="icon" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}><MenuIcon active={open} /></Button>
      <Button variant="destructive" size="icon" aria-label="Delete"><TrashIcon /></Button>
    </div>
  )
}
