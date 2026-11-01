import * as React from "react"

import { SpeakButton } from "@/components/ui/speak-button"
import { Textarea } from "@/components/ui/textarea"

export default function SpeakButtonDemo() {
  const [text, setText] = React.useState("Hello! Every component you need, in one place. Normal, glass, frost or aurora.")
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Textarea aria-label="Text to read aloud" value={text} onChange={(e) => setText(e.target.value)} rows={3} />
      <SpeakButton text={text} className="self-start" />
    </div>
  )
}
