import * as React from "react"

import { VoiceInput } from "@/components/ui/voice-input"

export default function VoiceInputDemo() {
  const [notes, setNotes] = React.useState<string[]>([])
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <VoiceInput onTranscript={(text) => text && setNotes((all) => [text, ...all])} />
      <ul className="flex flex-col gap-2 text-sm">
        {notes.length ? notes.map((note, i) => <li key={i} className="bg-muted rounded-lg px-3 py-2">{note}</li>) : <li className="text-muted-foreground text-center text-xs">Press the microphone, say something, press again. Your words land here.</li>}
      </ul>
    </div>
  )
}
