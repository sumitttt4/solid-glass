import * as React from "react"
import { AiIdeaIcon, Image01Icon, CodeIcon, Mail01Icon, PencilEdit02Icon, Search01Icon } from "@hugeicons/core-free-icons"

import { PromptSuggestions } from "@/components/ui/prompt-suggestions"

export default function PromptSuggestionsDemo() {
  const [picked, setPicked] = React.useState("")
  return (
    <div className="flex w-full max-w-xl flex-col gap-6">
      <PromptSuggestions
        onSelect={setPicked}
        suggestions={[
          { title: "Brainstorm names", description: "For a component library", icon: AiIdeaIcon },
          { title: "Summarize a document", description: "Key points in a minute", icon: Search01Icon },
          { title: "Draft an email", description: "Polite, short, specific", icon: Mail01Icon },
          { title: "Debug my code", description: "Find what's wrong and why", icon: CodeIcon },
        ]}
      />
      <PromptSuggestions
        variant="pills"
        onSelect={setPicked}
        suggestions={[
          { title: "Make an image", icon: Image01Icon },
          { title: "Rewrite this", icon: PencilEdit02Icon },
          { title: "Explain like I'm five", icon: AiIdeaIcon },
        ]}
      />
      <p className="text-muted-foreground text-center text-xs" role="status">{picked ? `Sent: “${picked}”` : "Pick one to send it."}</p>
    </div>
  )
}
